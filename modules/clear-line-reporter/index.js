'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var events = require('suman-events').events;
var _suman = global.__suman = (global.__suman || {});
function title(test) {
    return String(test.title || test.desc || test.description).replace(/#/g, '');
}
exports.default = function (s, sumanOpts) {
};
