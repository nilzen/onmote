angular.module('onmote.directives', [])
  .directive('onmNotifications', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'directives/notifications.html',
    };
  });