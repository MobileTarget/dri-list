/********* controllers ***********/
DomenowApp.controller('TodoCtrl', function(APIROOT, $scope, $state, $timeout, $interval,
	$ionicScrollDelegate, $ionicPopup, $http, $templateRequest, $localStorage, $q, $window,
	myService, utilityService, HttpService, BluemixService, $rootScope,
	Task, dbService, SocketBroadCastEvents, SocketListnerEvents, STATIC_PAGES, SEMI_REALTIME_CHANGES,
	$cordovaLocalNotification, ServiceHandler, CommonRequestHandler) {

	var isIOS = ionic.Platform.isIOS();

	/**
	 * Following angular $scope variable are used as a global config variable
	 * and were used in all over the code. Some $scope variable are global to the
	 * controller and are used in service's and factories.
	 **/
	$scope.config = {
		page_id: $localStorage.access_token ? 2 : 1,
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
	$scope.verification = {
		code1: "",
		code2: "",
		code3: "",
		code4: ""
	}; //used for verification screen
	$scope.data = {};
	$scope.html = "";
	$scope.isTyping = false;
	$scope.isPaginated = false;

	
	/**
	 *	Update PageCount when app is resumed or open 
	 **/
	ServiceHandler.updateCountsOnServer($scope);
	

	/**
	 *  Following watcher is used for the Verification screen
	 **/
	$scope.$watchCollection("verification", function(n, o) {
		if (n !== o) {
			$scope.verify(n);
		}
	});
	/**
	 *  Push notification callback listner and moved page to request one
	 **/
	$scope.$on("push$Notification$CallBack$Listner", function(evt, pushMessageObj) {
		console.info("Push notification data.", pushMessageObj);
		try {
			if (isIOS) {
				var payload = JSON.parse(pushMessageObj.payload);
		
				//check whether the notification comes in background and open the app via clicking on it
				if (pushMessageObj.isBackground) {
					console.info("When application comes from background then need to execute task");
					if (!utilityService.isEmpty(payload.page_id)) {
						$scope.config.page_id = payload.page_id;
						SEMI_REALTIME_CHANGES.UpdateLocalDbPages(payload.page_id);
						$timeout(function() {
							$scope.goPage($scope.config.page_id);
						}, 200);
					}
				} else {
					console.info("When application is in foreground then no need to display notification just silently execute task");
					if (!utilityService.isEmpty(payload)) {
						$timeout(function() {
							SEMI_REALTIME_CHANGES.UpdateLocalDbPages(payload.page_id);
						}, 200);
					}
				}
		
			} else {
				var payload = JSON.parse(pushMessageObj.payload);
		
				//check whether the notification comes in background and open the app via clicking on it
				if (pushMessageObj.isBackground) {
					console.info("When application comes from background then need to execute task");
					if (!utilityService.isEmpty(payload.page_id)) {
						$scope.config.page_id = payload.page_id;
						SEMI_REALTIME_CHANGES.UpdateLocalDbPages(payload.page_id);
						$timeout(function() {
							$scope.goPage($scope.config.page_id);
						}, 200);
					}
				} else {
					console.info("When application is in foreground then no need to display notification just silently execute task");
					if (!utilityService.isEmpty(payload)) {
						$timeout(function() {
							SEMI_REALTIME_CHANGES.UpdateLocalDbPages(payload.page_id);
						}, 200);
					}
				}
			}
		} catch (e) {
			console.warn("After receving the push notification unable to process the rest commands", e);
		}
	});

	SocketListnerEvents.updateLocalDbPagesWithServer(function(err, page_ids) {
		if (err) console.warn("getting err in controller updatePages listner file");
		SEMI_REALTIME_CHANGES.updateLocalPagesWithServer(page_ids);
	});

	/**
	 * Following events are configured to watch the Page up and page down event
	 * so It can get data from server in order to prev and next data to achive
	 * pagination task;
	 **/

	$scope.$on('loadmore', function(event, args) {
		var local_page_id = $scope.config.page_id;
		SEMI_REALTIME_CHANGES.UpdateLocalDbPages(local_page_id);
		// I am just giving time to system that remove page from local_storage
		$timeout(function() {
			$scope.goPage(local_page_id);
		});
	});

	$scope.watchSwipeDownEvent = function() {
		$scope.$broadcast('scroll.refreshComplete');
		var content_obj = {
			"page_id": $scope.config.page_id,
			"task_id": $scope.config.task_id,
			"type": "prev"
		};
		if ($localStorage.bookmark) content_obj.bookmark = $localStorage.bookmark;
		console.info("loadPrevRecords bookmark", content_obj.bookmark);
		var request_data = {
			app: {
				api: {
					"api_mode": "GET",
					"api_type": "pagination_data",
					"type": "pagination_data",
					"content": content_obj
				}
			},
			platform: {},
			other_users: {}
		};
		$scope.common_request_handler(request_data);
	};

	/**
	 * The following function is used to update pageData which
	 * is comes from server via using pagination api-endpoint;
	 **/
	$scope.updatePageData = function(server_data) {
		var type = server_data.type,
			detailsResult = server_data.records;
		if (!utilityService.isEmpty(detailsResult)) {
			if (type == "prev") {
				$scope.isPaginated = true;
				$scope.details = detailsResult;
				SEMI_REALTIME_CHANGES.UpdateSpecificPageDetail($scope.config.page_id, detailsResult);
			}
		}
	};
	/**
	 *	Update $localStorage bookmark if exists there remove it locally and
	 *	if not stored then saved into localStorage
	 **/
	$scope.updateBookmark = function(server_data) {
		var bookmark = server_data.bookmark;
		if (!utilityService.isEmpty(bookmark)) {
			if ($localStorage.bookmark) delete $localStorage.bookmark;
			$localStorage.bookmark = bookmark;
		}
	};
	/**
	 *  The following is the common Init function defination which have the following points to do.
	 *   1) check this is for testing app conditions
	 *   2) check if user is login or not ?
	 *   3) call the get_page function to get page initially.
	 **/
	$scope.init = function() {
		//debugger;	
		utilityService.setBusy(true);
		if ($scope.config.page_id == 1) {
			console.log("go to login page>>> when $scope.config.page == 1");
			$scope.config.page_id = 1;
			$scope.config.from_page_id = 0;
			var request_data = {
				app: {
					api: {
						"api_mode": "GET",
						"api_type": "get_page",
						"type": "get_page",
						"content": {
							"page_id": 1,
							"access_token": null
						}
					}
				},
				platform: {},
				other_users: {}
			};
			$scope.common_request_handler(request_data);
		} else {
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

			if (utilityService.isEmpty($localStorage.access_token)) {
				console.log("go to login page>>>");
				$scope.config.page_id = 1;
				$scope.config.from_page_id = 0;
				$scope.goPage($scope.config.page_id);
			} else {
				$timeout(function() {
					var deepLinkPageId = window.localStorage.getItem("deepLink_page_id");
					window.localStorage.removeItem("deepLink_page_id");
					$scope.goPage(deepLinkPageId || $scope.config.page_id);
				}, 1500);

			}
		}
		//$scope.getAllUserPages();
	};

	$scope.getAllUserPages = function() {
		if ($scope.config.page_id !== 1 || $scope.config.page_id !== 11) {
			var request_data = {
				app: {
					api: {
						"api_mode": "GET",
						"api_type": "all_user_pages",
						"type": "all_user_pages",
						"content": {
							"page_id": 0,
							"access_token": $localStorage.access_token,
							"phone": $localStorage.phone
						}
					}
				},
				platform: {},
				other_users: {}
			};
			$scope.common_request_handler(request_data);
		}
	};
	
	/**
	 *  The following function $scope.setConfig() fn is used to set the global $scope.config
	 *  Object so that $scope.config object can be used with the updated values which is coming
	 *  from the platfrom server with updated information. This function is necessery to call after
	 *  api-hit to update the $scope.config object. unless updated values are not available all accross
	 *  the application.
	 **/
	$scope.setConfig = function() {
		var task_info = myService.getTaskInfo();
		$scope.config.page_id = myService.apiResult.page_id;
		$scope.config.task_id = task_info.task_id;
		$scope.config.task_name = task_info.task_name;
		$scope.config.child_task_id = task_info.child_task_id;

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
	};

	/**
	 *  The $scope.setPage() is a function which is used to bind the html into the app
	 *  with the header, detail, footer object html/Js which is coming from $scope.goPage()
	 *  api-endpoint. If this function is not invoked after the $scope.goPage() api response,
	 *  then updated html or Js content will not going to bind into app.
	 **/
	$scope.setPage = function() {
		$scope.setConfig();
		var js_template = myService.getTemplateJs();
		$scope.header_html = myService.getTemplateHtml("header");
		$scope.detail_html = myService.getTemplateHtml("detail");
		$scope.footer_html = myService.getTemplateHtml("footer");
		eval(js_template);
		$scope.$evalAsync(function() {
			$scope.html = $scope.header_html + $scope.detail_html + $scope.footer_html;
		});
		utilityService.setBusy(false);
	};


	/**
	 *  The following function $scope.goPage() is used all over the app to move from
	 *  one page to another page. All the back-button throughout the app is call the following
	 *  function to move back or forward.
	 **/
	$scope.goPage = function(page_id) {
		if (page_id !== 1 || page_id !== 11) {
			$scope.html = $scope.header_html + $scope.footer_html;
		}
		utilityService.setBusy(true);
		$scope.config.page_id = page_id;
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
	$scope.common_request_handler = function(request_data) {
		//alert("inside common_request_handler"  + JSON.stringify(request_data));
		//return false;
		CommonRequestHandler.commonHandler($scope, request_data);
	};

	/**
	 *  Add Assistants to random group so user can edit it after.
	 **/
	$scope.addAssistantToGroup = function() {
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
	$scope.goToGroupDetail = function(item) {
		$scope.group_info = {
			group_id: item.id,
			page_id: 25
		};
		$scope.goPage($scope.group_info.page_id);
	};

	/**
	 * Delete Group function to delete from database
	 **/
	$scope.deleteGroup = function(item) {
		var params = {
			app: {
				api: {
					api_mode: 'POST',
					api_type: 'DELETE_DETAIL',
					table: 'delete_group',
					table_data: {
						id: item.id
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
	$scope.editAssistant = function(item) {
		var params = {
			"app": {
				"api": {
					"api_mode": "GET",
					"api_type": "EDIT_ASSISTANTS",
					"type": "get_assistant_by_id",
					"content": {
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
	$scope.updateAssistantDetail = function(assistant) {
		var params = {
			app: {
				api: {
					api_mode: 'POST',
					api_type: 'ADD_DETAIL',
					table: 'update_assistant',
					table_data: {
						user_id: assistant._id,
						first_name: assistant.firstname,
						last_name: assistant.lastname,
						email: assistant.email,
						phone: assistant.phone,
						deviceId: assistant.device_id,
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

	$scope.deleteAssistant = function(item) {
		var params = {
			app: {
				api: {
					api_mode: 'POST',
					api_type: 'DELETE_DETAIL',
					table: 'delete_assistant',
					table_data: {
						id: item.detail_id,
						group_id: $scope.group_info.group_id
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
	$scope.logout = function() {
		SocketBroadCastEvents.logout($localStorage.user_id);
		SEMI_REALTIME_CHANGES.logout();
		/**
		 *	Update PageCount when app is resumed or open 
	 	 **/
		ServiceHandler.updateCountsOnServer();
		
		$scope.config.page_id = 1;
		$scope.goPage($scope.config.page_id);
	};

	/**
	 * The following fn $scope.editUser() is used to re-direct user to
	 * edit user detail page with the required config data values.
	 **/
	$scope.editUser = function() {
		$scope.config.from_page_id = 2;
		$scope.config.task_name = "User edit";
		$scope.goPage(14);
	};

	/**
	 * The following fn $scope.sortDetail() is used to sort the
	 * Item on page.
	 **/
	$scope.sortDetail = function() {
		$scope.sort.order = ($scope.sort.order == "asc") ? "desc" : "asc";
		$scope.details = utilityService.sortByKey($scope.details, $scope.sort.key, $scope.sort.order);
	};

	/**
	 * The following fn $scope.subDetails() is re-direct to sub pages.
	 **/
	$scope.subDetails = function(item) {
		if ($scope.config.from_page_id == $scope.config.page_id) {
			var task_info = myService.getTaskInfo();
			$scope.config.from_page_id = task_info.from_page_id;
		} else {
			$scope.config.from_page_id = $scope.config.page_id;
		}
		$scope.config.task_name = item.name;
		$scope.goPage(item.page_id);
	};

	$scope.addThisDetailToNewTask = function(shortInfo) {
		$scope.addDetailToTask = angular.copy(shortInfo);
		var req_obj = {
			"app": {
				"api": {
					"api_mode": "GET",
					"api_type": "get_all_task",
					"type": "get_all_task",
					"content": {
						"access_token": $localStorage.access_token,
						"task_id": $scope.config.edit_task_id
					}
				}
			},
			"platform": {},
			"other_user": {}
		};
		$scope.common_request_handler(req_obj);
		$timeout(function() {
			$scope.goPage(19);
		}, 200);
	};
	/**
	 * The following fn $scope.editDetails() is used to re-direct to short details
	 * page where user can edit some of the deatails only
	 * basically the page_id = 15;
	 **/
	$scope.editDetails = function(item) {
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
		$scope.goPage(15);
	};

	/**
	 * The following fn $scope.moreDetails() is used to re-direct to moreDetails
	 * page where user can edit deatails basically the page_id = 16;
	 **/
	$scope.moreDetails = function(item) {
		$scope.config.from_page_id = $scope.config.page_id;
		$scope.config.task_name = item.name;
		$scope.config.edit_task_id = item.page_id;
		$scope.goPage(16);
	};

	/**
	 * The following fn $scope.deleteDetail() is remove record from
	 * list showing in app.
	 **/
	$scope.deleteDetail = function(request_data) {
		var item_id = request_data.app.api.table_data.id;
		$scope.$evalAsync(function() {
			angular.forEach($scope.details, function(value, key) {
				if (value.id) {
					if (value.id == item_id) {
						$scope.details.splice(key, 1);
					}
				} else {
					if (value.detail_id == item_id) {
						$scope.details.splice(key, 1);
					}
				}
			});
		});
	};

	/**
	 * The following fn $scope.goSearch() is re-direct to Search page.
	 **/
	$scope.goSearch = function() {
		$scope.config.from_page_id = $scope.config.page_id;
		$scope.config.edit_task_id = $scope.config.task_id;
		var page_id = 17;
		$scope.goPage(page_id);
	};

	/**
	 * The following function is used when user is offline and need to do
	 * process offline queue tasks.
	 */
	$scope.goOffline = function() {
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
	$scope.goPrevPage = function(prev_page_id) {
		console.log("go to prev page>>> id:" + prev_page_id);
		$scope.config.page_id = prev_page_id;
		$scope.setPage();
	};
	$scope.mark_detail_pending = function(request_data) {
		console.log("detail pending", request_data);
	};
	$scope.delete_error_fn = function(request_data, err_data) {
		utilityService.showAlert("Error: " + err_data.data.msg);
	};

	$scope.success_fn = function(res_data) {
		utilityService.showAlert("Success: " + res_data.msg ? res_data.msg : "Record updated successfully");
	};
	$scope.add_error_fn = function(request_data, err_data) {
		if (err_data.data) {
			utilityService.showAlert("Error: " + err_data.data ? err_data.data.msg : "error");
		}else{
			console.warn("err_data", err_data);
		}
	};
	$scope.defaultNextFn = function(request_data, res_data) {
		console.log(request_data, res_data);
	};


	/**
	 *  The following functions are utinlity function to manage scroll and ionic keyboard etc.
	 */
	$scope.inputUp = function() {
		if (isIOS) $scope.data.keyboardHeight = 216;
		$timeout(function() {
			$ionicScrollDelegate.scrollBottom();
			$ionicScrollDelegate.resize();
		}, 300);
	};

	$scope.inputDown = function() {
		if (isIOS) $scope.data.keyboardHeight = 0;
		$ionicScrollDelegate.resize();
	};
	$scope.closeKeyboard = function() {
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
	$scope.updateTyping = function() {
		var logged_user = myService.getUserInfo();
		var task_obj = myService.getTaskInfo();

		SocketBroadCastEvents.typing({
			user_id: logged_user._id,
			identifier: ((task_obj.page_id == 18) ? logged_user.virtual_phone : task_obj.task_name),
			current_page_id: task_obj.page_id,
			subcription_ids: null,
			outbound_message: ((logged_user.firstname + ' ' + logged_user.lastname) || logged_user.virtual_phone)
		});

		if (inputChangedPromise) {
			$timeout.cancel(inputChangedPromise);
		}

		inputChangedPromise = $timeout(function() {
			SocketBroadCastEvents.stopTyping({
				user_id: logged_user._id,
				identifier: ((task_obj.page_id == 18) ? logged_user.virtual_phone : task_obj.task_name),
				current_page_id: task_obj.page_id,
				subcription_ids: null,
				outbound_message: null
			});
		}, 200);
	};

	SocketListnerEvents.isPageRefreshRequired(function(err, obj) { //$notify$Connected$Users$From$Server
		console.info("inside isPageRefreshRequired callback/listner", err, obj);
		if (err) console.log("Exception raised into isPageRefreshRequired Socket listner.");
		
		//update unread count to local_pages then update it to node-red server;
		SEMI_REALTIME_CHANGES.UpdateCountsToLocalPages(obj, function(err, previous_page){
			if(err){
				console.warn(err);
			}else{
				if(!utilityService.isEmpty(previous_page) ) SEMI_REALTIME_CHANGES.createUserPage(previous_page, obj);
				//update message to screen on condition of isRefresh is required or not;
				if (obj.isRefresh) {
					if (Object.prototype.toString.call(obj.refresh_pages) === "[object Array]") {
						for (var itr in obj.refresh_pages) {
							if(obj.refresh_pages[itr]){
								SEMI_REALTIME_CHANGES.UpdateLocalDbPages(obj.refresh_pages[itr]);
							}	
						}
					} else {
						SEMI_REALTIME_CHANGES.UpdateLocalDbPages(obj.page_id);
					}
					
				} else { //case when need to dynamically push messages to screen.
					if (!utilityService.isEmpty(obj.msg)) {
						$rootScope.$broadcast("$newMesages$Comes$From$Server", obj);
				
						if (Object.prototype.toString.call(obj.refresh_pages) === "[object Array]") {
							for (var loc_itr in obj.refresh_pages) {
								if(obj.refresh_pages[loc_itr]){
									SEMI_REALTIME_CHANGES.UpdateLocalDbPages(obj.refresh_pages[loc_itr]);
								}
							}
						}else {
							SEMI_REALTIME_CHANGES.UpdateLocalDbPages(obj.page_id);
						}
				
						$timeout(function() {
							$ionicScrollDelegate.scrollBottom(true);
							$ionicScrollDelegate.resize();
						}, 200);
					}
				}
			}
		});
	});

	SocketListnerEvents.someDataIsAddedByOperator(function(err, obj) {
		console.log(">>>>$added$data$from$operator>>>", err, obj);
		if (err) console.log("Exception raised into someDataIsAddedByOperator Socket listner.");
		
		//update unread count to local_pages then update it to node-red server;
		//update unread count to local_pages then update it to node-red server;
		SEMI_REALTIME_CHANGES.UpdateCountsToLocalPages(obj, function(err, previous_page){
			if(err){
				console.warn(err);
			}else{
				if(!utilityService.isEmpty(previous_page) ) SEMI_REALTIME_CHANGES.createUserPage(previous_page, obj);
				
				//update message to screen on condition of isRefresh is required or not;
				if (obj.isRefresh) {
					if (Object.prototype.toString.call(obj.refresh_pages) === "[object Array]") {
						for (var itr in obj.refresh_pages) {
							if(obj.refresh_pages[itr]){
								SEMI_REALTIME_CHANGES.UpdateLocalDbPages(obj.refresh_pages[itr]);
							}
						}
					} else {
						SEMI_REALTIME_CHANGES.UpdateLocalDbPages(obj.page_id);
					}
				} else {
					if (!utilityService.isEmpty(obj.msg)) {
						$rootScope.$broadcast("$added$data$from$operator", obj);
						if (Object.prototype.toString.call(obj.refresh_pages) === "[object Array]") {
							for (var loc_itr in obj.refresh_pages) {
								if(obj.refresh_pages[loc_itr]){
									SEMI_REALTIME_CHANGES.UpdateLocalDbPages(obj.refresh_pages[loc_itr]);
								}
							}
						} else {
							SEMI_REALTIME_CHANGES.UpdateLocalDbPages(obj.page_id);
						}
				
						$timeout(function() {
							$ionicScrollDelegate.scrollBottom(true);
							$ionicScrollDelegate.resize();
						}, 200);
					}
				}
			}
		});
	});

	SocketListnerEvents.typingListner(function(err, obj) {
		console.log("Typing listner is called .....", err, obj);
		$scope.$evalAsync(function() {
			$scope.isTyping = true;
			$scope.typingUserName = obj.msg;
		});
		$ionicScrollDelegate.scrollBottom(true);
	});

	SocketListnerEvents.stopTypingListner(function() {
		$timeout(function() {
			$scope.$evalAsync(function() {
				$scope.isTyping = false;
			});
		}, 6000);
	});

	/**
	 * Users under masterbot if they type any message then those message will send
	 * from this message which was previously in 99_h header template
	 * */
	$scope.sendChatBotMessage = function(message) {
		var logged_user = myService.getUserInfo(),
			task_obj = myService.getTaskInfo();
		var request_data = {
			"task_name": task_obj.task_name,
			"responder_user": {
				"user_id": logged_user._id,
				"firstname": logged_user.firstname,
				"lastname": logged_user.lastname,
				"phone": logged_user.virtual_phone
			},
			"msg": message,
			"previous_page": task_obj.from_page_id
		};
		var api_url = APIROOT + '/user_chatbot_response',
			api_mode = "chatbot",
			api_type = "",
			api_next_fn = "",
			api_offline_queue = "",
			api_offline_fn = "",
			api_on_error_fn = "";

		ServiceHandler.Request($scope, request_data, api_url, api_mode, api_type, api_next_fn, api_offline_queue, api_offline_fn, api_on_error_fn);
		$scope.data.message = "";
	};

	/**
	 *  Sending Chatbot req from user
	 *  chatbot scren using the following method which was
	 *  previously in 18_h header template
	 **/

	$scope.showSendMessage = function(message) {
		var logged_user = myService.getUserInfo();
		var request_data = {
			"chatbot_user": {
				"user_id": logged_user._id,
				"phone": logged_user.virtual_phone,
				"firstname": logged_user.firstname,
				"lastname": logged_user.lastname,
				"type": logged_user.type
			},
			"phone": logged_user.virtual_phone,
			"body": message,
			"portal_number": "+12312259665",
			"previous_page": $scope.config.from_page_id
		};

		var api_url = APIROOT + '/ask_chatbot',
			api_mode = "chatbot",
			api_type = "",
			api_next_fn = "",
			api_offline_queue = "",
			api_offline_fn = "",
			api_on_error_fn = "";
		ServiceHandler.Request($scope, request_data, api_url, api_mode, api_type, api_next_fn, api_offline_queue, api_offline_fn, api_on_error_fn);
		delete $scope.data.message;
	};
	
}); //module closing brackets