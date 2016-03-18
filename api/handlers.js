function logErrors(err, req, res, next) {
  console.info('--------- logger start ---------');
  console.error(err);
  console.info('--------- logger end   ---------');
  next(err);
}

function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({
      error: 'Something failed!'
    });
  } else {
    next(err);
  }
}

function errorHandler(err, req, res, next) {
  res.status(500);
  res.send('something broke');
}

function ramdonError(req, res, next) {
  if (Math.random() < 0.2) {
    // Randomly fail to test error handling
    res.statusCode = 500;
    res.end('Random fail! (you may remove this code in your app)');
    return;
  }
  next();
}

function ramdonDelay(req, res, next) {
  setTimeout(next, 1000);
}

module.exports = {
  logErrors: logErrors,
  clientErrorHandler: clientErrorHandler,
  errorHandler: errorHandler,
  ramdonError: ramdonError,
  ramdonDelay: ramdonDelay
};
