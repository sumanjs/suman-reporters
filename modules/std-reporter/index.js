'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var process = require('suman-browser-polyfills/modules/process');
var global = require('suman-browser-polyfills/modules/global');
var util = require("util");
var chalk = require("chalk");
var _suman = global.__suman = (global.__suman || {});
var suman_events_1 = require("suman-events");
var noColors = process.argv.indexOf('--no-color') > 0;
function noop() {
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
function onError(data) {
    if (!logDebug.apply(null, arguments)) {
        process.stderr.write(data);
    }
}
var testCaseCount = 0;
var loaded = false;
exports.default = function (s, sumanOpts, expectations, su) {
    if (loaded) {
        console.error('Suman implementation error => Suman standard reporter loaded more than once.');
        return;
    }
    if (global.__suman && global.__suman.inceptionLevel > 0) {
        console.log('suman std reporter says: suman inception level greater than 0.');
        return;
    }
    loaded = true;
    var onAnyEvent = function () {
        if (!logDebug.apply(null, arguments)) {
            var args = Array.from(arguments).map(function (data) {
                return typeof data === 'string' ? data : util.inspect(data);
            });
            console.log.apply(console, args);
        }
    };
    var onTestCaseEvent = function () {
        if (!logDebug.apply(null, arguments)) {
            var args = Array.from(arguments).map(function (data) {
                return typeof data === 'string' ? data : util.inspect(data);
            });
            var padding = su.padWithXSpaces(sumanOpts.currPadCount.val || 0);
            (_a = console.log).call.apply(_a, [console, padding].concat(args));
        }
        var _a;
    };
    var onVerboseEvent = function (data, value) {
        if (!logDebug.apply(null, arguments)) {
            if (sumanOpts && sumanOpts.verbosity > 6) {
                process.stdout.write(' => \n\t' + (typeof data === 'string' ? data : util.inspect(data)) + '\n\n');
                if (value) {
                    process.stdout.write(' => \n\t' + (typeof value === 'string' ? value : util.inspect(value)) + '\n\n');
                }
            }
        }
    };
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
        onAnyEvent('\n\n' + logo + '\n\n');
    });
    s.on(String(suman_events_1.events.FATAL_TEST_ERROR), onAnyEvent);
    s.on(String(suman_events_1.events.TEST_CASE_END), function () {
        testCaseCount++;
    });
    s.on(String(suman_events_1.events.TEST_CASE_FAIL), function (test) {
        console.log('\n');
        if (_suman.processIsRunner) {
            onTestCaseEvent(chalk.bgWhite.black.bold(" [" + testCaseCount + "] " + '\u2718' + '   => test fail ') + '  \'' +
                (test.desc || test.name) + '\'\n\t' + chalk.bgYellow.gray(' Originating entry test path => ')
                + chalk.bgYellow.black.bold(test.sumanModulePath + ' ') + '\n' + chalk.yellow(test.errorDisplay || ''));
        }
        else {
            onTestCaseEvent(chalk.bgWhite.black.bold(" [" + testCaseCount + "] " + '\u2718' + '  => test fail ') + '  "' +
                (test.desc || test.name) + '"\n' + chalk.yellow(test.errorDisplay || ''));
        }
        console.log('\n');
    });
    s.on(String(suman_events_1.events.TEST_CASE_PASS), function (test) {
        onTestCaseEvent(chalk.blue(" [" + testCaseCount + "] " + '\u2714 ') + ' \'' + (test.desc || test.name) + '\' ' +
            (test.dateComplete ? '(' + ((test.dateComplete - test.dateStarted) || '< 1') + 'ms)' : ''));
    });
    s.on(String(suman_events_1.events.TEST_CASE_SKIPPED), function (test) {
        onTestCaseEvent(chalk.yellow(" [" + testCaseCount + "] " + '\u21AA ') + ' (skipped) \'' +
            (test.desc || test.name));
    });
    s.on(String(suman_events_1.events.TEST_CASE_STUBBED), function (test) {
        onTestCaseEvent(chalk.yellow(" [" + testCaseCount + "] " + '\u2026 ') + ' (stubbed) \'' +
            (test.desc || test.name));
    });
    s.on(String(suman_events_1.events.STANDARD_TABLE), function (table) {
        if (!sumanOpts.no_tables) {
            console.log('\n\n');
            var str = table.toString();
            str = '\t' + str;
            console.log(str.replace(/\n/g, '\n\t'));
            console.log('\n');
        }
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
        onVerboseEvent('\n' + chalk.white.green.bold(' => ' + chalk.white.bold('"--errors-only"')
            + ' option used, hopefully you don\'t see much output until the end :) '), '\n');
    });
    s.on(String(suman_events_1.events.USING_SERVER_MARKED_BY_HOSTNAME), onVerboseEvent);
    s.on(String(suman_events_1.events.USING_FALLBACK_SERVER), onVerboseEvent);
    s.on(String(suman_events_1.events.USING_DEFAULT_SERVER), onVerboseEvent);
    s.on(String(suman_events_1.events.FILENAME_DOES_NOT_MATCH_ANY), function (dir) {
        onVerboseEvent('\n => You may have wanted to run file with this name:' + dir + ', ' +
            'but it didnt match the regex(es) you passed in as input for "matchAny".');
    });
    s.on(String(suman_events_1.events.FILENAME_DOES_NOT_MATCH_NONE), function (dir) {
        onVerboseEvent('\n => You may have wanted to run file with this name:' + dir + ', ' +
            'but it didnt match the regex(es) you passed in as input for "matchNone".');
    });
    s.on(String(suman_events_1.events.FILENAME_DOES_NOT_MATCH_ALL), function (dir) {
        onVerboseEvent('\n => You may have wanted to run file with this name:' + dir + ',' +
            ' but it didnt match the regex(es) you passed in as input for "matchAll"');
    });
    s.on(String(suman_events_1.events.RUNNER_HIT_DIRECTORY_BUT_NOT_RECURSIVE), onVerboseEvent);
    s.on(String(suman_events_1.events.RUNNER_STARTED), noop);
    s.on(String(suman_events_1.events.RUNNER_ENDED), noop);
    s.on(String(suman_events_1.events.SUITE_SKIPPED), noop);
    s.on(String(suman_events_1.events.SUITE_END), noop);
    s.on(String(suman_events_1.events.TEST_END), noop);
    s.on(String(suman_events_1.events.RUNNER_EXIT_CODE_IS_ZERO), noop);
    s.on(String(suman_events_1.events.RUNNER_TEST_PATHS_CONFIRMATION), function (files) {
        if (sumanOpts.verbosity > 2 || su.isSumanDebug()) {
            onAnyEvent(['\n ' + chalk.bgBlack.white.bold(' Suman will attempt to execute test files with/within the following paths: '),
                '\n\n',
                files.map(function (p, i) { return '\t ' + (i + 1) + ' => ' + chalk.cyan('"' + p + '"'); }).join('\n') + '\n\n\n'].join(''));
        }
    });
    s.on(String(suman_events_1.events.RUNNER_RESULTS_TABLE), function (allResultsTableString) {
        if (!sumanOpts.no_tables || su.isSumanDebug()) {
            onAnyEvent('\n\n' + allResultsTableString.replace(/\n/g, '\n\t') + '\n\n');
        }
    });
    s.on(String(suman_events_1.events.RUNNER_RESULTS_TABLE_SORTED_BY_MILLIS), function (strSorted) {
        if (!sumanOpts.no_tables || su.isSumanDebug()) {
            onAnyEvent('\n\n' + strSorted.replace(/\n/g, '\n\t') + '\n\n');
        }
    });
    s.on(String(suman_events_1.events.RUNNER_OVERALL_RESULTS_TABLE), function (overallResultsTableString) {
        if (!sumanOpts.no_tables || su.isSumanDebug()) {
            onAnyEvent(overallResultsTableString.replace(/\n/g, '\n\t') + '\n\n');
        }
    });
};
