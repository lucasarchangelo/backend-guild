const restifyErrors = require('restify-errors'),
logger = require('winston'),
bcrypt = require('bcryptjs'),
jwt = require('jsonwebtoken'),
$database = require('../model/user_database'),
$config = require('../config');

const GuildManagementServer = {

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

  // Auth Middlewares
    login: function (req, res, next) {
        const token = req.headers['x-access-token'];
        if (!token) {
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

                const token = jwt.sign({ id: user._id,  nome: user.nome, idpsn: user.idpsn, acesso: user.acesso }, $config.secret, { expiresIn: '7d' });
                res.send({ id: user._id, nome: user.nome, idpsn: user.idpsn, acesso: user.acesso, token: token });
                return next();
                });
            });
        } else{
            jwt.verify(token, $config.secret, (err, decodedToken) => {
                if (err) {
                return next(new restifyErrors.InternalServerError('Error on the server.'));
                }

                res.send({ id: decodedToken.id, nome: decodedToken.nome, idpsn: decodedToken.idpsn, acesso: decodedToken.acesso, token: token })
                return next();
            });
        }

    },

    verifyAdmToken: function (req, res, next) {
        const token = req.headers['x-access-token'];
        if (!token) {
            return next(new restifyErrors.ForbiddenError({ auth: false, message: 'No token provided.' }));
        }

        jwt.verify(token, $config.secret, (err, decodedToken) => {
            if (err) {
            return next(new restifyErrors.InternalServerError('Error on the server.'));
            }

            if (decodedToken.acesso < 2) {
            return next(new restifyErrors.ForbiddenError({ auth: false, message: 'Parcerao tu ta de tirassaum!' }));
            }

            req.userId = decodedToken.id;
            req.acesso = decodedToken.acesso;
            req.idpsn = decodedToken.idpsn;

            return next();
        });
    },

    verifyUserToken: function (req, res, next) {
        const token = req.headers['x-access-token'];
        if (!token) {
            return next(new restifyErrors.ForbiddenError({ auth: false, message: 'No token provided.' }));
        }

        jwt.verify(token, $config.secret, (err, decodedToken) => {
            if (err) {
            return next(new restifyErrors.InternalServerError('Error on the server.'));
            }

            if (decodedToken.acesso < 1) {
            return next(new restifyErrors.ForbiddenError({ auth: false, message: 'Parcerao tu ta de tirassaum!' }));
            }

            req.userId = decodedToken.id;
            req.acesso = decodedToken.acesso;
            req.idpsn = decodedToken.idpsn;

            return next();
        });
    },

    verifyUpdateToken: function (req, res, next) { // Novo metodo de seguranca, para passar a aceitar delecao de players por ADM
        const token = req.headers['x-access-token'];
        if (!token) {
            return next(new restifyErrors.ForbiddenError({ auth: false, message: 'No token provided.' }));
        }

        jwt.verify(token, $config.secret, (err, decodedToken) => {
            if (err) {
                return next(new restifyErrors.InternalServerError('Error on the server.'));
            }

            if (decodedToken.acesso < 2 && decodedToken.id != req.body.id) {
                return next(new restifyErrors.ForbiddenError({ auth: false, message: 'Parcerao tu ta de tirassaum!' }));
            }

            req.userId = decodedToken.id;
            req.acesso = decodedToken.acesso;
            req.idpsn = decodedToken.idpsn;

            return next();
        });
    },
};
module.exports = GuildManagementServer;