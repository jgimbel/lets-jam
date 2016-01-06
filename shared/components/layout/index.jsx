import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import reducer from '../../reducers'
import React, { Component } from 'react'
export default class Layout extends Component {
    render(){
        return (
            <html>
                <head>
                <title>Radio Room</title>
                </head>
                <body>
                    <Provider store={applyMiddleware(thunk)(createStore)(reducer, this.props.initialState)}>
                        {this.props.children}
                    </Provider>
                    <script src="/js/app.js"/>
                </body>
            </html>
        )
    }
}