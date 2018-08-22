// Notes on react use
// https://stackoverflow.com/questions/24147331/react-the-right-way-to-pass-form-element-state-to-sibling-parent-elements

require('./TimelineContainer.scss');

import React from 'react';

import { TimelineControls } from './controls/TimelineControls';
import { Timeline } from './timeline/timeline';


export class TimelineContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            playing: false,
            cursorPosition: 0,
            selectionStart: 0,
            selectionEnd: 0,
            sequenceModuleName: 'unknown',
            cachebust: '',
        };
        this.onSelectTrack = this.onSelectTrack.bind(this);
        this.lightsCommand = this.lightsCommand.bind(this);

        this.onSeek = this.onSeek.bind(this);
        this.onUpdateState = this.onUpdateState.bind(this);
    }

    onSelectTrack(sequenceModuleName) {
        console.log('sequenceModuleName', sequenceModuleName);
        if (!this.props.eventmap.has(sequenceModuleName)) {console.error(`${sequenceModuleName} not in eventmap`);}
        this.props.sendMessages(...this.props.eventmap.get(sequenceModuleName).map((payload)=>payload.map((v, k)=>{
            return (v == 'lights.start_sequence') ? 'lights.load_sequence' : v;
        })));
        this.setState({'sequenceModuleName': sequenceModuleName});  // TODO? is handled in subscription_socket feedback.
    }

    lightsCommand(cmd, attrs={}) {
        console.log(`lights.${cmd}`, attrs);
        this.props.sendMessages(Object.assign({deviceid: 'lights', func: `lights.${cmd}`}, attrs));
    }

    onSeek(timecode) {
        console.log('onSeek', timecode);
        if (this.state.playing) {
            this.lightsCommand('start_sequence', {timecode: this.state.selectionStart});
        }
        else {
            this.lightsCommand('single_frame_at_timecode', {timecode: timecode});
        }
    }

    onUpdateState(state) {
        this.setState(state);  //Object.assign(this.state, state)
    }

    render() {
        return (
            <div className='timeline_container'>
                <TimelineControls
                    sequenceModuleNames={[...this.props.eventmap.keySeq()]}
                    sequenceModuleName={this.state.sequenceModuleName}
                    onSelectTrack={this.onSelectTrack}
                    lightsCommand={this.lightsCommand}

                    playing={this.state.playing}
                    cursorPosition={this.state.cursorPosition}
                    selectionStart={this.state.selectionStart}
                    selectionEnd={this.state.selectionEnd}

                    onUpdateState={this.onUpdateState}
                />
                <Timeline
                    ref={(child) => { this._timeline_react_component = child; }}

                    host={this.props.host}
                    pixelsPerSecond={this.props.pixelsPerSecond}

                    sequenceModuleName={this.state.sequenceModuleName}
                    cachebust={this.state.cachebust}

                    cursorPosition={this.state.cursorPosition}
                    selectionStart={this.state.selectionStart}
                    selectionEnd={this.state.selectionEnd}

                    onSeek={this.onSeek}
                    onUpdateState={this.onUpdateState}
                />
            </div>
        );
    }
}
TimelineContainer.defaultProps = {
    sendMessages: ()=>{},
};
