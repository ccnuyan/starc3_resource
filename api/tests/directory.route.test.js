var should = require('should');
var conf = require('../src/config/config').getConfig();
var request = require('supertest');
var path = require('path');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Directory = mongoose.model('Directory');
var serverAgent = require('../serverAgent.js');
var _ = require('lodash');
var jwt = require('jwt-simple');

/**
 * Globals
 */
var app, agent, credentials, token, _user, _directory;

describe('Directory Route tests', function() {

  before(function(done) {
    // Get application
    var testServer = require('./testServer');
    app = testServer.app();
    agent = testServer.agent();
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3'
    };

    // Create a new user
    _user = {
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password
    };

    done();
  });

  beforeEach(function(done) {
    User.remove().exec(function() {
      var user = new User(_user);
      user.save(function(err, user) {

        var payload = {
          id: user._id,
          from: 'host',
          to: 'local',
          username: user.username
        };

        token = jwt.encode(payload, conf.jwtsecret);
        done();
      });
    });
  });

  it('should be unable to get root if not login', function(done) {
    var user = _.clone(_user);
    agent.get('/disk/root')
      .expect(401)
      .end(function(err, res) {
        should.not.exist(err);
        return done();
      });
  });

  it('should be able to get root if login', function(done) {
    var user = _.clone(_user);
    agent.get('/disk/root')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
        return done();
      });
  });

  it('should be able to create sub sub directory and unable to create sub sub sub directory', function(done) {
    agent.get('/disk/root')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
        var rootId = res.body._id;
        agent.post('/disk/dir/' + rootId + '/subdir/')
          .set('Authorization', 'Bearer ' + token)
          .send({
            name: 'valid name 1'
          })
          .expect(201)
          .end(function(err, res) {
            should.not.exist(err);
            var subDirId = res.body._id;
            agent.post('/disk/dir/' + subDirId + '/subdir/')
              .set('Authorization', 'Bearer ' + token)
              .send({
                name: 'valid name 2'
              })
              .expect(201)
              .end(function(err, res) {
                should.not.exist(err);
                var subSubDirId = res.body._id;
                agent.post('/disk/dir/' + subSubDirId + '/subdir/')
                  .set('Authorization', 'Bearer ' + token)
                  .send({
                    name: 'valid name 3'
                  })
                  .expect(400)
                  .end(function(err, res) {
                    should(res.body.status).be.exactly('failure');
                    should(res.body.message).be.exactly('不允许创建更深层次的文件夹');
                    return done();
                  });
              });
          });
      });
  });


  it('should be able to rename directory', function(done) {
    agent.get('/disk/root')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
        var rootId = res.body._id;
        agent.post('/disk/dir/' + rootId + '/subdir/')
          .set('Authorization', 'Bearer ' + token)
          .send({
            name: 'valid name'
          })
          .expect(201)
          .end(function(err, res) {
            should.not.exist(err);
            var subDirId = res.body._id;
            agent.put('/disk/dir/' + rootId + '/subdir/' + subDirId)
              .set('Authorization', 'Bearer ' + token)
              .send({
                name: 'new name'
              })
              .expect(200)
              .end(function(err, res) {
                should.not.exist(err);
                should.exist(res.body.name);
                should(res.body.name).be.exactly('new name');
                return done();
              });
          });
      });
  });

  it('should be able to remove directory', function(done) {
    agent.get('/disk/root')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
        var rootId = res.body._id;
        agent.post('/disk/dir/' + rootId + '/subdir/')
          .set('Authorization', 'Bearer ' + token)
          .send({
            name: 'valid name'
          })
          .expect(201)
          .end(function(err, res) {
            should.not.exist(err);
            var subDirId = res.body._id;
            agent.delete('/disk/dir/' + rootId + '/subdir/' + subDirId)
              .set('Authorization', 'Bearer ' + token)
              .expect(200)
              .end(function(err, res) {
                should.not.exist(err);
                should.exist(res.body.name);
                should(res.body.name).be.exactly('valid name');
                return done();
              });
          });
      });
  });



  it('should be able to populate sub directories', function(done) {
    agent.get('/disk/root')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
        var rootId = res.body._id;
        agent.post('/disk/dir/' + rootId + '/subdir/')
          .set('Authorization', 'Bearer ' + token)
          .send({
            name: 'valid name'
          })
          .expect(201)
          .end(function(err, res) {
            should.not.exist(err);
            agent.get('/disk/root')
              .set('Authorization', 'Bearer ' + token)
              .expect(200)
              .end(function(err, res) {
                should.not.exist(err);
                should.exist(res.body.name);
                should(res.body.name).be.exactly('root');
                res.body.should.have.property('subDirectories').with.lengthOf(1);
                res.body.subDirectories[0].name.should.equal('valid name');
                console.log(JSON.stringify(res.body, null, 2));
                done();
              });
          });
      });
  });



  it('should be unable to get directory not existed', function(done) {
    agent.get('/disk/root')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
        var rootId = res.body._id;
        agent.get('/disk/dir/' + rootId + '/subdir/invaliddir')
          .set('Authorization', 'Bearer ' + token)
          .expect(400)
          .end(function(err, res) {
            should(res.body.status).be.exactly('failure');
            should(res.body.message).be.exactly('目录不存在');
            done();
          });
      });
  });

  it('should be unable to get directory if parent not existed', function(done) {
    agent.get('/disk/root')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
        var rootId = res.body._id;
        agent.get('/disk/dir/invalideparent/subdir/invaliddir')
          .set('Authorization', 'Bearer ' + token)
          .expect(400)
          .end(function(err, res) {
            should(res.body.status).be.exactly('failure');
            should(res.body.message).be.exactly('父目录不存在');
            done();
          });
      });
  });

  it('should be unable to create directory with illigal name', function(done) {
    agent.get('/disk/root')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
        var rootId = res.body._id;
        agent.post('/disk/dir/' + rootId + '/subdir/')
          .set('Authorization', 'Bearer ' + token)
          .send({
            name: '@/?'
          })
          .expect(400)
          .end(function(err, res) {
            should(res.body.status).be.exactly('failure');
            should(res.body.message).be.exactly('这个目录名不合法');
            return done();
          });
      });
  });


  afterEach(function(done) {
    User.remove().exec(function() {
      Directory.remove().exec(done);
    });
  });

  after(function(done) {
    done();
  });
});

//console.log(JSON.stringify(res.body, null, 2));
