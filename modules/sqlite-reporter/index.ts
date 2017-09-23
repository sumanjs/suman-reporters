'use strict';
import EventEmitter = NodeJS.EventEmitter;

//polyfills
const process = require('suman-browser-polyfills/modules/process');
const global = require('suman-browser-polyfills/modules/global');

//core
import util = require('util');
import path = require('path');

//npm
const sqlite3 = require('sqlite3').verbose();
import su = require('suman-utils');

//project
import {events} from 'suman-events';

////////////////////////////////////////////////

const p = path.resolve(process.env.HOME + '/.suman/global/node_modules/sqlite3');
const dbPth = path.resolve(process.env.HOME + '/.suman/db');
// let sqlite3 = require(p).verbose();

let db = new sqlite3.Database(dbPth, function (err: Error) {
  if (err) {
    console.error(err);
  }
  else {
    console.log(' => SQLite connected.');
  }
});

db.on('error', function (err: Error) {
  console.error(' => sqlite error => ', err);
});

db.configure('busyTimeout', 4000);

/////////////////////////////////////////////////////////////

function noop() {
  // we use this noop fn in several places
}

let ret: IRet;

/////////////////////////////////////////////////////////////

export default (s: EventEmitter, sqlite3: Object) => {

  if (ret) {
    // defensive programming construct, yay
    return ret;
  }

  const runAsync = function (fn: Function) {
    ret.count++;
    console.log(' => Suman sqlite reporter count pre => ', ret.count);
    fn(function (err: Error) {
      err && console.error(err.stack || err);
      ret.count--;
      console.log(' => Suman sqlite reporter count post => ', ret.count);
      if (ret.count < 1) {
        // ret.cb starts off as a noop, but the suman framework
        // will reassign the value in the future and it will signal that we are done
        ret.cb();
      }
    });
  };

  function runPromise(promise: Promise<any>) {
    ret.count++;
    console.log(' => Suman sqlite reporter count pre => ', ret.count);
    return promise
    .catch(err => err && console.error(err.stack || err))
    .then(function () {
      ret.count--;
      ret.count < 1 && ret.cb();
    });
  }

  s.on(String(events.FATAL_TEST_ERROR), function (val: any) {
    console.log('value => ', val);
    runAsync(function (cb: Function) {

      db.serialize(function () {
        db.run('CREATE TABLE lorem (info TEXT)');

        let stmt = db.prepare('INSERT INTO lorem VALUES (?)');
        for (let i = 0; i < 10; i++) {
          stmt.run('Ipsum ' + i);
        }
        stmt.finalize();

        db.all('SELECT rowid AS id, info FROM lorem', function (err: Error, rows: Array<any>) {
          console.log('rows count => ', rows.length);
          cb()
        });
      });

    });
  });

  s.on(String(events.TEST_CASE_END), function (val: any) {
    console.log('value => ', val);
    runAsync(function (cb: Function) {
      db.serialize(function () {
        db.run('CREATE TABLE lorem (info TEXT)');

        let stmt = db.prepare('INSERT INTO lorem VALUES (?)');
        for (let i = 0; i < 1; i++) {
          stmt.run('Ipsum ' + i);
        }
        stmt.finalize();

        db.all('SELECT rowid AS id, info FROM lorem', function (err: Error, rows: Array<any>) {
          console.log('rows count => ', rows.length);
          cb()
        });
      });
    });
  });

  s.on(String(events.TEST_CASE_PASS), function (val: any) {
    console.log('value => ', val);
    runAsync(function (cb: Function) {

      db.serialize(function () {
        db.run('CREATE TABLE lorem (info TEXT)');

        let stmt = db.prepare('INSERT INTO lorem VALUES (?)');
        for (let i = 0; i < 1; i++) {
          stmt.run('Ipsum ' + i);
        }
        stmt.finalize();

        db.all('SELECT rowid AS id, info FROM lorem', function (err: Error, rows: Array<any>) {
          console.log('rows count => ', rows.length);
          cb()
        });
      });

    });
  });

  s.on(String(events.TEST_CASE_SKIPPED), function (val: any) {
    console.log('value => ', val);
    runAsync(function (cb: Function) {
      db.serialize(function () {
        db.run('CREATE TABLE lorem (info TEXT)');

        let stmt = db.prepare('INSERT INTO lorem VALUES (?)');
        for (let i = 0; i < 1; i++) {
          stmt.run('Ipsum ' + i);
        }
        stmt.finalize();

        db.all('SELECT rowid AS id, info FROM lorem', function (err: Error, rows: Array<any>) {
          console.log('rows count => ', rows.length);
          cb()
        });
      });
    });
  });

  s.on(String(events.TEST_CASE_STUBBED), function (val: any) {
    console.log('value => ', val);
    runAsync(function (cb: Function) {
      db.serialize(function () {
        db.run('CREATE TABLE lorem (info TEXT)');

        let stmt = db.prepare('INSERT INTO lorem VALUES (?)');
        for (let i = 0; i < 1; i++) {
          stmt.run('Ipsum ' + i);
        }
        stmt.finalize();

        db.all('SELECT rowid AS id, info FROM lorem', function (err: Error, rows: Array<any>) {
          console.log('rows count => ', rows.length);
          cb()
        });
      });
    });
  });

  return ret = {
    count: 0,
    cb: noop
  };

};