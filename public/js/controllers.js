angular.module('onmote.controllers', [])
  .controller('DeviceListCtrl', function ($scope, $timeout, $log, socket, _) {

    var debugStart;

    socket.on('telldus:*',function(event, data) {
      $log.debug(event, data);
    });

    socket.on('telldus:command',function() {
      $log.debug('telldus:sendCommand', 'end', ((new Date().getTime() - debugStart) / 1000) + 's');
    });

    socket.on('telldus:devices', function(data) {
      $scope.devices = data;
    });

    $scope.toggle = function($event, id) {

      var checkbox = $event.target;
      var command = (checkbox.checked ? 'on' : 'off');

      $log.debug('telldus:sendCommand', 'start');
      debugStart = new Date().getTime();

      socket.emit('telldus:sendCommand', {
        id: id,
        command: command
      });
    };

    $scope.dim = _.throttle(function() {

      var that = this;

      $log.debug('telldus:sendCommand', 'start');
      debugStart = new Date().getTime();

      socket.emit('telldus:sendCommand', {
        id: that.device.id,
        command: 'dim',
        value: that.device.status.level
      });
    }, 500, { leading: false });

  });