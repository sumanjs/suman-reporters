'use strict';

//dts
import {IGlobalSumanObj, ISumanOpts} from 'suman-types/dts/global';
import EventEmitter = NodeJS.EventEmitter;
import {IRet, IRetContainer, IExpectedCounts} from 'suman-types/dts/reporters';
import {ITestDataObj} from "suman-types/dts/it";

//polyfills
const process = require('suman-browser-polyfills/modules/process');
const global = require('suman-browser-polyfills/modules/global');

//core
import * as util from 'util';
import * as assert from 'assert';
import * as path from 'path';

//npm
import chalk from 'chalk';
import {events} from 'suman-events';

//project
const _suman: IGlobalSumanObj = global.__suman = (global.__suman || {});
import {getLogger, wrapReporter} from "../../lib/utils";
const reporterName = path.basename(__dirname);
const log = getLogger(reporterName);

///////////////////////////////////////////////////////////

function getCleanTitle(test: ITestDataObj) {
  return String(test.title || test.desc || test.description || test.name).replace(/#/g, '');
}

//////////////////////////////////////////////////////////

function logDebug() {
  let debug;
  if (debug = process.env.SUMAN_DEBUG) {
    const args = Array.from(arguments).filter(i => i);
    args.forEach(function (a) {
      process.stderr.write('\n' + (typeof a === 'string' ? a : util.inspect(a)) + '\n');
    });
  }
  return debug;
}

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

//////////////////////////////////////////////////////////

export const loadreporter = wrapReporter(reporterName,
  (retContainer: IRetContainer, s: EventEmitter, sumanOpts: ISumanOpts) => {

    if (global.__suman.inceptionLevel < 1) {
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

    s.on(String(events.RUNNER_INITIAL_SET), function (forkedCPs: Array<any>, processes: string, suites: string) {
      onAnyEvent('\n\n\t ' + chalk.bgBlue.yellow(' => [Suman runner] =>  initial set => ' +
        forkedCPs.length + ' ' + processes + ' running ' + forkedCPs.length + ' ' + suites + ' ') + '\n');
    });

    s.on(String(events.RUNNER_OVERALL_SET), function (totalCount: number, processes: string, suites: string, addendum: string) {
      onAnyEvent('\t ' + chalk.bgBlue.yellow(' => [Suman runner] =>  overall set => '
        + totalCount + ' ' + processes + ' will run ' + totalCount + ' ' + (suites + addendum) + ' ') + '\n\n\n');
    });

    s.on(String(events.RUNNER_ASCII_LOGO), function (logo: string) {
      onAnyEvent('\n\n' + logo + '\n\n')
    });

    s.on(String(events.RUNNER_STARTED), function () {
      _suman.log.info('Suman runner has started.\n');
    });

    s.on(String(events.RUNNER_ENDED), function () {
      console.log('# tests ' + (results.passes + results.failures));
      console.log('# pass ' + results.passes);
      console.log('# fail ' + results.failures);
      console.log('# stubbed ' + results.failures);
      console.log('# skipped ' + results.failures);
    });

    s.on(String(events.TAP_COMPLETE), function (data) {
      console.log('all TAP input received.');
    });

    s.on(String(events.TEST_CASE_END), function (test: ITestDataObj) {
      ++results.n;
    });

    s.on(String(events.TEST_CASE_FAIL), function (test: ITestDataObj) {
      results.failures++;
      if (false && isColorable()) {
        console.log(chalk.red(`not ok ${results.n} ${getCleanTitle(test)}`));
      }
      else {
        console.log(`not ok ${results.n} ${getCleanTitle(test)}`);
      }

    });

    s.on(String(events.TEST_CASE_PASS), function (test: ITestDataObj) {
      results.passes++;
      if (false && isColorable()) {
        console.log(chalk.green(`ok ${results.n} ${getCleanTitle(test)}`));
      }
      else {
        console.log(`ok ${results.n} ${getCleanTitle(test)}`);
      }

    });

    s.on(String(events.TEST_CASE_SKIPPED), function (test: ITestDataObj) {
      results.skipped++;
      console.log('ok %d %s # SKIP -', results.n, getCleanTitle(test));
    });

    s.on(String(events.TEST_CASE_STUBBED), function (test: ITestDataObj) {
      results.stubbed++;
      console.log('ok %d %s # STUBBED -', results.n, getCleanTitle(test));
    });

    s.on(String(events.RUNNER_EXIT_CODE), function (code: number) {
      onAnyEvent(['\n  ',
        ' <::::::::::::::::::::::::::::::::: Suman runner exiting with exit code: ' + code +
        ' :::::::::::::::::::::::::::::::::>', '\n'].join('\n'));
    });

    if (!sumanOpts.no_tables) {

      s.on(String(events.STANDARD_TABLE), function (table: Object) {
        console.log('\n\n');
        let str = table.toString();
        str = '\t' + str;
        console.log(str.replace(/\n/g, '\n\t'));
        console.log('\n');
      });

      s.on(String(events.RUNNER_RESULTS_TABLE), function (allResultsTableString: string) {
        onAnyEvent('\n\n' + allResultsTableString.replace(/\n/g, '\n\t') + '\n\n')
      });

      s.on(String(events.RUNNER_RESULTS_TABLE_SORTED_BY_MILLIS), function (strSorted: string) {
        onAnyEvent('\n\n' + strSorted.replace(/\n/g, '\n\t') + '\n\n')
      });

      s.on(String(events.RUNNER_OVERALL_RESULTS_TABLE), function (overallResultsTableString: string) {
        onAnyEvent(overallResultsTableString.replace(/\n/g, '\n\t') + '\n\n')
      });

    }

    return retContainer.ret = {results} as IRet;

  });

export default loadreporter;
