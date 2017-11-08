import {IRet, IExpectedCounts} from "suman-types/dts/reporters";

//core
import EE = require('events');
import fs = require('fs');
import path = require('path');
import assert = require('assert');

//npm
import su = require('suman-utils');

// import all reporters, just for a smoke test
import clearLineReporter from '../modules/clear-line-reporter';
import karmaReporter from '../modules/karma-reporter';
import metaTestReporter from '../modules/meta-test-reporter';
import stdReporter from '../modules/std-reporter';
import tapJSONReporter from '../modules/tap-json-reporter';
import tapReporter from '../modules/tap-reporter';
import webSocketReporter from '../modules/websocket-reporter';

global.__karma__ = {}; // make the karma test pass..

const e = new EE();

[
  clearLineReporter(e, {} as any),
  karmaReporter(e, {} as any),
  metaTestReporter(e, {} as any, {} as IExpectedCounts),
  stdReporter(e, {} as any),
  tapJSONReporter(e, {} as any),
  tapReporter(e, {} as any),
  webSocketReporter(e, {} as any, {}, {} as SocketIOClient.Socket)
]
.forEach(function (ret: IRet) {
   assert(su.isObject(ret));
});


const items = fs.readdirSync(path.resolve(__dirname + '/../modules')).filter(function (item) {
  return fs.statSync(item).isDirectory();
});

// we should assert that items length is the same number as the number of loaded reporters
console.log('items.length => ', items.length);
