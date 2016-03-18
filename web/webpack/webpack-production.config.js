module.exports = [
  require('../webpack.config.maker')({
    longTermCaching: true,
    minimize: true
  })
];
