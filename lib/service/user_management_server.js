const restifyErrors = require('restify-errors'),
  logger = require('winston'),
  bcrypt = require('bcryptjs'),
  jwt = require('jsonwebtoken'),
  $database = require('../model/user_database'),
  $config = require('../config');

const UserManagementServer = {

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

  updatePlayerRole: function (req, res, next) {
    if (!req.params.userId) {
      return next(new restifyErrors.MissingParameterError(`missing parameter: 'userId'`));
    }

    if (!req.params.roleId) {
      return next(new restifyErrors.MissingParameterError(`missing parameter: 'roleId'`));
    }

    const updateBody = {
      id: req.params.userId,
      acesso: req.params.roleId,
    };

    $database.updateUser(updateBody, (err, data) => {
      if (err) {
        logger.error(`error updating user, error=${err}`);
        return next(new restifyErrors.InternalServerError(`error updating user, error=${err}`));
      } else {
        res.send(data);
        return next();
      }
    });
  },

  deleteUser: function (req, res, next) {

    if (!req.params.userId) {
      return next(new restifyErrors.MissingParameterError(`missing parameter: 'userId'`));
    }

    $database.deleteUser(req.params.userId, (err, data) => {
      if (err) {
        logger.error(`error deleting new user, error=${err}`);
        return next(new restifyErrors.InternalServerError(`error creating deleting user, error=${err}`));
      } else {
        res.send(data);
        return next();
      }
    });
  },
};
module.exports = UserManagementServer;
