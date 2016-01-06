import React, { Component } from 'react'
export default class Layout extends Component {
    render(){
        
        return (
            <html>
                <head>
                <title>Let's Jam!</title>
                </head>
                <body>
                    {this.props.children}
                    <script src="/js/app.js"/>
                </body>
            </html>
        )
    }
}