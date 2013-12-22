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

    $scope.toggle = function() {
      $scope.sendCommand(this.device.id, this.device.status.name.toLowerCase());
    };

    $scope.on = function() {
      $scope.sendCommand(this.device.id, 'on');
    };

    $scope.off = function() {
      $scope.sendCommand(this.device.id, 'off');
    };

    $scope.dim = _.throttle(function() {
      $scope.sendCommand(this.device.id, 'dim', this.device.status.level);
    }, 500, { leading: false });

    $scope.sendCommand = function(id, command, value) {

      $log.debug('telldus:sendCommand', 'start');
      $log.debug('telldus:sendCommand', 'id:', id, 'command:', command, 'value:', value);

      debugStart = new Date().getTime();

      socket.emit('telldus:sendCommand', {
        id: id,
        command: command,
        value: value
      });
    };

  });