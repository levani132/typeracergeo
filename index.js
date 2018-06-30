const express = require('express')
const app = express()

app.use('/public', express.static('public'))
app.use('/public', express.static('node_modules'))

app.get('/*', (req, res) => res.sendFile(__dirname + '/public/index.html'))

app.listen(process.env.PORT || 3000, () => console.log('App listening on port 3000!'))