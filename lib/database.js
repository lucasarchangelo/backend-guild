// NPM packages
const mongo = require('mongodb');
const logger = require('winston');

const ObjectId = mongo.ObjectId;
const MongoClient = mongo.MongoClient;
const url = 'mongodb://localhost:27017/estudos';

const Database = {

  createUser: function (user, callback) {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      db.collection('players').insertOne(user, function (err, res) {
        if (err) {
          logger.error('[createPlayer] error: ' + err);
          return callback(`ERROR=${err}`);
        }

        db.close();
        callback(null, user);
      });
    });
  },

  listAll: function (callback) {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      db.collection('players').find({}, { password: false }).toArray(function (err, res) {
        if (err) {
          logger.error('[listAll] error: ' + err);
          return callback(`ERROR=${err}`);
        }

        db.close();
        callback(null, res);
      });
    });
  },

  findOne: function (user, callback) {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      db.collection('players').findOne({ user }, { password: false }).toArray(function (err, res) {
        if (err) {
          logger.error('[listAll] error: ' + err);
          return callback(`ERROR=${err}`);
        }

        db.close();
        callback(null, res);
      });
    });
  },

  updateUser: function (user, callback) {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      const myquery = { _id: new ObjectId(user.id) };
      const newvalues = { $set: { acesso: user.acesso } };
      console.log(myquery);
      console.log(newvalues);
      db.collection('players').updateOne(myquery, newvalues, function (err, res) {
        if (err) {
          logger.error('[UpdatePlayer] error: ' + err);
          return callback(`ERROR=${err}`);
        }

        console.log('1 document updated');
        db.close();
        callback(null, res);
      });
    });
  },

  deleteUser: function (userId, callback) {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      const myquery = { _id: new ObjectId(userId) };
      db.collection('players').deleteOne(myquery, function (err, res) {
        if (err) {
          logger.error('[DeletePlayer] error: ' + err);
          return callback(`ERROR=${err}`);
        }
        console.log('1 document deleted');
        db.close();
        callback(null, res);
      });
    });
  },

};

module.exports = Database;
