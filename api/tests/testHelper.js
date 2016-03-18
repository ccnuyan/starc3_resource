module.exports = {
  shouldRejected: function(promise) {
    return {
      'catch': function(fn) {
        return promise.then(function() {
          throw new Error('Expected promise to be rejected but it was fulfilled');
        }, function(reason) {
          fn.call(promise, reason);
        });
      }
    };
  },
  shouldFulfilled: function(promise) {
    return {
      'then': function(fn) {
        return promise.then(function(value) {
          fn.call(promise, value);
        }, function(reason) {
          throw reason;
        });
      }
    };
  }
};
