const restifyErrors = require('restify-errors'),
  logger = require('winston'),
  bcrypt = require('bcryptjs'),
  jwt = require('jsonwebtoken'),
  $database = require('./database'),
  $config = require('./config');

const UserManagementServer = {

  // Auth Middlewares
  login: function (req, res, next) {

    $database.findUserByEmail(req.body.email, (err, user) => {
      if (err) {
        return next(new restifyErrors.InternalServerError('Error on the server.'));
      }

      if (!user) {
        return next(new restifyErrors.NotFoundError('No user found.'));
      }

      bcrypt.compare(req.body.password, user.password, (err, valid) => {
        if (err) {
          return next(new restifyErrors.InternalServerError('Error on the server.'));
        }

        if (!valid) {
          return next(new restifyErrors.UnauthorizedError({ auth: false, token: null }));
        }

        const token = jwt.sign({ id: user._id, acesso: user.acesso }, $config.secret, { expiresIn: 86400 });
        res.send({ acesso: user.acesso, token: token });
        return next();
      });
    });

  },

  verifyToken: function (req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) {
      return next(new restifyErrors.ForbiddenError({ auth: false, message: 'No token provided.' }));
    }

    jwt.verify(token, $config.secret, (err, decodedToken) => {
      if (err) {
        return next(new restifyErrors.InternalServerError('Error on the server.'));
      }

      if (decodedToken.acesso < 1) {
        return next(new restifyErrors.ForbiddenError({ auth: false, message: 'Parcerao tu ta tirassaum!' }));
      }

      req.userId = decodedToken.id;
      req.acesso = decodedToken.acesso;

      return next();
    });
  },

  createUser: function (req, res, next) {

    if (!req.body.nome) {
      return next(new restifyErrors.MissingParameterError(`missing parameter: 'nome'`));
    }
    $database.createUser(req.body, (err, data) => {
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

  /*
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

    UserManagementServer.updatePlayerRole(req.params.userId, Roles.ADMIN, (err, data) => {
      if (err) {
        logger.error(err);
        return next(restifyErrors.InternalServerError(err));
      } else {
        res.send(data);
        return next(null);
      }
    });
  },
  */
};
module.exports = UserManagementServer;
