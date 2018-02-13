(function(angular, DomenowApp, undefined) {
	DomenowApp
		.service('ServiceHandler', CommonServiceHandler);

	function CommonServiceHandler($rootScope, $http, $localStorage, HttpService, SEMI_REALTIME_CHANGES, SocketBroadCastEvents, utilityService, $ionicScrollDelegate, myService, $timeout, $q) {
		var self = this, canceller;
		/*
		 *       request function handling all type of requests likes POST,GET,UPDATE_SCHEDULE
		 *
		 */
		self.Request = function($scope, request_data, api_url, api_mode, api_type, api_next_fn, api_offline_queue, api_offline_fn, api_on_error_fn) {
			var isOnline = HttpService.isOnline(); //check if user having internet connectivity
			if (isOnline) { //if network is online
				utilityService.setBusy(true, "Processing...");
				var config = { headers: { "Content-Type": "application/json" } };
				api_mode = api_mode.toUpperCase();
				if (api_mode == "POST" || api_mode == "UPDATE_SCHEDULE" || api_mode == "ADD_ASSISTANT_INTO_GROUP" || api_mode == "CHATBOT" || api_mode == "UPDATE_COUNTS") { //POST request case
					self.postRequest(config, $scope, request_data, api_url, api_mode, api_type, api_next_fn, api_offline_queue, api_offline_fn, api_on_error_fn);
				} else if (api_mode == "GET" || api_mode == "GET_DATA_FOR_TASK" || api_mode == "GET_ALL_TASK" || api_mode == "GET_ASSISTANTS" || api_mode == "EDIT_ASSISTANTS" || api_mode == "GET_USERS_GROUPS" || api_mode == "PAGINATION_METHOD" || api_mode == "ALL_USER_PAGES" || api_mode == "GET_PAGE") { //GET Request case
					self.getRequest(config, $scope, request_data, api_url, api_mode, api_type, api_next_fn, api_offline_queue, api_offline_fn, api_on_error_fn);
				} else if (api_mode == "OTHER") { //Un specified case
					self.requestOtherType(config, $scope, request_data, api_url, api_mode, api_type, api_next_fn, api_offline_queue, api_offline_fn, api_on_error_fn);
				} else {
					console.log("Warning: api_mode is missing.");
					utilityService.setBusy(false);
				}
			} else { //offline
				self.offlineQueue($scope, request_data, api_url, api_mode, api_type, api_next_fn, api_offline_queue, api_offline_fn, api_on_error_fn);
			}
		};

		self.chatBotResponse = function() {
			utilityService.setBusy(false);
			$ionicScrollDelegate.scrollBottom(true);
		};
		/*
		 *error handling and show error popup
		 */

		self.add_error_fn = function(request_data, err_data) {
			console.log("err_data", err_data);
			if (err_data.data) {
				if (err_data.data.msg) {
					utilityService.showAlert("Error: " + err_data.data ? err_data.data.msg : "error");
				} else {
					utilityService.showAlert("Error: something went wrong. ");
				}
			} else {
				utilityService.showAlert("Error: something went wrong. ");
			}
		};

		self.errorResponse = function($scope, api_on_error_fn, request_data, err_data) {
			if (api_on_error_fn) {
				eval(api_on_error_fn);
			}
			utilityService.setBusy(false);
		};

		/*
		 *postRequest function handling POST,UPDATE_SCHEDULE,ADD_ASSISTANT_INTO_GROUP requests to server
		 */

		self.postRequest = function(config, $scope, request_data, api_url, api_mode, api_type, api_next_fn, api_offline_queue, api_offline_fn, api_on_error_fn) {
			if (api_mode == "POST") {
				var checkObj = {
					tableName: request_data.app.api.table_data.table,
					page_id: request_data.app.api.table_data.page_id
				};
			}
			$http.post(api_url, request_data, config).then(function(res) {
				if (api_mode == "POST") {
					self.postDataResponse($scope, res, checkObj, api_next_fn);
				} else if (api_mode == "UPDATE_SCHEDULE") {
					self.updateScheduleResponse($scope, res);
				} else if (api_mode == "ADD_ASSISTANT_INTO_GROUP") {
					self.addAssistantIntoGroup($scope, res);
				} else if (api_mode == "CHATBOT") {
					self.chatBotResponse();
				} else if( api_mode == "UPDATE_COUNTS"){
					var res_data = res.data;
					if(res_data.data){
						SEMI_REALTIME_CHANGES.makePageUnDirty(res_data.data);	
					}
					console.info("Counts updated on node-red server successfully");
				}else{
					console.info("Un-Expacted case for Post request response.");
				}
			}, function(err_data) {
				console.log("api err>>>", err_data, api_on_error_fn);
				self.errorResponse($scope, api_on_error_fn, request_data, err_data);
			});
		};
		/*
		 *updateScheduleResponse function handling  response of UPDATE_SCHEDULE type request
		 */
		self.updateScheduleResponse = function($scope, res) {
			var res_data = res.data,
				page_id = res_data.payload.company_detail.page_id || request_data.app.api.table_data.page_id;
			SEMI_REALTIME_CHANGES.UpdateLocalDbPages(page_id);
			$scope.goPage(26);
		};
		/*
		 *postDataResponse function handling  response of POST type request
		 */
		self.postDataResponse = function($scope, res, checkObj, api_next_fn) {
			var res_data = res.data;
			if (checkObj.tableName == "add_detail") SEMI_REALTIME_CHANGES.UpdateLocalDbPages(checkObj.page_id);
			if (api_next_fn) {
				setTimeout(function() {
					eval(api_next_fn);
				}, 500);
			}
			utilityService.setBusy(false);
		};
		/*
		 *requestForAllUserPages function handling  request parms 
		 */

		self.requestForAllUserPages = function(config) {
			config.params = {
				app: {
					api: {
						type: "update_get_pages",
						content: {
							page_id: 2,
							access_token: $localStorage.access_token,
							phone: $localStorage.logger_user_phone,
							all_pages: true
						}
					}
				},
				platform: {},
				other_users: {}
			};
		};
		/*
		 *getRequest function handling  parms  for ALL_USER_PAGES,GET_PAGE 
		 */
		self.getRequest = function(config, $scope, request_data, api_url, api_mode, api_type, api_next_fn, api_offline_queue, api_offline_fn, api_on_error_fn) {
			var page_id = request_data.app.api.content.page_id;
			if (api_mode == 'ALL_USER_PAGES') {
				self.requestForAllUserPages(config);
			} else if (api_mode == "GET_PAGE") {
				self.pageRequest(config, page_id);
			} else {
				config.params = request_data;
			}
			self.getPageExisting($scope, api_next_fn, request_data, api_on_error_fn, page_id, api_url, config, api_mode);
		};
		/*
		 *hitApiForGetData function handling  all GET types of requests  
		 */
		self.hitApiForGetData = function($scope, api_next_fn, request_data, api_on_error_fn, api_url, config, api_mode, page_id) {
			if (canceller) canceller.resolve("User Intrupt");
			
			//creating the defered object
			canceller = $q.defer();
			config.timeout = canceller.promise;
			$timeout(function() {
				console.log("Comes inside the hitApiGetData method..........", request_data);
				$http.get(api_url, config).then(function(res) {
					if (api_mode == "ALL_USER_PAGES") {
						self.getAllUsersPages($scope, res);
					} else if (api_mode == "GET") {
						self.updateGet($scope, res, api_next_fn);
					} else if (api_mode == "GET_DATA_FOR_TASK") {
						self.getDataForTasksRequest($scope, res);
					} else if (api_mode == "GET_ALL_TASK") {
						self.getAllTasks($scope, res);
					} else if (api_mode == "GET_ASSISTANTS") {
						self.getAssistantsRequest($scope, res);
					} else if (api_mode == "EDIT_ASSISTANTS") {
						self.editAssistantsRequest($scope, res, api_next_fn);
					} else if (api_mode == "GET_USERS_GROUPS") {
						self.getUsersGroups($scope, res);
					} else if (api_mode == "PAGINATION_METHOD") {
						self.getPagination($scope, res);
					} else if (api_mode == "GET_PAGE") {
						if (page_id == 1 || page_id == 11) {
							self.getPageRequestResponseForStartupPage($scope, res);
						} else {
					
							var local_user_task = SEMI_REALTIME_CHANGES.IsLocalUserTaskExists($scope.config.from_page_id);
							if (!utilityService.isEmpty(local_user_task)) {
								config.params.app.api.content.user_task_list = local_user_task;
							}
							self.getPageRequestResponse($scope, res);
						}
					}
				}, function(err_data) {
					console.log("api err>>>", err_data);
					self.errorResponse($scope, api_on_error_fn, request_data, err_data);
				});
			}, 200);
		};
		/*
		 *getAllTasks function handling  response of GET_ALL_TASK type request 
		 */

		self.getAllTasks = function($scope, res) {
			if (res.data.status === 200) {
				var populated_content = res.data.data;
				$scope.all_task_list = populated_content;
			}
		};
		/*
		 *getAssistantsRequest function handling  response of GET_ASSISTANTS type request 
		 */

		self.getAssistantsRequest = function($scope, res) {
			var records = res.data.record,
				myDetails = [];

			if (records.type == "list_assistant") {
				records = records.result;
				if (records && records.length) {
					angular.forEach(records, function(item) {
						myDetails.push({
							"detail_id": item._id,
							"name": (item.firstname || item.lastname) ? (item.firstname + " " + item.lastname) : item.virtual_phone,
							"page_id": item._id,
							"type": item.type
						});
					});
				}
				$scope.details = utilityService.sortByKey(myDetails, "name", {
					sort: {
						order: "asc"
					}
				});
				utilityService.setBusy(false);
			} else {
				$scope.assistant_list = records.result;
				utilityService.setBusy(false);
			}
		};
		/*
		 *getDataForTasksRequest function handling  response of GET_DATA_FOR_TASK type request 
		 */
		self.getDataForTasksRequest = function($scope, res) {
			if (res.data.status === 200) {
				var populated_content = res.data.data;
				$scope.temp_data = populated_content.formatted_template;
				$scope.task_arr = populated_content.formatted_task;
				$scope.timeout_arr = populated_content.formatted_timeout;
				$scope.location_arr = populated_content.formatted_location;
				$scope.user_list = populated_content.formatted_user;
				$scope.task_data = populate_task_obj(populated_content.task_obj);
				utilityService.setBusy(false);
			}
		};
		/*
		 *getPagination function handling  response of PAGINATION_METHOD type request 
		 */
		self.getPagination = function($scope, responseData) {
			$scope.updateBookmark(responseData.data);
			//going to update the pageData with new paginated data comes from server
			$scope.updatePageData(responseData.data);
			utilityService.setBusy(false);

		};
		/*
		 *getUsersGroups function handling  response of GET_USERS_GROUPS type request 
		 */
		self.getUsersGroups = function($scope, res) {
			var records = res.data.record,
				myDetails = [];
			if (records && records.length) {
				angular.forEach(records, function(item) {
					myDetails.push({
						"id": item._id,
						"name": item.group_name || "Anynomous Group",
						"page_id": item._id,
						"owner_id": item.owner_id
					});
				});
			}
			$scope.details = utilityService.sortByKey(myDetails, "name", {
				sort: {
					order: "asc"
				}
			});
			utilityService.setBusy(false);
		};
		/*
		 *editAssistantsRequest function handling  response of EDIT_ASSISTANTS type request 
		 */
		self.editAssistantsRequest = function($scope, res, api_next_fn) {
			$scope.assistant = res.data.records;
			$timeout(function() {
				eval(api_next_fn);
			}, 200);
		};

		/*
		 *addAssistantIntoGroup function handling  response of ADD_ASSISTANT_INTO_GROUP type request 
		 */

		self.addAssistantIntoGroup = function($scope, res) {
			var res_data = res.data;
			SEMI_REALTIME_CHANGES.UpdateLocalDbPages(25);
			utilityService.showAlert("Success: " + res_data.msg ? res_data.msg : "Record updated successfully");
			utilityService.setBusy(false);

		};
		/*
		 *updateGet function handling  response of GET type request 
		 */
		self.updateGet = function($scope, res, api_next_fn) {
			var res_data = res.data;
			eval(api_next_fn);
			utilityService.setBusy(false);
		};
		/*
		 *getAllUsersPages function handling  response of ALL_USER_PAGES type request 
		 */

		self.getAllUsersPages = function($scope, res) {

			var res_data = res.data.records;
			$scope.isPaginated = false;
			if (!utilityService.isEmpty(res_data.pages)) {
				SEMI_REALTIME_CHANGES.SaveAllPages({
					user_id: $localStorage.user_id
				}, res_data.pages);
			} else {
				console.info("There isn't any new pages on server.....");
			}

		};
		/*
		 *requestOtherType function handling  OTHER mode request 
		 */
		self.requestOtherType = function(config, $scope, request_data, api_url, api_mode, api_type, api_next_fn, api_offline_queue, api_offline_fn, api_on_error_fn) {
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

		};
		/*
		 *offlineQueue function handling offline requests  
		 */
		self.offlineQueue = function($scope, request_data, api_url, api_mode, api_type, api_next_fn, api_offline_queue, api_offline_fn, api_on_error_fn) {
			if (api_offline_queue) { //save to queue
				var offline_data = JSON.parse($localStorage.offline_queue);
				if (Object.prototype.toString.call(offline_data) !== '[object Array]') {
					offline_data = [];
				}
				var queue_data = {
					"page_id": request_data.app.api.content.page_id,
					"api_type": api_type,
					"api_url": api_url,
					"api_mode": api_mode,
					"request_data": request_data
				};
				offline_data.push(queue_data);
				$localStorage.offline_queue = JSON.stringify(offline_data);
			}
			eval(api_offline_fn);
		};
		/*
		 *getPageRequestResponseForStartupPage function handling response of GET_PAGE 1,11
		 */

		self.getPageRequestResponseForStartupPage = function($scope, res) {
			var res_data = res.data.records;
			res_data.status = 1;
			console.info("No need to save Login and verify page into local_db.");
			myService.apiResult = res_data.req_page;
			$scope.setPage();
		};
		/*
		 *getPageRequestResponse function handling response of GET_PAGE type request
		 */
		self.getPageRequestResponse = function($scope, res) {
			var res_data = res.data.records;
			page_id = res_data.req_page.page_id;
			res_data.status = 1;
			
			console.log("Reached herer......... with response", res_data);
			
			//page_data, isCurrent, isDirty 3 arg need for this fn.
			SEMI_REALTIME_CHANGES.StoreDataToLocalDb(res_data.req_page, false); //this stores this requested page into local_db if not exists
			if (res_data.pages.length) {
				SEMI_REALTIME_CHANGES.StorePagesToLocalDb(res_data.pages); //this stores all the pages which are sync = 0  on server
				SEMI_REALTIME_CHANGES.SaveAllPages(res_data.pages.push(res_data.req_page)); //replace/update pages into all new_pages
			}
			//going to update Bookmark data for that page into $localStorage
			if (res.data.bookmark) {
				delete $localStorage.initialBookmark;
				$localStorage.initialBookmark = res.data.bookmark;
				$scope.updateBookmark(res.data);
			}
			//update myService with latest record with server data
			myService.apiResult = res_data.req_page;
			$scope.isPaginated = false;
			$scope.setPage();
			SocketBroadCastEvents.onPageChangeSuccessfully(page_id); //update new page_id to web-socket server.
			
			SEMI_REALTIME_CHANGES.SaveAllPages({
				user_id: $localStorage.user_id
			}, [res_data.req_page]); //update/replace pages into all new_pages
			utilityService.setBusy(false);
		};
		/*
		 *getExistingPageData function handling local database if existing
		 */
		self.getExistingPageData = function($scope, isPage, api_next_fn, page_id) {
			if ($localStorage.initialBookmark) {
				delete $localStorage.bookmark;
				$localStorage.bookmark = $localStorage.initialBookmark;
			}
			myService.apiResult = isPage.local_pages;
			$scope.isPaginated = false;
			eval(api_next_fn);
			SocketBroadCastEvents.onPageChangeSuccessfully(page_id);
		};
		/*
		 *pageRequest function handling parms for GET_PAGE type request
		 */
		self.pageRequest = function(config, page_id) {
			config.params = {
				app: {
					api: {
						type: "update_get_pages",
						content: {
							page_id: page_id,
							access_token: $localStorage.access_token,
							phone: $localStorage.logged_user_phone
						}
					}
				},
				platform: {},
				other_users: {}
			};
		};
		/*
		 *getPageExisting function handling check page exist in local database 
		 *otherwise hit to server 
		 */
		self.getPageExisting = function($scope, api_next_fn, request_data, api_on_error_fn, page_id, api_url, config, api_mode) {
			if (page_id == 1 || page_id == 11) {
				self.hitApiForGetData($scope, api_next_fn, request_data, api_on_error_fn, api_url, config, api_mode, page_id);
			} else {

				if (api_mode == "PAGINATION_METHOD") {
					self.hitApiForGetData($scope, api_next_fn, request_data, api_on_error_fn, api_url, config, api_mode, page_id);
				} else {
					//console.log("comes here.........");
					//update counts on local temp_pages;
					if(api_mode == "GET_PAGE"){
						SEMI_REALTIME_CHANGES.setUserPageCountToDefault(page_id);
						SEMI_REALTIME_CHANGES.isPageExistsInLocalDb(page_id, function(err, isPage) {
							if (err) {
								console.log("Error while fetching the page", err);
							} else {
								if (isPage.isExists) {
									self.updateCountsOnServer($scope);
									self.getExistingPageData($scope, isPage, api_next_fn, page_id);
								} else {
									self.updateCountsOnServer($scope);
									self.hitApiForGetData($scope, api_next_fn, request_data, api_on_error_fn, api_url, config, api_mode, page_id);
								}
							}
						});	
					}else{
						self.updateCountsOnServer($scope);
						self.hitApiForGetData($scope, api_next_fn, request_data, api_on_error_fn, api_url, config, api_mode, page_id);
					}		
				}
			}
		};
		
		self.updateCountsOnServer = function($scope){
            var user_page = SEMI_REALTIME_CHANGES.getAllUserPages(),
                user_obj  = myService.getUserInfo();
            
            if(utilityService.isEmpty(user_page)){
                console.info("There is nothing to update on node-red server regarding the user_page counts");    
            }else{
                var api_url     = $scope.api_url + "/master_api_handler",
                    req_data    = { app: { api: { api_type: 'UPDATE_COUNTS', table: 'update_counts', table_data: {user: user_obj, data: user_page} } }, platform: {}, other_user: {} };
                    
                self.Request(null, req_data, api_url, "UPDATE_COUNTS", null, null, null, null, null);
            }
        };
		
	}
})(angular, DomenowApp);