'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var chalk = require("chalk");
exports.getLogger = function (reporterName) {
    reporterName = reporterName || 'browser-reporting';
    return {
        info: console.log.bind(console, " [suman-" + reporterName + "] "),
        warning: console.error.bind(console, chalk.yellow(" [suman-" + reporterName + "] ")),
        error: console.error.bind(console, chalk.red(" [suman-" + reporterName + "] ")),
        good: console.error.bind(console, chalk.cyan(" [suman-" + reporterName + "] ")),
        veryGood: console.error.bind(console, chalk.green(" [suman-" + reporterName + "] "))
    };
};
