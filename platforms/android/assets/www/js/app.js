var DomenowApp = angular.module('DomenowApp', ['ionic', 'btford.socket-io', 'ngStorage', 'darthwade.dwLoading',
	'ngTouch', 'ngCordova', 'itemSwipePaneDirective', 'ngTouchstart', 'angularMoment', 'chatacterCount', 'angular-timezone-selector', 'ion-datetime-picker', 'ion-datetime-picker', 'ngWebworker', 'ionic-native-transitions']);

//defining App Constant
DomenowApp.constant('APIROOT', 'https://dev-platform.mybluemix.net');
//DomenowApp.constant('SOCKET_ROOT', 'https://socket-server.mybluemix.net');
//DomenowApp.constant('SOCKET_ROOT', 'http://mastersoftwaretechnologies.com:6050');
//definfing app root run funtion which will invoke at very first.


//app devlopment constants
//DomenowApp.constant('APIROOT', 'https://test-platformapp.mybluemix.net');
DomenowApp.constant('SOCKET_ROOT', 'http://mastersoftwaretechnologies.com:6050');

DomenowApp.config(function($ionicConfigProvider, $ionicNativeTransitionsProvider){
  //enabling native scrolling;
  $ionicConfigProvider.scrolling.jsScrolling(false);
                  
  $ionicNativeTransitionsProvider.setDefaultOptions({
        duration: 400, // in milliseconds (ms), default 400, 
        slowdownfactor: 4, // overlap views (higher number is more) or no overlap (1), default 4 
        iosdelay: -1, // ms to wait for the iOS webview to update before animation kicks in, default -1 
        androiddelay: -1, // same as above but for Android, default -1 
        winphonedelay: -1, // same as above but for Windows Phone, default -1, 
        fixedPixelsTop: 0, // the number of pixels of your fixed header, default 0 (iOS and Android) 
        fixedPixelsBottom: 0, // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android) 
        triggerTransitionEvent: '$ionicView.afterEnter', // internal ionic-native-transitions option 
        backInOppositeDirection: false // Takes over default back transition and state back transition to use the opposite direction transition to go back 
  });
  
  $ionicNativeTransitionsProvider.setDefaultTransition({
      type: 'fade',
      duration :  500
  });
});

DomenowApp.run(function ($ionicPlatform, BluemixService, $window, $http, $localStorage, SocketBroadCastEvents, Client, $templateCache, $templateRequest, $rootScope) {
  // check application is in active state or not ?
  $rootScope.isActiveState = true ;
               
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
  
    if(Client){
      if(Client.isMobile()){
        if(Client.isMobileAndroid()){
          $localStorage.deviceType = "Android Device";
          $localStorage.deviceFingerPrint = Client.getFingerprint();
        }
        
        if(Client.isMobileIOS()){
          $localStorage.deviceType = "Ios Device";
          $localStorage.deviceFingerPrint = Client.getFingerprint();
        }
      }else{
        $localStorage.deviceType = "Web Browser";
        $localStorage.deviceFingerPrint = Client.getFingerprint();
      }
    }
    
		BluemixService.connect().then(function success(response) {
			console.log("Bluemix app registered OK. The deviceID of this device is: " + response);
			$localStorage.device_id = response;
		}, function failure(response) {
			console.log("Registering for Bluemix app push did not work" + response);
		});

    //registering user to socket server if user is valid and have access_token in our local.
    //if($localStorage.access_token) SocketBroadCastEvents.onAppStart("called from app.js file");
    
		/**
     *  Following event are IonicPlatform events and are
     *  trigrred when app is paused or resumed. This following events
     *  are used to inform socket-server that user is online or offline.
     **/
    $ionicPlatform.on('pause', function(){
      $rootScope.isActiveState = false ;
      SocketBroadCastEvents.onAppPause();
    });
    
    $ionicPlatform.on('resume', function(){
      $rootScope.isActiveState = true ;
      SocketBroadCastEvents.onAppResume();
    });
    
    /**
     *  getUpdated page information from the web-socket server when the user is offline
     **/
    setTimeout(function(){
      SocketBroadCastEvents.getUpdatedPageIds($localStorage.deviceFingerPrint, $localStorage.user_id);  
    }, 1500);
    
    /** puttin all templates into templateCache on apprun functino **/
    $templateRequest('angular-templates/userMessageList.html').then(function(template){
			$templateCache.put("/cachedUserMessageTemplate.html", template);
		});
		
		$templateRequest('angular-templates/companyMessageList.html').then(function(template){
			$templateCache.put("/cachedCompanyMessageTemplate.html", template);
		});
	});
               
    $rootScope.$on('$cordovaLocalNotification:schedule',
        function (event, notification, state) {
        console.log("SCHEDULE");
        console.log('event', event);
        console.log('notification', notification);
        console.log('state', state);
    });
               
    $rootScope.$on('$cordovaLocalNotification:trigger',
        function (event, notification, state) {
        console.log("TRIGGER");
        console.log('event', event);
        console.log('notification', notification);
        console.log('state', state);
    });
               
    $rootScope.$on('$cordovaLocalNotification:update',
        function (event, notification, state) {
        console.log('UPDATE');
        console.log('event', event);
        console.log('notification', notification);
        console.log('state', state);
    });
               
    $rootScope.$on('$cordovaLocalNotification:cancel',
        function (event, notification, state) {
        console.log('CANCEL');
        console.log('event', event);
        console.log('notification', notification);
        console.log('state', state);
    });
            
});


//following functino is used for deep-linking purpose and need to be independent.
function handleOpenURL(url) {
    try{
        if(url){
            var splitedUrl = url.split("?")[1] ,
            page_id = splitedUrl.split("=")[1];
            if(page_id){
                window.localStorage.removeItem("deepLink_page_id");
                window.localStorage.setItem("deepLink_page_id", page_id);
            }
        }else{
            console.warn("Unable to handel url on app deeplink open.");
        }
    }catch(e){
        console.info("Exception raised while deeplinking handelUrl", e);
    }
}

function parser(json){
  return JSON.parse(json);
}
 
