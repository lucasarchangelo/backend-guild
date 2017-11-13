// NPM packages
const restifyErrors = require('restify-errors');
const logger = require('winston');

// Module packages
const Database = require('./database');

const UserManagementServer = {

  createUser: function (req, res, next) {

    if (!req.body.nome) {
      return next(new restifyErrors.MissingParameterError(`missing parameter: 'nome'`));
    }
    //Todo usuario que entra no sistema, iniciara seu acesso como membro, ate que um ADM altere o acesso.
    req.body.acesso = "0";
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

  updatePlayerToMember: function (req, res, next) {
        if (!req.params.userId) {
          return next(new restifyErrors.MissingParameterError(`missing parameter: 'userId'`));
        }
        console.log(req.params);
        req.body.id = req.params.userId;
        req.body.acesso = "1";
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

  updatePlayerToAdm: function (req, res, next) {
    if (!req.params.userId) {
      return next(new restifyErrors.MissingParameterError(`missing parameter: 'userId'`));
    }
    req.body.id = req.params.userId;
    req.body.acesso = "2";
    Database.updateUser(req.body, (err, data) => {
      if (err) {
        logger.error(`error updating new user, error=${err}`);
        return next(new restifyErrors.InternalServerError(`error updating user, error=${err}`));
      } else {
        res.send(data);
        return next();
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