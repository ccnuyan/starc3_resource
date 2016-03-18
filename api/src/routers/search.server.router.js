var resource = require('../controllers/resource.server.controller');
var knowledgeNode = require('../controllers/knowledgeNode.server.controller');
var express = require('express');
var router = express.Router();

router.route('/knowledgeNodes')
  .get(knowledgeNode.search);

router.route('/resources')
  .get(resource.search);

module.exports = router;
