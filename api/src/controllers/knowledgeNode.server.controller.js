var conf = require('../config/config').getConfig();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Resource = mongoose.model('Resource');
var KnowledgeNode = mongoose.model('KnowledgeNode');
var client = require('../services/elasticSearchService.js').getClient();


exports.search = function(req, res, next) {

  //SQL -- ES
  //schema -- mappings
  //database -- index
  //table -- type
  //column -- property

  var searchParams = {};
  var matches = [];

  matches.push({
    match: {
      title: req.query.term
    }
  });

  searchParams.dis_max = {
    queries: matches
  };

  var filter = {
    and: []
  };
  filter.and.push({
    term: {
      subject: req.query.subject
    }
  });

  var searchBody = {
    size: 10,
    fields: [],
    query: searchParams
  };
  searchBody.filter = filter;

  client.search({
    index: 'starc3_resource',
    type: 'knowledgeNodes',
    body: searchBody
  }, function(error, response) {

    if (error) {
      return res.status(200).json([]);
    }

    var ids = [];
    response.hits.hits.forEach(function(hit) {
      ids.push(hit._id);
    });

    if (response && !response.timeout) {
      KnowledgeNode.find({
          _id: {
            $in: ids
          }
        })
        .exec(function(err, nodes) {
          if (err) {
            return next(err);
          }

          var orderdNodes = [];
          ids.forEach(function(id) {
            nodes.forEach(function(node) {
              if (node._id.toString() === id.toString()) {
                orderdNodes.push(node);
              }
            });
          });

          return res.status(200).json(orderdNodes);
        });
    }
  });
};

exports.list = function(req, res, next) {
  KnowledgeNode.find(req.query)
    .sort({
      code: 'asc'
    })
    .exec(function(err, knowledgeNodes) {
      if (err) {
        return next(err);
      }
      return res.status(200).json(knowledgeNodes);
    });
};

exports.read = function(req, res, next) {
  Resource.find({
      knowledgeNode: req.knowledgeNode.id
    })
    .populate('knowledgeNode')
    .sort({
      code: 'asc'
    })
    .exec(function(err, resources) {
      if (err) {
        return next(err);
      }
      return res.status(200).json(resources);
    });
};



exports.knowledegeNodeResources = function(req, res, next) {
  KnowledgeNode.findById(req.knowledgeNode.id, null, {
      lean: true
    })
    .exec(function(err, knowledgeNode) {
      if (err) {
        return next(err);
      }
      console.log(knowledgeNode);
      Resource.find({
          knowledgeNode: knowledgeNode._id
        }, null, {
          lean: true
        })
        .exec(function(err, resources) {
          if (err) {
            return next(err);
          }
          knowledgeNode.resources = resources;
          return res.status(200).send(knowledgeNode);
        });
    });
};

exports.knowledgeNodeById = function(req, res, next, id) {
  KnowledgeNode.findById(id)
    .exec(function(err, knowledgeNode) {
      if (err) {
        return next(err);
      }
      if (!knowledgeNode) {
        return next({
          message: 'knowledge node specified does not exist'
        });
      }
      req.knowledgeNode = knowledgeNode;
      return next();
    });
};
