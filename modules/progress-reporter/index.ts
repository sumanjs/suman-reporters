'use strict';
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

//npm
const ProgressBar = require('progress');
const {events} = require('suman-events');
import su = require('suman-utils');

//project
import {getLogger} from "../../lib/utils";
const reporterName = path.basename(__dirname);
const log = getLogger(reporterName);

///////////////////////////////////////////////////////////////////////////////////////////////////

const onAnyEvent = function (data) {
  process.stdout.write(data);
};

let ret: IRet;

////////////////////////////////////////////////////////////////////////////////////////////////////

export default (s: EventEmitter, sumanOpts: ISumanOpts) => {

  if (ret) {
    // defensive programming construct, yay
    log.warning(`implementation warning => "${reporterName}" loaded more than once.`);
    return ret;
  }


  if (su.vgt(5)) {
    log.info(`loading ${reporterName}.`);
  }


  let progressBar;

  s.on(events.RUNNER_STARTED, function onRunnerStart(totalNumTests) {

    console.log('\n');

    progressBar = new ProgressBar(' => progress [:bar] :percent :current :token1 :token2', {
        total: totalNumTests,
        width: 120
      }
    );
  });

  s.on(events.TEST_FILE_CHILD_PROCESS_EXITED, function onTestEnd(d) {
    // process.stdout.write('\n\n');
    // process.stdout.write(' Test finished with exit code = ' + d.exitCode + ' => path => ' + d.testPath);
    // process.stdout.write('\n\n');
    progressBar.tick({
      'token1': "",
      'token2': ""
    });
  });

  s.on(events.RUNNER_EXIT_CODE, onAnyEvent);

  s.on(events.RUNNER_ENDED, function onRunnerEnd() {
    console.log('\n => Runner end event fired.');
  });

  s.on('suite-skipped', function onRunnerEnd() {

  });

  s.on('suite-end', function onRunnerEnd() {

  });

  return ret = {} as Partial<IRet>

};
