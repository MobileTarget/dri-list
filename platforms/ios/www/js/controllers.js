/********* controllers ***********/
DomenowApp.controller('TodoCtrl', function (APIROOT, $rootScope, $scope, $state, $timeout, $interval,
	$ionicScrollDelegate, $ionicPopup, $http, $templateRequest, $localStorage, $q, $window,
	myService, utilityService, HttpService, BluemixService,
	Task, dbService, SocketBroadCastEvents, SocketListnerEvents, STATIC_PAGES, SEMI_REALTIME_CHANGES) {

	var isIOS = ionic.Platform.isIOS();

  
  /**
   *  Push notification callback listner and moved page to request one
   **/
  $scope.$on(function(err, pushMessageObj){
    console.log("Comes under PushNotificaiton callback", err, pushMessageObj);
    //alert("under controller Push notification listenr");
    $window.navigator.notification.alert("under controller Push notification listenr", function () {}, "Dri List notification", "ok");
  });
  
  
  /**
   *  To check if logged_in user is superAdmin or not ?
   *  and return true or false
   **/
  $scope.isSuperAdmin = function(){
    var user_obj = myService.getUserInfo();
    if(!utilityService.isEmpty(user_obj)){
      if(!utilityService.isEmpty(user_obj.type)){
        if("superAdmin" in user_obj.type){
          return true;
        }else{
          return false;
        }
      }else{
        return false;
      }
    }else{
      return false;
    }
  };

	/**
	 * Following angular $scope variable are used as a global config variable
	 * and were used in all over the code. Some $scope variable are global to the
	 * controller and are used in service's and factories.
	 **/
	$scope.config = {
		page_id: 2,
		from_page_id: 1,
		task_id: "2_0",
		edit_task_id: "",
		task_name: "Categories",
		child_task_id: "",
	};
	$scope.api_url = APIROOT;
	$scope.sort = {
		order: "asc",
		key: "name"
	};
	$scope.user = {};
	$scope.data = {};
	$scope.html = "";
	$scope.isTyping = false;

	/**
	 *  The following is the common Init function defination which have the following points to do.
	 *   1) check this is for testing app conditions
	 *   2) check if user is login or not ?
	 *   3) call the get_page function to get page initially.
	 **/
	$scope.init = function () {
		var parser = $window.location;
		if (parser.search) {
			var search_url = utilityService.getJsonFromUrl(parser);
			if (typeof search_url.page_id != "undefined") {
				$scope.config.page_id = parseInt(search_url.page_id);
			}
		}

		console.log('access_token>>> ' + $localStorage.access_token);
		console.log('user_id>>> ' + $localStorage.user_id);
		console.log('offline_queue>>> ' + $localStorage.offline_queue);

		$scope.is_test = false;
		if (!$localStorage.access_token) {
			console.log("go to login page>>>");
			$scope.config.page_id = 1;
			$scope.config.from_page_id = 0;
			$scope.goPage($scope.config.page_id);
		} else {
			$scope.goPage($scope.config.page_id);
		}
	};

	/**
	 * The following $scope.getPageDetail() fn is used to populate the details(detail html saved into db)
	 * to show html body onto app screen. The content is show on page for various pages are displayed using this
	 * method. This method get the data from myService service which get data from platfrom server.
	 **/
	$scope.getPageDetail = function () {
		var detailData = myService.getDetail(),
        myDetail = [];

		for (var ind = 0; ind < detailData.length; ind++) {
			var item = detailData[ind];
      myDetail.push({
        "id": item._id,
        "name": item.user_incoming.message,
        "page_id": item.to_page_id,
        "type": item.type,
        "display_if_empty": item.display_if_empty,
        "active": item.count.active,
        "unread": item.count.unread
      });
		} //closing for-lo  op

		$scope.details = myDetail;
		$scope.sort.order = ($scope.sort.order == "asc") ? "desc" : "asc";
		$scope.sortDetail();
	};

	/**
	 *  The following function $scope.setConfig() fn is used to set the global $scope.config
	 *  Object so that $scope.config object can be used with the updated values which is coming
	 *  from the platfrom server with updated information. This function is necessery to call after
	 *  api-hit to update the $scope.config object. unless updated values are not available all accross
	 *  the application.
	 **/
	$scope.setConfig = function () {
		var task_info = myService.getTaskInfo();
		//if (task_info.from_page_id) {
		//	$scope.config.from_page_id = task_info.from_page_id;
		//}

    $scope.config.page_id = myService.apiResult.page_id ;
		$scope.config.task_id = task_info.task_id;
		$scope.config.task_name = task_info.task_name;
		$scope.config.child_task_id = task_info.child_task_id;
		console.log("$scope.config>>>" + JSON.stringify($scope.config));

		$scope.title = $scope.config.task_name;
		var user_info = myService.getUserInfo();
		if (typeof user_info != "undefined" &&
			typeof user_info.type !== "undefined" &&
			typeof user_info.type.admin !== "undefined" &&
			user_info.type.admin == "admin"
    ) {
			$scope.isAdmin = true;
      } else {
        $scope.isAdmin = false;
    }
		$scope.getPageDetail();
	};

	/**
	 *  The $scope.setPage() is a function which is used to bind the html into the app
	 *  with the header, detail, footer object html/Js which is coming from $scope.goPage()
	 *  api-endpoint. If this function is not invoked after the $scope.goPage() api response,
	 *  then updated html or Js content will not going to bind into app.
	 **/
	$scope.setPage = function () {
    $scope.setConfig();
    var header_html = myService.getTemplateHtml("header"),
        detail_html = myService.getTemplateHtml("detail"),
        footer_html = myService.getTemplateHtml("footer"),
        js_template = myService.getTemplateJs();

    $scope.html = header_html + detail_html + footer_html;
		if (!$scope.$$phase)  $scope.$apply();

    eval(js_template);
    utilityService.setBusy(false);
	};

	/**
	 *  The following function $scope.goPage() is used all over the app to move from
	 *  one page to another page. All the back-button throughout the app is call the following
	 *  function to move back or forward.
	 **/
	$scope.goPage = function (page_id) {
		//if (page_id === 1) {
		//	$timeout(function () {
		//		myService.apiResult = STATIC_PAGES.login();
		//		$scope.setPage();
		//	}, 200);
		//} else {
			utilityService.setBusy(true);
			$scope.config.page_id = page_id;
			console.log("go to page>>>" + JSON.stringify(page_id));
			$scope.details = [];
			$scope.data = {};

			if ($scope.is_test) {
				for (ind = 0; ind < samplePages.length; ind++) {
					if (samplePages[ind].page_id == page_id) {
						myService.apiResult = samplePages[ind];
						break;
					}
				}
				$scope.setPage();
			} else {
				var request_data = {
          app: {
            api: {
              "api_mode": "GET",
              "api_type": "get_page",
              "type": "get_page",
              "content": {
                "page_id": page_id,
                "access_token": $localStorage.access_token
              }
            }
          },
          platform: {},
          other_users: {}
				};

				$scope.common_request_handler(request_data);
			}
		//}
	};

	/**
	 *  Following is a simple javscript function which is created to a particular task.
	 *  Basically this function is used to manupulate the api data-content with the the key
	 *  which are used in html to show the content.
	 **/
	function populate_task_obj(obj) {
		var task_obj = obj;
		if (task_obj.status) {
			task_obj.status = JSON.parse(task_obj.status);
		} else {
			task_obj.status = false;
		}
		task_obj.display_if_empty = JSON.parse(task_obj.display_if_empty);
		task_obj.additional_data_fn = task_obj.additional_data_fn ? task_obj.additional_data_fn : 'N/A';
		task_obj.optional_data = JSON.stringify(task_obj.optional_data);
		task_obj.required_data = JSON.stringify(task_obj.required_data);
		return task_obj;
	}

	/**
	 * The `$scope.common_request_handler()` fn is a centralized function which is used to make
	 * any $http request whether it's a GET/POST/PUT/PATCH/DELETE.
	 * This fn is worked on behalf of the programing object as an argument. On behalf of that it will
	 * make api request and do the rest of task step by step like calling api_on_error_fn, api_next_fn,
	 * api_offline_queue and api_offline_fn. These fn are used to work offline and online and do the for
	 * for semi real-time changes.
	 */
	$scope.common_request_handler = function (request_data) {
		request_data.app.api.user_id = $localStorage.user_id;
		request_data.app.api.access_token = $localStorage.access_token;

    var api_url = request_data.app.api.api_url || $scope.api_url + "/master_api_handler";
		var api_mode = request_data.app.api.api_mode || "GET";
		var api_type = request_data.app.api.api_type || "";
		var api_next_fn = request_data.app.api.api_next_fn || "";
		var api_offline_queue = request_data.app.api.api_offline_queue || "";
		var api_offline_fn = request_data.app.api.api_offline_fn || "";
		var api_on_error_fn = request_data.app.api.api_on_error_fn || "";

		delete request_data.app.api.api_url;
		delete request_data.app.api.api_mode;
		delete request_data.app.api.api_type;
		delete request_data.app.api.api_next_fn;
		delete request_data.app.api.api_on_error_fn;
		delete request_data.app.api.api_offline_queue;
		delete request_data.app.api.api_offline_fn;

		api_type = api_type.toUpperCase();
		switch (api_type) {
		case "ADD_DETAIL":
			{
				api_offline_queue = true;
				api_offline_fn = "$scope.mark_detail_pending()";
				api_next_fn = api_next_fn || "$scope.getPage()";
				api_on_error_fn = api_on_error_fn || "$scope.add_error_fn(request_data, err_data)";
				api_mode = "POST";
				break;
			}
		case "DELETE_DETAIL":
			{
				api_offline_queue = true;
				api_offline_fn = "$scope.mark_detail_pending()";
				api_next_fn = api_next_fn || "$scope.deleteDetail(request_data)";
				api_on_error_fn = api_on_error_fn || "$scope.delete_error_fn(request_data, err_data)";
				api_mode = "POST";
				break;
			}
		case "GET_PAGE":
			{
				api_offline_queue = false;
				api_offline_fn = "$scope.goOffline()";
				api_next_fn = "$scope.setPage()";
				api_on_error_fn = api_on_error_fn || "$scope.add_error_fn(request_data, err_data)";
				api_mode = "GET_PAGE";
				break;
			}
		case "UPDATE_GET_USER_TASK":
			{
				api_offline_queue = false;
				api_offline_fn = "$scope.goOffline()";
				api_next_fn = "";
				api_on_error_fn = api_on_error_fn || "";
				api_mode = "GET";
				break;
			}
		case "UPDATE_GET_PAGES":
			{
				api_offline_queue = false;
				api_offline_fn = "$scope.goOffline()";
				api_next_fn = "";
				api_on_error_fn = api_on_error_fn || "";
				api_mode = "GET";
				break;
			}
		case "URL":
			{
				api_offline_queue = false;
				api_offline_fn = "$scope.goOffline()";
				api_next_fn = "";
				api_on_error_fn = api_on_error_fn || "";
				api_mode = "OTHER";
				break;
			}
		case "UPDATE_MORE_INFO":
			{
				api_offline_queue = true;
				api_offline_fn = "$scope.mark_detail_pending()";
				api_next_fn = api_next_fn || "$scope.getPage()";
				api_on_error_fn = api_on_error_fn || "$scope.add_error_fn(request_data, err_data)";
				api_mode = "POST";
				break;
			}
		case "UPDATE_USER_DETAILS":
			{
				api_offline_queue = true;
				api_offline_fn = "$scope.mark_detail_pending()";
				api_next_fn = api_next_fn || "$scope.goPage(2)";
				api_on_error_fn = api_on_error_fn || "$scope.add_error_fn(request_data, err_data)";
				api_mode = "POST";
				break;
			}
		case "UPDATE_EDIT_SHORT_DETAIL":
			{
        var obj = {};
        obj[request_data.app.api.table_data.type] = request_data.app.api.table_data.type;
        request_data.app.api.table_data.type = obj ;
				api_offline_queue = true;
				api_offline_fn = "$scope.mark_detail_pending()";
				api_next_fn = api_next_fn || "$scope.getPage(2)";
				api_on_error_fn = api_on_error_fn || "$scope.add_error_fn(request_data, err_data)";
				api_mode = "POST";
				break;
			}
		case "GET_DATA_FOR_TASK":
			{
				api_offline_queue = false;
				api_offline_fn = "";
				api_next_fn = "";
				api_on_error_fn = api_on_error_fn || "$scope.add_error_fn(request_data, err_data)";
				api_mode = "GET_DATA_FOR_TASK";
				break;
			}
    case "GET_ALL_TASK": {
      api_offline_queue = false;
      api_offline_fn = "";
      api_next_fn = "";
      api_on_error_fn = api_on_error_fn || "$scope.add_error_fn(request_data, err_data)";
      api_mode = "GET_ALL_TASK";
      break;
    }
    case "ADD_DETAIL_TO_TASK":{

      //remove extra data which are mot requried.
      delete request_data.app.api.table_data.type ;
      delete request_data.app.api.table_data.display_if_empty ;
      delete request_data.app.api.table_data.message ;
      delete request_data.app.api.table_data.page_id ;
      delete request_data.app.api.table_data.task_name ;
      api_offline_queue = false;
      api_offline_fn = "";
      api_next_fn = "$scope.success_fn(res_data)";
      api_on_error_fn = api_on_error_fn || "$scope.add_error_fn(request_data, err_data)";
      api_mode = "POST";
      break;
    }

    case "GET_ASSISTANTS": {
      api_offline_queue = false;
      api_offline_fn = "$scope.goOffline()";
      api_next_fn = "";
      api_on_error_fn = api_on_error_fn || "$scope.add_error_fn(request_data, err_data)";
      api_mode = "GET_ASSISTANTS";
      break;
    }
    case "EDIT_ASSISTANTS": {
      api_offline_queue = false;
      api_offline_fn = "$scope.goOffline()";
      api_next_fn = "$scope.goPage(21);";
      api_on_error_fn = api_on_error_fn || "$scope.add_error_fn(request_data, err_data)";
      api_mode = "EDIT_ASSISTANTS";
      break;
    }
    case "ADD_ASSISTANTS":
			{
				api_offline_queue = true;
				api_offline_fn = "$scope.mark_detail_pending()";
				api_next_fn = api_next_fn || "$scope.getPage(20)";
				api_on_error_fn = api_on_error_fn || "$scope.add_error_fn(request_data, err_data)";
				api_mode = "POST";
				break;
			}

    case "GET_USERS_GROUPS": {
      api_offline_queue = false;
      api_offline_fn = "$scope.goOffline()";
      api_next_fn = "";
      api_on_error_fn = api_on_error_fn || "$scope.add_error_fn(request_data, err_data)";
      api_mode = "GET_USERS_GROUPS";
      break;
    }

    case "ADD_ASSISTANT_INTO_GROUP": {
      api_offline_queue = false;
      api_offline_fn = "$scope.goOffline()";
      api_next_fn = "";
      api_on_error_fn = api_on_error_fn || "$scope.add_error_fn(request_data, err_data)";
      api_mode = "ADD_ASSISTANT_INTO_GROUP";
      break;
    }
    case "UPDATE_SCHEDULE": {
      api_offline_queue = false;
      api_offline_fn = "$scope.goOffline()";
      api_next_fn = "$scope.getPage(config.from_page_id)";
      api_on_error_fn = api_on_error_fn || "$scope.add_error_fn(request_data, err_data)";
      api_mode = "UPDATE_SCHEDULE";
      break;
    }
		default:
			{
				api_offline_queue = false;
				api_offline_fn = "$scope.goOffline()";
				api_next_fn = api_next_fn || "$scope.defaultNextFn(request_data, res_data)";
				api_on_error_fn = api_on_error_fn || "";
				api_mode = "OTHER";
				break;
			}
		}

		var isOnline = HttpService.isOnline(); //check if user having internet connectivity
		if (isOnline) { //if network is online
			utilityService.setBusy(true, "Processing...");
			var headers = {
				"Content-Type": "application/json"
			};
			var config = {
				headers: headers
			};
			api_mode = api_mode.toUpperCase();
			if (api_mode == "POST") { //POST request case
        var checkObj = {tableName: request_data.app.api.table_data.table, page_id: request_data.app.api.table_data.page_id};

				$http.post(api_url, request_data, config).then(function (res) {
					var res_data = res.data;
          if(checkObj.tableName == "add_detail") SEMI_REALTIME_CHANGES.UpdateLocalDbPages(checkObj.page_id);
					if (api_next_fn) {
						setTimeout(function() {
							eval(api_next_fn);
						}, 500);
					}
					utilityService.setBusy(false);
				}, function (err_data) {
					console.log("api err>>>", err_data, api_on_error_fn);
					if (api_on_error_fn) {
						eval(api_on_error_fn);
					}
					utilityService.setBusy(false);
				});
			} else if (api_mode == "GET") { //GET Request case
				config.params = request_data;
				$http.get(api_url, config).then(function (res) {
					var res_data = res.data;
					eval(api_next_fn);
					utilityService.setBusy(false);
				}, function (err_data) {
					console.log("api err>>>", err_data);
					utilityService.setBusy(false);
				});
			} else if (api_mode == "GET_PAGE") { //special purpose Get_Page request
        config.params = request_data;
        var page_id   = request_data.app.api.content.page_id || $scope.config.page_id ,
            isPage    = SEMI_REALTIME_CHANGES.isPageExistsInLocalDb(page_id);

        isPage.isExists = false;     //this is for debuging prupose.
        if(isPage.isExists){
          myService.apiResult = isPage.local_pages;
          $scope.setPage();
        }else{
          config.params = {app: {api: { type: "update_get_pages", content: {page_id: page_id, access_token: $localStorage.access_token} }} , platform:{}, other_users:{}};

          var local_user_task = SEMI_REALTIME_CHANGES.IsLocalUserTaskExists();
          if(!utilityService.isEmpty(local_user_task)) {
            config.params.app.api.content.user_task_list = local_user_task ;
            SEMI_REALTIME_CHANGES.RemoveRecordLocally();
          }

          $http.get(api_url, config).then(function (res) {
            //console.log("res>>>>>>>>>>>>>>>>>", res);
            var res_data = res.data.records;
            res_data.status = 1;
            //if(res_data.page_id == 1){
            //  myService.apiResult = STATIC_PAGES.login();
            //}else{
             // SEMI_REALTIME_CHANGES.StoreDataToLocalDb(res_data.req_page); //this stores this requested page into local_db if not exists
              //if(res_data.pages.length) SEMI_REALTIME_CHANGES.StorePagesToLocalDb(res_data.req_page); //this stores all the pages which are sync = 0  on server
              myService.apiResult = res_data.req_page;
            //}
            eval(api_next_fn);
            $ionicScrollDelegate.scrollBottom(true);
            utilityService.setBusy(false);
          }, function (err_data) {
            console.log("api err>>>", err_data);
            if (api_on_error_fn) {
              eval(api_on_error_fn);
            }
            utilityService.setBusy(false);
          });
        }
			} else if (api_mode == "GET_DATA_FOR_TASK") {
				config.params = request_data;
				$http.get(api_url, config).then(function (result) {
					if (result.data.status === 200) {
						var populated_content = result.data.data;
						$scope.temp_data = populated_content.formatted_template;
						$scope.task_arr = populated_content.formatted_task;
						$scope.timeout_arr = populated_content.formatted_timeout;
						$scope.location_arr = populated_content.formatted_location;
						$scope.user_list = populated_content.formatted_user;
						$scope.task_data = populate_task_obj(populated_content.task_obj);
						utilityService.setBusy(false);
					}
				}, function (err) {
					console.log("Error occured while populating result", err);
					utilityService.setBusy(false);
				});
			} else if(api_mode == "GET_ALL_TASK"){
        config.params = request_data;
				$http.get(api_url, config).then(function (result) {
					if (result.data.status === 200) {
						var populated_content = result.data.data;
						$scope.all_task_list = populated_content;
					}
				}, function (err) {
					console.log("Error occured while populating result", err);
					utilityService.setBusy(false);
				});
      }else if(api_mode == "GET_ASSISTANTS"){
        config.params = request_data;
        $timeout(function(){
          utilityService.setBusy(true);
          $http
          .get(api_url, config)
          .then(function(assistants){
            var records = assistants.data.record ,
                myDetails = [];

            if(records.type == "list_assistant"){
              records = records.result;
              if(records && records.length){
                angular.forEach(records, function(item){
                  myDetails.push({
                    "detail_id" :	item._id,
                    "name"      :	(item.firstname||item.lastname) ? (item.firstname + " " + item.lastname) : item.virtual_phone ,
                    "page_id"   :	item._id,
                    "type"      : item.type
                  });
                });
              }
              $scope.details = utilityService.sortByKey(myDetails, "name", {sort: {order: "asc"}});
              utilityService.setBusy(false);
            }else{
              $scope.assistant_list = records.result;
              utilityService.setBusy(false);
            }
          }, function(err_data){
            console.log("err_data", err_data);
            utilityService.setBusy(false);
            if (api_on_error_fn) {
              eval(api_on_error_fn);
            }
          });
        }, 200);
      }else if( api_mode == "EDIT_ASSISTANTS"){
        config.params = request_data ;
        console.log("comes in EDIT_ASSISTANT section");
        $http.get(api_url, config).then(function(api_data){
          $scope.assistant = api_data.data.records;
          $timeout(function(){
            eval(api_next_fn);
          },200);
        }, function(err_data){
          console.log("err_data", err_data);
          utilityService.setBusy(false);
          if (api_on_error_fn) {
            eval(api_on_error_fn);
          }
        });
      }else if( api_mode == "GET_USERS_GROUPS" ){
        config.params = request_data;
        $timeout(function(){
          utilityService.setBusy(true);
          $http
          .get(api_url, config)
          .then(function(users_groups){
            var records = users_groups.data.record , myDetails = [];
            if(records && records.length){
              angular.forEach(records, function(item){
                myDetails.push({
                  "id"        :	item._id,
                  "name"      :	item.group_name || "Anynomous Group",
                  "page_id"   :	item._id,
                  "owner_id"  : item.owner_id
                });
              });
            }
            $scope.details = utilityService.sortByKey(myDetails, "name", {sort: {order: "asc"}});
            utilityService.setBusy(false);
          }, function(err_data){
            console.log("err_data", err_data);
            utilityService.setBusy(false);
            if (api_on_error_fn) {
              eval(api_on_error_fn);
            }
          });
        }, 200);
      }else if(api_mode == "ADD_ASSISTANT_INTO_GROUP"){
        $http.post(api_url, request_data, config).then(function (res) {
					var res_data = res.data;
          utilityService.showAlert("Success: " + res_data.msg ? res_data.msg: "Record updated successfully" );
          utilityService.setBusy(false);
				}, function (err_data) {
					if (api_on_error_fn) eval(api_on_error_fn);
					utilityService.setBusy(false);
				});
      }else if(api_mode == "UPDATE_SCHEDULE"){
        $http.post(api_url, request_data, config).then(function (res) {
					var res_data = res.data;
          $scope.goPage(1504598299371);
          utilityService.setBusy(false);
				}, function (err_data) {
          console.log("error <>>>>>>", err_data);
					if (api_on_error_fn) eval(api_on_error_fn);
					utilityService.setBusy(false);
				});
      }else if (api_mode == "OTHER") { //Un specified case
				if (api_type == "URL") {
					utilityService.setBusy(false);

					var url = request_data.url || "";
					if (url) {
						if (window.cordova) {
							cordova.InAppBrowser.open(url, "_blank", "location=yes");
						} else {
							window.open(url, "_system");
						}
					} else {
						utilityService.showAlert("Warning: URL is missing.");
					}
				}
			} else {
				console.log("Warning: api_mode is missing.");
				utilityService.setBusy(false);
			}
		} else { //offline

			if (api_offline_queue) { //save to queue
				var offline_data = JSON.parse($localStorage.offline_queue);
				if (Object.prototype.toString.call(offline_data) !== '[object Array]') {
					offline_data = [];
				}
				var queue_data = {
					"page_id": $scope.config.page_id,
					"api_type": api_type,
					"api_url": api_url,
					"api_mode": api_mode,
					"request_data": request_data
				};
				offline_data.push(queue_data);
				$localStorage.offline_queue = JSON.stringify(offline_data);
			}
			if (api_offline_fn) {
				eval(api_offline_fn);
			}
		}
	};
  /**
   *  Add Assistants to random group so user can edit it after.
   **/
  $scope.addAssistantToGroup = function(){
    var params = {
          app: {
            api: {
              api_mode: 'POST',
              api_type: 'ADD_DETAIL',
              table: 'add_assistant_to_groups',
              table_data: {
                assistants: $scope.details
              }
            }
          },
          platform: {},
          other_user: {}
        };
    $scope.config.page_id = 20;
    $scope.common_request_handler(params);
  };
  /**
   * Edit group function to update groupName
   **/
  $scope.goToGroupDetail = function(item){
    $scope.group_info = {
      group_id : item.id,
      page_id  : 25
    };
    $scope.goPage($scope.group_info.page_id);
  };

  /**
   * Delete Group function to delete from database
   **/
  $scope.deleteGroup = function(item){
    var params = {
      app: {
        api: {
          api_mode: 'POST',
          api_type: 'DELETE_DETAIL',
          table: 'delete_group',
          table_data: {
           id : item.id
          }
        }
      },
      platform: {},
      other_user: {}
    };
    $scope.common_request_handler(params);
  };

  /**
   *  Edit assistant method come below
   **/
  $scope.editAssistant = function(item){
    var params = {
      "app": {
        "api": {
          "api_mode": "GET",
          "api_type": "EDIT_ASSISTANTS",
          "type" : "get_assistant_by_id",
          "content" : {
          "access_token": $localStorage.access_token,
          "user_id": item.detail_id
          }
        }
      },
      "platform": {},
      "other_user": {}
    };
    $scope.common_request_handler(params);
  };

  /**
   *  Update assistant details
   **/
  $scope.updateAssistantDetail = function(assistant){
    var params = {
          app: {
            api: {
              api_mode: 'POST',
              api_type: 'ADD_DETAIL',
              table: 'update_assistant',
              table_data: {
                user_id: assistant._id,
                first_name: assistant.firstname,
                last_name : assistant.lastname,
                email     : assistant.email,
                phone     : assistant.phone,
                deviceId  : assistant.device_id,
                push_accepted: assistant.push_accepted
              }
            }
          },
          platform: {},
          other_user: {}
        };
    $scope.config.page_id = 20;
    $scope.common_request_handler(params);
  };

  $scope.deleteAssistant = function(item){
     var params = {
      app: {
        api: {
          api_mode: 'POST',
          api_type: 'DELETE_DETAIL',
          table: 'delete_assistant',
          table_data: {
           id : item.detail_id,
           group_id : $scope.group_info.group_id
          }
        }
      },
      platform: {},
      other_user: {}
    };
    $scope.common_request_handler(params);
  };

  /**
	 * The following fn $scope.logout() is used to logout user from app
	 * and clear all saved local_data and re-directed to login page.
	 **/
	$scope.logout = function () {
		delete $localStorage.access_token;
    SEMI_REALTIME_CHANGES.RemoveItemFromDB();
		$scope.goPage(1);
	};

	/**
	 * The following fn $scope.editUser() is used to re-direct user to
	 * edit user detail page with the required config data values.
	 **/
	$scope.editUser = function () {
		$scope.config.from_page_id = 2;
		$scope.config.task_name = "User edit";
		var page_id = 14;
		$scope.goPage(page_id);
	};

	/**
	 * The following fn $scope.sortDetail() is used to sort the
	 * Item on page.
	 **/
	$scope.sortDetail = function () {
		$scope.sort.order = ($scope.sort.order == "asc") ? "desc" : "asc";
		$scope.details = utilityService.sortByKey($scope.details, $scope.sort.key, $scope.sort.order);
	};

	/**
	 * The following fn $scope.subDetails() is re-direct to sub pages.
	 **/
	$scope.subDetails = function (item) {
    console.log("item >>>>>>>>>>>>>", item);
    if($scope.config.from_page_id == $scope.config.page_id){
      var task_info = myService.getTaskInfo();
      $scope.config.from_page_id = task_info.from_page_id;
    }else{
      $scope.config.from_page_id = $scope.config.page_id;
    }
		$scope.config.task_name = item.name;
    $scope.goPage(item.page_id);
	};

  $scope.addThisDetailToNewTask = function(shortInfo){
    $scope.addDetailToTask = angular.copy(shortInfo);
    var req_obj = {
        "app": {
          "api": {
            "api_mode": "GET",
            "api_type": "get_all_task",
            "type" : "get_all_task",
            "content" : {
              "access_token": $localStorage.access_token,
              "task_id": $scope.config.edit_task_id
            }
          }
        },
        "platform": {},
        "other_user": {}
      };
    $scope.common_request_handler(req_obj);
    $timeout(function(){
      $scope.goPage(19);
    }, 200);
  };
	/**
	 * The following fn $scope.editDetails() is used to re-direct to short details
	 * page where user can edit some of the deatails only
	 * basically the page_id = 15;
	 **/
	$scope.editDetails = function (item) {
		$scope.config.from_page_id = $scope.config.page_id;
		$scope.config.task_name = item.name;
		$scope.config.edit_task_id = $scope.config.task_id;
		$scope.short_info = {
			"detail_id": item.id,
			"message": item.name,
			"page_id": item.page_id,
			"task_name": $scope.config.task_name,
			"display_if_empty": item.display_if_empty,
			"type": item.type.public ? item.type.public : item.type.private
		};
		var page_id = 15;
		$scope.goPage(page_id);
	};

	/**
	 * The following fn $scope.moreDetails() is used to re-direct to moreDetails
	 * page where user can edit deatails basically the page_id = 16;
	 **/
	$scope.moreDetails = function (item) {
		$scope.config.from_page_id = $scope.config.page_id;
		$scope.config.task_name = item.name;
		$scope.config.edit_task_id = item.page_id;
		var page_id = 16;
		$scope.goPage(page_id);
	};

	/**
	 * The following fn $scope.deleteDetail() is remove record from
	 * list showing in app.
	 **/
	$scope.deleteDetail = function (request_data) {
		var item_id = request_data.app.api.table_data.id;
		angular.forEach($scope.details, function (value, key) {
      if(value.id){
        if (value.id == item_id) {
          $scope.details.splice(key, 1);
        }
      }else{
        if (value.detail_id == item_id) {
          $scope.details.splice(key, 1);
        }
      }
		});
    if (!$scope.$$phase) {
      $scope.$apply();
    }
	};

	/**
	 * The following fn $scope.goSearch() is re-direct to Search page.
	 **/
	$scope.goSearch = function () {
		$scope.config.from_page_id = $scope.config.page_id;
		$scope.config.edit_task_id = $scope.config.task_id;
		var page_id = 17;
		$scope.goPage(page_id);
	};
	/**
	 * The following fn $scope.getPage() is used to get specific page.
	 * but this function is used in $scope.common_request_handler() fn as
	 * a after_next_fn for add_details in after_next_fn.
	 **/
	$scope.getPage = function () {
		utilityService.setBusy(true);
		$scope.details = [];
		$scope.data = {};

		$timeout(function () {
			HttpService.getServerPage($scope.config.page_id).then(function (result) {
				myService.apiResult = result;
				$scope.setPage();
			});
		}, 1000);
	};

	/**
	 * The following function is used when user is offline and need to do
	 * process offline queue tasks.
	 */
	$scope.goOffline = function () {
		console.log("go to offline page");
		$scope.prev_page_id = $scope.config.page_id;

		var offlineResult = {};
		var page_id = 12;
		for (ind = 0; ind < samplePages.length; ind++) {
			if (samplePages[ind].page_id == page_id) {
				offlineResult = samplePages[ind];
				break;
			}
		}
		var header_html = offlineResult.task.template.header.html;
		var detail_html = offlineResult.task.template.detail.html;
		var footer_html = offlineResult.task.template.footer.html;
		$scope.html = header_html + detail_html + footer_html;

		var js_template = offlineResult.task.template.header.js;
		eval(js_template);
	};

	/**
	 * The following function are used in offline queue processing
	 * and not implemented or used.
	 */
	$scope.goPrevPage = function (prev_page_id) {
		console.log("go to prev page>>> id:" + prev_page_id);
		$scope.config.page_id = prev_page_id;
		$scope.setPage();
	};
	$scope.mark_detail_pending = function (request_data) {
		console.log("detail pending", request_data);
	};
	$scope.delete_error_fn = function (request_data, err_data) {
		utilityService.showAlert("Error: " + err_data.data.msg);
	};

  $scope.success_fn = function(res_data){
    utilityService.showAlert("Success: " + res_data.msg ? res_data.msg: "Record updated successfully" );
  };
	$scope.add_error_fn = function (request_data, err_data) {
    console.log("err_data", err_data);
		utilityService.showAlert("Error: " + err_data.data ? err_data.data.msg : "error");
	};
	$scope.defaultNextFn = function (request_data, res_data) {
		console.log(request_data, res_data);
	};


	/**
	 *  The following functions are utinlity function to manage scroll and ionic keyboard etc.
	 */
	$scope.inputUp = function () {
		if (isIOS) $scope.data.keyboardHeight = 216;
		$timeout(function () {
			$ionicScrollDelegate.scrollBottom(true);
		}, 300);
	};

	$scope.inputDown = function () {
		if (isIOS) $scope.data.keyboardHeight = 0;
		$ionicScrollDelegate.resize();
	};
	$scope.closeKeyboard = function () {
		// cordova.plugins.Keyboard.close();
	};
	//init
	$scope.init();

	/**
	 *  Socket Events are handled from below and used under
	 *  Chatbot section for example typing and push chatbot message
	 *  to admin user i.e to Roger user.
	 **/
	var inputChangedPromise;
	$scope.updateTyping = function () {
		var logged_user = myService.getUserInfo();
		var task_obj = myService.getTaskInfo();
		SocketBroadCastEvents.typing({
			user_id: task_obj.task_name,
			phone: logged_user.virtual_phone ,
      name : (logged_user.firstname + ' '+ logged_user.lastname ) || logged_user.virtual_phone
		});

		if (inputChangedPromise) {
			$timeout.cancel(inputChangedPromise);
		}

		inputChangedPromise = $timeout(function () {
			SocketBroadCastEvents.stopTyping({
				user_id: task_obj.task_name,
				phone: logged_user.virtual_phone
			});
		}, 200);
	};

	/**
	 *all listner event start from here
	 **/
  SocketListnerEvents.newDataFromRecievedServer(function(err, obj){
    console.info("New data Recieved from server.....", err, obj);
    //var page_id = obj.detail_obj.page_id || $scope.config.page_id ,
    //    isRefresh = false , logged_user = myService.getUserInfo();
    //SEMI_REALTIME_CHANGES.UpdateLocalDbPages(page_id);
    //
    //angular.forEach(obj.subscribed_users, function(user_task){
    //  if(user_task.user_id == logged_user._id){
    //    isRefresh = true;
    //  }
    //});
    //if(isRefresh) $scope.goPage($scope.config.page_id || 2);
  });

	SocketListnerEvents.typingListner(function (err, obj) {
		var task_obj = myService.getTaskInfo();
		if (Number(obj.user_id) == Number(task_obj.task_name)) {
				$scope.isTyping = true;
        $scope.typingUserName = obj.name ;
				$ionicScrollDelegate.scrollBottom(true);
				if (!$scope.$$phase) {
					$scope.$apply();
				}
		} else {
			$scope.isTyping = false;
		}
	});

	SocketListnerEvents.stopTypingListner(function (err, obj) {
		var task_obj = myService.getTaskInfo();

		if (Number(obj.user_id) == Number(task_obj.task_name)) {
				$scope.isTyping = false;
				if (!$scope.$$phase) {
					$scope.$apply();
				}
		} else {
			$scope.isTyping = false;
		}
	});

	SocketListnerEvents.messageListner(function (err, obj) {
		var task_obj = myService.getTaskInfo();
		var logged_user = myService.getUserInfo();

		if (obj.isTrigerGetPage) {
			$timeout(function () {
				$scope.goPage($scope.config.page_id);
				console.log("going to execute after 2 second.");
			}, 2000);
		} else {
			if (Number(obj.phone) == Number(task_obj.task_name)) {
				if (logged_user._id !== obj.user_id) {
					$ionicScrollDelegate.scrollBottom(true);
					$scope.messages.push(obj.msg);
					if (!$scope.$$phase) {
						$scope.$apply();
					}
				}
			} else if ((task_obj.task_name == "Chatbot") && (obj.user_id == logged_user.phone)) {
				$ionicScrollDelegate.scrollBottom(true);
				$scope.messages.push(obj.msg);
				if (!$scope.$$phase) {
					$scope.$apply();
				}
			} else {
				console.log("Unable to get Obj message", err, obj.msg);
			}
		}
	});


	/**
	 * Users under masterbot if they type any message then those message will send
	 * from this message which was previously in 99_h header template
	 * */
	$scope.sendChatBotMessage = function (message) {
			var logged_user = myService.getUserInfo(),
			task_obj = myService.getTaskInfo(),
      message_obj = {
				user_id     : logged_user._id,
				type        : "mine",
				message     : message,
				date_created: new Date().getTime(),
        processed   : 2,
        status      : 2,
        detail_type : {
          "public"  : "public"
        }
			};

		$scope.messages.push(message_obj);
    
    SocketBroadCastEvents.pushMessage({
			isTrigerGetPage: true,
			user_id: task_obj.task_name,
			phone: logged_user.virtual_phone,
			msg: message_obj
		});
    
		utilityService.setBusy(true, 'Processing....');
		var headers = {
			"Content-Type": "application/json"
		};
		var config = {
			headers: headers
		};

		$http.post(APIROOT + '/user_chatbot_response', {
			"task_name"     : task_obj.task_name,
      "responder_user": {
        "user_id" : logged_user._id ,
        "firstname": logged_user.firstname,
        "lastname" : logged_user.lastname,
        "phone"   : logged_user.virtual_phone
      },
			"msg"         : message
		}, config).then(function () {
			utilityService.setBusy(false);
			$ionicScrollDelegate.scrollBottom(true);
		}, function (err) {
			console.log("Error while processing request.", err);
			utilityService.setBusy(false);
      utilityService.showAlert("Error while processing request.");
		});
		$scope.data.message = "";
	};

	/**
	 *  Sending Chatbot req from user
	 *  chatbot scren using the following method which was
	 *  previously in 18_h header template
	 **/

	$scope.showSendMessage = function (message) {
		var d = new Date(),
			dt = d.toLocaleDateString() + " " + d.toLocaleTimeString().replace(/:\d+ /, " "),
			logged_user = myService.getUserInfo(),
			task_obj = myService.getTaskInfo(),
			message_obj = {
				user_id: logged_user._id,
				type: "mine",
				message: message,
				date_created: dt
			};

		$scope.messages.push(message_obj);
		SocketBroadCastEvents.pushMessage({
			isTrigerGetPage: true,
			user_id: task_obj.task_name,
			phone: logged_user.virtual_phone,
			msg: message_obj
		});

		utilityService.setBusy(true, 'Processing....');
		var headers = {
			"Content-Type": "application/json"
		};

		var config = {
			headers: headers
		};

		$http.post(APIROOT + '/ask_chatbot', {
      "chatbot_user": {
        "user_id"  : logged_user._id ,
        "phone"    : logged_user.virtual_phone,
        "firstname": logged_user.firstname,
        "lastname" : logged_user.lastname,
        "type"     : logged_user.type
      },
			"phone": logged_user.virtual_phone,
			"body": message
		}, config).then(function (result) {
			utilityService.setBusy(false);
			$ionicScrollDelegate.scrollBottom(true);
			$scope.messages.push({
				user_id: logged_user._id,
				type: "other",
				message: result.data.data,
				date_created: dt
			});
		}, function (err) {
			console.log("Error while processing request.", err);
			utilityService.setBusy(false);
      utilityService.showAlert("Error while processing request.");
		});
		delete $scope.data.message;
	};



});//module closing brackets
