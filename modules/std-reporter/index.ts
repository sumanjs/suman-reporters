'use strict';

//dts
import {IGlobalSumanObj, ISumanOpts} from 'suman-types/dts/global';
import EventEmitter = NodeJS.EventEmitter;
import {ITestSuite} from 'suman-types/dts/test-suite';
import {ITestDataObj} from "suman-types/dts/it";
import {ISumanChildProcess} from "suman-types/dts/runner";
import {ITableData} from "suman-types/dts/table-data";
import {IRet, IRetContainer, IExpectedCounts} from 'suman-types/dts/reporters';

//polyfills
const process = require('suman-browser-polyfills/modules/process');
const global = require('suman-browser-polyfills/modules/global');

//core
import * as util from 'util';
import * as assert from 'assert';
import * as path from 'path';

//npm
import su = require("suman-utils");
import chalk from 'chalk';

//project
const _suman: IGlobalSumanObj = global.__suman = (global.__suman || {});
import {events} from 'suman-events';
import {getLogger, wrapReporter} from "../../lib/utils";
const reporterName = path.basename(__dirname);
const log = getLogger(reporterName);
const noColors = process.argv.indexOf('--no-color') > 0;
const noop = function () {};

interface IStringVarargs {
  (...args: string[]): void;
}

/////////////////////////////////////////////////////////////////////////////////////

let testCaseCount = 0;

/////////////////////////////////////////////////////////////////////////////////////

