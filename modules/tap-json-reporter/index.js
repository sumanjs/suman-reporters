'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var process = require('suman-browser-polyfills/modules/process');
var global = require('suman-browser-polyfills/modules/global');
var util = require("util");
var path = require("path");
var suman_events_1 = require("suman-events");
var su = require("suman-utils");
var _suman = global.__suman = (global.__suman || {});
var logging_1 = require("../../lib/logging");
function title(test) {
    return String(test.title || test.desc || test.description || test.name).replace(/#/g, '');
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
var loaded = false;
var reporterName = path.basename(__dirname);
var log = logging_1.getLogger(reporterName);
exports.default = function (s, opts) {
    if (loaded) {
        log.warning("implementation warning => \"" + reporterName + "\" loaded more than once.");
        return;
    }
    if (_suman.inceptionLevel < 1) {
        log.warning("\"" + reporterName + "\" warning: suman inception level is 0, we may not need to load this reporter.");
    }
    log.info("loading " + reporterName + ".");
    loaded = true;
    var sumanOpts = _suman.sumanOpts;
    var level = _suman.inceptionLevel;
    var isColorable = function () {
        return level < 1 && !sumanOpts.no_color;
    };
    var n = 0;
    var passes = 0;
    var failures = 0;
    var skipped = 0;
    var stubbed = 0;
    s.on(String(suman_events_1.events.TEST_CASE_END), function (test) {
        ++n;
    });
    s.on(String(suman_events_1.events.TEST_CASE_FAIL), function (test) {
        failures++;
        console.log(su.customStringify({
            '@tap-json': true,
            ok: false,
            desc: test.desc || test.title || test.name,
            filePath: test.testPath || test.filePath,
            error: test.errorDisplay || test.error,
            id: n,
            dateComplete: test.dateComplete,
            dateStarted: test.dateStarted
        }));
    });
    s.on(String(suman_events_1.events.TEST_CASE_PASS), function (test) {
        passes++;
        console.log(su.customStringify({
            '@tap-json': true,
            ok: true,
            filePath: test.testPath || test.filePath,
            desc: test.desc || test.title || test.name,
            id: n,
            dateComplete: test.dateComplete,
            dateStarted: test.dateStarted
        }));
    });
    s.on(String(suman_events_1.events.TEST_CASE_SKIPPED), function (test) {
        skipped++;
        console.log(su.customStringify({
            '@tap-json': true,
            ok: true,
            desc: test.desc || test.title || test.name,
            filePath: test.testPath || test.filePath,
            id: n,
            skipped: true,
            skip: true,
            dateComplete: test.dateComplete,
            dateStarted: test.dateStarted
        }));
    });
    s.on(String(suman_events_1.events.TEST_CASE_STUBBED), function (test) {
        stubbed++;
        console.log(su.customStringify({
            '@tap-json': true,
            ok: true,
            desc: test.desc || test.title || test.name,
            filePath: test.testPath || test.filePath,
            id: n,
            stubbed: true,
            todo: true,
            dateComplete: test.dateComplete,
            dateStarted: test.dateStarted
        }));
    });
};
