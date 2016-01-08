import React, { Component } from 'react'

import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import reducer from '../../reducers'

import AddSong from './add-song'
import Queue from './queueList'

export default class Station extends Component {
    
    componentDidMount(){
        let host = window.document.location.host
        const protocol = window.location.protocol == 'http:' ? 'ws://' : 'wss://'
        this.ws = new WebSocket(protocol + host + window.document.location.pathname);
        this.ws.onmessage = (event) => {
            this.store.dispatch(JSON.parse(event.data))
        };
    }
    
    dispatch(action){
        if(typeof action == 'function'){
            action((a)=>this.dispatch(a), this.store.getState)
        } else {
            this.ws.send(JSON.stringify(action))
        }
    }
    
    render(){
       this.store = this.store || applyMiddleware(thunk)(createStore)(reducer, this.props.store)
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