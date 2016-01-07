import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../actions'
import Song from './song'
export class Queue extends Component {
    render(){
        
        const { nextSong } = bindActionCreators(actions, this.props.send)
        const { played, playing, queue } = this.props.songs
        console.log(this.props.songs)
        return (
            <div className="songs">
                <ul className="played">
                   { played.map( (song, index) => (<Song {...song} key={index} />)) }
                </ul>
                <div className="playing">
                    { playing ? <Song mutable={true} {...playing} isPlaying={true} /> : null }
                </div>
                <ul className="queue">
                    { queue.map( (song, index) => <Song {...song} key={index} />) }
                </ul>
            </div>
        )
    }
}

export default connect(
    state => ({songs: state.songs})
)(Queue)