'use strict';

import chalk from 'chalk';
import su = require('suman-utils');
import {IRet} from "suman-types/dts/reporters";
import EventEmitter = NodeJS.EventEmitter;
import {ISumanOpts} from "suman-types/dts/global";
import {IExpectedCounts, IReporterLoadFn} from "suman-types/dts/reporters";


/////////////////////////////////////////////////////////////////////////////////////

const loggers = {} as any;
const calledReporters = {} as any;

export const getLogger = function (reporterName: string) {

  if(loggers[reporterName]){
    return loggers[reporterName];
  }

  reporterName = reporterName || 'browser-reporting';

  return loggers[reporterName] = {
    reporterName: reporterName,
    info: console.log.bind(console, chalk.gray.bold(` [suman @${reporterName}] `)),
    warning: console.error.bind(console, chalk.yellow(` [suman @${reporterName}] `)),
    error: console.error.bind(console, chalk.red(` [suman @${reporterName}] `)),
    good: console.error.bind(console, chalk.cyan(` [suman @${reporterName}] `)),
    veryGood: console.log.bind(console, chalk.green(` [suman @${reporterName}] `))
  }

};


export const wrapReporter = function (reporterName: string, fn: IReporterLoadFn) {

  if(calledReporters[reporterName]){
    throw new Error(`${wrapReporter.name}  called more than once for reporter with name ${reporterName}`);
  }

  calledReporters[reporterName] = true;
  const log = getLogger(reporterName);

  const retContainer = {
    ret: null as IRet
  };

  return function (s: EventEmitter, sumanOpts: ISumanOpts, expectations?: IExpectedCounts, client?: SocketIOClient.Socket) {

    if (retContainer.ret) {
      // defensive programming construct, yay
      log.warning(`implementation warning => "${reporterName}" loaded more than once.`);
      return retContainer.ret;
    }

    if (su.vgt(5)) {
      log.info(`loading ${reporterName}.`);
    }

    if (!sumanOpts) {
      sumanOpts = {} as Partial<ISumanOpts>;
      log.error('Suman implementation warning, no sumanOpts passed to reporter.');
    }


    return fn.apply(null, [retContainer, s, sumanOpts, expectations, client]);

  }

};
