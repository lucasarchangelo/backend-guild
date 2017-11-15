// NPM packages
const mongoose = require('mongoose'),
      logger   = require('winston'),
      schemas  = require('./schemas');

mongoose.connect('mongodb://localhost:27017/estudos');

const User = mongoose.model('User', schemas.UserSchema);

const Database = {

  createUser: function (user, callback) {

    new User({
      nome: user.nome,
      idpsn: user.idpsn,
      dataNasc: user.dataNasc,
      dataClan: user.dataClan,
      cidade: user.cidade,
      jogos: user.jogos,
      email: user.email,
      password: user.password,
      acesso: user.acesso,
    }).save((err) => {
      if (err) {
        logger.error('[createPlayer] error: ' + err);
        return callback(`ERROR=${err}`);
      }

      return callback(null, user);
    });

  },

  listAll: function (callback) {

    User.find({}, (err, users) => {
      if (err) {
        logger.error('[listAll] error: ' + err);
        return callback(`ERROR=${err}`);
      }

      return callback(null, users);
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

    User.update({ _id: user.id }, { acesso: user.acesso }, (err, res) => {
      if (err) {
        logger.error('[UpdatePlayer] error: ' + err);
        return callback(`ERROR=${err}`);
      }

      return callback(null, res);
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
