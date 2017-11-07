'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var process = require('suman-browser-polyfills/modules/process');
var global = require('suman-browser-polyfills/modules/global');
var path = require("path");
var ProgressBar = require('progress');
var events = require('suman-events').events;
var su = require("suman-utils");
var utils_1 = require("../../lib/utils");
var reporterName = path.basename(__dirname);
var log = utils_1.getLogger(reporterName);
var onAnyEvent = function (data) {
    process.stdout.write(data);
};
var ret;
exports.default = function (s, sumanOpts) {
    if (ret) {
        log.warning("implementation warning => \"" + reporterName + "\" loaded more than once.");
        return ret;
    }
    if (su.vgt(5)) {
        log.info("loading " + reporterName + ".");
    }
    var progressBar;
    s.on(events.RUNNER_STARTED, function onRunnerStart(totalNumTests) {
        console.log('\n');
        progressBar = new ProgressBar(' => progress [:bar] :percent :current :token1 :token2', {
            total: totalNumTests,
            width: 120
        });
    });
    s.on(events.TEST_FILE_CHILD_PROCESS_EXITED, function onTestEnd(d) {
        progressBar.tick({
            'token1': "",
            'token2': ""
        });
    });
    s.on(events.RUNNER_EXIT_CODE, onAnyEvent);
    s.on(events.RUNNER_ENDED, function onRunnerEnd() {
        console.log('\n => Runner end event fired.');
    });
    s.on('suite-skipped', function onRunnerEnd() {
    });
    s.on('suite-end', function onRunnerEnd() {
    });
    return ret = {};
};
