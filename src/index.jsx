import 'core-js/fn/object/assign';
require('normalize.css/normalize.css');

import 'index.html';
require('./styles/main.scss');

import {SubscriptionSocketReconnect, ScreenMessageRouter} from 'displayTrigger';

import * as THREE from 'three';
import ThreeMain from './three/main';
import {initStage} from './stage/stageBuilder';
import {LightManager} from './lights/lightManager';


import React from 'react';
import {render} from 'react-dom';
import {TimelineManager, Timeline} from './timeline/timeline';


//const body = document.getElementsByTagName('body').item(0);

const three = new ThreeMain(document.getElementById('three_scene'));

const subscription_socket = new SubscriptionSocketReconnect();

const timelineInstance = render(
    <Timeline host={'localhost:23487'} pixelsPerSecond={8}></Timeline>,
    document.getElementById('timeline')
);
const timelineManager = new TimelineManager(subscription_socket, timelineInstance);

const screenMessageRouter = new ScreenMessageRouter(subscription_socket);
const lightManager = new LightManager(subscription_socket);



function _initStage(config) {
    return initStage(three, screenMessageRouter, lightManager, config);
}

// Fallback Config -------------------------------------------------------------
const urlParams = new URLSearchParams(window.location.search);
const config_url = `/data/stage_${urlParams.get('stage_config') || 'default'}.json`;
fetch(config_url).then(response => {
    return response.json();
}).then(data => {
    _initStage(Immutable.fromJS(data));
}).catch(error => {
    console.error(`Unable to load ${config_url} for stage config. Falling back to default`);
    _initStage(null);
});
