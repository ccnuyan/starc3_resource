var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var FileObjectSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  extension: {
    type: String,
    required: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  etag: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    default: 0
  },
  contentType: {
    type: String,
    default: 'application/octet-stream'
  },
  created: {
    type: Date,
    default: Date.now
  },
  storage_object_id: {
    type: String,
    required: true,
  },
  storage_box_id: {
    type: String,
    required: true,
  }
});

FileObjectSchema.pre('validate', function(next) {
  var file = this;
  var parts = file.name.split('.');
  file.extension = '.' + parts[parts.length - 1];
  next();
});

FileObjectSchema.path('name').validate(function(value) {
  if (!value) return false;

  var lengthCheck = value.length <= 128 && value.length >= 1;
  if (!lengthCheck) return false;

  var fileExtensionCheck = /.+\.([^.]+)$/.test(value);
  if (!fileExtensionCheck) return false;

  var validCheck = /^(?!^(PRN|AUX|CLOCK\$|NUL|CON|COM\d|LPT\d|\..*)(\..+)?$)[^\x00-\x1f\\?*:\";|/]+$/.test(value);
  if (!validCheck) return false;

  return true;
}, 'Invalid name');

module.exports = function() {
  mongoose.model('TempFileObject', FileObjectSchema);
  mongoose.model('FileObject', FileObjectSchema);
  mongoose.model('RemovedFileObject', FileObjectSchema);
};
