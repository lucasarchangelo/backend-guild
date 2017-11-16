// NPM packages
const restify = require('restify');
const corsMiddleware = require('restify-cors-middleware');

// Module packages
const UserManagementServer = require('./lib/user_management_server');
const Validations = require('./lib/validations');
const logger = require('./lib/log');

const server = restify.createServer({
  name: 'UserManagementServer',
  version: '1.0.0',
});

const cors = corsMiddleware({
  origins: ['https://portal-guild.herokuapp.com', 'http://localhost:4200'],
  allowHeaders: ['API-Token', 'Access-Control-Allow-Headers', 'x-access-token'],
  exposeHeaders: ['API-Token-Expiry'],
});

server.pre(cors.preflight);
server.use(cors.actual);
server.use(restify.plugins.acceptParser(['application/json']));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
server.use(Validations.enforceContentType);

server.post('/users/login', UserManagementServer.login);
server.get('/users', UserManagementServer.verifyToken, UserManagementServer.listAll);
server.post('/users', UserManagementServer.createUser);
server.del('/users/:userId',  UserManagementServer.verifyToken, UserManagementServer.deleteUser);
server.put('/users/:userId/:roleId', UserManagementServer.verifyToken, UserManagementServer.updatePlayerRole);
//server.put('/users/member/:userId', UserManagementServer.updatePlayerToMember);
//server.put('/users/adm/:userId', UserManagementServer.updatePlayerToAdm);
//server.put('/users/:userId', UserManagementServer.updateUser);


server.listen(process.env.PORT || 5000, function () {
  logger.info('%s listening at %s', server.name, server.url);
});
