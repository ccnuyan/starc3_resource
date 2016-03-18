var fs = require('fs');

function WebpackStatsGenerator(opts) {
  opts = opts || {};
  this.opts = {};
  this.opts.filename = opts.filename || 'stats.json';
}

WebpackStatsGenerator.prototype.apply = function(compiler) {
  var self = this;
  compiler.plugin('emit', function(curCompiler, callback) {
    // Get stats.
    // **Note**: In future, could pass something like `{ showAssets: true }`
    // to the `getStats()` function for more limited object returned.
    var jsonStats = curCompiler.getStats().toJson();

    if (jsonStats.errors.length > 0) {
      console.log('stats generator failed');
      console.log(jsonStats.errors);
      return callback();
    }
    if (jsonStats.warnings.length > 0)
      console.log('stats has warnings');

    var strstat = JSON.stringify(jsonStats);

    console.log('\nwriting');
    console.log(self.opts.filename);
    fs.writeFile(self.opts.filename, strstat, 'utf8');
    console.log('done');
    callback();
  });
};

module.exports = WebpackStatsGenerator;
