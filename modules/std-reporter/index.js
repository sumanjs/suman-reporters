'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var process = require('suman-browser-polyfills/modules/process');
var global = require('suman-browser-polyfills/modules/global');
var util = require("util");
var path = require("path");
var su = require("suman-utils");
var chalk_1 = require("chalk");
var _suman = global.__suman = (global.__suman || {});
var suman_events_1 = require("suman-events");
var utils_1 = require("../../lib/utils");
var reporterName = path.basename(__dirname);
var log = utils_1.getLogger(reporterName);
var noColors = process.argv.indexOf('--no-color') > 0;
var noop = function () {
};
exports.loadReporter = utils_1.wrapReporter(reporterName, function (retContainer, results, s, sumanOpts) {
    var currentPaddingCount = _suman.currentPaddingCount = _suman.currentPaddingCount || { val: 0 };
    var first = true;
    if (_suman.inceptionLevel > 0) {
        log.info("suman inception level greater than 0.");
        return;
    }
    var onAnyEvent = function () {
        var args = Array.from(arguments).map(function (data) {
            return typeof data === 'string' ? data : util.inspect(data);
        });
        console.log.apply(console, args);
    };
    var onTestCaseEvent = function () {
        if (first) {
            if (!('val' in currentPaddingCount) && sumanOpts.series) {
                log.warning("'" + reporterName + "' reporter may be unable to properly indent output.\n");
            }
            first = false;
        }
        var args = Array.from(arguments).map(function (data) {
            return chalk_1.default.bold(typeof data === 'string' ? data : util.inspect(data));
        });
        if (!_suman.isTestMostRecentLog) {
            console.log();
        }
        var amount = currentPaddingCount.val || 0;
        var padding = su.padWithXSpaces(amount);
        (_a = console.log).call.apply(_a, [console, padding].concat(args));
        _suman.isTestMostRecentLog = true;
        var _a;
    };
    var onVerboseEvent = function (data) {
        if (su.vgt(6)) {
            log.info(typeof data === 'string' ? data : util.inspect(data));
        }
    };
    s.on(String(suman_events_1.events.SUMAN_CONTEXT_BLOCK), function (b) {
        console.log('\n', su.padWithXSpaces(_suman.currentPaddingCount.val), chalk_1.default.underline.gray.bold.italic("\u25B6 " + b.desc + " \u25B6\u25B7 "));
    });
    s.on(String(suman_events_1.events.RUNNER_EXIT_CODE_GREATER_THAN_ZERO), noop);
    s.on(String(suman_events_1.events.FILE_IS_NOT_DOT_JS), function (dir) {
        onAnyEvent('\n => Warning -> Suman will attempt to execute the following file:\n "' +
            chalk_1.default.cyan(dir) + '",\n (which is not a .js file).\n');
    });
    s.on(String(suman_events_1.events.RUNNER_INITIAL_SET), function (forkedCPs, processes, suites) {
        onAnyEvent('\n\n\t', chalk_1.default.bgBlue.yellow(' => [Suman runner] =>  initial set => ' +
            forkedCPs.length + ' ' + processes + ' running ' + forkedCPs.length + ' ' + suites + ' '), '\n');
    });
    s.on(String(suman_events_1.events.RUNNER_OVERALL_SET), function (totalCount, processes, suites, addendum) {
        onAnyEvent('\t ' + chalk_1.default.bgBlue.yellow(' => [Suman runner] =>  overall set => '
            + totalCount + ' ' + processes + ' will run ' + totalCount + ' ' + (suites + addendum) + ' ') + '\n\n\n');
    });
    s.on(String(suman_events_1.events.RUNNER_ASCII_LOGO), function (logo) {
        onAnyEvent(logo, '\n');
    });
    s.on(String(suman_events_1.events.FATAL_TEST_ERROR), onAnyEvent);
    s.on(String(suman_events_1.events.TEST_CASE_END), function () {
        results.n++;
    });
    s.on(String(suman_events_1.events.TEST_CASE_FAIL), function (test) {
        results.failures++;
        console.log();
        if (_suman.processIsRunner) {
            onTestCaseEvent(chalk_1.default.bgYellow.black.bold(" [" + results.n + "] \u2718  => test case fail ") + '  \'' +
                (test.desc || test.name) + '\'\n ' + chalk_1.default.bgWhite.black(' Originating entry test path => ')
                + chalk_1.default.bgWhite.black.bold(test.filePath + ' ') + '\n' + chalk_1.default.yellow.bold(String(test.errorDisplay || test.error || '')));
        }
        else {
            onTestCaseEvent(chalk_1.default.bgWhite.black.bold(" [" + results.n + "]  \u2718  => test fail ") + '  "' +
                (test.desc) + '"\n' + chalk_1.default.yellow.bold(String(test.errorDisplay || test.error || '')));
        }
        console.log();
    });
    s.on(String(suman_events_1.events.TEST_CASE_PASS), function (test) {
        results.passes++;
        var timeDiffStr = (test.dateComplete ? '(' + ((test.dateComplete - test.dateStarted) || '< 1') + 'ms)' : '');
        onTestCaseEvent(chalk_1.default.green(" [" + results.n + "] " + chalk_1.default.bold('✔')) + " '" + test.desc + "' " + timeDiffStr);
    });
    s.on(String(suman_events_1.events.TEST_CASE_SKIPPED), function (test) {
        results.skipped++;
        onTestCaseEvent(chalk_1.default.yellow(" [" + results.n + "] \u21AA") + " '" + test.desc + "' " + chalk_1.default.italic.grey('(skipped)'));
    });
    s.on(String(suman_events_1.events.TEST_CASE_STUBBED), function (test) {
        results.stubbed++;
        onTestCaseEvent(chalk_1.default.yellow(" [" + results.n + "] \u2026") + " '" + test.desc + "' " + chalk_1.default.italic.grey('(stubbed)'));
    });
    s.on(String(suman_events_1.events.RUNNER_EXIT_SIGNAL), function (signal) {
        onAnyEvent(['<::::::::::::::::::::: Runner Exit Signal => ' + signal + ' ::::::::::::::::::::::::>'].join('\n'));
    });
    s.on(String(suman_events_1.events.RUNNER_EXIT_CODE), function (code) {
        onAnyEvent(['\n  ',
            ' <::::::::::::::::::::::::::::::::: Suman runner exiting with exit code: ' + code +
                ' :::::::::::::::::::::::::::::::::>', '\n'].join('\n'));
    });
    s.on(String(suman_events_1.events.ERRORS_ONLY_OPTION), function () {
        onVerboseEvent(chalk_1.default.white.green.bold(" => " + chalk_1.default.white.bold('"--errors-only"') + "  option used, hopefully you don't see much output until the end :) "));
    });
    s.on(String(suman_events_1.events.USING_SERVER_MARKED_BY_HOSTNAME), onVerboseEvent);
    s.on(String(suman_events_1.events.USING_FALLBACK_SERVER), onVerboseEvent);
    s.on(String(suman_events_1.events.USING_DEFAULT_SERVER), onVerboseEvent);
    s.on(String(suman_events_1.events.FILENAME_DOES_NOT_MATCH_ANY), function (dir) {
        onVerboseEvent(" => You may have wanted to run file/folder with this name: '" + chalk_1.default.bold(dir) + "',\n\t" +
            "but it didnt match the regex(es) you passed in as input for \"matchAny\".");
    });
    s.on(String(suman_events_1.events.FILENAME_DOES_NOT_MATCH_NONE), function (dir) {
        onVerboseEvent(" => You may have wanted to run file/folder with this name: '" + chalk_1.default.bold(dir) + "',\n\t" +
            "but it didnt match the regex(es) you passed in as input for \"matchNone\".");
    });
    s.on(String(suman_events_1.events.FILENAME_DOES_NOT_MATCH_ALL), function (dir) {
        onVerboseEvent(" => You may have wanted to run file/folder with this name: '" + chalk_1.default.bold(dir) + "',\n\t" +
            "but it didnt match the regex(es) you passed in as input for \"matchAll\"");
    });
    s.on(String(suman_events_1.events.RUNNER_SAYS_FILE_HAS_JUST_STARTED_RUNNING), function (file) {
        log.info(chalk_1.default.black('File has just started running =>'), chalk_1.default.grey.bold("'" + file + "'"));
    });
    s.on(String(suman_events_1.events.RUNNER_HIT_DIRECTORY_BUT_NOT_RECURSIVE), onVerboseEvent);
    s.on(String(suman_events_1.events.RUNNER_STARTED), noop);
    s.on(String(suman_events_1.events.RUNNER_ENDED), noop);
    s.on(String(suman_events_1.events.SUITE_SKIPPED), noop);
    s.on(String(suman_events_1.events.SUITE_END), noop);
    s.on(String(suman_events_1.events.TEST_END), noop);
    s.on(String(suman_events_1.events.RUNNER_EXIT_CODE_IS_ZERO), noop);
    s.on(String(suman_events_1.events.RUNNER_TEST_PATHS_CONFIRMATION), function (files) {
        if (sumanOpts.verbosity > 5) {
            onAnyEvent(['\n ' + chalk_1.default.bgBlack.white.bold(' Suman will attempt to execute test files with/within the following paths: '),
                '\n',
                files.map(function (p, i) { return '\t ' + (i + 1) + ' => ' + chalk_1.default.bold('"' + p + '"'); }).join('\n') + '\n\n'].join(''));
        }
    });
    if (!sumanOpts.no_tables) {
        s.on(String(suman_events_1.events.RUNNER_RESULTS_TABLE), function (allResultsTableString) {
            onAnyEvent('\n\n' + allResultsTableString.replace(/\n/g, '\n\t') + '\n\n');
        });
        s.on(String(suman_events_1.events.RUNNER_RESULTS_TABLE_SORTED_BY_MILLIS), function (strSorted) {
            onAnyEvent('\n\n' + strSorted.replace(/\n/g, '\n\t') + '\n\n');
        });
        s.on(String(suman_events_1.events.RUNNER_OVERALL_RESULTS_TABLE), function (overallResultsTableString) {
            onAnyEvent(overallResultsTableString.replace(/\n/g, '\n\t') + '\n\n');
        });
        s.on(String(suman_events_1.events.STANDARD_TABLE), function (table, code) {
            console.log('\n\n');
            var str = table.toString();
            code > 0 ? (str = chalk_1.default.yellow.bold(str)) : (str = chalk_1.default.gray(str));
            str = '\t' + str;
            console.log(str.replace(/\n/g, '\n\t'));
            console.log('\n');
        });
    }
    return retContainer.ret = {
        results: results,
        reporterName: reporterName
    };
});
exports.default = exports.loadReporter;
