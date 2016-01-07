export default (state = {queue: [], playing: null, played: [], time: 0}, action) => {
    switch(action.type){
        case "NEXT_SONG": 
            return Object.assign({}, state, {played: [...state.played, state.playing], playing: state.queue[0], queue: state.queue.slice(1)})
        case "ADD_SONG":
            if(state.playing){
                return Object.assign({}, state, {queue: [...state.queue, action.song]}, {time: action.time})
            } else {
                return Object.assign({}, state, {playing: action.song}, {time: action.time})
            }
            
        default:
            return state
    }
}