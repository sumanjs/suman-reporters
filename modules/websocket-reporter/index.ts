'use strict';
//dts
import {IGlobalSumanObj, ISumanOpts, ITestDataObj} from 'suman';
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

//project
const _suman: IGlobalSumanObj = global.__suman = (global.__suman || {});
const title = function (test) {
  return String(test.title || test.desc || test.description || test.name).replace(/#/g, '');
};

//////////////////////////////////////////////////////////

let count = 0;

//////////////////////////////////////////////////////////

export default (s: EventEmitter, opts: ISumanOpts) => {

  count++;
  if (count > 1) {
    throw new Error('Implementation error => Tap reporter loaded more than once.');
  }

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

  s.on(events.TAP_COMPLETE, function (data) {

  });

  s.on(events.TEST_CASE_END, function (test) {
    ++n;
  });

  s.on(events.TEST_CASE_FAIL, function (test) {
    failures++;
    console.log('not ok %d %s', n, title(test));
  });

  s.on(events.TEST_CASE_PASS, function (test) {
    passes++;
    console.log('ok %d %s', n, title(test));
  });

  s.on(events.TEST_CASE_SKIPPED, function (test) {
    skipped++;
    console.log('ok %d %s # SKIP -', n, title(test));
  });

  s.on(events.TEST_CASE_STUBBED, function (test) {
    stubbed++;
    console.log('ok %d %s # STUBBED -', n, title(test));
  });

  console.log(' => TAP reporter loaded.');

};
