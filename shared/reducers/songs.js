export default (state = {queue: [], playing: null, played: []}, action) => {
    switch(action.type){
        case "NEXT_SONG": 
            return Object.assign({}, state, {played: [...state.played, state.playing], playing: state.queue[0], queue: state.queue.slice(0,1)})
        case "ADD_SONG":
            if(state.playing){
                return Object.assign({}, state, {queue: [...state.queue, action.song]})
            } else {
                return Object.assign({}, state, {playing: action.song})
            }
            
        default:
            return state
    }
}