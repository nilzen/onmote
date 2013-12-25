/* exported app */
'use strict';

var app = angular.module('onmote', [
  'ngRoute',
  'onmote.services',
  'onmote.directives',
  'onmote.controllers'
]).config([
  '$provide', function($provide) {
    return $provide.decorator('$rootScope', [
      '$delegate', function($delegate) {
        $delegate.safeApply = function(fn) {
          var phase = $delegate.$$phase;
          if (phase === '$apply' || phase === '$digest') {
            if (fn && typeof fn === 'function') {
              fn();
            }
          } else {
            $delegate.$apply(fn);
          }
        };
        return $delegate;
      }
    ]);
  }
])
.config(function ($routeProvider) {

  $routeProvider.when('/telldus', { templateUrl: 'telldus/index.html', controller: 'TelldusDeviceListCtrl' });
  $routeProvider.otherwise({redirectTo: '/telldus'});
});