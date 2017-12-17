'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var process = require('suman-browser-polyfills/modules/process');
var global = require('suman-browser-polyfills/modules/global');
var util = require("util");
var path = require("path");
var suman_events_1 = require("suman-events");
var su = require("suman-utils");
var JSONStdio = require("json-stdio");
var _suman = global.__suman = (global.__suman || {});
var utils_1 = require("../../lib/utils");
var reporterName = path.basename(__dirname);
var log = utils_1.getLogger(reporterName);
function title(test) {
    return String(test.title || test.desc || test.description || test.name).replace(/#/g, '').trim();
}
var logDebug = function () {
    var debug;
    if (debug = process.env.SUMAN_DEBUG) {
        var args = Array.from(arguments).filter(function (i) { return i; });
        args.forEach(function (a) {
            process.stderr.write('\n' + (typeof a === 'string' ? a : util.inspect(a)) + '\n');
        });
    }
    return debug;
};
var onAnyEvent = function () {
    if (!logDebug.apply(null, arguments)) {
        var args = Array.from(arguments).map(function (data) {
            return typeof data === 'string' ? data : util.inspect(data);
        });
        return console.log.apply(console, args);
    }
};
var getTestFilePath = function (test) {
    return String(test.testPath || test.filePath || test.filepath || test.testpath).trim();
};
var getTestDesc = function (test) {
    return String(test.desc || test.title || test.name).trim();
};
var isTTY = process.stdout.isTTY;
exports.loadreporter = utils_1.wrapReporter(reporterName, function (retContainer, results, s, sumanOpts) {
    if (_suman.inceptionLevel < 1 && !isTTY) {
        log.warning("\"" + reporterName + "\" warning: suman inception level is 0, we may not need to load this reporter.");
    }
    var isColorable = function () {
        return _suman.inceptionLevel < 1 && !sumanOpts.no_color;
    };
    var getPaddingCount = function () {
        return _suman.currentPaddingCount ? _suman.currentPaddingCount.val || 0 : 0;
    };
    var getTAPJSONType = function (eventName) {
        return String(eventName) + '_TAP_JSON';
    };
    s.on(String(suman_events_1.events.TEST_CASE_END_TAP_JSON), function (d) {
        results.n++;
        JSONStdio.logToStdout(d);
    });
    s.on(String(suman_events_1.events.TEST_CASE_FAIL_TAP_JSON), function (d) {
        results.failures++;
        JSONStdio.logToStdout(d);
    });
    s.on(String(suman_events_1.events.TEST_CASE_PASS_TAP_JSON), function (d) {
        results.passes++;
        JSONStdio.logToStdout(d);
    });
    s.on(String(suman_events_1.events.TEST_CASE_SKIPPED_TAP_JSON), function (d) {
        results.skipped++;
        JSONStdio.logToStdout(d);
    });
    s.on(String(suman_events_1.events.TEST_CASE_STUBBED_TAP_JSON), function (d) {
        results.stubbed++;
        JSONStdio.logToStdout(d);
    });
    {
        var evn_1 = String(suman_events_1.events.SUMAN_CONTEXT_BLOCK);
        s.on(evn_1, function (b) {
            JSONStdio.logToStdout({
                messageType: getTAPJSONType(evn_1),
                padding: getPaddingCount(),
                message: " \u25B6 group: '" + b.desc + "' \u25B6 "
            });
        });
    }
    {
        var evn_2 = String(suman_events_1.events.TEST_CASE_END);
        s.on(evn_2, function (b) {
            results.n++;
            JSONStdio.logToStdout({
                messageType: getTAPJSONType(evn_2),
            });
        });
    }
    {
        var evn_3 = String(suman_events_1.events.TEST_CASE_FAIL);
        s.on(evn_3, function (test) {
            results.failures++;
            console.log(su.customStringify({
                '@tap-json': true,
                '@json-stdio': true,
                messageType: getTAPJSONType(evn_3),
                padding: getPaddingCount(),
                testCase: {
                    ok: false,
                    desc: getTestDesc(test),
                    filePath: getTestFilePath(test),
                    error: test.errorDisplay || test.error,
                    id: results.n,
                    dateComplete: test.dateComplete,
                    dateStarted: test.dateStarted
                }
            }));
        });
    }
    {
        var evn_4 = String(suman_events_1.events.TEST_CASE_PASS);
        s.on(evn_4, function (test) {
            results.passes++;
            console.log(su.customStringify({
                '@tap-json': true,
                '@json-stdio': true,
                messageType: getTAPJSONType(evn_4),
                padding: getPaddingCount(),
                testCase: {
                    ok: true,
                    desc: getTestDesc(test),
                    filePath: getTestFilePath(test),
                    id: results.n,
                    dateComplete: test.dateComplete,
                    dateStarted: test.dateStarted
                }
            }));
        });
    }
    {
        var evn_5 = String(suman_events_1.events.TEST_CASE_SKIPPED);
        s.on(evn_5, function (test) {
            results.skipped++;
            console.log(su.customStringify({
                '@tap-json': true,
                '@json-stdio': true,
                messageType: getTAPJSONType(evn_5),
                padding: getPaddingCount(),
                testCase: {
                    ok: true,
                    desc: getTestDesc(test),
                    filePath: getTestFilePath(test),
                    id: results.n,
                    skipped: true,
                    skip: true,
                    dateComplete: test.dateComplete,
                    dateStarted: test.dateStarted
                }
            }));
        });
    }
    {
        var evn_6 = String(suman_events_1.events.TEST_CASE_STUBBED);
        s.on(evn_6, function (test) {
            results.stubbed++;
            console.log(su.customStringify({
                '@tap-json': true,
                '@json-stdio': true,
                padding: getPaddingCount(),
                messageType: getTAPJSONType(evn_6),
                testCase: {
                    ok: true,
                    desc: getTestDesc(test),
                    filePath: getTestFilePath(test),
                    id: results.n,
                    stubbed: true,
                    todo: true,
                    dateComplete: test.dateComplete,
                    dateStarted: test.dateStarted
                }
            }));
        });
    }
    return retContainer.ret = {
        reporterName: reporterName,
        results: results
    };
});
exports.default = exports.loadreporter;
