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
        /*
        if (!req.params.userId) {
          return next(new restifyErrors.MissingParameterError(`missing parameter: 'userId'`));
        }
        if (!req.params.roleId) {
          return next(new restifyErrors.MissingParameterError(`missing parameter: 'roleId'`));
        }
        const updateBody = {
          player: req.params.roleId,
        };

        Pegar o NumberID do token da requisicao e incluir na lista de eventos
        */
        $database.updateEvent(numberId, (err, data) => {
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