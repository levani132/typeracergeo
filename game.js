const ZERO_GAME = 0, 
        NEW_GAME = 1, 
        STARTED_NEW_GAME = 2, 
        STARTED_GAME = 3, 
        ENDED_FOR_ME = 4, 
        ENDED_GAME = 5

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1)
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
}

class Player {
    constructor (name, place, speed, progress, isMe, id, nWords, errorCount) {
        this.name = name
        this.place = place
        this.speed = speed
        this.progress = progress
        this.isMe = isMe
        this.id = id
        this.nWords = nWords
        this.errorCount = errorCount
    }
}

class Game  {
    constructor () {
        this.id = guid()
        this.progress = ZERO_GAME
        this.text = {}
        this.players = []
        this.finished = {}
        this.waitingTime = 10
        this.textTime = 0
        this.timePassed = 0
        this.finishedCount = 0
    }
}

class Games {
    constructor () {
        this.games = {}
        this.openGames = []
    }

    getLastOpenGame () {
        while(this.openGames.length && (this.openGames[this.openGames.length - 1].players.length == 5 || this.openGames[this.openGames.length - 1].waitingTime < 5)){
            this.openGames.pop()
        }
        if(!this.openGames.length){
            return null
        }
        return this.openGames[this.openGames.length - 1]
    }

    getNewGame () {
        var game = new Game()
        this.openGames.push(game)
        this.games[game.id] = game
        return this.getLastOpenGame()
    }

    startGame(game){
        game.progress = STARTED_GAME
        var interval = setInterval(() => {
            game.timePassed += 3;
            if (game.timePassed % 60 == 0) {
                game.textTime--;
                if(game.textTime <= 0 || Object.keys(game.finished).length == game.players.length){
                    game.progress = ENDED_GAME
                    clearInterval(interval);
                }
            }
        }, 50)
    }
    
    startNewGame(game){
        game.progress = STARTED_NEW_GAME
        var interval = setInterval(() => {
            game.waitingTime--;
            if (game.waitingTime <= 0) {
                clearInterval(interval);
                this.startGame(game);
            }
        }, 1000)
    }
}

module.exports = {Game, Games, Player, guid}