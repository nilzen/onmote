angular.module('onmote.controllers', [])
  .controller('MainCtrl', function ($scope, notificationService) {

    $scope.notifications = notificationService.notifications;

    $scope.$watch('notificationService.current', function (notifications) {
      if (notifications) {
        $scope.notifications = notifications;
      }
    });
  });