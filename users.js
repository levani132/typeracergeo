var mongoose = require('mongoose')

var userSchema = mongoose.Schema({
    name: String,
    lastTenRaces: [Number],
    tenAvg: Number,
    allTimeAvg: Number,
    bestRace: Number,
    nRaces: Number,
    wonRaces: Number,
    rank: String,
    level: Number
})

var User = mongoose.model('User', userSchema)

module.exports = User;