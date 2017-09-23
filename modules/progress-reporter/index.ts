'use strict';
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
const ProgressBar = require('progress');
const {events} = require('suman-events');

////////////////////////////////////////

const onAnyEvent = function (data) {
  process.stdout.write(data);
};

export default (s: EventEmitter, sumanOpts: ISumanOpts) => {

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

};
