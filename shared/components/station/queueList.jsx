import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../actions'
import Song from './song'
export class Queue extends Component {
    render(){
        const { played, playing, queue } = this.props.songs
        const { nextSong } = this.props.actions
        console.log(this.props.songs)
        return (
            <div className="songs">
                <ul className="played">
                   { played.map( song => (<Song {...song} />)) }
                </ul>
                <div className="playing">
                    { playing ? <Song {...playing} isPlaying={true} onEnd={() => nextSong()} /> : null }
                </div>
                <ul className="queue">
                    { queue.map( song => <Song {...song} />) }
                </ul>
            </div>
        )
    }
}

export default connect(
    state => ({songs: state.songs}),
    dispatch => ({actions: bindActionCreators(actions, dispatch)})
)(Queue)