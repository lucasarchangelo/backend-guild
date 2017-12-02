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
        const eventBody = {
          name: req.body.name,
          detail: req.body.detail,
          gameName: req.body.gameName,
          date: req.body.date,
          limit: req.body.limit,
          creatorPlayer: req.userId,
          players: req.body.players,
        };
        $database.createEvent(eventBody, (err, data) => {
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
    includePlayerEvent: function (req, res, next) {
        if (!req.params.eventId) {
          return next(new restifyErrors.MissingParameterError(`missing parameter: 'eventId'`));
        }
        //Pegando o userId/email, que o metodo verifyToken coloca no request
        const updateBody = {
            id: req.params.eventId,
            userId: req.userId,
            idpsn: req.idpsn,
        };
        $database.includePlayerEvent(updateBody, (err, data) => {
          if (err) {
            logger.error(`error updating user, error=${err}`);
            return next(new restifyErrors.InternalServerError(`error updating event, error=${err}`));
          } else {
            res.send(data);
            return next();
          }
        });
    },
    exludePlayerEvent: function (req, res, next) {
        if (!req.params.eventId) {
          return next(new restifyErrors.MissingParameterError(`missing parameter: 'eventId'`));
        }
        //Pegando o userId/email, que o metodo verifyToken coloca no request
        const updateBody = {
            id: req.params.eventId,
            userId: req.userId,
        };
        $database.excludePlayerEvent(updateBody, (err, data) => {
          if (err) {
            logger.error(`error updating user, error=${err}`);
            return next(new restifyErrors.InternalServerError(`error updating event, error=${err}`));
          } else {
            res.send(data);
            return next();
          }
        });
    },

      deleteEvent: function (req, res, next) {
        if (!req.params.eventId) {
          return next(new restifyErrors.MissingParameterError(`missing parameter: 'eventId'`));
        }
        $database.deleteEvent(req.params.eventId, (err, data) => {
          if (err) {
            logger.error(`error deleting event, error=${err}`);
            return next(new restifyErrors.InternalServerError(`error creating event, error=${err}`));
          } else {
            res.send(data);
            return next();
          }
        });
    },
};
module.exports = EventManagementServer;