var elasticsearch = require('elasticsearch');
var uuid = require('uuid');
var conf = require('../src/config/config.dev').getConfig();
var client = new elasticsearch.Client(conf.esConfig);
var _ = require('lodash');
var async = require('async');


require('../src/models');

var mongoose = require('mongoose');

var KnowledgeNode = mongoose.model('KnowledgeNode');
var Resource = mongoose.model('Resource');

//SQL -- ES
//schema -- mappings
//database -- index
//table -- type
//column -- property

//references:

//https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html
//https://github.com/elastic/elasticsearch-js/blob/master/docs/api_methods_1_6.asciidoc

var mp = require('./mappings');

var excuteTask = function(done) {
  client.indices.delete({
    requestTimeout: Infinity,
    index: mp.knowledgeNodes.index,
  }, function(err, data) {
    client.indices.create({
      requestTimeout: Infinity,
      index: mp.knowledgeNodes.index,
    }, function(error) {
      if (error) {
        done('elasticsearch cluster died');
      } else {

        console.log('elasticsearch cluster connected');

        client.indices.putMapping(mp.knowledgeNodes, function(err) {
          if (err) {
            done(err);
          } else {

            console.log('knowledgeNodes mapping updated');
            KnowledgeNode.find()
              .exec(function(err, nodes) {

                var es_nodes = [];

                console.log(nodes.length + ' knowledge nodes to be imported');

                if (err) {
                  done(err);
                }

                nodes.forEach(function(nd) {
                  es_nodes.push({
                    index: {

                      _index: mp.knowledgeNodes.index,
                      _type: mp.knowledgeNodes.type,
                      _id: nd.id
                    }
                  });

                  es_nodes.push({
                    title: nd.title,
                    subject: nd.subject,
                  });
                });


                if (nodes.length === 0) {
                  return;
                }

                client.bulk({
                  body: es_nodes
                }, function(err, resp) {
                  if (err) {
                    return done(err);
                  }
                  console.log('knowledge nodes imported');
                  done();
                });
              });
          }
        });

        client.indices.putMapping(mp.resources, function(err) {
          if (err) {
            done(err);
          } else {

            console.log('resources mapping updated');

            Resource.find()
              .populate('knowledgeNode')
              .exec(function(err, resources) {

                var es_resources = [];

                console.log(resources.length + ' resources to be imported');

                if (err) {
                  done(err);
                }

                resources.forEach(function(rs) {
                  es_resources.push({
                    index: {
                      _index: mp.resources.index,
                      _type: mp.resources.type,
                      _id: rs.id
                    }
                  });

                  es_resources.push({
                    subjectId: rs.knowledgeNode.subject,
                    knowledgeNodeId: rs.knowledgeNode._id,
                    knowledgeNode: rs.knowledgeNode.title,
                    title: rs.title,
                    description: rs.description,
                  });
                });

                if (es_resources.length === 0) {
                  return;
                }

                client.bulk({
                  body: es_resources
                }, function(err, resp) {
                  if (err) {
                    return done(err);
                  }
                  console.log('resources imported');
                  done();
                });
              });
          }
        });
      }
    });
  });
};


var connect = function(callback) {
  var cstring = conf.dbconfig.url + conf.dbconfig.name;
  console.log(cstring);
  mongoose.connect(cstring, function(err) {
    if (err) {
      console.log(err.message);
      setTimeout(connect, 10000);
      mongoose.connection.close();
      return;
    }

    var callback = function(err) {
      if (err) {
        console.trace(err);
      }
    };

    excuteTask(callback);
  });
};

connect();
