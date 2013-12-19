angular.module('onmote.directives', [])
  .directive('telldusDevice', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'telldus/directives/device.html',
    };
  });