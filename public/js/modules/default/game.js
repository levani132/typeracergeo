const ZERO_GAME = 0, 
        NEW_GAME = 1, 
        STARTED_NEW_GAME = 2, 
        STARTED_GAME = 3, 
        ENDED_FOR_ME = 4, 
        ENDED_GAME = 5;

class Player {
    constructor (name, place, speed, progress, isMe, id) {
        this.name = name;
        this.place = place;
        this.speed = speed;
        this.progress = progress;
        this.isMe = isMe;
        this.id = id;
        this.nWords = 0;
        this.errorCount = 0;
    }
    view () {
        return `
            <li class="race-track${this.isMe ? ` me` : ``}" id="id-${this.id}">
                <div class="race-track-left">
                    <div class="race-track-user" style="left: ${this.progress / 100 * 80}%;">
                        <div class="race-track-user-name">${this.name}</div>
                        <span class="race-track-user-heli fas fa-helicopter"></span>
                    </div>
                    <div class="race-track-path"></div>
                </div>
                <div class="race-track-right">
                    <div class="race-track-place">${this.progress == 100 ? this.placeString() + " ადგილი" : ""}</div>
                    <div class="race-track-speed">${this.speed} ს/წმ</div>
                </div>
            </li>
        `
    }
    placeString () {
        return this.place == 1 ? "1-ლი" : "მე-" + this.place;
    }
}
        
class Game {
    constructor () {
        this.progress = ZERO_GAME;
        this.text = "";
        this.players = [new Player(User.loggedInUser.name, 0, 0, 0, true, User.loggedInUser.id)];
        this.waitingTime = 0;
        this.textTime = 0;
        this.timePassed = 0;
    }

    loadProgress (progress) {

    }

    timeLeft () {
        return `${Math.floor(this.textTime / 60)}:${Math.floor(this.textTime % 60 / 10)}${Math.floor(this.textTime % 60 % 10)}`;
    }

    playerProgress(userId, progress){
        var self = this;
        this.players.forEach(player => {
            if(player.id == userId){
                player.nWords++;
                player.speed = Math.round(player.nWords / self.timePassed * 60);
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