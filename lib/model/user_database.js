// NPM packages
const mongoose = require('mongoose'),
  bcrypt = require('bcryptjs'),
  logger = require('winston'),
  schemas = require('./schemas');

const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/estudos';

mongoose.connect(mongoUrl);

const User = mongoose.model('User', schemas.UserSchema);

const Database = {

  createUser: function (user, callback) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return callback(err);
      }
      bcrypt.hash(user.password, salt, (err, hashedPassword) => {
        if (err) {
          return callback(err);
        }

        new User({
          nome: user.nome,
          idpsn: user.idpsn,
          dataNasc: user.dataNasc,
          dataClan: user.dataClan,
          cidade: user.cidade,
          jogos: user.jogos,
          email: user.email,
          password: hashedPassword,
          //acesso: user.acesso, We can`t create user with acesso != 0, so thats why I`m cutting that line off.
        }).save((err) => {
          if (err) {
            logger.error('[createPlayer] error: ' + err);
            return callback(`ERROR=${err}`);
          }
          return callback(null, user);
        });

      });
    });
  },

  listAll: function (callback) {
    User.find({},{},{ sort:{ acesso: 1}}, (err, users) => {
      if (err) {
        logger.error('[listAll] error: ' + err);
        return callback(`ERROR=${err}`);
      }
      return callback(null, users);
    });
  },

  findOne: function (user, callback) {
    User.find({ user }, { password: false }).toArray((err, res) => {
      if (err) {
        logger.error('[findOne] error: ' + err);
        return callback(`ERROR=${err}`);
      }
      return callback(null, res);
    });
  },

  findUserByEmail: function (email, callback) {
    User.findOne({ email: email }, (err, user) => {
      if (err) {
        logger.error('[findByEmail] error: ' + err);
        return callback(`ERROR=${err}`);
      }
      return callback(null, user);
    });
  },

  updateUser: function (user, callback) {
    User.update({ _id: user.id }, { acesso: user.acesso }, (err, res) => {
      if (err) {
        logger.error('[updateUser] error: ' + err);
        return callback(`ERROR=${err}`);
      }
      return callback(null, res);
    });

  },

  deleteUser: function (userId, callback) {
    User.remove({ _id: userId }, (err, res) => {
      if (err) {
        logger.error('[deleteUser] error: ' + err);
        return callback(`ERROR=${err}`);
      }
      return callback(null, res);
    });

  },
};

module.exports = Database;