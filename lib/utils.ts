'use strict';

import chalk from 'chalk';
import su = require('suman-utils');
import {IRet} from "suman-types/dts/reporters";
import EventEmitter = NodeJS.EventEmitter;
import {ISumanOpts} from "suman-types/dts/global";
import {IExpectedCounts, IReporterLoadFn, IReporterLoadFnPre} from "suman-types/dts/reporters";

/////////////////////////////////////////////////////////////////////////////////////

const loggers = {} as any;
const calledReporters = {} as any;

export const getLogger = function (reporterName: string) {

  if (loggers[reporterName]) {
    return loggers[reporterName];
  }

  reporterName = reporterName || `browser-reporting`;
  let stdReporterName = ` [suman '${reporterName}'] `;

  return loggers[reporterName] = {
    info: console.log.bind(console, chalk.gray.bold(stdReporterName)),
    warning: console.error.bind(console, chalk.yellow(stdReporterName)),
    error: console.error.bind(console, chalk.red(stdReporterName)),
    good: console.error.bind(console, chalk.cyan(stdReporterName)),
    veryGood: console.log.bind(console, chalk.green(stdReporterName))
  }

};

export const wrapReporter = function (reporterName: string, fn: IReporterLoadFn): IReporterLoadFnPre {

  if (calledReporters[reporterName]) {
    throw new Error(`"${wrapReporter.name}" called more than once for reporter with name ${reporterName}`);
  }

  calledReporters[reporterName] = true;
  const log = getLogger(reporterName);

  const retContainer = {
    ret: null as IRet
  };

  return function (s, sumanOpts, expectations, client) {

    if (retContainer.ret) {
      // defensive programming construct, yay
      log.warning(`implementation warning => "${reporterName}" loaded more than once.`);
      return retContainer.ret;
    }

    if (su.vgt(5)) {
      log.info(`loading ${reporterName}.`);
    }

    if (!sumanOpts) {
      sumanOpts = {} as ISumanOpts;
      log.error('Suman implementation warning, no sumanOpts passed to reporter.');
    }

    return fn.apply(null, [retContainer, s, sumanOpts, expectations, client]);
  }

};
