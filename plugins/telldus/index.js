var _ = require('underscore'),
  express = require('express'),
  log = require('../../log'),
  telldus = require('telldus'),
  devices;

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
}

var sendCommand = function(id, command, value, cb) {

  var device = getDeviceById(id, function(device) {

    // device not found
    if (device.error) {
      cb(device);
    }

    // off
    if (command === 'off') {

      if (_.contains(device.methods, 'TURNOFF')) {
        telldus.turnOff(id, function(response) {
          validateResponse(response, cb);
        });
      } else {
        cb({ error: 'Unsupported command "off" for device with id "' + id + '".' });
      }

    // on
    } else if (command === 'on') {
      if (_.contains(device.methods, 'TURNON')) {
        telldus.turnOn(id, function(response) {
          validateResponse(response, cb);
        });
      } else {
        cb({ error: 'Unsupported command "on" for device with id "' + id + '".' });
      }

    // dim
    } else if (command === 'dim') {

      if (_.contains(device.methods, 'DIM')) {

        if (isNaN(value)) {
          cb({ error: 'Invalid dim value "' + value + '".' });
        }

        var level = parseInt(value, 10);

        if (level < 0 || level > 255) {
          cb({ error: 'Invalid dim level "' + level + '".' });
        }

        telldus.dim(device.id, level, function(response) {
          validateResponse(response, cb);
        });

      } else {
        cb({ error: 'Unsupported command "dim" for device with id "' + id + '".' });
      }

    // unknown command
    } else {
      cb({ error: 'Unknown command "' + command + '".' });
    }
  });
}

var validateResponse = function(response, cb) {
  if (response !== 0) {
    cb({ error: response });
  } else {
    cb({ status: 'ok' });
  }
}

var getDevices = function(cb) {
  
  /*
  if (devices == null) {

    log.verbose('[telldus]', 'No devices in cache, get from telldus core.');

    setTimeout(function() { 
      log.verbose('[telldus]', 'Clear devices cache.');
      devices = null;
    }, 10000);

    devices = telldus.getDevicesSync();
  } else {
    log.verbose('[telldus]', 'Devices in cache.');
  }
  */

  devices = telldus.getDevicesSync();

  cb(devices);
}

var getDeviceById = function(id, cb) {

  if (isNaN(id)) {
    cb({ error: 'Invalid id "' + id + '".' });
  } else {

    id = parseInt(id, 10);

    var device = _.findWhere(devices, { id: id });

    if (_.isUndefined(device)) {
      cb({ error: 'No device with id "' + id + '" found.' });
    } else {
      cb(device);
    }
  }
}

exports.enabled = true;
exports.name = 'Telldus';
exports.version = '1.0.0';
exports.init = init;