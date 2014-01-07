var express = require('express'),
  os = require('os'),
  log = require('../../log');

var init = function (app, sockets) {

  sockets.on('connection', function (socket) {

    socket.on('status:getStatus', function () {
      socket.emit('status:status', {
        process: {
          uptime: process.uptime(),
          argv: process.argv,
          execPath: process.execPath,
          execArgv: process.execArgv,
          version: process.version,
          versions: process.versions,
          config: process.config,
          title: process.title
        },
        os: {
          hostname: os.hostname(),
          type: os.type(),
          platform: os.platform(),
          arch: os.arch(),
          uptime: os.uptime(),
          loadavg: os.loadavg(),
          totalmem: os.totalmem(),
          freemem: os.freemem(),
          cpus: os.cpus(),
          networkInterfaces: os.networkInterfaces()
        }
      });
    });
  });

  

  app.use('/plugin/status', express.static(__dirname + '/public'));
};

exports.enabled = true;

exports.navigation = {
  title: 'Status',
  urlSegment: 'status'
};

exports.name = 'Status';
exports.version = '1.0.0';
exports.init = init;