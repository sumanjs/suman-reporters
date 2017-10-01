'use strict';
//dts
import {IGlobalSumanObj, ISumanOpts} from 'suman-types/dts/global';
import {ITestDataObj} from "suman-types/dts/it";
import EventEmitter = NodeJS.EventEmitter;

//polyfills
const process = require('suman-browser-polyfills/modules/process');
const global = require('suman-browser-polyfills/modules/global');

//core
import * as util from 'util';
import * as assert from 'assert';
import * as path from 'path';

//npm
import * as chalk from 'chalk';
import {events} from 'suman-events';
import su from 'suman-utils';


//project
const _suman : IGlobalSumanObj = global.__suman = (global.__suman || {});

///////////////////////////////////////////////////////////

function title(test: ITestDataObj) {
  return String(test.title || test.desc || test.description || test.name).replace(/#/g, '');
}

//////////////////////////////////////////////////////////

const logDebug = function () {
  let debug;
  if (debug = process.env.SUMAN_DEBUG) {
    const args = Array.from(arguments).filter(i => i);
    args.forEach(function (a) {
      process.stderr.write('\n' + (typeof a === 'string' ? a : util.inspect(a)) + '\n');
    });
  }
  return debug;
};

interface IStringVarargs {
  (...args: string[]): void;
}

let onAnyEvent: IStringVarargs = function () {
  if (!logDebug.apply(null, arguments)) {
    const args = Array.from(arguments).map(function (data) {
      return typeof data === 'string' ? data : util.inspect(data);
    });
    return console.log.apply(console, args);
  }
};

let loaded = false;

//////////////////////////////////////////////////////////

export default (s: EventEmitter, opts: ISumanOpts) => {

  if (_suman.inceptionLevel < 1) {
    console.error('Suman waring => tap-reporter: suman inception is 0, we may not need to load this reporter.');
  }

  if (loaded) {
    console.error('Suman implementation warning => TAP reporter loaded more than once.');
    return;
  }

  loaded = true;
  let sumanOpts = _suman.sumanOpts;
  let level = _suman.inceptionLevel;

  let isColorable = function (): boolean {
    return level < 1 && !sumanOpts.no_color;
  };

  let n = 0;
  let passes = 0;
  let failures = 0;
  let skipped = 0;
  let stubbed = 0;

  s.on(String(events.TEST_CASE_END), function (test: ITestDataObj) {
    ++n;
  });

  s.on(String(events.TEST_CASE_FAIL), function (test: ITestDataObj) {
    failures++;
    console.log(su.customStringify({
      '@tap-json': true,
      ok: false,
      desc: test.desc || test.title || test.name,
      filePath: test.testPath || test.filePath,
      error: test.errorDisplay || test.error,
      id: n,
      dateComplete: test.dateComplete,
      dateStarted: test.dateStarted
    }));
  });

  s.on(String(events.TEST_CASE_PASS), function (test: ITestDataObj) {
    passes++;
    console.log(su.customStringify({
      '@tap-json': true,
      ok: true,
      filePath: test.testPath || test.filePath,
      desc: test.desc || test.title ||  test.name,
      id: n,
      dateComplete: test.dateComplete,
      dateStarted: test.dateStarted
    }));
  });

  s.on(String(events.TEST_CASE_SKIPPED), function (test: ITestDataObj) {
    skipped++;
    console.log(su.customStringify({
      '@tap-json': true,
      ok: true,
      desc: test.desc || test.title || test.name,
      filePath: test.testPath || test.filePath,
      id: n,
      skipped: true,
      skip: true,
      dateComplete: test.dateComplete,
      dateStarted: test.dateStarted
    }));
  });

  s.on(String(events.TEST_CASE_STUBBED), function (test: ITestDataObj) {
    stubbed++;
    console.log(su.customStringify({
      '@tap-json': true,
      ok: true,
      desc: test.desc || test.title || test.name,
      filePath: test.testPath || test.filePath,
      id: n,
      stubbed: true,
      todo: true,
      dateComplete: test.dateComplete,
      dateStarted: test.dateStarted
    }));
  });

};
