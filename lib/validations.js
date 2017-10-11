// NPM packages
const restifyErrors = require('restify-errors');
const logger = require('winston');

const Validations = {

  enforceContentType: function (req, res, next) {

    if (req.is('application/json')) {
      return next();
    }

    logger.warn(`'dropping request due to unsupported media type: '${req.header('Content-Type')}'`);
    const err = new restifyErrors.UnsupportedMediaTypeError(`Unsupported Media Type: '${req.header('Content-Type')}'`);
    next(err);

  },

};

module.exports = Validations;
