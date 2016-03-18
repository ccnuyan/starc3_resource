var conf = require('../config/config').getConfig();
var fetch = require('isomorphic-fetch');

function base64Encode(str) {
  return new Buffer(str).toString('base64');
}
var authenticationString = base64Encode(conf.clientId + ':' + conf.clientSecret);

module.exports = {
  uploadRequest: function(token, method, uri, body, callback) {
    var body = JSON.stringify({
      requestType: 'upload',
      requestMethod: method,
      requestUri: uri,
      requestBody: body,
      authorization: token,
    });
    fetch(conf.requestUri, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + authenticationString
        },
        body: body
      })
      .then(function(response) {
        if (response.status === 201) {
          return response.json();
        } else {
          callback({
            status: 'failure',
            message: 'upload request failed'
          });
        }
      })
      .then(function(transaction) {
        callback(null, transaction);
      });
  },
  downloadRequest: function(storageBoxId, storageObjectId, fileName, callback) {
    var body = JSON.stringify({
      requestType: 'download',
      storage_object_id: storageObjectId,
      fileName: fileName
    });
    console.log(body);
    fetch(conf.requestUri, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + authenticationString
        },
        body: body
      })
      .then(function(response) {
        if (response.status === 201) {
          return response.json();
        } else {
          callback({
            status: 'failure',
            message: 'download request failed'
          });
        }
      })
      .then(function(transaction) {
        callback(null, transaction);
      });
  },
};
