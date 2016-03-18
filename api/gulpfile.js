var _ = require('lodash');
var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var mocha = require('gulp-mocha');
var eslint = require('gulp-eslint');
var mongoose = require('mongoose');
var runSequence = require('run-sequence');

var User = require('./src/users/model');

// Set NODE_ENV to 'dev'
gulp.task('env:dev', function() {
  process.env.NODE_ENV = 'development';
  process.env.PORT = '3400';
});

// Nodemon task
gulp.task('nodemon', function() {
  return nodemon({
    script: 'server.js',
    ext: 'js',
    watch: _.union('./config', './controller')
  });
});

gulp.task('eslint', function() {
  return gulp.src(['**/*.js', '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('debug', function(done) {
  runSequence('env:dev', 'eslint', 'nodemon', done);
});

// Mocha tests task
gulp.task('mocha-model', function(done) {
  process.env.NODE_ENV = 'test';
  var conf = require('./src/config/config').getConfig();
  var testSuites = [];
  testSuites.push('./tests/user.model.test.js');

  var connect = function() {
    mongoose.connect(conf.dbconfig.url, function(err) {
      if (err) {
        done(err.message);
      }
      var error;
      // Run the tests
      gulp.src(testSuites)
        .pipe(mocha({
          reporter: 'spec',
          timeout: 10000
        }))
        .on('error', function(err) {
          console.log(err);
          error = err;
        })
        .on('end', function() {
          mongoose.disconnect(done);
        });
    });
  };

  connect();
});

// Mocha tests task
gulp.task('mocha-route', function(done) {
  process.env.NODE_ENV = 'test';
  var testSuites = [];
  testSuites.push('./tests/file.route.test.js');

  var error;
  // Run the tests
  var callback = function() {
    gulp.src(testSuites)
      .pipe(mocha({
        reporter: 'spec',
        timeout: 10000
      }))
      .on('error', function(err) {
        console.log(err);
        error = err;
      })
      .on('end', function() {
        done(error);
        process.exit();
      });
  };

  var testServer = require('./tests/testServer');
  testServer.init(callback);
});
