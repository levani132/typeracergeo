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

function logMemory () {
    const used = process.memoryUsage();
    for (let key in used) {
        console.log(`\t${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
    }
}

mongoose.connect('mongodb://sa:123456qwerty@ds129321.mlab.com:29321/typeracergeo',{ useNewUrlParser: true })
// mongoose.connect('mongodb://127.0.0.1:27017/',{ useNewUrlParser: true })
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
            console.log('Created new random game');
            logMemory();
            res.send(game)
        })
    }else{
        game.players.push(req.body)
        if (game.players.length == 2){
            Games.startNewGame(game)
        }
        res.send(game)
    }
})

app.post('/GetPracticeGame', (req, res) => {
    var game = games.getNewGame()
    game.players.push(req.body)
    game.waitingTime = 5
    game.progress = STARTED_NEW_GAME
    Text.findRandom().then(text => {
        game.text = text
        game.textTime = text.text.split(' ').length * 6
        Games.startNewGame(game)
        console.log('Created new practice game');
        logMemory();
        res.send(game)
    })
})

app.post('/GetFriendGame', (req, res) => {
    var gameId = req.body.gameId;
    var textId = req.body.textId;
    var game;
    var resolve = text => {
        game.text = text
        game.textTime = text.text.split(' ').length * 6
        game.progress = NEW_GAME
        console.log('Created new friend game');
        logMemory();
        res.send(game)
    };
    if(gameId){
        game = friendGames.games[gameId];
        if(!game){
            friendGames.games[gameId] = new Game()
            game = friendGames.games[gameId]
            game.id = gameId;
            if(textId) {
                Text.find({guid: textId}, (err, dbres) => resolve(dbres[0]));
            }else{
                Text.findRandom().then(resolve);
            }
        }else{
            res.send(game)
        }
    }else{
        game = friendGames.getNewGame()
        Text.findRandom().then(resolve)
    }
})

app.post('/ConnectFriendGame', (req, res) => {
    var {player, gameId} = req.body;
    game = friendGames.games[gameId];
    if(!game){
        res.status(500);
        res.send('error');
        return;
    }
    var playerExists = false;
    game.players.forEach(gamePlayer => playerExists |= player.id == gamePlayer.id);
    if(!playerExists)
        game.players.push(player)
    if (game.players.length == 2 && game.progress < STARTED_NEW_GAME){
        Games.startNewGame(game)
    }
    res.send(game)
})

app.post('/UpdateInfo', (req, res) => {
    var {gameId, player} = req.body;
    var serverGame = games.games[gameId] || friendGames.games[gameId];
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
    if(player.progress == 100){
        Text.findOne({guid: serverGame.text.guid}, (err, text) => {
            text.player = {
                speed: player.speed,
                timeNeeded: `${Math.floor(player.timeNeeded / 60 / 60)}:${Math.floor(player.timeNeeded / 60 % 60 / 10)}${Math.floor(player.timeNeeded / 60 % 60 % 10)}`,
                accuracy: ((serverGame.text.text.length - player.errorCount) / serverGame.text.text.length * 100).toFixed(1)
            }
            text.date = Date.now();
            text.save(err => {
                if(err){
                    console.error(err);
                    return;
                }
                console.log('player saved successfully');
            })
        })
    }
    res.send(serverGame);
    if(serverGame.progress == ENDED_GAME && !serverGame.abandonedUsers.includes(player.id)){
        serverGame.sentEnded++;
        serverGame.abandonedUsers.push(player.id);
        if(serverGame.sentEnded == serverGame.players.length){
            if(games.games[serverGame.id]){
                delete games.games[serverGame.id];
                console.log('Deleted random/practice game');
                logMemory();
            }else{
                delete friendGames.games[serverGame.id];
                console.log('Deleted friend game');
                logMemory();
            }
        }
    }
})

app.post('/AddText', (req, res) => {
    //Text.remove({}, () => {});
    var text = new Text(Object.keys(req.body).length != 0 ? req.body : {
        guid: guid(),
        text: `ვიცი, ბოლოდ`,
        type: "ტექსტი", // Song, book or smthng
        name: "ვეფხისტყაოსანი", // Song, book or smthng name
        author: "შოთა რუსთაველი", // Song, book or smthng author
        picUrl: "https://loremflickr.com/200/300" // Song, book or smthng picture
    })
    text.save(err => {
        if(err){
            res.status(500);
            res.send(err);
        }
        res.send(true);
    })
})

app.post('/GetText', (req, res) => {
    Text.find({guid:req.body.textId}, (err, dbres) => {
        if(err){
            res.status(404);
            res.send('text not found');
            return;
        }
        res.send(dbres[0]);
    })
})

app.post('/GetLastTexts', (req, res) => {
    Text.find({}).sort({date: -1}).limit(10).exec((err, dbres) => {
        if(err){
            res.status(404);
            res.send('No texts');
            return;
        }
        res.send(dbres);
    })
})

app.post('/SearchText', (req, res) => {
    Text.find({"text": { $regex: req.body.SearchingText, $options: 'i' }}, (err, dbres) => {
        if(err){
            res.status(404);
            res.send('No texts');
            return;
        }
        res.send(dbres);
    })
})

app.get('/*', (req, res) => res.sendFile(__dirname + '/' + public + '/index.html'))

app.post('/*', (req, res) => res.sendFile(__dirname + '/' + public + '/index.html'))

app.listen(process.env.PORT || 3000, () => console.log('App listening on port 3000!'))