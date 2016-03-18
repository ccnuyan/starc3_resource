var should = require('should');
var mongoose = require('mongoose');
var uuid = require('uuid');
var User = mongoose.model('User');
var _ = require('lodash');
var helper = require('./testHelper.js');

/**
 * Globals
 */
var user1, user2, invalidUsernames;

/**
 * Unit tests
 */
describe('User Model Unit Tests:', function() {

  before(function(done) {
    user1 = {
      email: 'test@test.com',
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };
    user2 = {
      username: 'aZ03',
      email: 'user@different.com',
      password: 'zhende'
    };

    invalidUsernames = [];
    invalidUsernames.push('abcde');
    invalidUsernames.push('abcdefghijklmnopq');
    invalidUsernames.push('abc~defg');
    invalidUsernames.push('abc@defg');
    invalidUsernames.push('abc!defg');
    invalidUsernames.push('abc#defg');
    invalidUsernames.push('abc$defg');
    invalidUsernames.push('abc^defg');
    invalidUsernames.push('abc%defg');
    invalidUsernames.push('abc&defg');
    invalidUsernames.push('abc*defg');
    invalidUsernames.push('abc(defg');
    invalidUsernames.push('abc)defg');
    invalidUsernames.push('abc.defg');
    invalidUsernames.push('123abc');

    User.remove().exec(done);
  });

  describe('Method Save', function() {

    it('should begin with no users', function() {
      return User.find({}).exec(function(err, users) {
        users.should.have.length(0);
      });
    });

    it('should save user success', function() {
      var user = new User(user1);
      return helper.shouldFulfilled(new Promise(function(resolve, reject) {
        user.save(function(err, userRet) {
          if (err) {
            reject(err);
          } else {
            resolve(userRet);
          }
        });
      })).then(function(userRet) {
        should.exist(userRet);
        userRet.should.have.property('username', user1.username);
        userRet.should.have.property('email', user1.email);
        should(userRet.authenticate(user1.password)).be.exactly(true);
        should(userRet.authenticate('randompass')).be.exactly(false);
      });
    });

    it('should save with same username fail', function(done) {
      var user = new User(user1);
      var user2 = new User(user1);
      user.save(function(err, user) {
        user2.save(function(err, user) {
          should.exist(err);
          done();
        });
      });
    });

    it('should save with invalid username fail', function() {
      var failed = 0;
      var promises = _.reduce(invalidUsernames, function(sum, username) {
        var userlocal = _.clone(user1);
        userlocal.username = username;
        userlocal.email = uuid.v4() + '@abc.com';
        var user = new User(userlocal);
        var promise = new Promise(function(resolve, reject) {
          user.save(function(err, userReturn) {
            if (err) {
              failed++;
              resolve(null);
            } else {
              resolve('saved');
            }
          });
        });
        sum.push(promise);
        return sum;
      }, []);
      return helper.shouldFulfilled(Promise.all(promises))
        .then(function(results) {
          results.should.have.length(failed);
        });
    });

    //describe end
  });

  after(function(done) {
    User.remove().exec(done);
  });
});
