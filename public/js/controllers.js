angular.module('onmote')
  .controller('DeviceListCtrl', function ($scope, socket) {
    socket.on('telldus:devices', function(data) {
      console.log(data.devices)
      $scope.devices = data.devices;
    });
  });