const mongoose = require('mongoose')


var textSchema = mongoose.Schema({
    guid: String,
    text: String,
    type: String, // Song, book or smthng
    name: String, // Song, book or smthng name
    author: String, // Song, book or smthng author
    picUrl: String // Song, book or smthng picture
})

var Text = mongoose.model('Text', textSchema)

Text.findRandom = () => {
    return new Promise((resolve, reject) => {
        Text.find({}, (err, ids) => {
            if(err){
                reject(err)
                return
            }
            Text.findById(ids[Math.floor(ids.length * Math.random())].id, (err, text) => {
                if(err){
                    reject(err)
                    return
                }
                resolve(text)
            })
        })
    })
}

module.exports = Text