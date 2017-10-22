'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var process = require('suman-browser-polyfills/modules/process');
var global = require('suman-browser-polyfills/modules/global');
var util = require("util");
var assert = require("assert");
var path = require("path");
var _suman = global.__suman = (global.__suman || {});
var suman_events_1 = require("suman-events");
var logging_1 = require("../../lib/logging");
var reporterName = path.basename(__dirname);
var log = logging_1.getLogger(reporterName);
var noColors = process.argv.indexOf('--no-color') > 0;
var noop = function () {
};
var testCaseCount = 0;
var loaded = false;
var ret;
exports.default = function (s, sumanOpts, expectations) {
    if (loaded) {
        log.error('Suman implementation error => reporter loaded more than once.');
        return;
    }
    loaded = true;
    if (!sumanOpts) {
        sumanOpts = {};
        log.error('Suman implementation warning, no sumanOpts passed to reporter.');
    }
    if (_suman.inceptionLevel > 0) {
        log.info("suman inception level greater than 0.");
        return;
    }
    var karma = global.__karma__;
    assert(karma, 'karma object not exposed at global.__karma___ or window.__karma__');
    s.on(String(suman_events_1.events.RUNNER_EXIT_CODE_GREATER_THAN_ZERO), noop);
    s.on(String(suman_events_1.events.FATAL_TEST_ERROR), function (err) {
        log.error('fatal runtime error, suman tests cannot continue:\n', err && (err.stack || util.inspect(err)));
    });
    s.on(String(suman_events_1.events.TEST_CASE_END), function () {
        testCaseCount++;
    });
    s.on(String(suman_events_1.events.TEST_CASE_FAIL), function (test) {
        karma.result({ pass: false, fail: true, name: test.desc });
    });
    s.on(String(suman_events_1.events.TEST_CASE_PASS), function (test) {
        var timeDiffStr = (test.dateComplete ? '(' + ((test.dateComplete - test.dateStarted) || '< 1') + 'ms)' : '');
        karma.result({ pass: true, name: test.desc });
    });
    s.on(String(suman_events_1.events.TEST_CASE_SKIPPED), function (test) {
        karma.result({ pass: false, skipped: true, skip: true, name: test.desc });
    });
    s.on(String(suman_events_1.events.TEST_CASE_STUBBED), function (test) {
        karma.result({ pass: false, stubbed: true, stub: true, name: test.desc });
    });
    return ret = {
        reporterName: reporterName,
        count: 0,
        cb: noop,
        completionHook: function () {
            karma.complete();
        }
    };
};
