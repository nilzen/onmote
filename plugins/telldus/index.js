var _ = require('underscore'),
  log = require('../../log'),
  telldus = require('telldus');

var version = function() {
	return '1.0.0';
}

var name = function() {
	return 'Telldus';
}

var init = function(app) {

  app.all('/api/telldus/*', function(req, res, next) {
    log.verbose('[telldus]', req.originalUrl);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
  });
	
	app.get('/api/telldus/devices', function(req, res) {

    var devices = telldus.getDevices();

    log.verbose('[telldus]', JSON.stringify(devices));

    res.json(devices);
	});


  app.put('/api/telldus/devices/:id', function(req, res) {

      var device = getDeviceById(req.params.id, res);

      if (device === null) {
        return;
      }

      var command = req.body.command;
      var level = req.body.level;

      if (command === 'off') {
        if (_.contains(device.methods, 'TURNOFF')) {
          telldus.turnOff(device.id);
        } else {
          badRequest('Unsupported command "off" for device with id "' + device.id + '".', res);
        }
      } else if (command === 'on') {
        if (_.contains(device.methods, 'TURNON')) {
          telldus.turnOn(device.id);
        } else {
          badRequest('Unsupported command "on" for device with id "' + device.id + '".', res);
        }
      } else if (command === 'dim') {
        if (_.contains(device.methods, 'DIM')) {

          if (isNaN(level)) {
            badRequest('Invalid dim level "' + level + '".', res);
          }

          level = parseInt(level, 10);

          if (level < 0 || level > 255) {
            badRequest('Invalid dim level "' + level + '".', res);
          }

          telldus.dim(device.id, level);

        } else {
          badRequest('Unsupported command "on" for device with id "' + device.id + '".', res);
        }
      } else {
        badRequest('Unknown command "' + command + '".', res);
      }

      res.send(200, 'Ok');
  });

  app.get('/api/telldus/devices/:id', function(req, res) {

      var device = getDeviceById(req.params.id, res);

      if (device === null) {
        return;
      }

      log.verbose('[telldus]', JSON.stringify(device));

      res.json(device);
  });
}

var badRequest = function(message, res) {
    log.error('[telldus]', message);
    res.send(400, message);
    return null;
}

var getDeviceById = function(id, res) {

  var message;

  if (isNaN(id)) {
    badRequest('Invalid id "' + id + '".', res);
  }

  id = parseInt(id, 10);

  var device = _.findWhere(telldus.getDevices(), { id: id });

  if (_.isUndefined(device)) {
    badRequest('No device with id "' + id + '" found.', res);
  }

  return device;
}

exports.name = name;
exports.version = version;
exports.init = init;