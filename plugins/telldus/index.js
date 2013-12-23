var _ = require('underscore'),
  express = require('express'),
  log = require('../../log'),
  telldus = require('telldus');

var getDevices = function(cb) {

  telldus.getDevices(function(err, devices) {

    for (var i = devices.length - 1; i >= 0; i--) {
      if (devices[i].methods.indexOf('DIM') > -1) {
        devices[i].renderer = 'dimmer';
      } else {
        devices[i].renderer = 'switch';
      }
    }

    cb(devices);
  });
};

var getDeviceById = function(id, cb) {

  if (isNaN(id)) {
    cb({ error: 'Invalid id "' + id + '".' });
  } else {

    getDevices(function(devices) {

      id = parseInt(id, 10);

      var device = _.findWhere(devices, { id: id });

      if (_.isUndefined(device)) {
        cb({ error: { message:  'No device with id "' + id + '" found.' } });
      } else {
        cb(device);
      }
    });
  }
};

var validateResponse = function(error, cb) {
  if (error) {
    cb({ status: 'error', error: error });
  } else {
    cb({ status: 'ok' });
  }
}
var sendCommand = function(id, command, value, cb) {

  getDeviceById(id, function(device) {

    // device not found
    if (device.error) {
      cb(device);
    }

    // off
    if (command === 'off') {

      telldus.turnOff(id, function(error) {
        validateResponse(error, cb);
      });

    // on
    } else if (command === 'on') {

      telldus.turnOn(id, function(error) {
        validateResponse(error, cb);
      });

    // dim
    } else if (command === 'dim') {

      var level = parseInt(value, 10);

      telldus.dim(device.id, level, function(error) {
        validateResponse(error, cb);
      });

    // unknown command
    } else {
      cb({ error: { message: 'Unknown command "' + command } });
    }
  });
};

var init = function(app, sockets) {

  sockets.on('connection', function (socket) {

    getDevices(function(response) {
      log.verbose('[telldus]', 'telldus:devices', JSON.stringify(response));
      socket.emit('telldus:devices', response);
    });

    socket.on('telldus:getDevices', function () {
      getDevices(function(response) {
        log.verbose('[telldus]', 'telldus:devices', JSON.stringify(response));
        socket.emit('telldus:devices', response);
      });
    });

    socket.on('telldus:getDevice', function (data) {
      getDeviceById(data.id, function(response) {
        log.verbose('[telldus]', 'telldus:device', JSON.stringify(response));
        socket.emit('telldus:device', response);
      });
    });

    socket.on('telldus:sendCommand', function (data) {
      sendCommand(data.id, data.command, data.value, function(response) {
        log.verbose('[telldus]', 'telldus:sendCommand', JSON.stringify(response));
        socket.emit('telldus:command', response);

        getDevices(function(response) {
          log.verbose('[telldus]', 'telldus:devices', JSON.stringify(response));
          sockets.emit('telldus:devices', response);
        });
      });
    });

  });

  app.use('/telldus', express.static(__dirname + '/public'));
};

exports.enabled = true;
exports.name = 'Telldus';
exports.version = '1.0.0';
exports.init = init;