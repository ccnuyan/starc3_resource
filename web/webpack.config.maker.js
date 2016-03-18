var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var loadersByExtension = require('./webpack/loadersByExtension');
var WebpackStatsGenerator = require('./webpack/webpack-stats-generator');

module.exports = function(options) {
  var entry = {
    main: './web/config/mainApp'
  };

  //jsx js loader get rid of stage=0 in babel6, switch /app to /src
  var loaders = {
    'jsx': options.hotComponents ? ['react-hot-loader', 'babel-loader'] : 'babel-loader',
    'js': {
      loader: 'babel-loader',
      include: path.join(__dirname, 'src')
    },
    'json': 'json-loader',
    'coffee': 'coffee-redux-loader',
    'json5': 'json5-loader',
    'txt': 'raw-loader',
    'png|jpg|jpeg|gif|svg': 'url-loader?limit=10000',
    'woff|woff2': 'url-loader?limit=100000',
    'ttf|eot': 'file-loader',
    'wav|mp3': 'file-loader',
    'html': 'html-loader',
    'md|markdown': ['html-loader', 'markdown-loader']
  };
  var cssLoader = options.minimize ? 'css-loader?module' : 'css-loader?module&localIdentName=[path][name]---[local]---[hash:base64:5]';
  var stylesheetLoaders = {
    'css': cssLoader,
    'less': [cssLoader, 'less-loader'],
    'styl': [cssLoader, 'stylus-loader'],
    'scss|sass': [cssLoader, 'sass-loader']
  };
  var additionalLoaders = [
    // { test: /some-reg-exp$/, loader: 'any-loader' }
  ];
  var alias = {

  };
  var aliasLoader = {

  };
  var externals = [

  ];
  var modulesDirectories = ['web_modules', 'node_modules'];
  var extensions = ['', '.web.js', '.js', '.jsx'];
  var root = path.join(__dirname, 'src');
  var publicPath = options.devServer ?
    'http://localhost:8580/_assets/' :
    '/resource/_assets/';
  var output = {
    path: path.join(__dirname, 'build', 'public'),
    publicPath: publicPath,
    filename: '[name].js' + (options.longTermCaching ? '?[chunkhash]' : ''),
    chunkFilename: (options.devServer ? '[id].js' : '[name].js') + (options.longTermCaching ? '?[chunkhash]' : ''),
    sourceMapFilename: 'debugging/[file].map',
  };
  var excludeFromStats = [
    /node_modules[\\\/]react(-router)?[\\\/]/,
    /node_modules[\\\/]items-store[\\\/]/
  ];
  var plugins = [
    new webpack.PrefetchPlugin('react'),
    new webpack.PrefetchPlugin('react/lib/ReactComponentBrowserEnvironment')
  ];

  plugins.push(new WebpackStatsGenerator({
    filename: path.join(__dirname, 'build', 'stats.json')
  }));

  Object.keys(stylesheetLoaders).forEach(function(ext) {
    var stylesheetLoader = stylesheetLoaders[ext];
    if (Array.isArray(stylesheetLoader)) stylesheetLoader = stylesheetLoader.join('!');
    stylesheetLoaders[ext] = 'style-loader!' + stylesheetLoader;
  });
  if (options.minimize) {
    plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        compressor: {
          warnings: false
        }
      }),
      new webpack.optimize.DedupePlugin()
    );
  }
  if (options.minimize) {
    plugins.push(
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        }
      }),
      new webpack.NoErrorsPlugin()
    );
  }

  var config = {
    entry: entry,
    output: output,
    target: 'web',
    module: {
      preLoaders: [{
        test: /\.jsx?$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      }],
      loaders: [].concat(loadersByExtension(loaders)).concat(loadersByExtension(stylesheetLoaders)).concat(additionalLoaders)
    },
    devtool: options.devtool,
    debug: options.debug,
    resolveLoader: {
      root: path.join(__dirname, 'node_modules'),
      alias: aliasLoader
    },
    externals: externals,
    resolve: {
      root: root,
      modulesDirectories: modulesDirectories,
      extensions: extensions,
      alias: alias
    },
    plugins: plugins,
    devServer: {
      stats: {
        cached: false,
        exclude: excludeFromStats
      }
    }
  };

  // console.log('config:\n' + JSON.stringify(config, null, 2));

  return config;
};
