var passport = require('passport');

module.exports = function(app) {
  app.use('/search',
    require('./search.server.router'));

  app.use('/',
    passport.authenticate('bearer', {
      session: false
    }),
    require('./resource.server.router'));
};
