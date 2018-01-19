// NPM packages
const restify = require('restify');
const corsMiddleware = require('restify-cors-middleware');

// Module packages
const UserManagementServer = require('./lib/service/user_management_server');
const GuildManagementServer = require('./lib/service/guild_management_server');
const EventManagementServer = require('./lib/service/event_management_server');
const GameManagementServer = require('./lib/service/game_management_server');
const PendencyManagementServer = require('./lib/service/pendency_management_server');
const Validations = require('./lib/validations');
const logger = require('./lib/log');

const server = restify.createServer({
  name: 'GuildManagementServer',
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

//Guild ( no security )
server.post('guild/login', GuildManagementServer.login);
server.post('guild/users', GuildManagementServer.createUser);

//Users
server.get('guild/users', GuildManagementServer.verifyAdmToken, UserManagementServer.listAll);
server.del('guild/users/:userId',  GuildManagementServer.verifyAdmToken, UserManagementServer.deleteUser);
server.put('guild/users/:userId/:roleId', GuildManagementServer.verifyAdmToken, UserManagementServer.updatePlayerRole);

//Events
server.post('guild/events', GuildManagementServer.verifyUserToken, EventManagementServer.createEvent);
server.get('guild/events', GuildManagementServer.verifyUserToken, EventManagementServer.listAll);
server.del('guild/events/:eventId', GuildManagementServer.verifyUserToken, EventManagementServer.deleteEvent);
server.put('guild/events/:eventId/subscribe', GuildManagementServer.verifyUserToken, EventManagementServer.includePlayerEvent);
server.put('guild/events/:eventId/unsubscribe', GuildManagementServer.verifyUserToken, EventManagementServer.exludePlayerEvent);

//Game
server.post('guild/games', GuildManagementServer.verifyAdmToken, GameManagementServer.createGame);
server.get('guild/games', GuildManagementServer.verifyUserToken, GameManagementServer.listAll);
server.del('guild/games/:gameId',  GuildManagementServer.verifyAdmToken, GameManagementServer.deleteGame);

//Pendency
server.post('guild/pendencies', GuildManagementServer.verifyAdmToken, PendencyManagementServer.createPendency);
server.get('guild/pendencies/:gameId', GuildManagementServer.verifyUserToken, PendencyManagementServer.listByGame);
server.del('guild/pendencies/:pendencyId', GuildManagementServer.verifyAdmToken, PendencyManagementServer.deletePendency);
server.put('guild/pendencies/:pendencyId/subscribe', GuildManagementServer.verifyUserToken, PendencyManagementServer.includePlayerPendency);
server.put('guild/pendencies/:pendencyId/unsubscribe', GuildManagementServer.verifyUserToken, PendencyManagementServer.excludePlayerPendency);

server.listen(process.env.PORT || 5000, function () {
  logger.info('%s listening at %s', server.name, server.url);
});
