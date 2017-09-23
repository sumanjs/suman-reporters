'use strict';
var events = require('suman-events').events;
var _suman = global.__suman = (global.__suman || {});
function title(test) {
    return String(test.title || test.desc || test.description).replace(/#/g, '');
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = function (s, sumanOpts) {
};
