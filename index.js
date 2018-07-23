const public = 'build/public';
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const {Game, Games, Player, guid} = require('./game')
const Text = require('./text')
const session = require("express-session")
const bodyParser = require('body-parser')
const passport = require('./passport')
const {User} = require('./schemes')
const Ranks = require('./public/js/base/ranks')
const sha256 = require('sha256')

mongoose.connect('mongodb://sa:123456qwerty@ds129321.mlab.com:29321/typeracergeo',{ useNewUrlParser: true })
app.use('/public', express.static(public))
app.use('/public', express.static('node_modules'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

const NEW_GAME = 1, 
        STARTED_NEW_GAME = 2, 
        STARTED_GAME = 3, 
        ENDED_GAME = 5

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
    serverGame.players.forEach(serverPlayer => {
        if(serverPlayer.id == player.id){
            Object.keys(serverPlayer).forEach(key => {
                serverPlayer[key] = player[key];
            })
        }
    });
    if(player.progress == 100 && !serverGame.finished[player.id]){
        serverGame.finished[player.id] = true;
        serverGame.finishedCount++;
        Text.findOne({guid: serverGame.text.guid}, (err, text) => {
            if(!text.player || !text.player.speed || text.player.speed < player.speed){
                text.player = {
                    speed: player.speed,
                    timeNeeded: `${Math.floor(player.timeNeeded / 60 / 60)}:${Math.floor(player.timeNeeded / 60 % 60 / 10)}${Math.floor(player.timeNeeded / 60 % 60 % 10)}`,
                    accuracy: ((serverGame.text.text.length - player.errorCount) / serverGame.text.text.length * 100).toFixed(1)
                }
            }
            text.date = Date.now();
            text.save(err => {
                if(err){
                    res.status(500);
                    res.send(err.message);
                    return;
                }
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
            }else{
                delete friendGames.games[serverGame.id];
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

app.post('/GetLoggedInUser',
    (req, res) => {
        var user = Object.assign({}, req.user);
        if(user.passwordHash){
            delete user['passwordHash'];
        }
        res.send(req.user);
    }
);

app.post('/Register', (req, res) => {
    var username = req.body.username.trim();
    var password = req.body.password.trim();
    var repassword = req.body.repassword.trim();
    if(!(username.length && password.length)){
        res.status(500);
        res.send("Fill all inputs");
        return;
    }
    if(password != repassword){
        res.status(500);
        res.send("Passwords don't match");
        return;
    }
    var user = new User({
        name: username,
        passwordHash: sha256(password),
        lastTenRaces: [],
        tenAvg: 0,
        allTimeAvg: 0,
        bestRace: 0,
        nRaces: 0,
        wonRaces: 0,
        rank: Ranks.getRank(0)
    });
    user.save(err => {
        if(err){
            res.status(500);
            res.send(err);
            return;
        }
        req.login(user, function(err) {
            if(err){
                res.status(500);
                res.send(err);
                return;
            }
            res.send(true);
        });
    })
})

app.post('/Login', (req, res) => {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            res.status(500);
            res.send(err);
            return;
        }
        if (!user) {
            res.status(401);
            return res.send(info.message);
        }
        req.logIn(user, function(err) {
            if (err) {
                res.status(500);
                res.send(err);
                return;
            }
            res.send(true);
        });
    })(req, res);
});

app.post('/Logout', (req, res) => {
    req.logout();
    res.send(true);
})

app.post('/AddStatistics', (req, res) => {
    var player = req.body;
    User.findById(req.user.id, (err, loggedInUser) => {
        if(err){
            res.status(500);
            res.send(err);
            return;
        }
        if(loggedInUser.lastTenRaces.length == 10){
            loggedInUser.lastTenRaces.splice(0, 1);
        }
        loggedInUser.lastTenRaces.push(player.speed);
        loggedInUser.allTimeAvg = Math.round(loggedInUser.allTimeAvg * loggedInUser.nRaces / (loggedInUser.nRaces + 1) + player.speed / (loggedInUser.nRaces + 1));
        loggedInUser.nRaces++;
        if(loggedInUser.bestRace < player.speed){
            loggedInUser.bestRace = player.speed;
        }
        if(player.place == 1){
            loggedInUser.wonRaces++;
        }
        loggedInUser.tenAvg = loggedInUser.lastTenRaces.length ? Math.round(loggedInUser.lastTenRaces.reduce((a, b) => a + b) / loggedInUser.lastTenRaces.length) : 0;
        loggedInUser.rank = Ranks.getRank(loggedInUser.tenAvg);
        loggedInUser.save(err => {
            if(err){
                res.status(500);
                res.send(err);
                return;
            }
            res.send(true);
        })
    });
})

app.get('/*', (req, res) => res.sendFile(__dirname + '/' + public + '/index.html'))

app.post('/*', (req, res) => res.sendFile(__dirname + '/' + public + '/index.html'))

app.listen(process.env.PORT || 3000, () => console.log('App listening on port 3000!'))