import 'core-js/fn/object/assign';
require('normalize.css/normalize.css');

import 'index.html';
require('./styles/main.scss');

import {SubscriptionSocketReconnect, ScreenMessageRouter, utils} from 'displayTrigger';

import * as THREE from 'three';
import ThreeMain from './three/main';
import {initStage} from './stage/stageBuilder';
import {LightManager} from './lights/LightManager';


import React from 'react';
import {render} from 'react-dom';
import {TimelineManager, Timeline} from './timeline/timeline';


//const body = document.getElementsByTagName('body').item(0);

const three = new ThreeMain(document.getElementById('three_scene'));

const subscription_socket = new SubscriptionSocketReconnect();

const timelineInstance = render(
    <Timeline name={''} host={'localhost:23487'} pixelsPerSecond={8} zoom={1}></Timeline>,
    document.getElementById('timeline')
);
const timelineManager = new TimelineManager(subscription_socket, timelineInstance);

const screenMessageRouter = new ScreenMessageRouter(subscription_socket);
const lightManager = new LightManager(subscription_socket);



function _initStage(config) {
    return initStage(three, screenMessageRouter, lightManager, config);
}

// Fallback Config -------------------------------------------------------------

const config_url = `/data/stage_${utils.getUrlParameter('stage_config') || 'default'}.json`;
fetch(config_url).then(response => {
    return response.json();
}).then(data => {
    _initStage(Immutable.fromJS(data));
}).catch(error => {
    console.error(`Unable to load ${config_url} for stage config. Falling back to default`);
    _initStage(null);
});