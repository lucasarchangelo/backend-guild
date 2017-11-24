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
            date: event.date,
            creatorPlayer: event.creatorPlayer,
            players: event.players,
          }).save((err) => {
            if (err) {
              logger.error('[createEvent] error: ' + err);
              return callback(`ERROR=${err}`);
            }
            return callback(null, event);
          });
    },
    listAll: function (callback) {
        Event.find({}, (err, event) => {
            if (err) {
            logger.error('[listAll] error: ' + err);
            return callback(`ERROR=${err}`);
            }
            return callback(null, event);
        });
    },
    updateEvent: function (event, callback) {
        Event.update({ _id: event.id }, { $addToSet: { players: { id: event.userId, idpsn: event.idpsn } } }, (err, res) => {
          if (err) {
            logger.error('[updateUser] error: ' + err);
            return callback(`ERROR=${err}`);
          }
          return callback(null, res);
        });
    },
    deleteEvent: function (eventId, callback) {
        User.remove({ _id: eventId }, (err, res) => {
          if (err) {
            logger.error('[deleteEvent] error: ' + err);
            return callback(`ERROR=${err}`);
          }
          return callback(null, res);
        });
    },
};

module.exports = Database;