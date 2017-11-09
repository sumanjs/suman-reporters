'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var process = require('suman-browser-polyfills/modules/process');
var global = require('suman-browser-polyfills/modules/global');
var util = require("util");
var path = require("path");
var suman_events_1 = require("suman-events");
var su = require("suman-utils");
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
exports.loadreporter = utils_1.wrapReporter(reporterName, function (retContainer, results, s, sumanOpts) {
    if (_suman.inceptionLevel < 1) {
        log.warning("\"" + reporterName + "\" warning: suman inception level is 0, we may not need to load this reporter.");
    }
    var level = _suman.inceptionLevel;
    var isColorable = function () {
        return level < 1 && !sumanOpts.no_color;
    };
    s.on(String(suman_events_1.events.TEST_CASE_END), function (test) {
        ++results.n;
    });
    s.on(String(suman_events_1.events.TEST_CASE_FAIL), function (test) {
        results.failures++;
        console.log(su.customStringify({
            '@tap-json': true,
            ok: false,
            desc: getTestDesc(test),
            filePath: getTestFilePath(test),
            error: test.errorDisplay || test.error,
            id: results.n,
            dateComplete: test.dateComplete,
            dateStarted: test.dateStarted
        }));
    });
    s.on(String(suman_events_1.events.TEST_CASE_PASS), function (test) {
        results.passes++;
        console.log(su.customStringify({
            '@tap-json': true,
            ok: true,
            desc: getTestDesc(test),
            filePath: getTestFilePath(test),
            id: results.n,
            dateComplete: test.dateComplete,
            dateStarted: test.dateStarted
        }));
    });
    s.on(String(suman_events_1.events.TEST_CASE_SKIPPED), function (test) {
        results.skipped++;
        console.log(su.customStringify({
            '@tap-json': true,
            ok: true,
            desc: getTestDesc(test),
            filePath: getTestFilePath(test),
            id: results.n,
            skipped: true,
            skip: true,
            dateComplete: test.dateComplete,
            dateStarted: test.dateStarted
        }));
    });
    s.on(String(suman_events_1.events.TEST_CASE_STUBBED), function (test) {
        results.stubbed++;
        console.log(su.customStringify({
            '@tap-json': true,
            ok: true,
            desc: getTestDesc(test),
            filePath: getTestFilePath(test),
            id: results.n,
            stubbed: true,
            todo: true,
            dateComplete: test.dateComplete,
            dateStarted: test.dateStarted
        }));
    });
    return retContainer.ret = {
        reporterName: reporterName,
        results: results
    };
});
exports.default = exports.loadreporter;
