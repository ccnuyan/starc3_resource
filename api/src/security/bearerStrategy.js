var BearerStrategy = require('passport-http-bearer').Strategy;
var passport = require('passport');
var jwt = require('jwt-simple');
var conf = require('../config/config').getConfig();
var User = require('../users/model');
var mongoose = require('mongoose');
var reporter = require('../services/statusReporter');

var strategy = new BearerStrategy(function(token, done) {
  var user = jwt.decode(token, conf.jwtsecret);
  User.findById(user.id).exec(function(err, userReturn) {
    if (err) {
      //impossible
      return done(err);
    }
    if (!userReturn) {
      return done({
        //impossible
        message: 'user not existed'
      });
    }

    return done(null, userReturn);
  });
});

module.exports = function() {
  passport.use('bearer', strategy);
  console.log('Strategy bearer initialized');
};
