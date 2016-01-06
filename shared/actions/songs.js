
export function nextSong(){
    return {
        type: "NEXT_SONG"
    }
}

export function addSong(song){
    var Fetch = require('whatwg-fetch')
    return (dispatch, getState) =>{
        fetch('/song?song='+song)
        .then(res => res.json())
          .then((res) => {
            dispatch(res)
          },
          err => dispatch(err))
    }
}