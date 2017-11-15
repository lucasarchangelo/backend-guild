// NPM packages
const restify = require('restify');
const corsMiddleware = require('restify-cors-middleware');
const verifyToken = require('./verifyToken');

// Module packages
const UserManagementServer = require('./lib/user_management_server');
const Validations = require('./lib/validations');
const logger = require('./lib/log');
const authController = require('./auth/authController');

const server = restify.createServer({
  name: 'UserManagementServer',
  version: '1.0.0',
});

const cors = corsMiddleware({
  origins: ['http://localhost:4200'],
  allowHeaders: ['API-Token'],
  exposeHeaders: ['API-Token-Expiry'],
});

server.use('/users/auth', authController);
server.pre(cors.preflight);
server.use(cors.actual);
server.use(restify.plugins.acceptParser(['application/json']));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
server.use(Validations.enforceContentType);

server.get('/users', verifyToken, UserManagementServer.listAll);
server.post('/users', UserManagementServer.createUser);
server.del('/users/:userId',  verifyToken, UserManagementServer.deleteUser);
server.put('/users/:userId/:roleId', verifyToken, UserManagementServer.updatePlayerRole);
//server.put('/users/member/:userId', UserManagementServer.updatePlayerToMember);
//server.put('/users/adm/:userId', UserManagementServer.updatePlayerToAdm);
//server.put('/users/:userId', UserManagementServer.updateUser);


server.listen(8080, function () {
  logger.info('%s listening at %s', server.name, server.url);
});
