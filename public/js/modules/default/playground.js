var PlayGround = {
    init () {
        this.game = new Game({id: "", progress: 0, text: {}, players: [], waitingTime: 10, textTime: 0, timePassed: 0, finishedCount: 0});
        this.states = [GameState("")];
        this.isOffline = false;
        this.counterInterval = null;
        this.player = new Player(User.loggedInUser.name, 0, 0, 0, true, User.loggedInUser._id, 0, 0, 0);
        this.gameId = null;
        var serviceCall;
        if (Router.innerRoute() == 'world') {
            serviceCall = 'GetRandomGame';
        } else if (Router.innerRoute() == 'friend') {
            this.gameId = Router.idRoute();
            if(!this.gameId.length){
                Router.redirectTo(`${window.location.origin}/race/newgame`);
                return;
            }
            serviceCall = 'ConnectFriendGame';
        } else if (Router.innerRoute() == 'practice') {
            this.isOffline = true;
            serviceCall = 'GetPracticeGame';
        }
        var self = this;
        Service[serviceCall](self.gameId != null ? {player: self.player, gameId: self.gameId} : self.player).then(game => {
            self.game = new Game(game);
            self.game.players.forEach(player => {
                player.isMe = false;
                if(player.id == User.loggedInUser._id){
                    player.isMe = true;
                }
            })
            self.states = [GameState(self.game.text.text)];
            document.querySelector('.race-section').outerHTML = self.view();
            self.mainLoop ();
        }).catch(error => {
            if(self.gameId){
                console.log(error);
                Router.redirectTo(`${window.location.origin}/race/newgame/${this.gameId}`);
            }
        });
    },
    states: [],
    game: null,
    isOffline: false,
    counterInterval: null,
    mainInterval: null,
    player: null,
    gameId: null,
    onLoad () {
        if (Router.innerRoute() != '')  {
            PlayGround.raceInput = document.querySelector('.race-input');
            PlayGround.raceInput.oninput = PlayGround.input;
        }
    },
    onExit () {
        if(this.mainInterval != null){
            clearInterval(this.mainInterval);
        }
    },
    mainLoop () {
        var self = this;
        this.mainInterval = setInterval(() => {
            Service.UpdateInfo({gameId: self.game.id, player: self.player}).then(game => {
                self.game.players = game.players.map(player => player.id != User.loggedInUser._id ? Player.copy(player) : self.player);
                self.game.players.forEach(player => {
                    player.isMe = false;
                    if(player.id == User.loggedInUser._id){
                        player.isMe = true;
                        self.player = player;
                    }
                })
                document.querySelector('.race-tracks').innerHTML = self.game.players.map(player => player.view()).join('');
                var refreshAll = self.game.progress < game.progress;
                if(refreshAll){
                    console.log(self.game.progress, game.progress);
                }
                self.game.progress = Math.max(game.progress, self.game.progress);
                self.game.finishedCount = Math.max(game.finishedCount, self.game.finishedCount);
                if(self.game.progress == STARTED_NEW_GAME){
                    self.game.waitingTime = game.waitingTime;
                    document.querySelector('.race-counter').outerHTML = self.counterView();
                }else if(self.game.progress == ENDED_GAME){
                    clearInterval(PlayGround.mainInterval);
                    PlayGround.mainInterval = null;
                }
                self.game.timePassed = game.timePassed;
                self.game.textTime = game.textTime;
                document.querySelector('.text-counter').outerHTML = self.textCounterView();
                if(refreshAll){
                    document.querySelector('.race-section').outerHTML = self.view();
                    if(self.game.progress == STARTED_GAME){
                        self.startGame ();
                    }
                }
            }).catch(error => {
                clearInterval(self.mainInterval);
            });
        }, 100);
    },
    startGame () {
        PlayGround.raceInput = document.querySelector('.race-input');
        PlayGround.raceInput.oninput = PlayGround.input;
        PlayGround.raceInput.removeAttribute('disabled');
        PlayGround.raceInput.removeAttribute('placeholder');
        PlayGround.raceInput.focus();
    },
    input () {
        var c = PlayGround.raceInput.value[PlayGround.raceInput.value.length - 1];
        var newState = PlayGround.states[PlayGround.states.length - 1].copy();
        
        var wordEnd = newState.text.indexOf(' ', newState.green.b);
        wordEnd = wordEnd == -1 ? newState.text.length : wordEnd;
        var curWord = newState.text.substring(newState.green.b, wordEnd + 1);
        
        while (curWord == PlayGround.raceInput.value.substring(0, wordEnd - newState.green.b + 1)) {
            PlayGround.raceInput.value = PlayGround.raceInput.value.substr(wordEnd - newState.green.b + 1);
            PlayGround.game.playerProgress(User.loggedInUser._id, newState.greenLine.b / newState.text.length);
            newState.green.b = wordEnd == newState.text.length ? wordEnd : wordEnd + 1;
            if(wordEnd == newState.text.length)
                break;
            wordEnd = newState.text.indexOf(' ', newState.green.b);
            wordEnd = wordEnd == -1 ? newState.text.length : wordEnd;
            curWord = newState.text.substring(newState.green.b, wordEnd + 1);
        }
        newState = newState.step(PlayGround.raceInput.value);
        newState.lastInput = PlayGround.raceInput.value;
        PlayGround.states.push(newState);
        if (!newState.correct) {
            PlayGround.game.playerError(User.loggedInUser._id);
        }
        if(PlayGround.states[PlayGround.states.length - 1].position == PlayGround.states[PlayGround.states.length - 1].text.length && PlayGround.states[PlayGround.states.length - 1].correct){
            PlayGround.raceInput.value = "";
            PlayGround.game.playerProgress(User.loggedInUser._id, 
                PlayGround.states[PlayGround.states.length - 1].position / PlayGround.states[PlayGround.states.length - 1].text.length);
            PlayGround.game.playerPlace(User.loggedInUser._id, ++PlayGround.game.finishedCount);
            PlayGround.game.progress = ENDED_FOR_ME;
            PlayGround.player.timeNeeded = PlayGround.game.timePassed;
            if(!PlayGround.isOffline){
                User.addStatistics(PlayGround.game.playerFind(User.loggedInUser._id));
            }
            document.querySelector('.race-section').outerHTML = PlayGround.view();
        }
        document.querySelector('.race-text').innerHTML = PlayGround.states[PlayGround.states.length - 1].raceText();
    },
    counterView() {
        return `
            <div class="race-counter ${this.game.progress < STARTED_GAME ? '' : 'hidden'}">
                <div class="race-counter-left">
                    <div class="race-counter-ball ${this.game.waitingTime > 5 || this.game.progress < STARTED_NEW_GAME ? 'red' : ''}">
                    </div><div class="race-counter-ball ${this.game.waitingTime <= 5 && this.game.waitingTime > 1 && this.game.progress == STARTED_NEW_GAME ? 'yellow' : ''}">
                    </div><div class="race-counter-ball ${this.game.waitingTime == 1 ? 'green' : ''}"></div>
                </div><div class="race-counter-right">
                    <span class="race-counter-text">
                        ${
                            this.game.progress < STARTED_NEW_GAME ? 'დაელოდე მოწინააღმდეგეებს' :
                            this.game.waitingTime > 5 ? 'მოემზადე' :
                            this.game.waitingTime != 1 ? 'ბოლო წამები...' :
                            'დაიწყე'
                        }
                    </span>
                    <span class="race-counter-count" ${this.game.progress == STARTED_NEW_GAME ? '' : 'hidden'}>:${this.game.waitingTime}წმ</span>
                </div>
            </div>
        `;
    },
    textCounterView () {
        return `
            <div class="text-counter ${this.game.progress >= STARTED_GAME && this.game.progress < ENDED_GAME ? '' : 'hidden'}">${this.game.timeLeft()}</div>
        `;
    },
    aboutTextView () {
        return `
            <div class="text-review">
                <h1 class="text-review-state">ახლახანს შეყვანილი ნაწყვეტი არის ${this.game.text.type}დან:</h1>
                <img class="text-review-picture" src="${this.game.text.picUrl}">
                <div class="text-review-left">
                    <a class="text-review-header" href="/text/${this.game.text.guid}">${this.game.text.name}</a>
                    <h2 class="text-review-author">${this.game.text.author}</h2>
                    <div class="text-review-stat">
                        <span class="text-review-stat-name">შენი სიჩქარე:</span>
                        <span class="text-review-stat-value">${this.player.speed} ს/წთ</span>
                    </div>
                    <div class="text-review-stat">
                        <span class="text-review-stat-name">დრო:</span>
                        <span class="text-review-stat-value">${this.player.timePassed()}</span>
                    </div>
                    <div class="text-review-stat">
                        <span class="text-review-stat-name">აკურატულობა:</span>
                        <span class="text-review-stat-value">${this.player.accuracy()}%</span>
                    </div>
                </div>
            </div>
        `;
    },
    view () {
        Router.loadMe(this);
        return `
            <div class="race-section">
                ${this.counterView()}
                <h1 class="race-state">
                    ${
                        (this.game.progress < STARTED_NEW_GAME ? 'დაელოდეთ ოპონენტებს...' :
                        (this.game.progress == STARTED_NEW_GAME ? 'რბოლა მალე დაიწყება!' :
                        (this.game.progress == STARTED_GAME ? 'წერე!' : 
                        (this.game.progress == ENDED_FOR_ME ? `თქვენ დაიკავეთ ${this.player.placeString()} ადგილი.` : 
                        ('რბოლა დასრულდა.')))))
                    }
                </h1>
                ${this.textCounterView()}
                <ul class="race-tracks">
                    ${this.game.players.map(player => player.view()).join('')}
                </ul>
                <div class="race-text" ${this.game.progress < ENDED_FOR_ME ? "" : "hidden"}>
                    ${this.game.progress < ENDED_FOR_ME ? this.states[this.states.length - 1].text : ""}
                </div>
                <input type="text" class="race-input" ${this.game.progress == STARTED_GAME ? '' : (this.game.progress > STARTED_GAME ? "hidden" : "disabled")} 
                                                        ${this.game.progress < STARTED_GAME ? 'placeholder="შეიყვანეთ მოცემული ტექსტი აქ, როცა რბოლა დაიწყება"' : ""}>
                <div class="race-footer clearfix">
                    <a href="/race${this.gameId != null ? `/newgame/${this.gameId}` : ''}" class="race-link leave">რბოლიდან გასვლა</a>
                    <a href="${this.gameId == null ? Router.fullRoute() : `/race/newgame/${this.gameId}`}" class="race-link next" ${this.game.progress >= ENDED_FOR_ME ? "" : "hidden"}>შემდეგი რბოლა</a>
                </div>
                ${this.game.progress >= ENDED_FOR_ME ? this.aboutTextView() : ""}
            </div class="race-section">
        `;
    }
};