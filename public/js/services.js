angular.module('onmote.services', [])
  .factory('socket', function ($rootScope) {
    var socket = io.connect();

    var emit = socket.$emit;
    socket.$emit = function() {
      var args = Array.prototype.slice.call(arguments);

      if (args[0].indexOf(':') !== -1) {
        emit.apply(socket, [args[0].split(':')[0] + ':*'].concat(args));
      }

      emit.apply(socket, ['*'].concat(args));
      emit.apply(socket, arguments);
    };

    return {

      on: function (eventName, callback) {
        socket.on(eventName, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      },

      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        });
      }
    };
  })
  .factory('_', function() {
    return window._;
  });