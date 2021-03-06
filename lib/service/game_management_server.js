const restifyErrors = require('restify-errors'),
logger = require('winston'),
bcrypt = require('bcryptjs'),
jwt = require('jsonwebtoken'),
$database = require('../model/game_database'),
$config = require('../config');

const GameManagementServer = {

    createGame: function (req, res, next) {
        if (!req.body.name) {
          return next(new restifyErrors.MissingParameterError(`missing parameter: 'name'`));
        }

        const gameBody = {
          name: req.body.name,
          resetDay: req.body.resetDay,
        };
        $database.createGame(gameBody, (err, data) => {
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

    deleteGame: function (req, res, next) {

        if (!req.params.gameId) {
          return next(new restifyErrors.MissingParameterError(`missing parameter: 'userId'`));
        }
        $database.deleteGame(req.params.gameId, (err, data) => {
          if (err) {
            logger.error(`error deleting new user, error=${err}`);
            return next(new restifyErrors.InternalServerError(`error creating deleting user, error=${err}`));
          } else {
            res.send(data);
            return next();
          }
        });
    },
}

module.exports = GameManagementServer;