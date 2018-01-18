// NPM packages
const mongoose = require('mongoose'),
bcrypt = require('bcryptjs'),
logger = require('winston'),
schemas = require('./schemas');

const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/estudos';

mongoose.connect(mongoUrl);

const Game = mongoose.model('Game', schemas.GameSchema);

const Database = {

    createGame: function (game, callback) {
        new Game({
            name: game.name,
          }).save((err) => {
            if (err) {
              logger.error('[createGame] error: ' + err);
              return callback(`ERROR=${err}`);
            }
            return callback(null, game);
          });
    },

    listAll: function (callback) {
        Game.find({},{},{}, (err, game) => {
          if (err) {
            logger.error('[listAllGame] error: ' + err);
            return callback(`ERROR=${err}`);
          }
          return callback(null, game);
        });
    },

    deleteGame: function (gameId, callback) {
        Game.remove({ _id: gameId }, (err, res) => {
          if (err) {
            logger.error('[deleteUser] error: ' + err);
            return callback(`ERROR=${err}`);
          }
          return callback(null, res);
        });
    },
}

module.exports = Database;

