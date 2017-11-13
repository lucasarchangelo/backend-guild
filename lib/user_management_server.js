// NPM packages
const restifyErrors = require('restify-errors');
const logger = require('winston');

// Module packages
const Database = require('./database');
const Roles = require('./roles');

const UserManagementServer = {

  createUser: function (req, res, next) {

    if (!req.body.nome) {
      return next(new restifyErrors.MissingParameterError(`missing parameter: 'nome'`));
    }

    //Todo usuario que entra no sistema, iniciara seu acesso como membro, ate que um ADM altere o acesso.
    req.body.acesso = Roles.NEW;
    Database.createUser(req.body, (err, data) => {

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
    Database.listAll((err, data) => {

      if (err) {
        logger.error(`error listing all players, error=${err}`);
        return next(new restifyErrors.InternalServerError(`error listing all players, error=${err}`));
      } else {
        res.send(data);
        return next();
      }
    });
  },

  updatePlayerRole: function (userId, roleId, callback) {
    const updateBody = {
      id: userId,
      acesso: roleId,
    };

    Database.updateUser(updateBody, (err, data) => {
      if (err) {
        return callback(`error updating new user, error=${err}`);
      } else {
        return callback(null, data);
      }
    });
  },

  updatePlayerToMember: function (req, res, next) {
    if (!req.params.userId) {
      return next(new restifyErrors.MissingParameterError(`missing parameter: 'userId'`));
    }

    UserManagementServer.updatePlayerRole(req.body.id, Roles.MEMBER, (err, data) => {
      if (err) {
        logger.error(err);
        return next(restifyErrors.InternalServerError(err));
      } else {
        res.send(data);
        return next(null);
      }
    });
  },

  updatePlayerToAdm: function (req, res, next) {
    if (!req.params.userId) {
      return next(new restifyErrors.MissingParameterError(`missing parameter: 'userId'`));
    }

    UserManagementServer.updatePlayerRole(req.body.id, Roles.ADMIN, (err, data) => {
      if (err) {
        logger.error(err);
        return next(restifyErrors.InternalServerError(err));
      } else {
        res.send(data);
        return next(null);
      }
    });
  },

  /*
    updateUser: function (req, res, next) {

      if (!req.body.name) {
        return next(new restifyErrors.MissingParameterError(`missing parameter: 'name'`));
      }

      req.body.id = req.params.userId;

      Database.updateUser(req.body, (err, data) => {

        if (err) {
          logger.error(`error updating new user, error=${err}`);
          return next(new restifyErrors.InternalServerError(`error updating new user, error=${err}`));
        } else {
          res.send(data);
          return next();
        }

      });

    },

    deleteUser: function (req, res, next) {

      Database.deleteUser(req.params.userId, (err, data) => {

        if (err) {
          logger.error(`error deleting new user, error=${err}`);
          return next(new restifyErrors.InternalServerError(`error creating deleting user, error=${err}`));
        } else {
          res.send(data);
          return next();
        }

      });

    },

    listAll: function (req, res, next) {

      Database.listAll((err, data) => {

        if (err) {
          logger.error(`error deleting new user, error=${err}`);
          return next(new restifyErrors.InternalServerError(`error creating deleting user, error=${err}`));
        } else {
          res.send(data);
          return next();
        }

      });

    },
  */
};
module.exports = UserManagementServer;
