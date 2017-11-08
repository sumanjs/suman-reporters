'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var process = require('suman-browser-polyfills/modules/process');
var global = require('suman-browser-polyfills/modules/global');
var assert = require("assert");
var path = require("path");
var _suman = global.__suman = (global.__suman || {});
var suman_events_1 = require("suman-events");
var isEqual = require("lodash.isequal");
var utils_1 = require("../../lib/utils");
var reporterName = path.basename(__dirname);
var log = utils_1.getLogger(reporterName);
var noColors = process.argv.indexOf('--no-color') > 0;
var results = {
    TEST_CASE_FAIL: 0,
    TEST_CASE_PASS: 0,
    TEST_CASE_SKIPPED: 0,
    TEST_CASE_STUBBED: 0
};
exports.loadreporter = utils_1.wrapReporter(reporterName, function (retContainer, s, sumanOpts, expectations) {
    s.on(String(suman_events_1.events.TEST_CASE_FAIL), function (test) {
        results.TEST_CASE_FAIL++;
    });
    s.on(String(suman_events_1.events.TEST_CASE_PASS), function (test) {
        results.TEST_CASE_PASS++;
    });
    s.on(String(suman_events_1.events.TEST_CASE_SKIPPED), function (test) {
        results.TEST_CASE_SKIPPED++;
    });
    s.on(String(suman_events_1.events.TEST_CASE_STUBBED), function (test) {
        results.TEST_CASE_STUBBED++;
    });
    s.on(String(suman_events_1.events.META_TEST_ENDED), function (test) {
        console.log('META_TEST_ENDED => ', test);
        try {
            assert(isEqual(results, expectations), 'expectations and results are not equal.');
        }
        catch (err) {
            console.error(err.stack || err);
            process.exit(1);
        }
    });
    return retContainer.ret = {};
});
exports.default = exports.loadreporter;
