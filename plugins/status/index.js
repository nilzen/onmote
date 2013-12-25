var express = require('express'),
  log = require('../../log');

var init = function (app, sockets) {
  app.use('/plugin/status', express.static(__dirname + '/public'));
};

exports.enabled = true;
exports.name = 'Status';
exports.version = '1.0.0';
exports.init = init;