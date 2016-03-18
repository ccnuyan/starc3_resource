module.exports = function(options) {

  var express = require('express');
  var bodyParser = require('body-parser');
  var path = require('path');
  var Renderer = require('./renderer.js');
  var renderer = new Renderer(options);
  var app = express();

  // serve the static assets
  app.use('/_assets', express.static(path.join(__dirname, '..', 'build', 'public'), {
    maxAge: '200d' // We can cache them as they include hashes
  }));
  app.use('/', express.static(path.join(__dirname, '..', 'public'), {}));

  // artifical delay and errors
  app.use(function(req, res, next) {
    if (Math.random() < 0.0001) {
      // Randomly fail to test error handling
      res.statusCode = 500;
      res.end('Random fail! (you may remove this code in your app)');
      return;
    }
    setTimeout(next, Math.ceil(Math.random() * 100));
  });

  app.use(bodyParser.json());

  var requestRender = function(req, res, appName) {
    renderer.render(
      req.path,
      function(err, html) {
        if (err) {
          res.statusCode = 500;
          res.contentType = 'text; charset=utf8';
          res.end(err.message);
          return;
        }
        res.contentType = 'text/html; charset=utf8';
        res.end(html);
      }, appName);
  };

  // main
  app.get('/*', function(req, res) {
    requestRender(req, res, 'main');
  });


  var port = process.env.PORT || options.defaultPort || 8580;
  app.listen(port, function() {
    console.log('Server listening on port ' + port);
  });
};
