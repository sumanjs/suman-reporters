'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var process = require('suman-browser-polyfills/modules/process');
var global = require('suman-browser-polyfills/modules/global');
var path = require("path");
var ProgressBar = require('progress');
var events = require('suman-events').events;
var utils_1 = require("../../lib/utils");
var reporterName = path.basename(__dirname);
var log = utils_1.getLogger(reporterName);
var onAnyEvent = function (data) {
    process.stdout.write(String(data));
};
exports.loadreporter = utils_1.wrapReporter(reporterName, function (retContainer, s, sumanOpts, expectations) {
    var progressBar;
    s.on(events.RUNNER_STARTED, function onRunnerStart(totalNumTests) {
        log.info('runner has started.');
        progressBar = new ProgressBar(' => progress [:bar] :percent :current :token1 :token2', {
            total: totalNumTests,
            width: 120
        });
    });
    s.on(String(events.TEST_FILE_CHILD_PROCESS_EXITED), function onTestEnd(d) {
        if (!progressBar) {
            log.error('progress bar was not yet initialized.');
            return;
        }
        progressBar.tick({
            'token1': "",
            'token2': ""
        });
    });
    s.on(String(events.RUNNER_EXIT_CODE), onAnyEvent);
    s.on(events.RUNNER_ENDED, function onRunnerEnd() {
        log.good('Runner has ended.');
    });
    return retContainer.ret = {
        reporterName: reporterName
    };
});
exports.default = exports.loadreporter;
