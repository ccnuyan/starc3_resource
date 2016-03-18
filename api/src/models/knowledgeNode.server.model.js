var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var KnowledgeNodeSchema = new Schema({
  title: {
    type: String
  },
  subject: {
    type: String
  }
});


module.exports = function() {
  mongoose.model('KnowledgeNode', KnowledgeNodeSchema);
};
