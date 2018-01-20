const restifyErrors = require('restify-errors'),
logger = require('winston'),
bcrypt = require('bcryptjs'),
jwt = require('jsonwebtoken'),
$database = require('../model/pendency_database'),
$config = require('../config');

const PendencyManagementServer = {

    createPendency: function (req, res, next) {
        if (!req.body.name) {
          return next(new restifyErrors.MissingParameterError(`missing parameter: 'name'`));
        }
        const pendencyBody = {
          name: req.body.name,
          game: req.body.game,
          weekly: req.body.weekly,
          players: req.body.players,
        };
        $database.createPendency(pendencyBody, (err, data) => {
          if (err) {
            logger.error(`error creating new event, error=${err}`);
            return next(new restifyErrors.InternalServerError(`error creating new event, error=${err}`));
          } else {
            res.send(data);
            return next();
          }
        });
    },

    listByGame: function (req, res, next) {
        $database.listByGame(req.params.gameId, (err, data) => {
          if (err) {
            logger.error(`error listing all events, error=${err}`);
            return next(new restifyErrors.InternalServerError(`error listing all events, error=${err}`));
          } else {
            res.send(data);
            return next();
          }
        });
    },

    includePlayerPendency: function (req, res, next) {
        if (!req.params.pendencyId) {
          return next(new restifyErrors.MissingParameterError(`missing parameter: 'pendencyId'`));
        }
        //Pegando o userId/email, que o metodo verifyToken coloca no request
        const updateBody = {
            id: req.params.pendencyId,
            userId: req.userId,
            idpsn: req.idpsn,
        };
        $database.includePlayerPendency(updateBody, (err, data) => {
          if (err) {
            logger.error(`error updating Pendency, error=${err}`);
            return next(new restifyErrors.InternalServerError(`error updating Pendency, error=${err}`));
          } else {
            res.send(data);
            return next();
          }
        });
    },
    excludePlayerPendency: function (req, res, next) {
        if (!req.params.pendencyId) {
          return next(new restifyErrors.MissingParameterError(`missing parameter: 'pendencyId'`));
        }
        //Pegando o userId/email, que o metodo verifyToken coloca no request
        const updateBody = {
            id: req.params.pendencyId,
            userId: req.userId,
        };
        $database.excludePlayerPendency(updateBody, (err, data) => {
          if (err) {
            logger.error(`error updating pendency, error=${err}`);
            return next(new restifyErrors.InternalServerError(`error updating pendency, error=${err}`));
          } else {
            res.send(data);
            return next();
          }
        });
    },

    deletePendency: function (req, res, next) {
      if (!req.params.pendencyId) {
        return next(new restifyErrors.MissingParameterError(`missing parameter: 'pendencyId'`));
      }
      $database.deletePendency(req.params.pendencyId, (err, data) => {
        if (err) {
          logger.error(`error deleting pendency, error=${err}`);
          return next(new restifyErrors.InternalServerError(`error deleting pendency, error=${err}`));
        } else {
          res.send(data);
          return next();
        }
      });
  },

}

module.exports = PendencyManagementServer;

