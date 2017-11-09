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
    reporterName = reporterName || "browser-reporting";
    var stdReporterName = " [suman '" + reporterName + "'] ";
    return loggers[reporterName] = {
        info: console.log.bind(console, chalk_1.default.gray.bold(stdReporterName)),
        warning: console.error.bind(console, chalk_1.default.yellow(stdReporterName)),
        error: console.error.bind(console, chalk_1.default.red(stdReporterName)),
        good: console.error.bind(console, chalk_1.default.cyan(stdReporterName)),
        veryGood: console.log.bind(console, chalk_1.default.green(stdReporterName))
    };
};
exports.wrapReporter = function (reporterName, fn) {
    if (calledReporters[reporterName]) {
        throw new Error("\"" + exports.wrapReporter.name + "\" called more than once for reporter with name " + reporterName);
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
        var results = {
            n: 0,
            passes: 0,
            failures: 0,
            skipped: 0,
            stubbed: 0
        };
        if (su.vgt(5)) {
            log.info("loading " + reporterName + ".");
        }
        if (!sumanOpts) {
            sumanOpts = {};
            log.error('Suman implementation warning, no sumanOpts passed to reporter.');
        }
        return fn.apply(null, [retContainer, results, s, sumanOpts, expectations, client]);
    };
};
