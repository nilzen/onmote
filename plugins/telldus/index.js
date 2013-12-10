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

  app.get('/api/telldus/devices/:id', function(req, res) {

      var message;

      if (isNaN(req.params.id)) {
        message = 'Invalid id ' + req.params.id + '.';
        log.error('[telldus]', message);
        res.send(400, message);
        return;
      }

      var id = parseInt(req.params.id, 10);

      var device = _.findWhere(telldus.getDevices(), { id: id });

      if (_.isUndefined(device)) {
        message = 'No device with id ' + id + ' found.';
        log.error('[telldus]', message);
        res.send(404, message);
        return;
      }

      log.verbose('[telldus]', JSON.stringify(device));

      res.json(device);
  });
}

exports.name = name;
exports.version = version;
exports.init = init;