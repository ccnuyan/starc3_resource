var checkStatus = function(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else if (response.status === 400) {
    return response.json().then(function(err) {
      throw err;
    });
  } else if (response.status === 401) {
    throw {
      status: 'failure',
      message: '登陆失败'
    };
  } else {
    var error = new Error(response.body);
    error.response = response;
    throw error;
  }
};

function parseJSON(response) {
  return response.json();
}

var serialize = function(obj) {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
    }
  return str.join('&');
};

export default {
  checkStatus: checkStatus,
  parseJSON: parseJSON,
  serialize: serialize,
};
