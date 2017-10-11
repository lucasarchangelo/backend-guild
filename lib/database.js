// NPM packages
const mysql = require('mysql');
const logger = require('winston');

const Database = {

  conn: null,

  getUser: function (userId, callback) {
    Database.conn.query(
      'SELECT * FROM users WHERE id = ?',
      [userId],
      (err, results) => {
        if (err) {
          logger.error('[getUser] SQL error: ' + err);
          return callback(`SQL_ERROR=${err}`);
        }

        const user = {
          id: results[0].id,
          name: results[0].name,
        };

        callback(null, user);
      }
    );
  },

  createUser: function (user, callback) {

    Database.conn.query(
      'INSERT INTO users (name) VALUES (?)',
      [user.name],
      (err, result) => {
        if (err) {
          logger.error('[createUser] SQL error: ' + err);
          return callback(`SQL_ERROR=${err}`);
        }

        Database.getUser(result.insertId, (err, user) => {
          if (err) {
            logger.error(`error retrieving user, userId=${result.insertId}, error=${err}`);
            return callback(`SQL_ERROR=${err}`);
          }

          callback(null, user);

        });
      }
    );

  },

  updateUser: function (user, callback) {

    Database.conn.query(
      'UPDATE users SET name = ? WHERE id = ?',
      [user.name, user.id],
      (err, result) => {
        if (err) {
          logger.error('[updateUser] SQL error: ' + err);
          return callback(`SQL_ERROR=${err}`);
        }

        Database.getUser(user.id, (err, user) => {
          if (err) {
            logger.error(`error retrieving user, userId=${user.id}, error=${err}`);
            return callback(`SQL_ERROR=${err}`);
          }

          callback(null, user);

        });
      }
    );

  },

  deleteUser: function (userId, callback) {

    Database.conn.query(
      'DELETE FROM users WHERE id = ?',
      [userId],
      (err, result) => {
        if (err) {
          logger.error('[deleteUser] SQL error: ' + err);
          return callback(`SQL_ERROR=${err}`);
        }

        callback(null, null);
      }
    );

  },

  listAll: function (callback) {

    Database.conn.query(
      'SELECT * FROM users',
      [],
      (err, results) => {
        if (err) {
          logger.error('[listAll] SQL error: ' + err);
          return callback(`SQL_ERROR=${err}`);
        }

        const users = results.map(function (elem) {
          return {
            id: elem.id,
            name: elem.name,
          };
        });

        callback(null, users);
      }
    );

  },

};

let started = false;
module.exports = function () {

  if (started) {
    return Database;
  }

  // Specify connection credentials.
  Database.conn = mysql.createConnection({
    host: 'localhost',
    user: 'user',
    password: 'password',
    database: 'database',
  });

  // Connect to the database.
  Database.conn.connect(function (err) {
    if (err) {
      logger.error('Mysql connection error: ' + err.stack);
      return;
    }

    logger.info('Mysql connection succeeded.');
  });

  // Run a test query to make sure things are working.
  Database.conn.query('SELECT NOW();', function (error, results, fields) {
    if (error) {
      logger.error('Mysql test query error: ' + error);
      return;
    }

    logger.info('Mysql test query succeeded.');
  });

  return Database;

};
