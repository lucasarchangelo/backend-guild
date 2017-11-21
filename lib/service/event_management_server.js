const restifyErrors = require('restify-errors'),
logger = require('winston'),
bcrypt = require('bcryptjs'),
jwt = require('jsonwebtoken'),
$database = require('../model/event_database'),
$config = require('../config');

const EventManagementServer = {
    createUser: function (req, res, next) {
        if (!req.body.name) {
          return next(new restifyErrors.MissingParameterError(`missing parameter: 'name'`));
        }
        $database.createEvent(req.body, (err, data) => {
          if (err) {
            logger.error(`error creating new user, error=${err}`);
            return next(new restifyErrors.InternalServerError(`error creating new user, error=${err}`));
          } else {
            res.send(data);
            return next();
          }
        });
    },
    listAll: function (req, res, next) {
        $database.listAll((err, data) => {
          if (err) {
            logger.error(`error listing all players, error=${err}`);
            return next(new restifyErrors.InternalServerError(`error listing all players, error=${err}`));
          } else {
            res.send(data);
            return next();
          }
        });
      },
    updateEvent: function (req, res, next) {
        if (!req.userId) {
          return next(new restifyErrors.MissingParameterError(`missing parameter: 'userId'`));
        }
        //Pegando o userId, que o metodo verifyToken coloca no request
        const updateBody = {
            id: req.body.eventId,
            players: req.userId,
        };
        $database.updateEvent(updateBody, (err, data) => {
          if (err) {
            logger.error(`error updating user, error=${err}`);
            return next(new restifyErrors.InternalServerError(`error updating user, error=${err}`));
          } else {
            res.send(data);
            return next();
          }
        });
      },
};
module.exports = EventManagementServer;