export const loadReporter = wrapReporter(reporterName,
  (retContainer: IRetContainer, s: EventEmitter, sumanOpts: ISumanOpts) => {

  const currentPaddingCount = _suman.currentPaddingCount = _suman.currentPaddingCount || {};

  let first = true;

  if (_suman.inceptionLevel > 0) {
    log.info(`suman inception level greater than 0.`);
    return;
  }

  let onAnyEvent: IStringVarargs = function () {
    const args = Array.from(arguments).map(function (data) {
      return typeof data === 'string' ? data : util.inspect(data);
    });

    // log.info(...args);
    console.log.apply(console, args);
  };

  let onTestCaseEvent: IStringVarargs = function () {

    if (first) {
      if (!('val' in currentPaddingCount) && sumanOpts.series) {
        log.warning(`'${reporterName}' reporter may be unable to properly indent output.\n`);
      }
      first = false;
    }

    const args = Array.from(arguments).map(function (data) {
      return chalk.bold(typeof data === 'string' ? data : util.inspect(data));
    });

    if (!_suman.isTestMostRecentLog) {
      console.log();  // log a new line
    }

    let amount = currentPaddingCount.val || 0;
    const padding = su.padWithXSpaces(amount);
    console.log.call(console, padding, ...args);
    _suman.isTestMostRecentLog = true;
  };

  let onVerboseEvent = function (data: any) {
    if (su.vgt(6)) {
      log.info(typeof data === 'string' ? data : util.inspect(data));
    }
  };

  s.on(String(events.SUMAN_CONTEXT_BLOCK), function (b: ITestSuite) {
    console.log('\n', su.padWithXSpaces(_suman.currentPaddingCount.val),
      chalk.underline.gray.bold.italic(`▶ ${b.desc} ▶▷ `));
  });

  //on error
  s.on(String(events.RUNNER_EXIT_CODE_GREATER_THAN_ZERO), noop);

  //on any event
  s.on(String(events.FILE_IS_NOT_DOT_JS), function (dir: string) {
    onAnyEvent('\n => Warning -> Suman will attempt to execute the following file:\n "' +
      chalk.cyan(dir) + '",\n (which is not a .js file).\n');
  });

  s.on(String(events.RUNNER_INITIAL_SET),
    function (forkedCPs: Array<ISumanChildProcess>, processes: string, suites: string) {
      onAnyEvent('\n\n\t', chalk.bgBlue.yellow(' => [Suman runner] =>  initial set => ' +
        forkedCPs.length + ' ' + processes + ' running ' + forkedCPs.length + ' ' + suites + ' '), '\n');
    });

  s.on(String(events.RUNNER_OVERALL_SET),
    function (totalCount: number, processes: string, suites: string, addendum: string) {
      onAnyEvent('\t ' + chalk.bgBlue.yellow(' => [Suman runner] =>  overall set => '
        + totalCount + ' ' + processes + ' will run ' + totalCount + ' ' + (suites + addendum) + ' ') + '\n\n\n');
    });

  s.on(String(events.RUNNER_ASCII_LOGO), function (logo: string) {
    onAnyEvent(logo, '\n')
  });

  s.on(String(events.FATAL_TEST_ERROR), onAnyEvent);

  s.on(String(events.TEST_CASE_END), function () {
    testCaseCount++;
  });

  s.on(String(events.TEST_CASE_FAIL), function (test: ITestDataObj) {

    console.log();

    if (_suman.processIsRunner) {
      onTestCaseEvent(chalk.bgYellow.black.bold(` [${testCaseCount}] \u2718  => test case fail `) + '  \'' +
        (test.desc || test.name) + '\'\n ' + chalk.bgWhite.black(' Originating entry test path => ')
        + chalk.bgWhite.black.bold(test.filePath + ' ') + '\n' + chalk.yellow.bold(String(test.errorDisplay || test.error || '')));
    }
    else {
      onTestCaseEvent(chalk.bgWhite.black.bold(` [${testCaseCount}]  \u2718  => test fail `) + '  "' +
        (test.desc) + '"\n' + chalk.yellow.bold(String(test.errorDisplay || test.error || '')));
    }

    console.log();
  });

  s.on(String(events.TEST_CASE_PASS), function (test: ITestDataObj) {
    let timeDiffStr = (test.dateComplete ? '(' + ((test.dateComplete - test.dateStarted) || '< 1') + 'ms)' : '');
    onTestCaseEvent(`${chalk.green(` [${testCaseCount}] ${chalk.bold('✔')}`)} '${test.desc}' ${timeDiffStr}`);
  });

  s.on(String(events.TEST_CASE_SKIPPED), function (test: ITestDataObj) {
    onTestCaseEvent(`${chalk.yellow(` [${testCaseCount}] \u21AA`)} '${test.desc}' ${chalk.italic.grey('(skipped)')}`);
  });

  s.on(String(events.TEST_CASE_STUBBED), function (test: ITestDataObj) {
    onTestCaseEvent(`${chalk.yellow(` [${testCaseCount}] \u2026`)} '${test.desc}' ${chalk.italic.grey('(stubbed)')}`);
  });

  s.on(String(events.RUNNER_EXIT_SIGNAL), function (signal: any) {
    onAnyEvent(['<::::::::::::::::::::: Runner Exit Signal => ' + signal + ' ::::::::::::::::::::::::>'].join('\n'));
  });

  s.on(String(events.RUNNER_EXIT_CODE), function (code: number) {
    onAnyEvent(['\n  ',
      ' <::::::::::::::::::::::::::::::::: Suman runner exiting with exit code: ' + code +
      ' :::::::::::::::::::::::::::::::::>', '\n'].join('\n'));
  });

  //on verbose
  s.on(String(events.ERRORS_ONLY_OPTION), function () {
    onVerboseEvent(chalk.white.green.bold(` => ${chalk.white.bold('"--errors-only"')}  option used, hopefully you don't see much output until the end :) `));
  });

  s.on(String(events.USING_SERVER_MARKED_BY_HOSTNAME), onVerboseEvent);
  s.on(String(events.USING_FALLBACK_SERVER), onVerboseEvent);
  s.on(String(events.USING_DEFAULT_SERVER), onVerboseEvent);

  s.on(String(events.FILENAME_DOES_NOT_MATCH_ANY), function (dir: string) {
    onVerboseEvent(` => You may have wanted to run file/folder with this name: '${chalk.bold(dir)}',\n\t` +
      `but it didnt match the regex(es) you passed in as input for "matchAny".`);
  });

  s.on(String(events.FILENAME_DOES_NOT_MATCH_NONE), function (dir: string) {
    onVerboseEvent(` => You may have wanted to run file/folder with this name: '${chalk.bold(dir)}',\n\t` +
      `but it didnt match the regex(es) you passed in as input for "matchNone".`);
  });

  s.on(String(events.FILENAME_DOES_NOT_MATCH_ALL), function (dir: string) {
    onVerboseEvent(` => You may have wanted to run file/folder with this name: '${chalk.bold(dir)}',\n\t` +
      `but it didnt match the regex(es) you passed in as input for "matchAll"`);
  });

  s.on(String(events.RUNNER_SAYS_FILE_HAS_JUST_STARTED_RUNNING), function(file: string){
    log.info(chalk.black('File has just started running =>'), chalk.grey.bold(`'${file}'`));
  });

  s.on(String(events.RUNNER_HIT_DIRECTORY_BUT_NOT_RECURSIVE), onVerboseEvent);

  //ignore these
  s.on(String(events.RUNNER_STARTED), noop);
  s.on(String(events.RUNNER_ENDED), noop);
  s.on(String(events.SUITE_SKIPPED), noop);
  s.on(String(events.SUITE_END), noop);
  s.on(String(events.TEST_END), noop);
  s.on(String(events.RUNNER_EXIT_CODE_IS_ZERO), noop);

  s.on(String(events.RUNNER_TEST_PATHS_CONFIRMATION), function (files: Array<string>) {
    if (sumanOpts.verbosity > 5) {
      onAnyEvent(['\n ' + chalk.bgBlack.white.bold(' Suman will attempt to execute test files with/within the following paths: '),
        '\n',
        files.map((p, i) => '\t ' + (i + 1) + ' => ' + chalk.bold('"' + p + '"')).join('\n') + '\n\n'].join(''))
    }
  });

  if (!sumanOpts.no_tables) {

    s.on(String(events.RUNNER_RESULTS_TABLE), function (allResultsTableString: string) {
      onAnyEvent('\n\n' + allResultsTableString.replace(/\n/g, '\n\t') + '\n\n')
    });

    s.on(String(events.RUNNER_RESULTS_TABLE_SORTED_BY_MILLIS), function (strSorted: string) {
      onAnyEvent('\n\n' + strSorted.replace(/\n/g, '\n\t') + '\n\n')
    });

    s.on(String(events.RUNNER_OVERALL_RESULTS_TABLE), function (overallResultsTableString: string) {
      onAnyEvent(overallResultsTableString.replace(/\n/g, '\n\t') + '\n\n')
    });

    s.on(String(events.STANDARD_TABLE), function (table: ITableData, code: number) {
      console.log('\n\n');
      let str = table.toString();
      code > 0 ? (str = chalk.yellow.bold(str)) : (str = chalk.gray(str));
      str = '\t' + str;
      console.log(str.replace(/\n/g, '\n\t'));
      console.log('\n');
    });

  }

  // we can add values to ret as needed later
  return retContainer.ret = {
    reporterName
  } as IRet;

});

export default loadReporter;
