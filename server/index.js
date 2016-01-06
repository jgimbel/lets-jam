let express = require('express')
  , url = require('url')
  , path = require('path')
  , app = express()
  , server = require('http').createServer(app)
  , WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ server: server })
  , engine = require('react-view-engine')
  , ytdl = require('ytdl-core')
  , emptyQueue = { queue: [], playing: null, played: [] }
  , redux = require('redux')
  , applyMiddleware = redux.applyMiddleware
  , createStore = redux.createStore
  , thunk = require('redux-thunk')
  , reducer = require('../shared/reducers')


require('babel-register')({extensions: ['.js', '.jsx']})
engine.setLayout('layout')

// Normal express view stuff
app.engine('jsx', engine.engine)
app.set('view', engine.view)
app.set("view engine", "jsx")
app.set("views", __dirname+"/../shared/components")
app.set("views cache", false)


let locations = []


app.use(express.static(path.join(__dirname, '..', '.build')))

app.get('/', (req, res) => res.render('home'))

app.get('/station/:station', (req, res) => {
  let store
  for(let loc of locations){
      if(loc.url == req.path){
          store = loc.store
      }
  }
  
    res.render('station', store || emptyQueue)
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
  var location = url.parse(ws.upgradeReq.url, true)
  let store
  for(let loc of locations){
      if(loc.path == location.path){
          store = loc.store
      }
  }
  if(!store){
      store = { store: applyMiddleware(thunk)(createStore)(reducer,  emptyQueue) }
      locations.push(Object.assign({}, location, { store }))
  }
  
  // you might use location.query.access_token to authenticate or share sessions
  // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

  ws.on('message', function incoming(message) {
    store.dispatch(message)
    console.log('received: %s', message);
  });

  ws.send('something');
});

server.listen(process.env.PORT || 8000, process.env.IP || '127.0.0.1')
server.on('listening', () => console.log('listening'))