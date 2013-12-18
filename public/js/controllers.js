angular.module('onmote')
  .controller('DeviceListCtrl', function ($scope, $timeout, $log, socket) {

    var dimTimer,
      debugStart;

    socket.on('telldus:*',function(event, data) {
      $log.debug(event, data);
    });

    socket.on('telldus:command',function(data) {
      $log.debug('telldus:sendCommand', 'end', ((new Date().getTime() - debugStart) / 1000) + "s");
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

    $scope.dim = function($event, id) {

      var that = this;

      $timeout.cancel(dimTimer);

      $log.debug('telldus:sendCommand', 'start');
      debugStart = new Date().getTime();

      dimTimer = $timeout(function() {
        socket.emit('telldus:sendCommand', {
          id: that.device.id,
          command: 'dim',
          value: that.device.status.level
        });
      }, 100);
    };
  }).directive('telldusDevice', function() {
    return {
      restrict: "E",
      replace: true,
      templateUrl: 'telldus/directives/device.html',
    };
  });