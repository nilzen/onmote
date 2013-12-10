var fs = require('fs'),
  log = require('./log'),
  express = require('express'),
  app = express(),
  config = require('./config');
  pluginRoot = './plugins';

log.info('Scanning for plugins.');

fs.readdirSync(pluginRoot).forEach(function(folder) {

  var pluginPath = pluginRoot + '/' + folder;

  log.verbose('Scanning folder ' + pluginPath);

  var files = fs.readdirSync(pluginPath);

  if (files.indexOf('index.js') > -1) {

    try {
      var plugin = require(pluginPath);

      log.info('Initializing ' + plugin.name() + ' v' + plugin.version());

      plugin.init(app);

    } catch(e) {
      log.error(e.stack);
    }

  } else {
    log.error('Missing index.js in ' + pluginPath);
  }
});

try {
  app.listen(config.port);
  log.info('Server listening at port ' + config.port);
} catch(e) {
  log.error(e.stack);
}