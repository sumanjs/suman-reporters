'use strict';

//dts
import {IGlobalSumanObj, ISumanOpts} from 'suman-types/dts/global';
import EventEmitter = NodeJS.EventEmitter;
import {IRet} from 'suman-types/dts/reporters';
import {ITestDataObj} from "suman-types/dts/it";

//polyfills
const process = require('suman-browser-polyfills/modules/process');
const global = require('suman-browser-polyfills/modules/global');

//core
import * as util from 'util';
import * as assert from 'assert';
import * as path from 'path';

//project
const _suman: IGlobalSumanObj = global.__suman = (global.__suman || {});
import {events} from 'suman-events';
const colors = require('colors/safe');
import * as _ from 'lodash';


////////////////////////////////////////////////////////////////////////

const noColors = process.argv.indexOf('--no-color') > 0;

///////////////////////////////////////////////////////////////////////////////

let count = 0;

/////////////////////////////////////////////////////////////////////////////////////

const results: IExpectedCounts = {
  TEST_CASE_FAIL: 0,
  TEST_CASE_PASS: 0,
  TEST_CASE_SKIPPED: 0,
  TEST_CASE_STUBBED: 0
};

export interface IExpectedCounts {
  TEST_CASE_FAIL: number,
  TEST_CASE_PASS: number,
  TEST_CASE_SKIPPED: number,
  TEST_CASE_STUBBED: number
}

//README: note that just for reference, all events are included here; many are noop'ed because of this

export default (s: EventEmitter, sumanOpts: ISumanOpts, expectations: IExpectedCounts) => {

  count++;
  if (count > 1) {
    throw new Error('Suman implementation error => Suman standard reporter loaded more than once.');
  }

  s.on(String(events.TEST_CASE_FAIL), function (test: ITestDataObj) {
    results.TEST_CASE_FAIL++;
  });

  s.on(String(events.TEST_CASE_PASS), function (test: ITestDataObj) {
    results.TEST_CASE_PASS++;
  });

  s.on(String(events.TEST_CASE_SKIPPED), function (test: ITestDataObj) {
    results.TEST_CASE_SKIPPED++;
  });

  s.on(String(events.TEST_CASE_STUBBED), function (test: ITestDataObj) {
    results.TEST_CASE_STUBBED++;
  });

  s.on(String(events.META_TEST_ENDED), function (test: ITestDataObj) {

    console.log('META_TEST_ENDED => ', test);

    try {
      assert(_.isEqual(results, expectations), 'expectations and results are not equal.');
    }
    catch (err) {
      console.error(err.stack || err);
      process.exit(1);
    }

  });

};
