app.register.controller('TelldusCtrl', function ($scope, $timeout, $log, _, socketService, notificationService) {

  var debugStart;

  $scope.loaded = false;

  socketService.emit('telldus:getDevices');

  socketService.on('telldus:*', function(event, data) {
    $log.debug(event, data);
  });

  socketService.on('telldus:command', function(response) {
    if (response.error) {
      notificationService.error(response.error.message);
    } else {
      notificationService.success('ok');
    }

    $log.debug('telldus:sendCommand', 'end', ((new Date().getTime() - debugStart) / 1000) + 's');
  });

  socketService.on('telldus:devices', function(data) {
    $scope.loaded = true;
    $scope.devices = data;
  });

  $scope.$on('$destroy', function() {
    socketService.removeListener('telldus:*');
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
    $log.debug('telldus:sendCommand', 'id:', id + ',', 'command:', command + ',', 'value:', value);

    debugStart = new Date().getTime();

    socketService.emit('telldus:sendCommand', {
      id: id,
      command: command,
      value: value
    });
  };
});

app.register.directive('onmTelldusDevice', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'plugin/telldus/directives/device.html',
  };
});