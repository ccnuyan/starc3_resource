var path = require('path');
var config = require('../config/config').getConfig();
var elasticsearch = require('elasticsearch');

var client;

exports.getClient = function () {
    if (client) {
        return client;
    }
    else {
        client = elasticsearch.Client(config.esConfig);
        return client;
    }
};
