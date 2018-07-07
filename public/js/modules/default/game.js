const ZERO_GAME = 0, 
        NEW_GAME = 1, 
        STARTED_NEW_GAME = 2, 
        STARTED_GAME = 3, 
        ENDED_FOR_ME = 4, 
        ENDED_GAME = 5;

class Player {
    constructor (name, place, speed, progress, isMe, id, nWords, errorCount) {
        this.name = name;
        this.place = place;
        this.speed = speed;
        this.progress = progress;
        this.isMe = isMe;
        this.id = id;
        this.nWords = nWords;
        this.errorCount = errorCount;
    }
    static copy (player) {
        return new Player(player.name, player.place, player.speed,
                            player.progress, player.isMe, player.id, 
                            player.nWords, player.errorCount);
    }
    view () {
        return `
            <li class="race-track${this.isMe ? ` me` : ``}" id="id-${this.id}">
                <div class="race-track-left">
                    <div class="race-track-user" style="left: ${this.progress / 100 * 82.5}%;">
                        <div class="race-track-user-name">${this.name}</div>
                        <span class="race-track-user-heli fas fa-helicopter"></span>
                    </div>
                    <div class="race-track-path"></div>
                </div>
                <div class="race-track-right">
                    <div class="race-track-place">${this.progress == 100 ? PlayGround.isOffline ? "ფინიში" : this.placeString() + " ადგილი" : ""}</div>
                    <div class="race-track-speed">${this.speed} ს/წთ</div>
                </div>
            </li>
        `
    }
    placeString () {
        return this.place == 1 ? "1-ლი" : "მე-" + this.place;
    }
    accuracy () {
        return ((PlayGround.game.text.text.length - this.errorCount) / PlayGround.game.text.text.length * 100).toFixed(1);
    }
}
        
class Game {
    constructor () {
        this.id = '';
        this.progress = ZERO_GAME;
        this.text = {
            id: "",
            text: "",
            type: "", // Song, book or smthng
            name: "", // Song, book or smthng name
            author: "", // Song, book or smthng author
            picUrl: "" // Song, book or smthng picture
        };
        this.players = [new Player(User.loggedInUser.name, 0, 0, 0, true, User.loggedInUser.id, 0, 0)];
        this.waitingTime = 10;
        this.textTime = 0;
        this.timePassed = 0;
        this.finishedCount = 0;
    }

    static copy (game) {
        var newGame = new Game();
        newGame.id = game.id;
        newGame.progress = game.progress;
        newGame.text = game.text;
        newGame.players = game.players.map(player => Player.copy(player));
        newGame.waitingTime = game.waitingTime;
        newGame.textTime = game.textTime;
        newGame.timePassed = game.timePassed;
        newGame.finishedCount = game.finishedCount;
        return newGame;
    }

    timeLeft () {
        return `${Math.floor(this.textTime / 60)}:${Math.floor(this.textTime % 60 / 10)}${Math.floor(this.textTime % 60 % 10)}`;
    }

    playerProgress(userId, progress){
        var self = this;
        this.players.forEach(player => {
            if(player.id == userId){
                player.nWords++;
                player.speed = Math.round(player.nWords / self.timePassed * 3600);
                player.progress = progress * 100;
                document.querySelector(`#id-${userId}`).outerHTML = player.view();
            }
        });
    }

    playerPlace(userId, place) {
        this.players.forEach(player => {
            if(player.id == userId){
                player.nWords++;
                player.place = place;
                document.querySelector(`#id-${userId}`).outerHTML = player.view();
            }
        });
    }

    playerError(userId) {
        this.players.forEach(player => {
            if(player.id == userId){
                player.errorCount++;
            }
        });
    }

    playerFind(userId) {
        var res;
        this.players.forEach(player => {
            if(player.id == userId){
                res = player;
            }
        });
        return res;
    }

    addPlayer(player){
        this.players.push(player);
    }
}