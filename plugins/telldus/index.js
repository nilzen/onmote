var log = require('../../log');

var version = function() {
	return '1.0.0';
}

var name = function() {
	return 'Telldus';
}

var init = function(app) {
	
	app.get('/api/telldus/devices', function(req, res){
  		var body = 'get all devices';
  		res.setHeader('Content-Type', 'text/plain');
  		res.setHeader('Content-Length', body.length);
  		res.end(body);
	});

	app.get('/api/telldus/devices/:id', function(req, res){
  		var body = 'get device with id: ' + req.params.id;
  		res.setHeader('Content-Type', 'text/plain');
  		res.setHeader('Content-Length', body.length);
  		res.end(body);
	});
}

exports.name = name;
exports.version = version;
exports.init = init;