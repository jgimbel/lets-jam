import React , { Component } from 'react'

export default class Home extends Component {
    constructor(props){
        super(props)
        this.state = {text: ""}
    }
    render(){
        return (
            <main>
                <h1>Radio Room</h1>
                <div>
                        <input type="text" onChange={(ev) => this.setState({text: ev.target.value})}/>
                        <button onClick={ ()=>{ console.log('clicked'); window.location.href = `/station/${this.state.text.replace(' ', '-')}` }}>Go To Station</button>
                </div>
            </main>
        )
    }
}