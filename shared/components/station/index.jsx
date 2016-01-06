import React, { Component } from 'react'

import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import reducer from '../../reducers'

import AddSong from './add-song'
import Queue from './queueList'

export default class Station extends Component {
    
    componentDidMount(){
        let host = window.document.location.host.replace(/:.*/, '');
        this.ws = new WebSocket('ws://' + host + ':8000' + window.document.location.pathname);
        this.ws.onmessage = (event) => {
            this.store.dispatch(JSON.parse(event.data))
        };
    }
    
    dispatch(action){
        this.ws.send(JSON.stringify(action))
    }
    
    render(){
       this.store = this.store || applyMiddleware(thunk)(createStore)(reducer, this.props.initialState)
       return (
            <Provider store={this.store}>
                <main>
                    <AddSong send={(a) => this.dispatch(a)} />
                    <Queue send={(a) => this.dispatch(a)} />
                </main>
            </Provider>
        )
    }
}