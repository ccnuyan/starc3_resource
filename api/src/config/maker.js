var config = {};

var user = process.env.MONGO_USER;
var pass = process.env.MONGO_PASS;
var host = process.env.MONGO_HOST;
var port = process.env.MONGO_PORT;
config.dbconfig = {
  url: 'mongodb://' + user + ':' + pass + '@' + host + '/'
};
config.domain = process.env.DOMAIN;
config.port = '3500';
config.jwtsecret = process.env.JWT_SECRET;

config.requestUri = 'http://oa.starc.com.cn/storage/api/request/';
config.clientId = process.env.CLIENT_ID;
config.clientSecret = process.env.CLIENT_SECRET;

config.esConfig = {
  host: process.env.ES_HOST,
  log: {
    type: 'file',
    level: 'trace',
    path: 'elasticsearch.dev.log'
  }
};

config.openStackConfig = {
  cloudUrl: process.env.OPENSTACK_HOST,
  cloudPort: process.env.OPENSTACK_PORT,
  xAuthUser: process.env.OPENSTACK_USER,
  xAuthKey: process.env.OPENSTACK_PASS
};

module.exports = config;
