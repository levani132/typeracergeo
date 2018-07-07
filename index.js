const express = require('express')
const app = express()
const mongoose = require('mongoose')
const {Game, Games, Player, guid} = require('./game')
const Text = require('./text')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

app.use('/public', express.static('public'))
app.use('/public', express.static('node_modules'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const ZERO_GAME = 0, 
        NEW_GAME = 1, 
        STARTED_NEW_GAME = 2, 
        STARTED_GAME = 3, 
        ENDED_FOR_ME = 4, 
        ENDED_GAME = 5

// mongoose.connect('mongodb://typeracergeo:typeracergeo321@ds129321.mlab.com:29321/typeracergeo')
mongoose.connect('mongodb://127.0.0.1:27017/')
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connected to mongoDB");
});

var games = new Games()

var friendGames = new Games()

app.get('/userInfo/:id', (req, res) => {

})

app.post('/GetRandomGame', (req, res) => {
    var game = games.getLastOpenGame()
    if(!game){
        game = games.getNewGame()
        game.players.push(req.body)
        Text.findRandom().then(text => {
            game.text = text
            res.send(game)
        })
    }else{
        game.players.push(req.body)
        if (game.players.length == 2){
            game.progress = STARTED_NEW_GAME;
        }
        res.send(game)
    }
})

app.post('/UpdateInfo', (req, res) => {
    var myGame = req.body;
    var serverGame = games.games[myGame.id];
    serverGame.timePassed = myGame.timePassed;
    if(myGame.waitingTime < serverGame.waitingTime){
        if(myGame.waitingTime == 0){
            serverGame.waitingTime = 0;
            serverGame.progress = STARTED_GAME;
        }
        serverGame.waitingTime = myGame.waitingTime;
    }
    myGame.players.forEach(player => {
        if(player.isMe){
            serverGame.players.forEach(serverPlayer => {
                if(serverPlayer.id == player.id){
                    Object.keys(serverPlayer).forEach(key => {
                        serverPlayer[key] = player[key];
                    })
                }
            });
        }
    });
    res.send(serverGame);
})

app.get('/addd', (req, res) => {
    var text = new Text({
        guid: guid(),
        text:   `ვიცი, ბოლოდ არ დამიგმობ ამა ჩემსა განზრახულსა. `+
                `კაცი ბრძენი ვერ გასწირავს მოყვარესა მოყვარულსა; `+
                `მე სიტყვასა ერთსა გკადრებ, პლატონისგან სწავლა-თქმულსა: `+
                `"სიცრუე და ორპირობა ავნებს ხორცსა, მერმე სულსა".`,
        type: "ტექსტი", // Song, book or smthng
        name: "ვეფხისტყაოსანი", // Song, book or smthng name
        author: "შოთა რუსთაველი", // Song, book or smthng author
        picUrl: "https://picsum.photos/200/300" // Song, book or smthng picture
    })
    console.log(text)
    text.save()
})

app.get('/*', (req, res) => res.sendFile(__dirname + '/public/indexNew.html'))

app.listen(process.env.PORT || 3000, () => console.log('App listening on port 3000!'))