var express = require('express');
var router = express.Router();
var _ = require('lodash');
var User = require('./model');
var jwt = require('jwt-simple');
var passport = require('passport');
var conf = require('../config/config').getConfig();

var reporter = require('../services/statusReporter');

var errorHandler = function(err, req, res, next) {
  switch (err.name) {
    case 'MongoError':
      var error = '该用户已经注册';
      return reporter.userValidationError(res, error);
      break;
    case 'ValidationError':
      var errors = err.errors;
      var error = errors[Object.keys(errors)[0]].message;
      return reporter.userValidationError(res, error);
      break;
    default:
      next(err);
  }
};

router.post('/register', function(req, res, next) {
  var user = req.body;
  var newUser = new User(user);

  newUser.save(function(err, userSaved) {
    if (err) {
      return next(err);
    } else {
      return reporter.createAndSendToken(res, userSaved.toJSON());
    }
  });
}, errorHandler);

router.post('/login', passport.authenticate('local', {
  session: false
}), function(req, res) {
  return reporter.createAndSendToken(res, req.user);
});

router.get('/info', passport.authenticate('bearer', {
  session: false
}), function(req, res, next) {
  User.findById(req.user.id).exec(function(err, userReturn) {
    if (err) {
      return next(err);
    }
    if (!userReturn) {
      return reporter.userNotExisted(res);
    }
    res.status(200).send(userReturn);
  });
});

router.post('/modifypwd', passport.authenticate('bearer', {
  session: false
}), function(req, res, next) {
  User.findById(req.user.id).exec(function(err, userReturn) {
    if (err) {
      return next(err);
    }
    if (!userReturn) {
      return reporter.userNotExisted(res);
    }
    if (userReturn.authenticate(req.body.oldpassword)) {
      userReturn.password = req.body.newpassword;

      userReturn.save(function(err, userSaved) {
        if (err) {
          next(err);
        } else {
          return reporter.success(res);
        }
      });
    } else {
      return reporter.toBeModifiedPasswordWrong(res);
    }
  });
}, errorHandler);

router.post('/resetemail', passport.authenticate('bearer', {
  session: false
}), function(req, res) {
  res.status(200).json(req.user);
});

router.post('/forgetpassword', function(req, res) {
  res.status(200).json(req.user);
});

module.exports = router;
