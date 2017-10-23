'use strict';

import chalk = require('chalk');

/////////////////////////////////////////////////////////////////////////////////////

export const getLogger = function (reporterName: string) {

  reporterName = reporterName || 'browser-reporting';

  return {
    info: console.log.bind(console, ` [suman-${reporterName}] `),
    warning: console.error.bind(console, chalk.yellow(` [suman-${reporterName}] `)),
    error: console.error.bind(console, chalk.red(` [suman-${reporterName}] `)),
    good: console.error.bind(console, chalk.cyan(` [suman-${reporterName}] `)),
    veryGood: console.error.bind(console, chalk.green(` [suman-${reporterName}] `))
  }

};
