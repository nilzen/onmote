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
      	'level': 'info',
      	'maxsize': 10485760,
      	'maxFiles': 10,
      	'json': false,
      	'filename': 'onmote.log'
      })
    ]
});

module.exports=logger;