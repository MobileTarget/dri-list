(function(DomenowApp, undefined) {
    'use strict';

    DomenowApp.factory("LOCAL_DB", function($window, Webworker) {
        return {
            SaveData: function(key, val) {
                if ($window.localStorage) {
                    if (Object.prototype.toString.call(val) === '[object Object]') {
                        delete $window.localStorage[key];
                        $window.localStorage.setItem(key, JSON.stringify(val));
                        return true;
                    } else if (Object.prototype.toString.call(val) === '[object Array]') {
                        for (var itr in val) {
                            if (val[itr].page_id) {
                                delete $window.localStorage[key];
                                $window.localStorage.setItem(key, JSON.stringify(val));
                            }
                        }
                        return true;
                    } else {
                        delete $window.localStorage[key];
                        $window.localStorage.setItem(key, val);
                        return true;
                    }
                } else {
                    alert("Please update your browser to use the functionality");
                    return false;
                }
            },
            SavePages: function(data) {
                if ($window.localStorage) {
                    if (Object.prototype.toString.call(data) === '[object Object]') {
                        data.detail = data.detail.reverse();
                        if (data.page_id) {
                            delete $window.localStorage[data.page_id];
                            $window.localStorage.setItem(data.page_id, JSON.stringify(data));
                        }
                        return true;
                    } else if (Object.prototype.toString.call(data) === '[object Array]') {
                        data = data.reverse();
                        for (var itr in data) {
                            if (data[itr].page_id) {
                                delete $window.localStorage[data[itr].page_id];
                                $window.localStorage.setItem(data[itr].page_id, JSON.stringify(data[itr]));
                            }
                        }
                        return true;
                    } else {
                        console.warn("Exception raised while saving data into localStorage >>>", "Invalid data to save.", data);
                    }
                } else {
                    alert("Please update your browser to use the functionality");
                    return false;
                }
            },
            UpdatePages: function(arr){
                if ($window.localStorage) {
                    if (Object.prototype.toString.call(arr) === '[object Object]') {
                        if (arr.page_id) {
                            delete $window.localStorage[arr.page_id];
                            $window.localStorage.setItem(arr.page_id, JSON.stringify(arr));
                        }
                        return true;
                    } else if (Object.prototype.toString.call(arr) === '[object Array]') {
                        console.log("inside the local-db fn", arr);
                        for (var itr in arr) {
                            if (arr[itr].page_id) {
                                delete $window.localStorage[arr[itr].page_id];
                                $window.localStorage.setItem(arr[itr].page_id, JSON.stringify(arr[itr]));
                                console.log("after updating the page in local", arr[itr].page_id, arr[itr]);
                            }
                        }
                        return true;
                    } else {
                        console.warn("Exception raised while saving data into localStorage >>>", "Invalid data to save.", arr);
                    }
                } else {
                    alert("Please update your browser to use the functionality");
                    return false;
                }
            },
            GetData: function(key, callback) {
                if ($window.localStorage) {
                    var JSONDATA = $window.localStorage.getItem(key),
                        JsonWorker = Webworker.create(parser);
                    JsonWorker.run(JSONDATA).then(function(JsonObj) {
                        callback(null, JsonObj);
                    });
                } else {
                    alert("Please update your browser to use the functionality");
                    callback(true, null);
                }
            },
            UpdateSpecificPageWithDetails: function(page_id, details, callback){
            	if ($window.localStorage) {
                    var JSONDATA = $window.localStorage.getItem(page_id),
                        JsonWorker = Webworker.create(parser);

                    JsonWorker.run(JSONDATA).then(function(JsonObj) {
                        var local_detail = JSON.parse(JSON.stringify(JsonObj.detail));
                        	
                        	for(var itr in details){
                    			local_detail.unshift(details[itr]);
                        	}
                        JsonObj.detail = local_detail;
                        $window.localStorage.setItem(page_id, JSON.stringify(JsonObj));
                        callback(null, "Page detail updated successfully");
                    });
                } else {
                    callback("Please update your browser to use the functionality", null);
                }
            },
            GetTask: function(key) {
                if ($window.localStorage) {
                    try {
                        return JSON.parse($window.localStorage.getItem(key));
                    } catch (e) {
                        console.log("Exception raised while parsing localStorage value", JSON.stringify(e));
                        return $window.localStorage.getItem(key);
                    }
                } else {
                    alert("Please update your browser to use the functionality");
                    return false;
                }
            },
            RemoveByKey: function(key) {
                if ($window.localStorage) {
                    delete $window.localStorage[key];
                    return true;
                } else {
                    alert("Please update your browser to use the functionality");
                    return false;
                }
            },
            ClearAll: function() {
                if ($window.localStorage) {
                    $window.localStorage.clear();
                    return true;
                } else {
                    alert("Please update your browser to use the functionality");
                    return false;
                }
            },
            GetAllUserPages: function(){
                if($window.localStorage){
                    var user_pages = [], localStorage = $window.localStorage;
                    for(var each in localStorage){
                        var split = each.split('-');
                        if( split[0]== "USER_PAGE"){
                            var local_page = JSON.parse(localStorage[each]);
                            if(local_page.isDirty){
                                user_pages.push(local_page);    
                            }
                        }
                    }
                    return user_pages;
                }else{
                    return [];
                }
            }
        };
    });
})(DomenowApp);