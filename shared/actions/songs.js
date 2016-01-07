import 'isomorphic-fetch'
export function nextSong(){
    return {
        type: "NEXT_SONG"
    }
}

export function addSong(song){
    return (dispatch, getState) =>{
        const station = window.location.pathname.split('/').slice(-1)[0]
        let url = `http://${(window.location.host || 'localhost:8000')}/song/${station}?song=${song}`
        fetch(url)
        .then(res => res.json())
          .then((res) => {
            dispatch(res)
          },
          err => dispatch(err))
    }
}