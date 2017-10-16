'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var process = require('suman-browser-polyfills/modules/process');
var global = require('suman-browser-polyfills/modules/global');
var path = require("path");
var sqlite3 = require('sqlite3').verbose();
var suman_events_1 = require("suman-events");
var logging_1 = require("../../lib/logging");
var reporterName = path.basename(__dirname);
var log = logging_1.getLogger(reporterName);
var p = path.resolve(process.env.HOME + '/.suman/global/node_modules/sqlite3');
var dbPth = path.resolve(process.env.HOME + '/.suman/db');
var db = new sqlite3.Database(dbPth, function (err) {
    if (err) {
        log.error(err);
    }
    else {
        log.veryGood(' => SQLite connected.');
    }
});
db.on('error', function (err) {
    log.error(' => sqlite error => ', err);
});
db.configure('busyTimeout', 4000);
var noop = function () {
};
var ret;
exports.default = function (s, sqlite3) {
    if (ret) {
        return ret;
    }
    var runAsync = function (fn) {
        ret.count++;
        fn(function (err) {
            err && console.error(err.stack || err);
            ret.count--;
            if (ret.count < 1) {
                ret.cb();
            }
        });
    };
    var runPromise = function (promise) {
        ret.count++;
        return promise
            .catch(function (err) { return err && console.error(err.stack || err); })
            .then(function () {
            ret.count--;
            ret.count < 1 && ret.cb();
        });
    };
    s.on(String(suman_events_1.events.FATAL_TEST_ERROR), function (val) {
        runAsync(function (cb) {
            db.serialize(function () {
                db.run('CREATE TABLE lorem (info TEXT)');
                var stmt = db.prepare('INSERT INTO lorem VALUES (?)');
                for (var i = 0; i < 10; i++) {
                    stmt.run('Ipsum ' + i);
                }
                stmt.finalize();
                db.all('SELECT rowid AS id, info FROM lorem', function (err, rows) {
                    log.info('rows count => ', rows.length);
                    cb();
                });
            });
        });
    });
    s.on(String(suman_events_1.events.TEST_CASE_END), function (val) {
        runAsync(function (cb) {
            db.serialize(function () {
                db.run('CREATE TABLE lorem (info TEXT)');
                var stmt = db.prepare('INSERT INTO lorem VALUES (?)');
                for (var i = 0; i < 1; i++) {
                    stmt.run('Ipsum ' + i);
                }
                stmt.finalize();
                db.all('SELECT rowid AS id, info FROM lorem', function (err, rows) {
                    log.info('rows count => ', rows.length);
                    cb();
                });
            });
        });
    });
    s.on(String(suman_events_1.events.TEST_CASE_PASS), function (val) {
        runAsync(function (cb) {
            db.serialize(function () {
                db.run('CREATE TABLE lorem (info TEXT)');
                var stmt = db.prepare('INSERT INTO lorem VALUES (?)');
                for (var i = 0; i < 1; i++) {
                    stmt.run('Ipsum ' + i);
                }
                stmt.finalize();
                db.all('SELECT rowid AS id, info FROM lorem', function (err, rows) {
                    log.info('rows count => ', rows.length);
                    cb();
                });
            });
        });
    });
    s.on(String(suman_events_1.events.TEST_CASE_SKIPPED), function (val) {
        runAsync(function (cb) {
            db.serialize(function () {
                db.run('CREATE TABLE lorem (info TEXT)');
                var stmt = db.prepare('INSERT INTO lorem VALUES (?)');
                for (var i = 0; i < 1; i++) {
                    stmt.run('Ipsum ' + i);
                }
                stmt.finalize();
                db.all('SELECT rowid AS id, info FROM lorem', function (err, rows) {
                    log.info('rows count => ', rows.length);
                    cb();
                });
            });
        });
    });
    s.on(String(suman_events_1.events.TEST_CASE_STUBBED), function (val) {
        runAsync(function (cb) {
            db.serialize(function () {
                db.run('CREATE TABLE lorem (info TEXT)');
                var stmt = db.prepare('INSERT INTO lorem VALUES (?)');
                for (var i = 0; i < 1; i++) {
                    stmt.run('Ipsum ' + i);
                }
                stmt.finalize();
                db.all('SELECT rowid AS id, info FROM lorem', function (err, rows) {
                    log.info('rows count => ', rows.length);
                    cb();
                });
            });
        });
    });
    return ret = {
        reporterName: reporterName,
        count: 0,
        cb: noop
    };
};
