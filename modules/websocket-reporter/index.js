'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var process = require('suman-browser-polyfills/modules/process');
var global = require('suman-browser-polyfills/modules/global');
var path = require("path");
var events = require('suman-events').events;
var su = require("suman-utils");
var _suman = global.__suman = (global.__suman || {});
var utils_1 = require("../../lib/utils");
var reporterName = path.basename(__dirname);
var log = utils_1.getLogger(reporterName);
exports.loadreporter = utils_1.wrapReporter(reporterName, function (retContainer, results, s, opts, expectations, client) {
    var runAsync = function (fn) {
        retContainer.ret.count++;
        fn(function (err) {
            err && log.error(err.stack || err);
            retContainer.ret.count--;
            if (retContainer.ret.count < 1) {
                retContainer.ret.cb && retContainer.ret.cb();
            }
        });
    };
    s.on(events.RUNNER_STARTED, function () {
        log.info('Suman runner has started.\n');
    });
    s.on(events.RUNNER_ENDED, function () {
        console.log('# tests ' + (results.n));
        console.log('# pass ' + results.passes);
        console.log('# fail ' + results.failures);
        console.log('# stubbed ' + results.stubbed);
        console.log('# skipped ' + results.skipped);
    });
    s.on(events.TEST_CASE_END, function (test) {
        ++results.n;
    });
    s.on(events.TEST_CASE_FAIL, function (test) {
        results.failures++;
        runAsync(function (cb) {
            var str = su.customStringify({
                childId: process.env.SUMAN_CHILD_ID,
                test: test,
                type: 'LOG_RESULT',
            });
            client.emit('LOG_RESULT', JSON.parse(str), cb);
        });
    });
    s.on(events.TEST_CASE_PASS, function (test) {
        results.passes++;
        runAsync(function (cb) {
            var str = su.customStringify({
                childId: process.env.SUMAN_CHILD_ID,
                test: test,
                type: 'LOG_RESULT',
            });
            client.emit('LOG_RESULT', JSON.parse(str), cb);
        });
    });
    s.on(events.TEST_CASE_SKIPPED, function (test) {
        results.skipped++;
        runAsync(function (cb) {
            var str = su.customStringify({
                childId: process.env.SUMAN_CHILD_ID,
                test: test,
                type: 'LOG_RESULT',
            });
            client.emit('LOG_RESULT', JSON.parse(str), cb);
        });
    });
    s.on(events.TEST_CASE_STUBBED, function (test) {
        results.stubbed++;
        runAsync(function (cb) {
            var str = su.customStringify({
                childId: process.env.SUMAN_CHILD_ID,
                test: test,
                type: 'LOG_RESULT',
            });
            client.emit('LOG_RESULT', JSON.parse(str), cb);
        });
    });
    return retContainer.ret = {
        results: results,
        reporterName: reporterName,
        count: 0,
        cb: null
    };
});
exports.default = exports.loadreporter;
