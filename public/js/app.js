/* exported app */
'use strict';

var app = angular.module('onmote', [
  'ngRoute',
  'onmote.services',
  'onmote.directives',
  'onmote.filters',
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

.config(function($controllerProvider, $compileProvider, $filterProvider, $provide){
  app.register = {
    controller: $controllerProvider.register,
    directive: $compileProvider.directive,
    filter: $filterProvider.register,
    factory: $provide.factory,
    service: $provide.service
  };
})
.config(function ($routeProvider) {

  $routeProvider.when('/p/:plugin', {

    templateUrl: function(rd) {
      return 'plugin/' + rd.plugin + '/index.html';
    },

    resolve: {
      load: function($q, $route, $rootScope) {

        var deferred = $q.defer();

        var dependencies = [
          'plugin/' + $route.current.params.plugin + '/index.js'
        ];

        $script(dependencies, function () {
          $rootScope.$apply(function() {
            deferred.resolve();
          });
        });

        return deferred.promise;
      }
    }
  });
});