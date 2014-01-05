angular.module('onmote.controllers', [])
  .controller('MainCtrl', function ($scope, notificationService, socketService) {

    socketService.on('core:navigation', function(navigation) {
      $scope.navigation = navigation;
    });

    socketService.emit('core:getNavigation');

    $scope.notifications = notificationService.notifications;

    $scope.$watch('notificationService.current', function (notifications) {
      if (notifications) {
        $scope.notifications = notifications;
      }
    });
  });