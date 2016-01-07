import React, { Component } from 'react'
import ReactDOM from 'react-dom'
export default class AudioItem extends Component {
    componentDidMount(){
        const { source, length, time, onProgress, onTimeUpdate, onEnd } = this.props
        const audio = this.refs.audio
        if(source){
            this.updateSource()
        }
        audio.currentTime = time || 0
        audio.addEventListener('progress', (ev) => { console.log(ev) })
        audio.addEventListener('timeupdate', (ev) => { console.log(ev) })
        audio.addEventListener('ended', onEnd)
    }
    
    componentWillUnmount() {
        const { source, length, time, onProgress, onTimeUpdate, onEnd } = this.props
        const audio = this.refs.audio
        audio.removeEventListener('progress', onProgress)
        audio.removeEventListener('timeupdate', onTimeUpdate)
        audio.removeEventListener('ended', onEnd)
    } 
    
    componentDidUpdate(prevProps) {
        if (prevProps.source !== this.props.source) {
            this.updateSource()
        }

        if (prevProps.isPlaying !== this.props.isPlaying) {
            this.updateIsPlaying()
        }

        if (prevProps.defaultTime !== this.props.defaultTime) {
            this.updateCurrentTime()
        }
    }
    
    updateCurrentTime() {
        const node = this.refs.audio;
        if (node.readyState) {
            node.currentTime = this.props.defaultTime;
        }
    }
    
    updateIsPlaying() {
        const node = this.refs.audio
            , isPlaying = this.props.isPlaying

        if (isPlaying) {
            node.play()
        } else {
            node.pause()
        }
    }
    
    updateSource() {
        const node = this.refs.audio
            , isPlaying = this.props.isPlaying

        node.pause()
        // this.props.onTimeUpdate({
        //     currentTime: 0
        // })

        node.load()
        if (isPlaying) {
            node.play()
        }
    }
    
    onMute(){
        const node = this.refs.audio
        node.muted = !node.muted
    }
    
    mutable(mute){
        if(mute){
            return (
                <button onClick={()=>this.onMute()}>
                    Mute
                </button>
            )
        }
    }
    
    render(){
        const { source, duration, time, title, image, mutable } = this.props
        
        return (
            <li>
                <div style={{backgroundSize: '100%', height: '200px', width: '340px', backgroundImage: `url(${image})`, backgroundRepeat: 'no-repeat'}}>
                    <div>{title}</div>
                </div>
                <audio ref="audio">
                    <source src={source} />
                </audio>
                <div className="controls">
                    {this.mutable(mutable)}
                </div>
            </li>
        )
    }
}