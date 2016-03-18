var maker = require('./maker');

exports.getConfig = function() {
  var config = maker;

  config.dbconfig.name = 'starc3';
  config.port = '3500';
  return config;
};
