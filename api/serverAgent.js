var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var assert = require('assert');
var passport = require('passport');

var handlers = require('./handlers');
var crossDomainHanlder = require('./crossDomainHanlder');

var app = express();

var conf = require('./src/config/config').getConfig();

app.get('/service/status', function(req, res) {
  res.status(200).send('ok');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(crossDomainHanlder);
app.use(logger('dev'));

require('./src/models');
require('./src/security/bearerStrategy')();

app.use(passport.initialize());

// artifical delay and errors
if (process.env.NODE_ENV === 'debug') {
  // app.use(handlers.ramdonDelay);
  // app.use(handlers.ramdonError);
}

app.use('/user/', require('./src/users/userController'));

require('./src/routers/initialize')(app);

//error handlers
app.use(handlers.logErrors);
app.use(handlers.clientErrorHandler);
app.use(handlers.errorHandler);

var mongoose = require('mongoose');
//luanch api
var connect = function(callback) {
  var cstring = conf.dbconfig.url + conf.dbconfig.name;
  console.log(cstring);
  mongoose.connect(cstring, function(err) {
    if (err) {
      console.log(err.message);
      setTimeout(connect, 10000);
      mongoose.connection.close();
      return;
    }
    app.listen(conf.port, function() {
      console.log('Express server listening on port ' + conf.port);
      if (callback) callback(app);
    });
  });
};

module.exports = connect;
