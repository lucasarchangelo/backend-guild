const winston = require('winston');

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console,
  {
    level: 'debug',
    colorize: true,
    timestamp: () => new Date().toLocaleString(),
  }
);

module.exports = winston;
