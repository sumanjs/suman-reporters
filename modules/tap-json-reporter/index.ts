'use strict';

//dts
import {IGlobalSumanObj, ISumanOpts} from 'suman-types/dts/global';
import {ITestDataObj} from "suman-types/dts/it";
import EventEmitter = NodeJS.EventEmitter;
import {IRet, IRetContainer, IExpectedCounts} from 'suman-types/dts/reporters';

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
import su =  require('suman-utils');

//project
const _suman: IGlobalSumanObj = global.__suman = (global.__suman || {});
import {getLogger, wrapReporter} from "../../lib/utils";
const reporterName = path.basename(__dirname);
const log = getLogger(reporterName);

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

let getTestFilePath = function(test: ITestDataObj){
  return test.testPath || test.filePath || test.filepath || test.testpath;
};

let getTestDesc = function(test: ITestDataObj){
 return test.desc || test.title || test.name;
};

////////////////////////////////////////////////////////////////////////////////////////

export const loadreporter = wrapReporter(reporterName,
  (retContainer: IRetContainer, s: EventEmitter, sumanOpts: ISumanOpts) => {

    if (_suman.inceptionLevel < 1) {
      log.warning(`"${reporterName}" warning: suman inception level is 0, we may not need to load this reporter.`);
    }

    let level = _suman.inceptionLevel;

    let isColorable = function (): boolean {
      return level < 1 && !sumanOpts.no_color;
    };

    const results = {
      n: 0,
      passes: 0,
      failures: 0,
      skipped: 0,
      stubbed: 0
    };

    s.on(String(events.TEST_CASE_END), function (test: ITestDataObj) {
      ++results.n;
    });

    s.on(String(events.TEST_CASE_FAIL), function (test: ITestDataObj) {
      results.failures++;
      console.log(su.customStringify({
        '@tap-json': true,
        ok: false,
        desc: getTestDesc(test),
        filePath: getTestFilePath(test),
        error: test.errorDisplay || test.error,
        id: results.n,
        dateComplete: test.dateComplete,
        dateStarted: test.dateStarted
      }));
    });

    s.on(String(events.TEST_CASE_PASS), function (test: ITestDataObj) {
      results.passes++;
      console.log(su.customStringify({
        '@tap-json': true,
        ok: true,
        desc: getTestDesc(test),
        filePath: getTestFilePath(test),
        id: results.n,
        dateComplete: test.dateComplete,
        dateStarted: test.dateStarted
      }));
    });

    s.on(String(events.TEST_CASE_SKIPPED), function (test: ITestDataObj) {
      results.skipped++;
      console.log(su.customStringify({
        '@tap-json': true,
        ok: true,
        desc: getTestDesc(test),
        filePath: getTestFilePath(test),
        id: results.n,
        skipped: true,
        skip: true,
        dateComplete: test.dateComplete,
        dateStarted: test.dateStarted
      }));
    });

    s.on(String(events.TEST_CASE_STUBBED), function (test: ITestDataObj) {
      results.stubbed++;
      console.log(su.customStringify({
        '@tap-json': true,
        ok: true,
        desc: getTestDesc(test),
        filePath: getTestFilePath(test),
        id: results.n,
        stubbed: true,
        todo: true,
        dateComplete: test.dateComplete,
        dateStarted: test.dateStarted
      }));

    });

    return retContainer.ret = {
      reporterName,
      results
    } as IRet;

  });

export default loadreporter;
