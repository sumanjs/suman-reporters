'use strict';

//dts
import {IGlobalSumanObj, ISumanOpts} from 'suman-types/dts/global';
import EventEmitter = NodeJS.EventEmitter;
import {IRet} from 'suman-types/dts/reporters';

//polyfills
const process = require('suman-browser-polyfills/modules/process');
const global = require('suman-browser-polyfills/modules/global');

//core
import * as util from 'util';
import * as assert from 'assert';
import * as path from 'path';

//npm
const {events} = require('suman-events');

//project
const _suman: IGlobalSumanObj = global.__suman = (global.__suman || {});

function title(test) {
  return String(test.title || test.desc || test.description).replace(/#/g, '');
}

//////////////////////////////////////////////////////////

export default (s: EventEmitter, sumanOpts: ISumanOpts) => {

//TODO: allow printing of just one line of results, until a failure
//readline.clearLine(process.stdout, 0);
//process.stdout.write('\r' + chalk.green('Pass count: ' + successCount));

};

