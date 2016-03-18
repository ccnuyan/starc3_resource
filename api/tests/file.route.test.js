var should = require('should');
var conf = require('../src/config/config').getConfig();
var request = require('supertest');
var path = require('path');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Directory = mongoose.model('Directory');
var File = mongoose.model('File');
var serverAgent = require('../serverAgent.js');
var _ = require('lodash');
var jwt = require('jwt-simple');

/**
 * Globals
 */
var app, agent, credentials, token, rootId, subDir1Id, subDir2Id, _user, _directory;

var tfObj = {
  name: 'file.txt',
  etag: 'etagid',
  size: '100',
  contentType: 'text/plain',
  storage_object_id: 'storage_object_id',
  storage_box_id: 'storage_box_id',
};

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
        agent.get('/disk/root')
          .set('Authorization', 'Bearer ' + token)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            rootId = res.body._id;
            agent.post('/disk/dir/' + rootId + '/subdir/')
              .set('Authorization', 'Bearer ' + token)
              .send({
                name: 'valid name 1'
              })
              .expect(201)
              .end(function(err, res) {
                should.not.exist(err);
                subDir1Id = res.body._id;
                agent.post('/disk/dir/' + rootId + '/subdir/')
                  .set('Authorization', 'Bearer ' + token)
                  .send({
                    name: 'valid name 2'
                  })
                  .expect(201)
                  .end(function(err, res) {
                    should.not.exist(err);
                    subDir2Id = res.body._id;
                    done();
                  });
              });
          });
      });
    });
  });

  it('should be able to create file in foot', function(done) {
    agent.post('/disk/dir/' + rootId + '/subfile/')
      .set('Authorization', 'Bearer ' + token)
      .send({
        file: tfObj
      })
      .expect(201)
      .end(function(err, res) {
        res.body.should.have.property('parent');
        res.body.parent.should.equal(rootId);
        should.not.exist(err);
        done();
      });
  });

  it('should be able to delete file in foot', function(done) {
    agent.post('/disk/dir/' + rootId + '/subfile/')
      .set('Authorization', 'Bearer ' + token)
      .send({
        file: tfObj
      })
      .expect(201)
      .end(function(err, res) {
        should.not.exist(err);
        res.body.should.have.property('_id');
        agent.delete('/disk/dir/' + rootId + '/subfile/' + res.body._id)
          .set('Authorization', 'Bearer ' + token)
          .expect(200)
          .end(function(err, res) {
            res.body.should.have.property('parent');
            res.body.parent.should.equal(rootId);
            should.not.exist(err);
            done();
          });
      });
  });

  it('should be able to rename file in foot', function(done) {
    agent.post('/disk/dir/' + rootId + '/subfile/')
      .set('Authorization', 'Bearer ' + token)
      .send({
        file: tfObj
      })
      .expect(201)
      .end(function(err, res) {
        should.not.exist(err);
        res.body.should.have.property('_id');
        agent.put('/disk/dir/' + rootId + '/subfile/' + res.body._id)
          .set('Authorization', 'Bearer ' + token)
          .send({name:'new name.txt'})
          .expect(200)
          .end(function(err, res) {
            res.body.should.have.property('parent');
            res.body.name.should.equal('new name.txt');
            should.not.exist(err);
            done();
          });
      });
  });

  it('should be able to rename file to another extension', function(done) {
    agent.post('/disk/dir/' + rootId + '/subfile/')
      .set('Authorization', 'Bearer ' + token)
      .send({
        file: tfObj
      })
      .expect(201)
      .end(function(err, res) {
        should.not.exist(err);
        res.body.should.have.property('_id');
        agent.put('/disk/dir/' + rootId + '/subfile/' + res.body._id)
          .set('Authorization', 'Bearer ' + token)
          .send({name:'new name.etxt'})
          .expect(400)
          .end(function(err, res) {
            res.body.status.should.equal('failure');
            res.body.message.should.equal('不允许修改文件扩展名');
            should.not.exist(err);
            done();
          });
      });
  });

  it('should be able to move file', function(done) {
    agent.post('/disk/dir/' + rootId + '/subfile/')
      .set('Authorization', 'Bearer ' + token)
      .send({
        file: tfObj
      })
      .expect(201)
      .end(function(err, res) {
        should.not.exist(err);
        res.body.should.have.property('_id');
        agent.put('/disk/move/'+res.body._id+'/from/'+rootId+'/to/' + subDir1Id)
          .set('Authorization', 'Bearer ' + token)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            console.log(JSON.stringify(res.body, null, 2));
            done();
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
