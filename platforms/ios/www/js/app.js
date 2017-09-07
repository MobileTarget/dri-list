var DomenowApp = angular.module('DomenowApp', ['ionic', 'btford.socket-io', 'ngStorage', 'darthwade.dwLoading',
	'ngTouch', 'ngCordova', 'itemSwipePaneDirective', 'ngTouchstart', 'angularMoment', 'chatacterCount', 'angular-timezone-selector', 'ion-datetime-picker', 'ion-datetime-picker']);

//defining App Constant
DomenowApp.constant('APIROOT', 'https://dev-platform.mybluemix.net');
DomenowApp.constant('SOCKET_ROOT', 'https://socket-server.mybluemix.net');
//DomenowApp.constant('SOCKET_ROOT', 'http://mastersoftwaretechnologies.com:6005');
//definfing app root run funtion which will invoke at very first.
DomenowApp.run(function ($ionicPlatform, BluemixService, $window, $http, $localStorage, SocketBroadCastEvents) {
  // Sends this header with any AJAX request
  $http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

	$ionicPlatform.ready(function () {
		if (window.cordova && window.cordova.plugins.Keyboard) {
			// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
			// for form inputs)
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

			// Don't remove this line unless you know what you are doing. It stops the viewport
			// from snapping when text inputs are focused. Ionic handles this internally for
			// a much nicer keyboard experience.
			cordova.plugins.Keyboard.disableScroll(true);
		}

		if (window.StatusBar) {
			StatusBar.styleDefault();
		}

    //registering user to socket server is user is valid and have access_token in our local.
    if($localStorage.access_token) SocketBroadCastEvents.onAppResume();

		BluemixService.connect().then(function success(response) {
			console.log("Bluemix app registered OK. The deviceID of this device is: " + response);
			$localStorage.device_id = response;
		}, function failure(response) {
			console.log("Registering for Bluemix app push did not work" + response);
		});

		/**
     *  Following event are IonicPlatform events and are
     *  trigrred when app is paused or resumed. This following events
     *  are used to inform socket-server that user is online or offline.
     **/
    $ionicPlatform.on('pause', function(){
      SocketBroadCastEvents.onAppPause();
    });
    
    $ionicPlatform.on('resume', function(){
      SocketBroadCastEvents.onAppResume();
    });
    
	});
});
