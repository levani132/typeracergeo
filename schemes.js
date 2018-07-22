var mongoose = require('mongoose')

var userSchema = mongoose.Schema({
    name: { type : String , unique : true, required : true },
    passwordHash: { type : String , unique : true, required : true },
    lastTenRaces: [Number],
    tenAvg: Number,
    allTimeAvg: Number,
    bestRace: Number,
    nRaces: Number,
    wonRaces: Number,
    rank: String
})

var User = mongoose.model('User', userSchema)

module.exports = {User}