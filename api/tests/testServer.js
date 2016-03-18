var should = require('should');
var request = require('supertest');
var path = require('path');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var serverAgent = require('../serverAgent.js');
var _ = require('lodash');

var app, agent;

module.exports = {
  app: function() {
    return app;
  },
  agent: function() {
    return agent;
  },
  init: function(done) {
    var callback = function(appback) {
      app = appback;
      agent = request.agent(app);
      done();
    };

    serverAgent(callback);
  }
};
