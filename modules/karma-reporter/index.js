'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var process = require('suman-browser-polyfills/modules/process');
var global = require('suman-browser-polyfills/modules/global');
var util = require("util");
var assert = require("assert");
var path = require("path");
var _suman = global.__suman = (global.__suman || {});
var suman_events_1 = require("suman-events");
var utils_1 = require("../../lib/utils");
var reporterName = path.basename(__dirname);
var log = utils_1.getLogger(reporterName);
var noColors = process.argv.indexOf('--no-color') > 0;
var noop = function () { };
exports.loadReporter = utils_1.wrapReporter(reporterName, function (retContainer, results, s, sumanOpts) {
    var karma = global.__karma__;
    assert(karma, 'karma object not exposed at global.__karma___ or window.__karma__');
    s.on(String(suman_events_1.events.RUNNER_EXIT_CODE_GREATER_THAN_ZERO), noop);
    s.on(String(suman_events_1.events.FATAL_TEST_ERROR), function (err) {
        log.error('fatal runtime error, suman tests cannot continue:\n', err && (err.stack || util.inspect(err)));
    });
    s.on(String(suman_events_1.events.TEST_CASE_END), function () {
        ++results.n;
    });
    s.on(String(suman_events_1.events.TEST_CASE_FAIL), function (test) {
        ++results.failures;
        karma.result({
            id: String(test.testId),
            skipped: false,
            success: false,
            description: test.desc,
            log: [],
            suite: []
        });
    });
    s.on(String(suman_events_1.events.TEST_CASE_PASS), function (test) {
        ++results.passes;
        var timeDiffStr = (test.dateComplete ? '(' + ((test.dateComplete - test.dateStarted) || '< 1') + 'ms)' : '');
        karma.result({
            id: String(test.testId),
            skipped: false,
            success: true,
            description: test.desc,
            log: [],
            suite: []
        });
    });
    s.on(String(suman_events_1.events.TEST_CASE_SKIPPED), function (test) {
        ++results.skipped;
        karma.result({
            id: String(test.testId),
            skipped: true,
            success: false,
            description: test.desc,
            log: [],
            suite: []
        });
    });
    s.on(String(suman_events_1.events.TEST_CASE_STUBBED), function (test) {
        ++results.stubbed;
        karma.result({
            id: String(test.testId),
            skipped: true,
            success: false,
            description: test.desc,
            log: [],
            suite: []
        });
    });
    return retContainer.ret = {
        results: results,
        reporterName: reporterName,
        count: 0,
        cb: noop,
        completionHook: function () {
            log.veryGood('calling karma.complete()...');
            karma.info({ total: results.n });
            karma.complete({ total: results.n });
        }
    };
});
exports.default = exports.loadReporter;
