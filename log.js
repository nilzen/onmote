var winston = require('winston');

var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({
      	'timestamp': true,
      	'level': 'info',
      	'colorize': true
      }),

      new (winston.transports.File)({
      	'timestamp': true,
      	'level': 'verbose',
      	'maxsize': 10485760,
      	'maxFiles': 1,
      	'json': false,
      	'filename': 'onmote.log'
      })
    ]
});

module.exports = logger;