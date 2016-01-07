import 'isomorphic-fetch'
export function nextSong(){
    return {
        type: "NEXT_SONG"
    }
}

export function addSong(song){
    return (dispatch, getState) =>{
        let url = (window.location.hostname || 'localhost:8000') + '/song?song='+song
        fetch(url)
        .then(res => res.json())
          .then((res) => {
            dispatch(res)
          },
          err => dispatch(err))
    }
}