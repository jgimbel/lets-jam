'use strict'
require('babel-register')({extensions: ['.js', '.jsx']})

let url = require('url')
  , path = require('path')
  
  ,  express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ server: server })
  
  , engine = require('react-view-engine')
  
  , ytdl = require('ytdl-core')
  
  , emptyQueue = { songs: { queue: [], playing: null, played: [] } }
  , redux = require('redux')
  , applyMiddleware = redux.applyMiddleware
  , createStore = redux.createStore
  , thunk = require('redux-thunk')
  , reducer = require('../shared/reducers').default


engine.setLayout('layout')

// Normal express view stuff
app.engine('jsx', engine.engine)
app.set('view', engine.view)
app.set("view engine", "jsx")
app.set("views", __dirname + "/../shared/components")
app.set("views cache", false)

let locations = []

app.use(express.static(path.join(__dirname, '..', '.build')))

app.get('/', (req, res) => res.render('home'))

app.get('/station/:station', (req, res) => {
  let store
  for(let loc of locations){
      if(loc.path == req.path){
          store = loc.store.getState()
      }
  }
  
    res.render('station', { store } || {})
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

wss.on('connection', function connection(ws) {
  //what redux store currently exists on this
  var location = url.parse(ws.upgradeReq.url, true)
  let store
  
  for(let loc of locations){
      if(loc.path == location.path){
          store = loc.store
      }
  }
  
  if(!store){
      store = applyMiddleware(thunk)(createStore)(reducer)
      locations.push(Object.assign({}, location, { store }))
  }

  ws.on('message', function incoming(message) {
    let action = JSON.parse(message)
    store.dispatch(action)
    wss.broadcast(message, location.path)
    console.log('received: %s', message)
  })
  
})

wss.broadcast = function broadcast(data, loc) {
  wss.clients.forEach(function each(client) {
    if(url.parse(client.upgradeReq.url, true).path == loc){
        client.send(data)
    }
  })
}


server.listen(process.env.PORT || 8000, process.env.IP || '127.0.0.1')
server.on('listening', () => console.log('listening'))