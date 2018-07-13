const FriendGame = {
    game: {
        id: "randomString",
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
    init () {
        var self = this;
        Service.GetFriendGame(Router.idRoute()).then(game => {
            self.game = game;
            self.game.players = game.players.map(player => Player.copy(player));
            self.game.players.forEach(player => {
                player.isMe = false;
                if(player.id == User.loggedInUser.id){
                    player.isMe = true;
                    self.alreadyPlaying = true;
                }
            })
            if(!Router.idRoute().length){
                window.history.pushState({}, "", `${window.location.origin}/race/newgame/${game.id}`);
            }
        })
    },
    startWaitingInterval () {
        var self = this;
        this.waitingInterval = setInterval(() => {
            Service.GetFriendsUpdate(Router.idRoute()).then(game => self.game = game);
        }, 500);
    },
    view() {
        return `
            <div class="race-section">
                <h1 class="race-state">
                    ეთამაშე მეგობრებს მოცემული ლინკით.
                </h1>
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
                <input type="text" class="race-input" value="${window.location.origin}/race/friend/${this.game.id}">
            </div>
        `;
    }
}