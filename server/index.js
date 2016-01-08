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
  
  , emptyQueue = { songs: { queue: [], playing: null, played: [], time: 0 } }
  , redux = require('redux')
  , applyMiddleware = redux.applyMiddleware
  , createStore = redux.createStore
  , thunk = require('redux-thunk')
  , reducer = require('../shared/reducers').default


engine.setLayout('layout')

let locations = {}
function findStore(path){
    console.log(path)
    if(locations[path]){ 
        return locations[path].store
    } else {
        let store = applyMiddleware(thunk)(createStore)(reducer, emptyQueue)
        locations[path] = Object.assign({}, path, { store })
        return store    
    }
    
}

// Normal express view stuff
app.engine('jsx', engine.engine)
app.set('view', engine.view)
app.set("view engine", "jsx")
app.set("views", __dirname + "/../shared/components")
app.set("views cache", false)


app.use(express.static(path.join(__dirname, '..', '.build')))

app.get('/', (req, res) => res.render('home'))

app.get('/station/:station', (req, res) => {

    let store = findStore(req.path).getState()
    res.render('station', { store } || {})
})

app.get('/song/:station', (req, res) => {
    const song = req.query.song
    console.log(song)
    let loc = `/station/${req.params.station}`
    const store = findStore(loc)
    ytdl.getInfo(song, (err, info) => {
        if(err || !(info && info.formats && info.formats[0].url && info.title)) {
            return res.json({
                type: "ADD_SONG_ERROR",
                source: song
            })
        }
        const oldTime = store.getState().songs.time != 0 ? store.getState().songs.time : Date.now()
        let time = oldTime + info.length_seconds*1000
        res.json({
            type: "ADD_SONG",
            song: {
                source: info.formats[0].url,
                title: info.title,
                time: oldTime,
                duration: info.length_seconds,
                image: info.iurlmaxres || info.iurlhq || info.iurl,
                votes: 0
            },
            time
        })
        let nextSongTime = setTimeout(() => { 
            store.dispatch({type:"NEXT_SONG"}); 
            wss.broadcast({ type:"NEXT_SONG" }, loc) 
        }, (time - Date.now()))
    })
})

wss.on('connection', function connection(ws) {
  //what redux store currently exists on this
  var location = url.parse(ws.upgradeReq.url, true)
  let store = findStore(location.path)

  ws.on('message', function incoming(message) {
    let action = JSON.parse(message)
    store.dispatch(action)
    wss.broadcast(action, location.path)
    console.log('received: %s', message)
  })
  
})

wss.broadcast = function broadcast(data, loc) {
  let json = JSON.stringify(data)
  console.log("sending: " + json)
  wss.clients.forEach(function each(client) {
    if(url.parse(client.upgradeReq.url, true).path == loc){
        client.send(json)
    }
  })
}


server.listen(process.env.PORT || 8000, process.env.IP || '127.0.0.1')
server.on('listening', () => console.log('listening'))