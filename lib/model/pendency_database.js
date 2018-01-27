// NPM packages
const mongoose = require('mongoose'),
bcrypt = require('bcryptjs'),
logger = require('winston'),
schemas = require('./schemas');

const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/estudos';

mongoose.connect(mongoUrl);

const Pendency = mongoose.model('Pendency', schemas.PendencySchema);

const Database = {

    createPendency: function (pendency, callback) {
        new Pendency({
            name: pendency.name,
            game: pendency.game,
            weekly: pendency.weekly,
            players: pendency.players,
        }).save((err, pendency) => {
            if (err) {
              logger.error('[createPendency] error: ' + err);
              return callback(`ERROR=${err}`);
            }
            return callback(null, pendency);
        });
    },
    listByGame: function (listBody, callback) {

        Pendency.find({game: listBody.gameId, weekly: listBody.weekly},{},{sort:{ name: -1}}, (err, pendencies) => {
          if (err) {
            logger.error('[listAll] error: ' + err);
            return callback(`ERROR=${err}`);
          }
          return callback(null, pendencies);
        });
    },
    includePlayerPendency: function (pendency, callback) {
            Pendency.update({ _id: pendency.id }, { $addToSet: { players: { id: pendency.userId, idpsn: pendency.idpsn } } }, (err, res) => {
              if (err) {
                logger.error('[updatePendency] error: ' + err);
                return callback(`ERROR=${err}`);
              }
              return callback(null, res);
            });
    },
    excludePlayerPendency: function (pendency, callback) {
        Pendency.update({ _id: pendency.id }, { $pull: { players: { id: pendency.userId } } }, (err, res) => {
            if (err) {
              logger.error('[updatePendency] error: ' + err);
              return callback(`ERROR=${err}`);
            }
            return callback(null, res);
          });
    },
    deletePendency: function (pendencyId, callback) {
            Pendency.remove({ _id: pendencyId }, (err, res) => {
              if (err) {
                logger.error('[deletePendency] error: ' + err);
                return callback(`ERROR=${err}`);
              }
              return callback(null, res);
            });
    },

}

module.exports = Database;
