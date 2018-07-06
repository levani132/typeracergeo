var PlayGround = {
    init () {
        this.game = new Game();
        this.states = [GameState(this.game.text.text)];
        this.finishedCount = 0;
        this.isOffline = false;
        this.counterInterval = null;

        if (Router.innerRoute() == 'world') {
            var self = this;
            Service.GetRandomGame().then(game => {
                self.game = Game.copy(game);
                document.querySelector('.race-section').outerHTML = self.view();
                self.startStartingCountdown();
            });
        } else if (Router.innerRoute() == 'friend') {
        } else if (Router.innerRoute() == 'practice') {
            this.isOffline = true;
            var self = this;
            Service.GetRandomText().then(text => {
                self.game.text = text;
                self.states = [GameState(self.game.text.text)];
                self.game.waitingTime = 5;
                self.game.textTime = text.text.split(' ').length * 6;
                self.game.progress = STARTED_NEW_GAME;
                document.querySelector('.race-section').outerHTML = self.view();
                self.startStartingCountdown();
            });
        }
    },
    finishedCount: 0,
    states: [],
    game: null,
    isOffline: false,
    counterInterval: null,
    onLoad () {
        if (Router.innerRoute() != '')  {
            PlayGround.raceInput = document.querySelector('.race-input');
            PlayGround.raceInput.oninput = PlayGround.input;
        }
    },
    startStartingCountdown () {
        var self = this;
        var countDown = setInterval(() => {
            self.game.waitingTime--;
            document.querySelector('.race-counter').outerHTML = self.counterView();
            if (self.game.waitingTime <= 0) {
                clearInterval(countDown);
                self.startGame();
            }
        }, 1000);
    },
    startGame () {
        PlayGround.game.progress = STARTED_GAME;
        document.querySelector('.race-section').outerHTML = this.view();
        PlayGround.raceInput = document.querySelector('.race-input');
        PlayGround.raceInput.oninput = PlayGround.input;
        PlayGround.raceInput.removeAttribute('disabled');
        PlayGround.raceInput.removeAttribute('placeholder');
        PlayGround.raceInput.focus();
        var self = this;
        this.counterInterval = setInterval(() => {
            self.game.timePassed++;
            if(self.game.timePassed % 60 == 0){
                self.game.textTime--;
                document.querySelector('.text-counter').outerHTML = self.textCounterView();
                if(self.game.textTime == 0){
                    document.querySelector('.text-counter').classList.add('hidden');
                    clearInterval(self.counterInterval);
                }
            }
        }, 16.66);
    },
    input () {
        if(PlayGround.raceInput.value.length < PlayGround.states[PlayGround.states.length - 1].lastInput.length){
            var n = PlayGround.states[PlayGround.states.length - 1].lastInput.length - PlayGround.raceInput.value.length;
            for(var i = 0; i < n; i++)
                PlayGround.states.splice(PlayGround.states.length - 1, 1);
        }else if(PlayGround.states[PlayGround.states.length - 1].text.length != PlayGround.states[PlayGround.states.length - 1].position){
            var c = PlayGround.raceInput.value[PlayGround.raceInput.value.length - 1];
            var newState = PlayGround.states[PlayGround.states.length - 1].step(c);
            if (newState.correct && c == ' ') {
                PlayGround.raceInput.value = '';
                PlayGround.game.playerProgress(User.loggedInUser.id, newState.position / newState.text.length);
            }
            newState.lastInput = PlayGround.raceInput.value;
            PlayGround.states.push(newState);
            if (!newState.correct) {
                PlayGround.game.playerError(User.loggedInUser.id);
            }
        }
        if(PlayGround.states[PlayGround.states.length - 1].position == PlayGround.states[PlayGround.states.length - 1].text.length && PlayGround.states[PlayGround.states.length - 1].correct){
            PlayGround.raceInput.value = "";
            PlayGround.game.playerProgress(User.loggedInUser.id, 
                PlayGround.states[PlayGround.states.length - 1].position / PlayGround.states[PlayGround.states.length - 1].text.length);
            PlayGround.game.playerPlace(User.loggedInUser.id, ++PlayGround.finishedCount);
            if (PlayGround.finishedCount == PlayGround.game.players.length) {
                PlayGround.game.progress = ENDED_GAME;
                clearInterval(PlayGround.counterInterval);
            } else {
                PlayGround.game.progress = ENDED_FOR_ME;
            }
            if(!PlayGround.isOffline){
                User.addStatistics(PlayGround.game.playerFind(User.loggedInUser.id));
            }
            document.querySelector('.race-section').outerHTML = PlayGround.view();
        }else{

        }
        document.querySelector('.race-text').innerHTML = PlayGround.states[PlayGround.states.length - 1].raceText();
    },
    timePassed () {
        return `${Math.round(this.game.timePassed / 60 / 60)}:${Math.round(this.game.timePassed / 60 % 60)}`;
    },
    googleSearch(query){
        return `http://www.google.com/search?q=${query.split(' ').join('+')}`;
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
        var player = this.game.playerFind(User.loggedInUser.id);
        return `
            <div class="text-review">
                <h1 class="text-review-state">ახლახანს შეყვანილი ნაწყვეტი არის ${this.game.text.type}დან:</h1>
                <img class="text-review-picture" src="${this.game.text.picUrl}">
                <div class="text-review-left">
                    <a class="text-review-header" href="${this.googleSearch(this.game.text.name)}" target="_blank">${this.game.text.name}</a>
                    <h2 class="text-review-author">${this.game.text.author}</h2>
                    <div class="text-review-stat">
                        <span class="text-review-stat-name">შენი სიჩქარე:</span>
                        <span class="text-review-stat-value">${player.speed}ს/წთ</span>
                    </div>
                    <div class="text-review-stat">
                        <span class="text-review-stat-name">დრო:</span>
                        <span class="text-review-stat-value">${this.timePassed()}</span>
                    </div>
                    <div class="text-review-stat">
                        <span class="text-review-stat-name">აკურატულობა:</span>
                        <span class="text-review-stat-value">${player.accuracy()}%</span>
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
                        (this.game.progress == ENDED_FOR_ME ? `თქვენ გახვედით ${this.game.players[0].placeString()} ადგილზე.` : 
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
                    <a href="/race" class="race-link leave">რბოლიდან გასვლა</a>
                    <a href="${Router.fullRoute()}" class="race-link next" ${this.game.progress == ENDED_GAME ? "" : "hidden"}>შემდეგი რბოლა</a>
                </div>
                ${this.game.progress >= ENDED_FOR_ME ? this.aboutTextView() : ""}
            </div class="race-section">
        `;
    }
};