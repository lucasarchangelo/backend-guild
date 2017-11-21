const restifyErrors = require('restify-errors'),
logger = require('winston'),
bcrypt = require('bcryptjs'),
jwt = require('jsonwebtoken'),
$database = require('../model/event_database'),
$config = require('../config');

const EventManagementServer = {
    createEvent: function (req, res, next) {
        if (!req.body.name) {
          return next(new restifyErrors.MissingParameterError(`missing parameter: 'name'`));
        }
        $database.createEvent(req.body, (err, data) => {
          if (err) {
            logger.error(`error creating new event, error=${err}`);
            return next(new restifyErrors.InternalServerError(`error creating new event, error=${err}`));
          } else {
            res.send(data);
            return next();
          }
        });
    },
    listAll: function (req, res, next) {
        $database.listAll((err, data) => {
          if (err) {
            logger.error(`error listing all events, error=${err}`);
            return next(new restifyErrors.InternalServerError(`error listing all events, error=${err}`));
          } else {
            res.send(data);
            return next();
          }
        });
      },
    updateEvent: function (req, res, next) {
        if (!req.params.eventId) {
          return next(new restifyErrors.MissingParameterError(`missing parameter: 'eventId'`));
        }
        //Pegando o userId/email, que o metodo verifyToken coloca no request
        const updateBody = {
            id: req.params.eventId,
            userId: req.userId,
            email: req.email,
        };
        $database.updateEvent(updateBody, (err, data) => {
          if (err) {
            logger.error(`error updating user, error=${err}`);
            return next(new restifyErrors.InternalServerError(`error updating event, error=${err}`));
          } else {
            res.send(data);
            return next();
          }
        });
      },
};
module.exports = EventManagementServer;