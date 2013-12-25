angular.module('onmote.services', [])
  .factory('socketService', function ($rootScope) {
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

      removeListener: function (eventName) {

        // remove all "namespaced" listeners
        if (eventName.indexOf(':*') !== -1) {

          var namespace = eventName.split(':*')[0] + ':';

          for (event in socket.$events) {
            if (event.indexOf(namespace) == 0) {
              socket.removeListener(event, socket.$events[event]);
            }
          }

        // re
        } else {
          if (socket.$events[eventName]) {
            socket.removeListener(eventName, socket.$events[eventName]);
          }
        }
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
  .factory('notificationService', function ($rootScope, $timeout, _) {

    var notifications = [];

    return {

      show: function(item) {
        $rootScope.safeApply(function () {

          item.id = Date.now();

          notifications.push(item);

          $timeout(function() {

            var notification = _.findWhere(notifications, { id: item.id });

            if (!_.isUndefined(notification)) {
              notifications.splice(notifications.indexOf(notification), 1);
            }

          }, 5000);

          return item;
        });
      },

      success: function (message) {
          return this.show({ message: message, type: 'success', time: new Date() });
      },

      error: function (message) {
          return show({ message: message, type: 'error', time: new Date() });
      },

      warning: function (message) {
          return show({ message: message, type: 'warning', time: new Date() });
      },

      info: function (message) {
          return show({ message: message, type: 'info', time: new Date() });
      },

      remove: function (index) {
          $rootScope.safeApply(function() {
              notifications.splice(index, 1);
          });
      },

      removeAll: function () {
          $rootScope.safeApply(function() {
              notifications = [];
          });
      },

      notifications: notifications
    };
  })
  .factory('_', function() {
    return window._;
  });