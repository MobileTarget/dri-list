(function(DomenowApp, undefined){
  'use strict';
	
	DomenowApp.factory("LOCAL_DB", function($window, Webworker) {
		return {
			SaveData: function(key, val) {
				if($window.localStorage){
					if(Object.prototype.toString.call( val ) === '[object Object]'){
            delete $window.localStorage[key];
						$window.localStorage.setItem(key, JSON.stringify(val));
						return true;
					}else if(Object.prototype.toString.call( val ) === '[object Array]'){
            for(var itr in val){
              if(val[itr].page_id){
                delete $window.localStorage[key];
                $window.localStorage.setItem(key, JSON.stringify(val));
              }
            }
						return true;
					}else{
						delete $window.localStorage[key];
						$window.localStorage.setItem(key, val);
						return true;
					}
				}else{
					alert("Please update your browser to use the functionality");
					return false;
				}
			},
      SavePages: function(data){
        if($window.localStorage){
					if(Object.prototype.toString.call( data ) === '[object Object]'){
            if(data.page_id){
              delete $window.localStorage[data.page_id];
              $window.localStorage.setItem(data.page_id, JSON.stringify(data));
            }
						return true;
					}else if(Object.prototype.toString.call( data ) === '[object Array]'){
            for(var itr in data){
              if(data[itr].page_id){
                delete $window.localStorage[data[itr].page_id];
                $window.localStorage.setItem(data[itr].page_id, JSON.stringify(data[itr]));
              }
            }
						return true;
					}else{
						console.warn("Exception raised while saving data into localStorage >>>", "Invalid data to save.", data);
					}
				}else{
					alert("Please update your browser to use the functionality");
					return false;
				}
      },
			GetData: function(key, callback) {
				if($window.localStorage){
          var JSONDATA    = $window.localStorage.getItem(key),
              JsonWorker  = Webworker.create(parser);
          
          JsonWorker.run(JSONDATA).then(function(JsonObj) {
              callback(null, JsonObj);
          });
				}else{
					alert("Please update your browser to use the functionality");
					return false ;
				}
			},
      GetTask: function(key){
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
					delete $window.localStorage[key];
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
