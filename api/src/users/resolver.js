var Presentation = require('./model');

module.exports = function (req, res, next, id) {
  Presentation.findById(id).exec(
    function(err, data) {
      req.presentation = data;
      next();
    }
  );
};
