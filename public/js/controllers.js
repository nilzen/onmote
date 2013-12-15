var dimTimer;

angular.module('onmote')
  .controller('DeviceListCtrl', function ($scope, $timeout, socket) {

	socket.on('telldus:*',function(event, data) {
	    console.log(event, data);
	});

    socket.on('telldus:devices', function(data) {
      $scope.devices = data;
    });

    $scope.toggle = function($event, id) {

		var checkbox = $event.target;
  		var command = (checkbox.checked ? 'on' : 'off');

  		socket.emit('telldus:sendCommand', {
  			id: id,
  			command: command
  		});
    };

    $scope.dim = function($event, id) {

    	var that = this;

    	$timeout.cancel(dimTimer);

		dimTimer = $timeout(function() {
			socket.emit('telldus:sendCommand', {
				id: that.device.id,
				command: 'dim',
				value: that.device.status.level
			});
		}, 500);
  	
    };

  });