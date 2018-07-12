const express = require('express')
const app = express()
const mongoose = require('mongoose')
const {Game, Games, Player, guid} = require('./game')
const Text = require('./text')
const bodyParser = require('body-parser')

const public = 'build/public';

app.use('/public', express.static(public))
app.use('/public', express.static('node_modules'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const NEW_GAME = 1, 
        STARTED_NEW_GAME = 2, 
        STARTED_GAME = 3, 
        ENDED_GAME = 5

mongoose.connect('mongodb://sa:123456qwerty@ds129321.mlab.com:29321/typeracergeo')
// mongoose.connect('mongodb://127.0.0.1:27017/')
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connected to mongoDB");
});

var games = new Games()

var friendGames = new Games()

app.post('/GetRandomGame', (req, res) => {
    var game = games.getLastOpenGame()
    if(!game || game.players.some(player => player.id == req.body.id)){
        game = games.getNewGame()
        game.players.push(req.body)
        Text.findRandom().then(text => {
            game.text = text
            game.textTime = text.text.split(' ').length * 6
            game.progress = NEW_GAME
            res.send(game)
        })
    }else{
        game.players.push(req.body)
        if (game.players.length == 2){
            games.startNewGame(game)
        }
        res.send(game)
    }
})

app.post('/GetPracticeGame', (req, res) => {
    game = games.getNewGame()
    game.players.push(req.body)
    game.waitingTime = 5
    game.progress = STARTED_NEW_GAME
    Text.findRandom().then(text => {
        game.text = text
        game.textTime = text.text.split(' ').length * 6
        games.startNewGame(game)
        res.send(game)
    })
})

app.post('/UpdateInfo', (req, res) => {
    var {gameId, player} = req.body;
    var serverGame = games.games[gameId];
    if(!serverGame){
        res.status(500);
        res.send('error');
        return;
    }
    if(player.progress == 100 && !serverGame.finished[player.id]){
        serverGame.finished[player.id] = true;
        serverGame.finishedCount++;
    }
    serverGame.players.forEach(serverPlayer => {
        if(serverPlayer.id == player.id){
            Object.keys(serverPlayer).forEach(key => {
                serverPlayer[key] = player[key];
            })
        }
    });
    res.send(serverGame);
    if(serverGame.progress == ENDED_GAME){
        serverGame.sentEnded++;
        if(serverGame.sentEnded == serverGame.players.length){
            delete games.games[serverGame.id];
        }
    }
})

app.get('/GetRandomText', (req, res) => {
    Text.findRandom().then(text => {
        res.send(text);
    })
})

app.get('/addd', (req, res) => {
    var text = new Text(Object.keys(req.body).length != 0 ? req.body : {
        guid: guid(),
        text: `ვიცი, ბოლოდ`,
        type: "ტექსტი", // Song, book or smthng
        name: "ვეფხისტყაოსანი", // Song, book or smthng name
        author: "შოთა რუსთაველი", // Song, book or smthng author
        picUrl: "https://loremflickr.com/200/300" // Song, book or smthng picture
    })
    text.save()
})

app.get('/*', (req, res) => res.sendFile(__dirname + '/' + public + '/index.html'))

app.listen(process.env.PORT || 3000, () => console.log('App listening on port 3000!'))