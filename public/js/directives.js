angular.module('onmote.directives', [])
  .directive('onmTelldusDevice', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'telldus/directives/device.html',
    };
  });