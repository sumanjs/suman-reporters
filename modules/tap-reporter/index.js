'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var process = require('suman-browser-polyfills/modules/process');
var global = require('suman-browser-polyfills/modules/global');
var util = require("util");
var path = require("path");
var chalk_1 = require("chalk");
var suman_events_1 = require("suman-events");
var _suman = global.__suman = (global.__suman || {});
var utils_1 = require("../../lib/utils");
var reporterName = path.basename(__dirname);
var log = utils_1.getLogger(reporterName);
function getCleanTitle(test) {
    return String(test.title || test.desc || test.description || test.name).replace(/#/g, '').trim();
}
function logDebug() {
    var debug;
    if (debug = process.env.SUMAN_DEBUG) {
        var args = Array.from(arguments).filter(function (i) { return i; });
        args.forEach(function (a) {
            process.stderr.write('\n' + (typeof a === 'string' ? a : util.inspect(a)) + '\n');
        });
    }
    return debug;
}
var onAnyEvent = function () {
    if (!logDebug.apply(null, arguments)) {
        var args = Array.from(arguments).map(function (data) {
            return typeof data === 'string' ? data : util.inspect(data);
        });
        return console.log.apply(console, args);
    }
};
exports.loadreporter = utils_1.wrapReporter(reporterName, function (retContainer, results, s, sumanOpts) {
    if (global.__suman.inceptionLevel < 1) {
        log.warning("\"" + reporterName + "\" warning: suman inception level is 0, we may not need to load this reporter.");
    }
    var level = _suman.inceptionLevel;
    var isColorable = function () {
        return level < 1 && !sumanOpts.no_color;
    };
    s.on(String(suman_events_1.events.RUNNER_INITIAL_SET), function (forkedCPs, processes, suites) {
        onAnyEvent('\n\n\t ' + chalk_1.default.bgBlue.yellow(' => [Suman runner] =>  initial set => ' +
            forkedCPs.length + ' ' + processes + ' running ' + forkedCPs.length + ' ' + suites + ' ') + '\n');
    });
    s.on(String(suman_events_1.events.RUNNER_OVERALL_SET), function (totalCount, processes, suites, addendum) {
        onAnyEvent('\t ' + chalk_1.default.bgBlue.yellow(' => [Suman runner] =>  overall set => '
            + totalCount + ' ' + processes + ' will run ' + totalCount + ' ' + (suites + addendum) + ' ') + '\n\n\n');
    });
    s.on(String(suman_events_1.events.RUNNER_ASCII_LOGO), function (logo) {
        onAnyEvent('\n\n' + logo + '\n\n');
    });
    s.on(String(suman_events_1.events.RUNNER_STARTED), function () {
        _suman.log.info('Suman runner has started.');
    });
    s.on(String(suman_events_1.events.RUNNER_ENDED), function () {
        console.log('# tests ' + (results.passes + results.failures));
        console.log('# pass ' + results.passes);
        console.log('# fail ' + results.failures);
        console.log('# stubbed ' + results.failures);
        console.log('# skipped ' + results.failures);
    });
    s.on(String(suman_events_1.events.TAP_COMPLETE), function (data) {
        log.info('All TAP input received.');
    });
    s.on(String(suman_events_1.events.TEST_CASE_END), function (test) {
        results.n++;
    });
    s.on(String(suman_events_1.events.TEST_CASE_FAIL), function (test) {
        results.failures++;
        if (false && isColorable()) {
            console.log(chalk_1.default.red("not ok " + results.n + " " + getCleanTitle(test)));
        }
        else {
            console.log("not ok " + results.n + " " + getCleanTitle(test));
        }
    });
    s.on(String(suman_events_1.events.TEST_CASE_PASS), function (test) {
        results.passes++;
        if (false && isColorable()) {
            console.log(chalk_1.default.green("ok " + results.n + " " + getCleanTitle(test)));
        }
        else {
            console.log("ok " + results.n + " " + getCleanTitle(test));
        }
    });
    s.on(String(suman_events_1.events.TEST_CASE_SKIPPED), function (test) {
        results.skipped++;
        console.log('ok %d %s # SKIP -', results.n, getCleanTitle(test));
    });
    s.on(String(suman_events_1.events.TEST_CASE_STUBBED), function (test) {
        results.stubbed++;
        console.log('ok %d %s # STUBBED -', results.n, getCleanTitle(test));
    });
    s.on(String(suman_events_1.events.RUNNER_EXIT_CODE), function (code) {
        onAnyEvent(['\n  ',
            ' <::::::::::::::::::::::::::::::::: Suman runner exiting with exit code: ' + code +
                ' :::::::::::::::::::::::::::::::::>', '\n'].join('\n'));
    });
    if (!sumanOpts.no_tables) {
        s.on(String(suman_events_1.events.STANDARD_TABLE), function (table) {
            console.log('\n\n');
            var str = table.toString();
            str = '\t' + str;
            console.log(str.replace(/\n/g, '\n\t'));
            console.log('\n');
        });
        s.on(String(suman_events_1.events.RUNNER_RESULTS_TABLE), function (allResultsTableString) {
            onAnyEvent('\n\n' + allResultsTableString.replace(/\n/g, '\n\t') + '\n\n');
        });
        s.on(String(suman_events_1.events.RUNNER_RESULTS_TABLE_SORTED_BY_MILLIS), function (strSorted) {
            onAnyEvent('\n\n' + strSorted.replace(/\n/g, '\n\t') + '\n\n');
        });
        s.on(String(suman_events_1.events.RUNNER_OVERALL_RESULTS_TABLE), function (overallResultsTableString) {
            onAnyEvent(overallResultsTableString.replace(/\n/g, '\n\t') + '\n\n');
        });
    }
    return retContainer.ret = {
        reporterName: reporterName,
        results: results
    };
});
exports.default = exports.loadreporter;
