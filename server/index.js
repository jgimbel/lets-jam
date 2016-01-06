var express = require('express')
  , path = require('path')
  , app = express()
  , engine = require('react-view-engine')
  , ytdl = require('ytdl-core')
require('babel-register')({extensions: ['.js', '.jsx']})
engine.setLayout('layout')

// Normal express view stuff
app.engine('jsx', engine.engine)
app.set('view', engine.view)
app.set("view engine", "jsx")
app.set("views", __dirname+"/../shared/components")
app.set("views cache", false)

app.use(express.static(path.join(__dirname, '..', '.build')))

app.get('/', (req, res) => res.render('home'))

app.get('/station/:station', (req, res) => {
    res.render('station', {queue: [], playing: null, played: []})
})

app.get('/song', (req, res) => {
    const song = req.query.song
    ytdl.getInfo(song, (err, info) => {
        if(err || !(info && info.formats && info.formats[0].url && info.title)) {
            return res.json({
                type: "ADD_SONG_ERROR",
                source: song
            })
        }
        res.json({
            type: "ADD_SONG",
            song: {
                source: info.formats[0].url,
                title: info.title,
                time: 0,
                duration: info.length_seconds,
                image: info.thumbnail_url,
                votes: 0
            }
        })
    })
})

var server = require('http').createServer(app)
server.listen(process.env.PORT || 8000, process.env.IP || '127.0.0.1')
server.on('listening', () => console.log('listening'))