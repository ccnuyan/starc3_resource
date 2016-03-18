// https://jwt.io/

// 1 header
// {
// "alg": "HS256",
// "typ": "JWT"
// }

// 2 payload
// {
//   "id": "1234567890",
//   "name": "John Doe",
//   "admin": true
// }

// 3 secret
// HMACSHA256(
//   base64UrlEncode(header) + "." +
//   base64UrlEncode(payload),
//   secret)

//method to encode and decode our jwt;
var algorithm = 'HS256';

//node js native crypto
var crypto = require('crypto');

//method to ge jwt
exports.encode = function(payload, secret) {
  var header = {
    typ: 'JWT',
    alg: algorithm
  };

  // 1 header
  var header = base64Encode(JSON.stringify(header));
  // 2 payload
  var payload = base64Encode(JSON.stringify(payload));
  // 3 secret
  var signature = sign(header + '.' + payload, secret);

  return header + '.' + payload + '.' + signature;
};

exports.decode = function(payload, secret) {
  var segments = token.split('.');
  if (segments.length !== 3) {
    throw new Error('token structure incorrect');
  }

  var header = JSON.parse(base64Decode(segments[0]));
  var payload = JSON.parse(base64Decode(segments[1]));

  var rawSignature = segments[0] + segments[1];

  if (!verify(rawSignature, secret, segments[2])) {
    throw new Error('validation failed');
  };

  return payload;
};

function verify(raw, secret, signature) {
  return signature === sign(raw, secret);
}

function sign(str, key) {
  return crypto.createHmac('sha256', key).update(str).digest('base64');
}

function base64Encode(str) {
  return new Buffer(str).toString('base64');
}

function base64Decode(str) {
  return new Buffer(str, 'base64').toString();
}
