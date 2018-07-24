const FriendGame = {
    game: {
        id: "",
        progress: NEW_GAME,
        text: {
            guid: "randomString",
            text: "something in the way she moves, attracts me like no other lover.",
            type: "song", // Song, book or smthng
            name: "something", // Song, book or smthng name
            author: "The Beatles" , // Song, book or smthng author
            picUrl: "https://i.ytimg.com/vi/lURY5hzr3Cc/hqdefault.jpg" // Song, book or smthng picture
        },
        players: [],
        waitingTime: 10,
        textTime: 80,
        timePassed: 0,
        finishedCount: 0
    },
    waitingInterval: null,
    alreadyPlaying: false,
    inputElem: null,
    playUrl: "",
    thisUrl: "",
    init () {
        this.game = {
            id: "",
            progress: NEW_GAME,
            text: {
                guid: "randomString",
                text: "something in the way she moves, attracts me like no other lover.",
                type: "song", // Song, book or smthng
                name: "something", // Song, book or smthng name
                author: "The Beatles" , // Song, book or smthng author
                picUrl: "https://i.ytimg.com/vi/lURY5hzr3Cc/hqdefault.jpg" // Song, book or smthng picture
            },
            players: [],
            waitingTime: 10,
            textTime: 80,
            timePassed: 0,
            finishedCount: 0
        };
        this.waitingInterval = null;
        this.alreadyPlaying = false;
        this.inputElem = null,
        this.playUrl = "";
        this.thisUrl = "";
        var textId = null;
        if(Router.innerRoute() == 'text')
            textId = Router.idRoute();
        var self = this;
        Service.GetFriendGame(Router.idRoute(), textId).then(game => {
            self.game = game;
            self.game.players = game.players.map(player => {
                var player = Player.copy(player)
                player.isMe = false;
                if(player.id == User.loggedInUser._id){
                    player.isMe = true;
                    self.alreadyPlaying = true;
                }
                return player;
            });
            if(!Router.idRoute().length){
                window.history.pushState({}, "", `${window.location.origin}/race/newgame/${game.id}`);
            }
            this.playUrl = `${window.location.origin}/race/friend/${this.game.id}`;
            this.thisUrl = `${window.location.origin}/race/newgame/${this.game.id}`;
            document.querySelector('.race-section').outerHTML = self.view();
            self.inputElem = document.querySelector('.race-input');
            self.inputElem.oninput = self.input;
            self.inputElem.onclick = self.click;
            this.startWaitingInterval();
        }).catch(() => {
            Router.redirectTo(`${window.location.origin}/race/newgame`);
        })
    },
    startWaitingInterval () {
        var self = this;
        this.waitingInterval = setInterval(() => {
            Service.GetFriendGame(Router.idRoute()).then(game => {
                self.game = game;
                self.game.players = game.players.map(player => {
                    var player = Player.copy(player)
                    player.isMe = false;
                    if(player.id == User.loggedInUser._id){
                        player.isMe = true;
                        self.alreadyPlaying = true;
                    }
                    return player;
                });
                document.querySelector('.race-tracks').outerHTML = self.viewRaceTracks();
                FriendGame.inputElem = document.querySelector('.race-input');
                FriendGame.inputElem.oninput = FriendGame.input;
                FriendGame.inputElem.onclick = FriendGame.click;
            });
        }, 500);
    },
    onLoad () {
    },
    onExit () {
        clearInterval(this.waitingInterval);
    },
    input () {
        FriendGame.inputElem.value = FriendGame.playUrl;
    },
    click () {
        FriendGame.inputElem.setSelectionRange(0, FriendGame.inputElem.value.length);
        document.execCommand("copy");
        Toastr.callMessage('link coppied');
    },
    viewRaceTracks () {
        return `
            <ul class="race-tracks">
                ${this.game.players.map(player => player.view()).join('')}
                <li class="race-track me${this.alreadyPlaying ? ' hidden' : ''}">
                    <div class="race-track-left">
                        <div class="race-track-user" style="left: 0;">
                            <div class="race-track-user-name">შენ?</div>
                            <span class="race-track-user-heli fas fa-helicopter"></span>
                        </div>
                        <div class="race-track-path"></div>
                    </div>
                    <div class="race-track-right"></div>
                </li>
            </ul>
        `;
    },
    view () {
        Router.loadMe(this);
        return `
            <div class="race-section">
                <h1 class="race-state">
                    ეთამაშე მეგობრებს მოცემული ლინკით.
                </h1>
                ${this.viewRaceTracks()}
                <input type="text" class="race-input" value="${this.thisUrl}">
                <div class="race-footer clearfix">
                    <a href="${this.playUrl}" class="race-link leave">რბოლაში ჩართვა</a>
                </div>
            </div>
        `;
    }
}