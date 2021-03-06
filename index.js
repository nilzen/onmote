var fs = require('fs'),
  http = require('http'),
  express = require('express'),
  app = express(),
  server = http.createServer(app),
  log = require('./log'),
  io = require('socket.io'),
  config = require('./config'),
  pluginRoot = './plugins',
  navigation = [];

app.use(express.urlencoded());
app.use(express.json());
app.disable('x-powered-by');

io = io.listen(server, {
  logger: {
    debug: log.debug,
    info: log.info,
    error: log.error,
    warn: log.warn
  }
});

app.use('/', express.static(__dirname + '/public'));

/*
io.enable('browser client minification');
io.enable('browser client etag');
io.enable('browser client gzip');
io.set('log level', 1); 
*/

log.info('[app]', 'Scanning for plugins.');

fs.readdirSync(pluginRoot).forEach(function(folder) {

  var pluginPath = pluginRoot + '/' + folder;

  if (!fs.statSync(pluginPath).isDirectory()) {
    return;
  }

  log.verbose('[app]', 'Scanning folder ' + pluginPath);

  var files = fs.readdirSync(pluginPath);

  if (files.indexOf('index.js') > -1) {

    try {
      var plugin = require(pluginPath);

      log.info('[app]', 'Initializing ' + plugin.name + ' v' + plugin.version);
      if (plugin.enabled) {
        plugin.init(app, io.sockets);

        if (plugin.navigation) {
          navigation.push(plugin.navigation);
        }
      }

    } catch(e) {
      log.error('[app]', e.stack);
    }

  } else {
    log.error('[app]', 'Missing index.js in ' + pluginPath);
  }
});

io.sockets.on('connection', function (socket) {

  socket.on('core:getNavigation', function () {
    log.verbose('[core]', 'core:navigation', JSON.stringify(navigation));
    socket.emit('core:navigation', navigation);
  });
});

try {
  server.listen(config.port);
  log.info('[app]', 'Server listening at port ' + config.port);
} catch(e) {
  log.error('[app]', e.stack);
}