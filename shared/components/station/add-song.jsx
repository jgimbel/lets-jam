import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../actions'

export class AddSong extends Component {
    render(){
        var { addSong } = this.props.actions
        return (
            <section>
                <input type="text" ref="url"/>
                <button onClick={()=>addSong(this.refs.url.value)}>Add Song</button>
            </section>
        )
    }
}
export default connect(() => ({}), dispatch => ({actions: bindActionCreators(actions, dispatch)}))(AddSong)
