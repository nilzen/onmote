app.register.controller('StatusCtrl', function ($scope, socketService) {

  $scope.loaded = false;

  socketService.emit('status:getStatus');

  socketService.on('status:status', function(status) {
    $scope.status = status;
    $scope.loaded = true;
  });
});