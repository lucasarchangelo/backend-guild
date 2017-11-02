// NPM packages
var mongo = require('mongodb');
const logger = require('winston');


var MongoClient = mongo.MongoClient;
var url = "mongodb://localhost:27017/estudos";

const Database = {

  createUser: function (user, callback) {
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      db.collection("players").insertOne(user, function(err, res) {
        if (err) {
          logger.error('[createPlayer] error: ' + err);
          return callback(`ERROR=${err}`);
        }
        db.close();
        callback(null, user);
      });
    });
  }
};

module.exports = Database;
