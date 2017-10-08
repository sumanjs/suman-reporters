'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var process = require('suman-browser-polyfills/modules/process');
var global = require('suman-browser-polyfills/modules/global');
var path = require("path");
var sqlite3 = require('sqlite3').verbose();
var suman_events_1 = require("suman-events");
var p = path.resolve(process.env.HOME + '/.suman/global/node_modules/sqlite3');
var dbPth = path.resolve(process.env.HOME + '/.suman/db');
var db = new sqlite3.Database(dbPth, function (err) {
    if (err) {
        console.error(err);
    }
    else {
        console.log(' => SQLite connected.');
    }
});
db.on('error', function (err) {
    console.error(' => sqlite error => ', err);
});
db.configure('busyTimeout', 4000);
var noop = function () {
};
var ret;
exports.default = function (s, sqlite3) {
    if (ret) {
        return ret;
    }
    var reporterName = path.basename(__dirname);
    var runAsync = function (fn) {
        ret.count++;
        console.log(' => Suman sqlite reporter count pre => ', ret.count);
        fn(function (err) {
            err && console.error(err.stack || err);
            ret.count--;
            console.log(' => Suman sqlite reporter count post => ', ret.count);
            if (ret.count < 1) {
                ret.cb();
            }
        });
    };
    var runPromise = function (promise) {
        ret.count++;
        console.log(' => Suman sqlite reporter count pre => ', ret.count);
        return promise
            .catch(function (err) { return err && console.error(err.stack || err); })
            .then(function () {
            ret.count--;
            ret.count < 1 && ret.cb();
        });
    };
    s.on(String(suman_events_1.events.FATAL_TEST_ERROR), function (val) {
        console.log('value => ', val);
        runAsync(function (cb) {
            db.serialize(function () {
                db.run('CREATE TABLE lorem (info TEXT)');
                var stmt = db.prepare('INSERT INTO lorem VALUES (?)');
                for (var i = 0; i < 10; i++) {
                    stmt.run('Ipsum ' + i);
                }
                stmt.finalize();
                db.all('SELECT rowid AS id, info FROM lorem', function (err, rows) {
                    console.log('rows count => ', rows.length);
                    cb();
                });
            });
        });
    });
    s.on(String(suman_events_1.events.TEST_CASE_END), function (val) {
        console.log('value => ', val);
        runAsync(function (cb) {
            db.serialize(function () {
                db.run('CREATE TABLE lorem (info TEXT)');
                var stmt = db.prepare('INSERT INTO lorem VALUES (?)');
                for (var i = 0; i < 1; i++) {
                    stmt.run('Ipsum ' + i);
                }
                stmt.finalize();
                db.all('SELECT rowid AS id, info FROM lorem', function (err, rows) {
                    console.log('rows count => ', rows.length);
                    cb();
                });
            });
        });
    });
    s.on(String(suman_events_1.events.TEST_CASE_PASS), function (val) {
        console.log('value => ', val);
        runAsync(function (cb) {
            db.serialize(function () {
                db.run('CREATE TABLE lorem (info TEXT)');
                var stmt = db.prepare('INSERT INTO lorem VALUES (?)');
                for (var i = 0; i < 1; i++) {
                    stmt.run('Ipsum ' + i);
                }
                stmt.finalize();
                db.all('SELECT rowid AS id, info FROM lorem', function (err, rows) {
                    console.log('rows count => ', rows.length);
                    cb();
                });
            });
        });
    });
    s.on(String(suman_events_1.events.TEST_CASE_SKIPPED), function (val) {
        console.log('value => ', val);
        runAsync(function (cb) {
            db.serialize(function () {
                db.run('CREATE TABLE lorem (info TEXT)');
                var stmt = db.prepare('INSERT INTO lorem VALUES (?)');
                for (var i = 0; i < 1; i++) {
                    stmt.run('Ipsum ' + i);
                }
                stmt.finalize();
                db.all('SELECT rowid AS id, info FROM lorem', function (err, rows) {
                    console.log('rows count => ', rows.length);
                    cb();
                });
            });
        });
    });
    s.on(String(suman_events_1.events.TEST_CASE_STUBBED), function (val) {
        console.log('value => ', val);
        runAsync(function (cb) {
            db.serialize(function () {
                db.run('CREATE TABLE lorem (info TEXT)');
                var stmt = db.prepare('INSERT INTO lorem VALUES (?)');
                for (var i = 0; i < 1; i++) {
                    stmt.run('Ipsum ' + i);
                }
                stmt.finalize();
                db.all('SELECT rowid AS id, info FROM lorem', function (err, rows) {
                    console.log('rows count => ', rows.length);
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
