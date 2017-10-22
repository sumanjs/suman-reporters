'use strict';
//dts
import {IGlobalSumanObj, ISumanOpts} from 'suman-types/dts/global';
import EventEmitter = NodeJS.EventEmitter;

//polyfills
const process = require('suman-browser-polyfills/modules/process');
const global = require('suman-browser-polyfills/modules/global');

//core
import * as util from 'util';
import * as assert from 'assert';
import * as path from 'path';

//npm
const {events} = require('suman-events');
import * as chalk from 'chalk';
import su = require('suman-utils');

//project
const _suman: IGlobalSumanObj = global.__suman = (global.__suman || {});
import {getLogger} from "../../lib/logging";
const reporterName = path.basename(__dirname);
const log = getLogger(reporterName);

//////////////////////////////////////////////////////////

let count = 0;
let ret: IRet;

//////////////////////////////////////////////////////////

export default (s: EventEmitter, opts: ISumanOpts, expectations: {}, client: SocketIOClient.Socket) => {

  if (ret) {
    // defensive programming construct, yay
    return ret;
  }

  const runAsync = function (fn: Function) {
    ret.count++;
    fn(function (err: Error) {
      err && console.error(err.stack || err);
      ret.count--;
      if (ret.count < 1) {
        // ret.cb starts off as a noop, but the suman framework
        // will reassign the value in the future and it will signal that we are done
        ret.cb && ret.cb();
      }
    });
  };

  //TODO: make a websocket connection with runner
  //TODO: this reporter should be used by the browser only
  //TODO: it should write to stdout *AND* write the same thing to websocket connection

  let n = 0;
  let passes = 0;
  let failures = 0;
  let skipped = 0;
  let stubbed = 0;

  s.on(events.RUNNER_STARTED, function () {
    console.log(' => Suman runner has started.\n');
  });

  s.on(events.RUNNER_ENDED, function () {
    console.log('# tests ' + (passes + failures));
    console.log('# pass ' + passes);
    console.log('# fail ' + failures);
    console.log('# stubbed ' + failures);
    console.log('# skipped ' + failures);
  });

  s.on(events.TEST_CASE_END, function (test) {
    ++n;
  });

  s.on(events.TEST_CASE_FAIL, function (test) {
    failures++;
    runAsync(function (cb: Function) {
      const str = su.customStringify({
        childId: process.env.SUMAN_CHILD_ID,
        test,
        type: 'LOG_RESULT',
      });
      client.emit('LOG_RESULT', JSON.parse(str), cb);
    });
  });

  s.on(events.TEST_CASE_PASS, function (test) {
    passes++;
    runAsync(function (cb: Function) {
      const str = su.customStringify({
        childId: process.env.SUMAN_CHILD_ID,
        test,
        type: 'LOG_RESULT',
      });
      client.emit('LOG_RESULT', JSON.parse(str), cb);
    });
  });

  s.on(events.TEST_CASE_SKIPPED, function (test) {
    skipped++;
    runAsync(function (cb: Function) {
      const str = su.customStringify({
        childId: process.env.SUMAN_CHILD_ID,
        test,
        type: 'LOG_RESULT',
      });
      client.emit('LOG_RESULT', JSON.parse(str), cb);
    });
  });

  s.on(events.TEST_CASE_STUBBED, function (test) {
    stubbed++;
    runAsync(function (cb: Function) {
      const str = su.customStringify({
        childId: process.env.SUMAN_CHILD_ID,
        test,
        type: 'LOG_RESULT',
      });
      client.emit('LOG_RESULT', JSON.parse(str), cb);
    });
  });

  return ret = {
    reporterName,
    count: 0,
    cb: null
  };

};
