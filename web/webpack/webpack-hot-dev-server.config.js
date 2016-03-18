module.exports = (require('../webpack.config.maker'))({
  devServer: true,
  devtool: 'eval-source-map',
  debug: true,
	hotComponents:true
});
