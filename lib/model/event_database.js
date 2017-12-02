// NPM packages
const mongoose = require('mongoose'),
bcrypt = require('bcryptjs'),
logger = require('winston'),
schemas = require('./schemas');

const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/estudos';

mongoose.connect(mongoUrl);

const Event = mongoose.model('Event', schemas.EventSchema);

const Database = {
  createEvent: function (event, callback) {
    new Event({
        name: event.name,
        detail: event.detail,
        gameName: event.gameName,
        date: event.date,
        limit: event.limit,
        creatorPlayer: event.creatorPlayer,
        players: event.players,
    }).save((err, event) => {
        if (err) {
          logger.error('[createEvent] error: ' + err);
          return callback(`ERROR=${err}`);
        }
        return callback(null, event);
    });
  },
  listAll: function (callback) {
        Event.find({},{},{ sort:{ date: -1}}, (err, event) => {
            if (err) {
            logger.error('[listAll] error: ' + err);
            return callback(`ERROR=${err}`);
            }
            return callback(null, event);
        });
  },
  includePlayerEvent: function (event, callback) {
        Event.update({ _id: event.id }, { $addToSet: { players: { id: event.userId, idpsn: event.idpsn } } }, (err, res) => {
          if (err) {
            logger.error('[updateUser] error: ' + err);
            return callback(`ERROR=${err}`);
          }
          return callback(null, res);
        });
    },
  excludePlayerEvent: function (event, callback) {
      Event.update({ _id: event.id }, { $pull: { players: { id: event.userId } } }, (err, res) => {
        if (err) {
          logger.error('[updateUser] error: ' + err);
          return callback(`ERROR=${err}`);
        }
        return callback(null, res);
      });
  },
    deleteEvent: function (eventId, callback) {
      Event.remove({ _id: eventId }, (err, res) => {
          if (err) {
            logger.error('[deleteEvent] error: ' + err);
            return callback(`ERROR=${err}`);
          }
          return callback(null, res);
        });
    },
};

module.exports = Database;