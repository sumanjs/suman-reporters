'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var process = require('suman-browser-polyfills/modules/process');
var global = require('suman-browser-polyfills/modules/global');
var util = require("util");
var path = require("path");
var su = require("suman-utils");
var chalk = require("chalk");
var _suman = global.__suman = (global.__suman || {});
var suman_events_1 = require("suman-events");
var utils_1 = require("../../lib/utils");
var reporterName = path.basename(__dirname);
var log = utils_1.getLogger(reporterName);
var noColors = process.argv.indexOf('--no-color') > 0;
var noop = function () { };
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
            return chalk.bold(typeof data === 'string' ? data : util.inspect(data));
        })
            .join(' ');
        var amount = _suman.processIsRunner ? 0 : (currentPaddingCount.val || 0);
        printTestCaseEvent(args, amount);
    };
    var printTestCaseEvent = function (str, paddingCount) {
        if (!_suman.isTestMostRecentLog)
            console.log();
        paddingCount = paddingCount || 0;
        var padding = _suman.processIsRunner ? su.padWithXSpaces(0) : su.padWithXSpaces(paddingCount + 4);
        console.log.call(console, padding, str);
        _suman.isTestMostRecentLog = true;
    };
    var onVerboseEvent = function (data) {
        if (su.vgt(6)) {
            log.info(typeof data === 'string' ? data : util.inspect(data));
        }
    };
    s.on(String(suman_events_1.events.SUMAN_CONTEXT_BLOCK), function (b) {
        console.log('\n', su.padWithXSpaces(_suman.currentPaddingCount.val), chalk.gray.bold.italic(" \u25B6 group: '" + b.desc + "' \u25B6 "));
    });
    s.on(String(suman_events_1.events.SUMAN_CONTEXT_BLOCK_TAP_JSON), function (b) {
        console.log('\n', su.padWithXSpaces(b.padding), chalk.gray.bold.italic(b.message));
    });
    s.on(String(suman_events_1.events.RUNNER_EXIT_CODE_GREATER_THAN_ZERO), noop);
    s.on(String(suman_events_1.events.FILE_IS_NOT_DOT_JS), function (dir) {
        onAnyEvent('\n => Warning -> Suman will attempt to execute the following file:\n "' +
            chalk.cyan(dir) + '",\n (which is not a .js file).\n');
    });
    s.on(String(suman_events_1.events.RUNNER_INITIAL_SET), function (forkedCPs, processes, suites) {
        onAnyEvent('\n\n\t', chalk.bgBlue.yellow(' => [Suman runner] =>  initial set => ' +
            forkedCPs.length + ' ' + processes + ' running ' + forkedCPs.length + ' ' + suites + ' '), '\n');
    });
    s.on(String(suman_events_1.events.RUNNER_OVERALL_SET), function (totalCount, processes, suites, addendum) {
        onAnyEvent('\t ' + chalk.bgBlue.yellow(' => [Suman runner] =>  overall set => '
            + totalCount + ' ' + processes + ' will run ' + totalCount + ' ' + (suites + addendum) + ' ') + '\n\n\n');
    });
    s.on(String(suman_events_1.events.RUNNER_ASCII_LOGO), function (logo) {
        onAnyEvent(logo, '\n');
    });
    s.on(String(suman_events_1.events.FATAL_TEST_ERROR), onAnyEvent);
    var onTestCaseFailed = function (test) {
        results.failures++;
        var str;
        if (_suman.processIsRunner) {
            var testPath = " " + (test.filePath || test.filepath || '(uknown test path)') + " ";
            str = " " + chalk.bgYellow.black.bold(" [" + results.n + "] \u2718 test case fail => ") + chalk.bgBlack.white(" \"" + test.desc + "\" ") + " \n" +
                ("  " + chalk.gray.bold.underline(' Originating entry test path => ')) +
                (chalk.black.bold(testPath) + "\n") +
                ("" + chalk.yellow.bold(String(test.errorDisplay || test.error || '')));
        }
        else {
            str = " " + chalk.bgWhite.black.bold(" [" + results.n + "]  \u2718  => test fail ") +
                (" \"" + test.desc + "\"\n  " + chalk.yellow.bold(String(test.errorDisplay || test.error || '')));
        }
        return str;
    };
    var onTestCasePass = function (test) {
        results.passes++;
        var timeDiffStr = (test.dateComplete ? '(' + ((test.dateComplete - test.dateStarted) || '< 1') + 'ms)' : '');
        return chalk.green(" [" + results.n + "] " + chalk.bold('✔')) + " '" + test.desc + "' " + timeDiffStr;
    };
    var onTestCaseSkipped = function (test) {
        results.skipped++;
        return chalk.yellow(" [" + results.n + "] \u21AA") + " '" + test.desc + "' " + chalk.italic.grey('(skipped)');
    };
    var onTestCaseStubbed = function (test) {
        results.stubbed++;
        return chalk.yellow(" [" + results.n + "] \u2026") + " '" + test.desc + "' " + chalk.italic.grey('(stubbed)');
    };
    var onTestCaseEnd = function () {
        results.n++;
    };
    s.on(String(suman_events_1.events.TEST_CASE_END), function () {
        onTestCaseEnd();
    });
    s.on(String(suman_events_1.events.TEST_CASE_FAIL), function (test) {
        console.log();
        onTestCaseEvent(onTestCaseFailed(test));
        console.log();
    });
    s.on(String(suman_events_1.events.TEST_CASE_PASS), function (test) {
        onTestCaseEvent(onTestCasePass(test));
    });
    s.on(String(suman_events_1.events.TEST_CASE_SKIPPED), function (test) {
        onTestCaseEvent(onTestCaseSkipped(test));
    });
    s.on(String(suman_events_1.events.TEST_CASE_STUBBED), function (test) {
        onTestCaseEvent(onTestCaseStubbed(test));
    });
    s.on(String(suman_events_1.events.TEST_CASE_END_TAP_JSON), function () {
        onTestCaseEnd();
    });
    s.on(String(suman_events_1.events.TEST_CASE_FAIL_TAP_JSON), function (d) {
        var str = onTestCaseFailed(d.testCase);
        console.log();
        printTestCaseEvent(str, d.padding);
        console.log();
    });
    s.on(String(suman_events_1.events.TEST_CASE_PASS_TAP_JSON), function (d) {
        var str = onTestCasePass(d.testCase);
        printTestCaseEvent(str, d.padding);
    });
    s.on(String(suman_events_1.events.TEST_CASE_SKIPPED_TAP_JSON), function (d) {
        var str = onTestCaseSkipped(d.testCase);
        printTestCaseEvent(str, d.padding);
    });
    s.on(String(suman_events_1.events.TEST_CASE_STUBBED_TAP_JSON), function (d) {
        var str = onTestCaseStubbed(d.testCase);
        printTestCaseEvent(str, d.padding);
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
        onVerboseEvent(chalk.white.green.bold(" => " + chalk.white.bold('"--errors-only"') + "  option used, hopefully you don't see much output until the end :) "));
    });
    s.on(String(suman_events_1.events.USING_SERVER_MARKED_BY_HOSTNAME), onVerboseEvent);
    s.on(String(suman_events_1.events.USING_FALLBACK_SERVER), onVerboseEvent);
    s.on(String(suman_events_1.events.USING_DEFAULT_SERVER), onVerboseEvent);
    s.on(String(suman_events_1.events.FILENAME_DOES_NOT_MATCH_ANY), function (dir) {
        onVerboseEvent(" => You may have wanted to run file/folder with this name: '" + chalk.bold(dir) + "',\n\t" +
            "but it didnt match the regex(es) you passed in as input for \"matchAny\".");
    });
    s.on(String(suman_events_1.events.FILENAME_DOES_NOT_MATCH_NONE), function (dir) {
        onVerboseEvent(" => You may have wanted to run file/folder with this name: '" + chalk.bold(dir) + "',\n\t" +
            "but it didnt match the regex(es) you passed in as input for \"matchNone\".");
    });
    s.on(String(suman_events_1.events.FILENAME_DOES_NOT_MATCH_ALL), function (dir) {
        onVerboseEvent(" => You may have wanted to run file/folder with this name: '" + chalk.bold(dir) + "',\n\t" +
            "but it didnt match the regex(es) you passed in as input for \"matchAll\"");
    });
    s.on(String(suman_events_1.events.RUNNER_SAYS_FILE_HAS_JUST_STARTED_RUNNING), function (file) {
        log.info(chalk.black('File has just started running =>'), chalk.grey.bold("'" + file + "'"));
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
            onAnyEvent(['\n ' + chalk.bgBlack.white.bold(' Suman will attempt to execute test files with/within the following paths: '),
                '\n',
                files.map(function (p, i) { return '\t ' + (i + 1) + ' => ' + chalk.bold('"' + p + '"'); }).join('\n') + '\n\n'].join(''));
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
            code > 0 ? (str = chalk.yellow.bold(str)) : (str = chalk.gray(str));
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
