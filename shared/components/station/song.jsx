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
        audio.addEventListener('progress', onProgress)
        //audio.addEventListener('timeupdate', onTimeUpdate)
        audio.addEventListener('ended', onEnd)
    }
    
    componentWillUnmount() {
        const { source, length, time, onProgress, onTimeUpdate, onEnd } = this.props
        const audio = this.refs.audio
        audio.removeEventListener('progress', onProgress)
        //audio.removeEventListener('timeupdate', onTimeUpdate)
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
    
    render(){
        const { source, duration, time, title, image } = this.props
        
        return (
            <section>
                <div style={{height: '90px', width: '120px', backgroundImage: `url(${image})`, backgroundRepeat: 'no-repeat'}}>
                    <label>{title}</label>
                </div>
                <audio ref="audio">
                    <source src={source} />
                </audio>
                <div className="controls">
                    <button onClick={()=>this.onMute()}>
                        Mute
                    </button>
                </div>
            </section>
        )
    }
}