'use strict';

//dts
import {IGlobalSumanObj, ISumanOpts} from 'suman-types/dts/global';
import EventEmitter = NodeJS.EventEmitter;
import {ITestDataObj} from "suman-types/dts/it";
import {ISumanChildProcess} from "suman-types/dts/runner";
import {ITableData} from "suman-types/dts/table-data";

//polyfills
const process = require('suman-browser-polyfills/modules/process');
const global = require('suman-browser-polyfills/modules/global');

//core
import * as util from 'util';
import * as assert from 'assert';
import * as path from 'path';

//npm
import su = require("suman-utils");
import * as chalk from 'chalk';

//project
const _suman: IGlobalSumanObj = global.__suman = (global.__suman || {});
import {events} from 'suman-events';
import {getLogger} from "../../lib/logging";
const reporterName = path.basename(__dirname);
const log = getLogger(reporterName);

////////////////////////////////////////////////////////////////////////

const noColors = process.argv.indexOf('--no-color') > 0;

////////////////////////////////////////////////////////////////////////

const noop = function () {
};

interface IStringVarargs {
  (...args: string[]): void;
}

/////////////////////////////////////////////////////////////////////////////////////

let testCaseCount = 0;
let loaded = false;
let ret: IRet;

/////////////////////////////////////////////////////////////////////////////////////

export default (s: EventEmitter, sumanOpts: ISumanOpts, expectations: Object) => {

  if (loaded) {
    log.error('Suman implementation error => reporter loaded more than once.');
    return;
  }
  loaded = true;

  if (!sumanOpts) {
    sumanOpts = {} as Partial<ISumanOpts>;
    log.error('Suman implementation warning, no sumanOpts passed to reporter.');
  }

  if (_suman.inceptionLevel > 0) {
    log.info(`suman inception level greater than 0.`);
    return;
  }

  const karma = global.__karma__;
  assert(karma, 'karma object not exposed at global.__karma___ or window.__karma__');

  //on error
  s.on(String(events.RUNNER_EXIT_CODE_GREATER_THAN_ZERO), noop);

  s.on(String(events.FATAL_TEST_ERROR), function (err: any) {
    log.error('fatal runtime error, suman tests cannot continue:\n', err && (err.stack || util.inspect(err)));
  });

  s.on(String(events.TEST_CASE_END), function () {
    testCaseCount++;
  });

  s.on(String(events.TEST_CASE_FAIL), function (test: ITestDataObj) {
    karma.result({pass: false, fail: true, name: test.desc});
  });

  s.on(String(events.TEST_CASE_PASS), function (test: ITestDataObj) {
    let timeDiffStr = (test.dateComplete ? '(' + ((test.dateComplete - test.dateStarted) || '< 1') + 'ms)' : '');
    karma.result({pass: true, name: test.desc});
  });

  s.on(String(events.TEST_CASE_SKIPPED), function (test: ITestDataObj) {
    karma.result({pass: false, skipped: true, skip: true, name: test.desc});
  });

  s.on(String(events.TEST_CASE_STUBBED), function (test: ITestDataObj) {
    karma.result({pass: false, stubbed: true, stub: true, name: test.desc});
  });

  return ret = {
    reporterName,
    count: 0,
    cb: noop,
    completionHook: function () {
      karma.complete();
    }
  };

};
