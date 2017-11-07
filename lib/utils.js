'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = require("chalk");
var su = require("suman-utils");
var loggers = {};
var calledReporters = {};
exports.getLogger = function (reporterName) {
    if (loggers[reporterName]) {
        return loggers[reporterName];
    }
    reporterName = reporterName || 'browser-reporting';
    return loggers[reporterName] = {
        reporterName: reporterName,
        info: console.log.bind(console, chalk_1.default.gray.bold(" [suman @" + reporterName + "] ")),
        warning: console.error.bind(console, chalk_1.default.yellow(" [suman @" + reporterName + "] ")),
        error: console.error.bind(console, chalk_1.default.red(" [suman @" + reporterName + "] ")),
        good: console.error.bind(console, chalk_1.default.cyan(" [suman @" + reporterName + "] ")),
        veryGood: console.log.bind(console, chalk_1.default.green(" [suman @" + reporterName + "] "))
    };
};
exports.wrapReporter = function (reporterName, fn) {
    if (calledReporters[reporterName]) {
        throw new Error(exports.wrapReporter.name + "  called more than once for reporter with name " + reporterName);
    }
    calledReporters[reporterName] = true;
    var log = exports.getLogger(reporterName);
    var retContainer = {
        ret: null
    };
    return function (s, sumanOpts, expectations, client) {
        if (retContainer.ret) {
            log.warning("implementation warning => \"" + reporterName + "\" loaded more than once.");
            return retContainer.ret;
        }
        if (su.vgt(5)) {
            log.info("loading " + reporterName + ".");
        }
        if (!sumanOpts) {
            sumanOpts = {};
            log.error('Suman implementation warning, no sumanOpts passed to reporter.');
        }
        return fn.apply(null, [retContainer, s, sumanOpts, expectations, client]);
    };
};
