'use strict';
var process = require('suman-browser-polyfills/modules/process');
var global = require('suman-browser-polyfills/modules/global');
var ProgressBar = require('progress');
var events = require('suman-events').events;
function onAnyEvent(data) {
    process.stdout.write(data);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = function (s, sumanOpts) {
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
};
