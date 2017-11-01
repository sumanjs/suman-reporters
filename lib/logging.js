'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = require("chalk");
exports.getLogger = function (reporterName) {
    reporterName = reporterName || 'browser-reporting';
    return {
        info: console.log.bind(console, chalk_1.default.gray.bold(" [suman @" + reporterName + "] ")),
        warning: console.error.bind(console, chalk_1.default.yellow(" [suman @" + reporterName + "] ")),
        error: console.error.bind(console, chalk_1.default.red(" [suman @" + reporterName + "] ")),
        good: console.error.bind(console, chalk_1.default.cyan(" [suman @" + reporterName + "] ")),
        veryGood: console.log.bind(console, chalk_1.default.green(" [suman @" + reporterName + "] "))
    };
};
