// import all reporters, just for a smoke test

import clearLineReporter from '../modules/clear-line-reporter';
import karmaReporter from '../modules/karma-reporter';
import metaTestReporter, {IExpectedCounts} from '../modules/meta-test-reporter';
import stdReporter from '../modules/std-reporter';
import tapJSONReporter from '../modules/tap-json-reporter';
import tapReporter from '../modules/tap-reporter';
import webSocketReporter from '../modules/websocket-reporter';

import EE = require('events');
import fs = require('fs');
import path = require('path');
const e = new EE();


clearLineReporter(e, {} as any);
karmaReporter(e, {} as any);
metaTestReporter(e, {} as any, {} as IExpectedCounts);
stdReporter(e, {} as any);
tapJSONReporter(e, {} as any);
tapReporter(e, {} as any);
webSocketReporter(e, {} as any, {}, {} as SocketIOClient.Socket);


const items = fs.readdirSync(path.resolve(__dirname + '/../modules')).filter(function(item){
    return fs.statSync(item).isDirectory();
});


// we should assert that items length is the same number as the number of loaded reporters
console.log('items.length => ', items.length);
