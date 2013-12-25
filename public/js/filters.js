angular.module('onmote.filters', [])
  .filter('timespan', function() {
    return function(delta) {

      var days = Math.floor(delta / 86400);
      var hours = Math.floor(delta / 3600) % 24;
      var minutes = Math.floor(delta / 60) % 60;
      var seconds = delta % 60;

      return days + ' days, ' + hours + ' hours, ' + minutes + ' minutes, ' + seconds + ' seconds';
    }
  });