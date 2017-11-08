'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var process = require('suman-browser-polyfills/modules/process');
var global = require('suman-browser-polyfills/modules/global');
var path = require("path");
var events = require('suman-events').events;
var _suman = global.__suman = (global.__suman || {});
var utils_1 = require("../../lib/utils");
var reporterName = path.basename(__dirname);
var log = utils_1.getLogger(reporterName);
exports.loadReporter = utils_1.wrapReporter(reporterName, function (retContainer, s, sumanOpts) {
    return retContainer.ret = {
        reporterName: reporterName
    };
});
exports.default = exports.loadReporter;
