var storage = $window.localStorage;
var cachedToken;

export default {
  setToken: function(token) {
    catchedToken = token;
    storage.setItem('userToken', token);
  },
  getToken: function() {
    if (!catchedToken)
      catchedToken = storage.getItem('userToken');
    return catchedToken;
  },
  isAuthenticated: function() {
    return !!getToken();
  }
};
