import React, { Component } from 'react'
import AddSong from './add-song'
import Queue from './queueList'
export default class Station extends Component {
    render(){
       return <main>
            <AddSong />
            <Queue />
        </main>
    }
}