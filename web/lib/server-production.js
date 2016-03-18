process.env.NODE_ENV = 'production';

require('./server')({
  defaultPort: 8500
});
