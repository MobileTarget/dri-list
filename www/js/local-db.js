(function(DomenowApp, undefined){
  'use strict';
	
	DomenowApp.factory("LOCAL_DB", function($window) {
		return {
			SaveData: function(key, val) {
				if($window.localStorage){
					if(Object.prototype.toString.call( val ) === '[object Object]'){
						$window.localStorage.removeItem[key];
						$window.localStorage.setItem(key, JSON.stringify(val));
						return true;
					}else if(Object.prototype.toString.call( val ) === '[object Array]'){
						$window.localStorage.removeItem[key];
						$window.localStorage.setItem(key, JSON.stringify(val));
						return true;
					}else{
						$window.localStorage.removeItem[key];
						$window.localStorage.setItem(key, val);
						return true;
					}
				}else{
					alert("Please update your browser to use the functionality");
					return false;
				}
			},
			GetData: function(key) {
				if($window.localStorage){
					try{
						return JSON.parse($window.localStorage.getItem(key));
					}catch(e){
						console.log("Exception raised while parsing localStorage value", JSON.stringify(e));
						return $window.localStorage.getItem(key);
					}
				}else{
					alert("Please update your browser to use the functionality");
					return false ;
				}
			},
      RemoveByKey: function(key){
        if($window.localStorage){
					$window.localStorage.removeItem[key];
					return true ;
				}else{
					alert("Please update your browser to use the functionality");
					return false ;
				}
      },
			ClearAll: function() {
				if($window.localStorage){
					$window.localStorage.clear();
					return true ;
				}else{
					alert("Please update your browser to use the functionality");
					return false ;
				}
			}
		};
	});
})(DomenowApp);