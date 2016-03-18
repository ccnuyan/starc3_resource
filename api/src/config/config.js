var dev = require('./config.dev');
var prod = require('./config.prod');
var test = require('./config.test');

if (process.env.NODE_ENV === 'development') {
  console.log('server running in dev mode');
  exports.getConfig = dev.getConfig;
}

if (process.env.NODE_ENV === 'production') {
  console.log('server running in prod mode');
  exports.getConfig = prod.getConfig;
}

if (process.env.NODE_ENV === 'test') {
  console.log('server running in test mode');
  exports.getConfig = test.getConfig;
}
