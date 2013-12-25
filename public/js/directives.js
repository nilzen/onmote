angular.module('onmote.directives', [])
  .directive('onmTelldusDevice', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'plugin/telldus/directives/device.html',
    };
  })
  .directive('onmNotifications', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'directives/notifications.html',
    };
  });