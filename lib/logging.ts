'use strict';

import chalk from 'chalk';

/////////////////////////////////////////////////////////////////////////////////////

export const getLogger = function (reporterName: string) {

  reporterName = reporterName || 'browser-reporting';

  return {
    info: console.log.bind(console, chalk.gray.bold(` [suman @${reporterName}] `)),
    warning: console.error.bind(console, chalk.yellow(` [suman @${reporterName}] `)),
    error: console.error.bind(console, chalk.red(` [suman @${reporterName}] `)),
    good: console.error.bind(console, chalk.cyan(` [suman @${reporterName}] `)),
    veryGood: console.log.bind(console, chalk.green(` [suman @${reporterName}] `))
  }

};
