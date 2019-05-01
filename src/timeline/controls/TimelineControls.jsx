// The control buttons play, pause, stop
// the current track (as dropdown, linked to eventmap)
// the current timecodes (timecode and beats/bars), timesignature
// this component sits above the timeline

import React from 'react';

import { TrackSelection } from './TrackSelection';
import { Timecode } from './Timecode';

require('./TimelineControls.scss');


export class TimelineControls extends React.Component {

    constructor(props) {
        super(props);

        this.onPlay = this.onPlay.bind(this);
        this.onPause = this.onPause.bind(this);
        this.onStop = this.onStop.bind(this);
        this.onFrameBack = this.onFrameBack.bind(this);
        this.onFrameForward = this.onFrameForward.bind(this);
    }

    onPlay() {
        this.props.onUpdateState({playing: true});
        this.props.lightsCommand('start_sequence', {timecode: this.props.cursorPosition});
    }

    onPause() {
        this.props.onUpdateState({playing: false});
        this.props.lightsCommand('pause');
    }

    onStop() {
        this.props.onUpdateState({playing: false});
        this.props.lightsCommand('pause');
        this.props.lightsCommand('seek', {timecode: 0});
    }

    onFrameBack() {
        this.props.lightsCommand('seek', {timecode: this.props.cursorPosition, frame_offset: -1});
    }
    onFrameForward() {
        this.props.lightsCommand('seek', {timecode: this.props.cursorPosition, frame_offset: +1});
    }

    render() {
        const timecodeFactory = (name) => {
            return <Timecode name={name} timecode={this.props[name]} bpm={this.props.bpm} timesignature={this.props.timesignature}/>;
        }

        return (
            <div className="timeline_controls">
                {
                    this.props.playing ?
                        <button className="timeline_pause" onClick={this.onPause}></button>
                        :
                        <button className="timeline_play" onClick={this.onPlay}></button>
                }
                <button className="timeline_stop" onClick={this.onStop}></button>
                <button className="timeline_frame-back" onClick={this.onFrameBack}></button>
                <button className="timeline_frame-forward" onClick={this.onFrameForward}></button>

                <div className='timing_info'>
                    <div>{this.props.bpm}bpm</div>
                    <div>{this.props.timesignature}</div>
                </div>

                {timecodeFactory("cursorPosition")}
                {timecodeFactory("selectionStart")}
                {timecodeFactory("selectionEnd")}

                <TrackSelection
                    sequenceModuleNames={this.props.sequenceModuleNames}
                    sequenceModuleName={this.props.sequenceModuleName}
                    onSelectTrack={this.props.onSelectTrack}
                />
            </div>
        );
    }
}
TimelineControls.defaultProps = {
    bpm: 120,
    timesignature: '4:4',
    lightsCommand: ()=>{},
};
