DomenowApp.service('utilityService', function($ionicLoading, $ionicPopup, $loading) {
	var self = this;
	var appName = "Dri Lists";
	self.sortByKey = function(array, key, order) {
		return array.sort(function(a, b) {
			var x = a[key];
			var y = b[key];
			if (order == "asc")
				return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			else
				return ((x > y) ? -1 : ((x < y) ? 1 : 0));
		});
	};
	self.showAlert = function(txt, title) {
		if (title === void 0) {
			title = appName;
		}
		var alertPopup = $ionicPopup.alert({
			title: title,
			template: txt
		});
		return alertPopup;
	};
	self.showConfirm = function(title, message, cancelText, okText) {
		if (!title) {
			title = appName;
		}
		var confirmPopup = $ionicPopup.confirm({
			title: title,
			template: message,
			cancelText: cancelText,
			okText: okText
		});
		return confirmPopup;
	};
	self.busyState = false;
	self.setBusy = function(state, message, key) {
		if (state === this.busyState) {
			return;
		}
		key = key || "loading";
		this.busyState = state;
		if (this.busyState) {
			var text = message || 'Loading...';
			$loading.start(key);
			$loading.setDefaultOptions({
				active: true,
				text: text
			});
		} else {
			$loading.finish(key);
		}
	};
	self.loadingState = false;
	self.setLoading = function(state, message) {
		if (state === this.loadingState) {
			return;
		}
		this.loadingState = state;
		if (this.loadingState) {
			$ionicLoading.show({
				template: message || 'Loading...'
			});
		} else {
			$ionicLoading.hide();
		}
	};
	self.getJsonFromUrl = function(location) {
		var query = location.search.substr(1);
		var result = {};
		query.split("&").forEach(function(part) {
			var item = part.split("=");
			result[item[0]] = decodeURIComponent(item[1]);
		});
		return result;
	};
	self.isEmpty = function(obj) {
		if (Object.prototype.toString.call(obj) === "[object Object]") {
			if (Object.keys(obj).length) {
				return false;
			} else {
				return true;
			}
		} else if (Object.prototype.toString.call(obj) === "[object Array]") {
			if (obj.length) {
				return false;
			} else {
				return true;
			}
		} else {
			if (obj) {
				return false;
			} else {
				return true;
			}
		}
	};
	self.isExists = function(item, container) {
		if (Object.prototype.toString.call(container) === "[object Object]") {
			return (item in container);
		} else if (Object.prototype.toString.call(container) === "[object Array]") {
			return (container.indexOf(item) > -1);
		} else {
			return false;
		}
	};
	self.getUserGroups = function(obj) {
		if (self.isEmpty(obj.data)) {
			return [];
		} else {
			if (self.isEmpty(obj.data.groups)) {
				return [];
			} else {
				var group_ids = [];
				for (var itr in obj.data.groups) {
					if (itr) {
						group_ids.push(itr);
					}
				}
				return group_ids;
			}
		}
	};
}).service('HttpService', function($rootScope, $localStorage, $http, $cordovaNetwork, APIROOT) {
	this.server = {
		baseURL: APIROOT
	};
	this.isOnline = function() {
		try {
			return $cordovaNetwork.isOnline();
		} catch (err) {
			return navigator.onLine;
		}
	};
	this.getServerPage = function(page_id) {
		var endpoint = this.server.baseURL + "/master_api_handler";
		var access_token = $localStorage.access_token;
		if (!access_token) access_token = "123456";
		var request_data = {
			app: {
				api: {
					"type": "get_page",
					"content": {
						"page_id": page_id,
						"access_token": access_token
					}
				}
			},
			platform: {},
			other_users: {}
		};
		var config = {
			headers: {
				"Content-Type": "application/json"
			},
			params: request_data
		};
		var res_data = {};
		return $http.get(endpoint, config).then(function(res) {
			res_data = res.data;
			res_data.status = 1;
			return res_data;
		}, function(err) {
			console.log("get server page err>>>", err);
			res_data.status = -1;
			res_data.error = true;
			return res_data;
		});
	};
	this.updateGetUserTask = function(user_task_list) {
		var endpoint = this.server.baseURL + "/api_handler";
		var config = {
			headers: {
				"Content-Type": "application/json"
			}
		};
		var request_data = {
			"type": "update_get_user_tasks",
			"body": {
				"user_id": "5d6065708854476d0a0c9af551271b1a",
				"filter": {},
				"user_task_list": user_task_list
			}
		};
		var res_data = {};
		return $http.post(endpoint, request_data, config).then(function(res) {
			res_data = res.data;
			return res_data;
		}, function(err) {
			console.log("update_get_user_tasks err>>>", err);
			res_data.status = -1;
			return res_data;
		});
	};
	this.updateGetPages = function(user_task_list) {
		var endpoint = this.server.baseURL + "/api_handler";
		var config = {
			headers: {
				"Content-Type": "application/json"
			}
		};
		var request_data = {
			"type": "update_get_pages",
			"body": {
				"access_token": $localStorage.access_token,
				"user_task_list": user_task_list
			}
		};
		var res_data = {};
		return $http.post(endpoint, request_data, config).then(function(res) {
			res_data = res.data;
			return res_data;
		}, function(err) {
			console.log("update_get_pages err>>>", err);
			res_data.status = -1;
			return res_data;
		});
	};
}).service('myService', function($localStorage) {
	var self = this;
	this.apiResult = {};
	this.getUserInfo = function() {
		var apiResult = self.getApiResult(),
			access_token = $localStorage.access_token;
		if (apiResult.user) {
			if (access_token !== apiResult.user.access_token) {
				if (apiResult.page_id !== 1) {
					delete $localStorage.access_token;
					$localStorage.access_token = apiResult.user.access_token;
				}
			}
		}
		return apiResult.user;
	};
	this.getTaskInfo = function() {
		var apiResult = self.getApiResult();
		if (apiResult.task !== undefined) {
			var task_info = {
				from_page_id: apiResult.task.from_page_id,
				page_id: apiResult.task.page_id,
				task_id: apiResult.task.task_id,
				task_name: apiResult.task.task_name,
				child_task_id: apiResult.task.child_task_id
			};
			return task_info;
		}
		return {};
	};
	this.getTemplateHtml = function(part) {
		var apiResult = self.getApiResult();
		var temp_str = "apiResult.task.template." + part + ".html";
		var template_html = eval(temp_str);
		return template_html;
	};
	this.getTemplateJs = function() {
		var apiResult = self.getApiResult();
		var template_js = "apiResult.task.template.header.js";
		template_js = eval(template_js);
		return template_js;
	};
	this.getDetail = function() {
		var getDetailApiResult = self.getApiResult(),
			detailData = getDetailApiResult.detail;
		return detailData;
	};
	this.getApiResult = function() {
		return self.apiResult;
	};
}).service('dbService', function($localStorage, utilityService, HttpService, Localpages, User, Usertask, Detail, Task, Template) {
	'use strict';
	var self = this;
	var userObj = {},
		taskObj = {},
		detailObj = {},
		templateObj = {};
	var pageResult = {
		"page_id": "",
		"user": userObj,
		"task": taskObj,
		"detail": detailObj
	};
	this.sync = {
		detail: -1,
		task: -1,
		template: -1,
		user: -1
	};
	this.synced = 0;
	this.syncMessage = "Syncing...";
	this.doSync = function() {
		utilityService.setBusy(true, self.syncMessage);
		User.doSync();
		Detail.doSync();
		Task.doSync();
		Template.doSync();
	};
	this.syncPage = function(local_usertask, server_page) {
		var updateTemplate = function() {
			var templateObj = {
				"header": {
					"_id": server_page.task.template.header._id,
					"name": server_page.task.template.header.name,
					"html": server_page.task.template.header.html,
					"js": server_page.task.template.header.js
				},
				"detail": {
					"_id": server_page.task.template.detail._id,
					"name": server_page.task.template.detail.name,
					"html": server_page.task.template.detail.html,
					"js": server_page.task.template.detail.js
				},
				"footer": {
					"_id": server_page.task.template.footer._id,
					"name": server_page.task.template.footer.name,
					"html": server_page.task.template.footer.html,
					"js": server_page.task.template.footer.js
				}
			};
			return Template.updateData(templateObj).then(function(result) {
				return result;
			});
		};
		var updateLocalPage = function() {
			var pageObj = {
				"_id": server_page.page_id,
				"task": {
					"task_id": server_page.task.task_id,
					"task_name": server_page.task.task_name,
					"header_template_id": server_page.task.template.header._id,
					"detail_template_id": server_page.task.template.detail._id,
					"footer_template_id": server_page.task.template.footer._id,
					"from_page_id": server_page.task.from_page_id,
					"child_task_id": server_page.task.child_task_id,
					"date_created": server_page.task.date_created
				},
				"detail": server_page.detail
			};
			console.log("pageObj>>>", pageObj);
			return Localpages.updatePageData(pageObj).then(function(result) {
				return result;
			});
		};
		var updateUserTask = function() {
			local_usertask.synchronized = 1;
			local_usertask.dirty = 1;
			local_usertask.task_id = server_page.task.task_id;
			return Usertask.updateData(local_usertask).then(function(result) {
				return result;
			});
		};
		return updateTemplate().then(function(result) {
			console.log("1. template update response>>>", result);
			return updateLocalPage();
		}).then(function(result) {
			console.log("2. local page update response>>>", result);
			return updateUserTask();
		}).then(function(result) {
			console.log("3. user task update response>>>", result);
			return Localpages.getPage(server_page.page_id).then(function(pageResult) {
				return pageResult;
			});
		});
	};
	this.getLocalPage = function(page_id) {
		return Usertask.getUserTask(page_id).then(function(local_usertask) {
			console.log("get local user_task>>>", local_usertask);
			var isOnline = HttpService.isOnline();
			if (!local_usertask.synchronized && isOnline) {
				utilityService.setBusy(false);
				utilityService.setBusy(true, self.syncMessage);
				return HttpService.getServerPage(page_id).then(function(server_page) {
					console.log("server page response>>>", server_page);
					if (server_page.status == -1) {
						return {
							error: true
						};
					}
					return self.syncPage(local_usertask, server_page);
				});
			} else if (local_usertask.synchronized) {
				return Localpages.getPage(page_id).then(function(pageResult) {
					if (typeof pageResult.error != "undefined" && pageResult.error) {
						local_usertask.synchronized = 0;
						local_usertask.dirty = 1;
						Usertask.updateData(local_usertask).then(function(result) {
							console.log("user task set sync=0>>>", result);
						});
					}
					return pageResult;
				});
			} else {
				return Localpages.getPage(page_id).then(function(pageResult) {
					return pageResult;
				});
			}
		});
	};
	this.getDirtyUserTask = function() {
		return Usertask.getDirtyList().then(function(res) {
			return res;
		});
	};
	this.updateLocalPage = function(update_page) {
		var page_id = update_page.page_id;
		return Usertask.getUserTask(page_id).then(function(local_usertask) {
			console.log("get update local user_task>>>", local_usertask);
			return self.syncPage(local_usertask, update_page);
		});
	};
}).service('BluemixService', function($window, $q, $localStorage, utilityService, $rootScope) {
	
	//IOS distribution push notification credentails
	//var appGuid = "f9fb70f7-e91f-4e62-b713-a609fb81be59";
	//var clientSecret = "0956be68-ad37-4abd-9f98-8215dd9dc680";
	
	//IOS developement push notification credentails
	var appGuid = "4419942e-8f02-4527-8794-c24b42c584b5";
	var clientSecret = "778ddc4f-9bb0-433b-a9bc-7af24e0d62e7";
	
	this.connect = function() {
		var deferred = $q.defer(),
			deviceId;
		console.log("$localStorage.push_accepted>>>" + $localStorage.push_accepted);
		if (window.cordova) {
			var isIOS = ionic.Platform.isIOS();
			if (!isIOS) {
				var isAccepted = $localStorage.push_accepted;
				if (!isAccepted) {
					var confirm_msg = 'Would Like to Send You Push Notifications';
					utilityService.showConfirm("", confirm_msg, "Don't Allow", "OK").then(function(res) {
						if (res) {
							$localStorage.push_accepted = 1;
						} else {
							$localStorage.push_accepted = 0;
						}
					});
				}
			} else {
				$localStorage.push_accepted = 1;
			}
			utilityService.setBusy(true);
			$window.BMSClient.initialize(BMSClient.REGION_US_SOUTH);
			var category = {};
			$window.BMSPush.initialize(appGuid, clientSecret, category);
			var success = function(resp) {
				console.log("BMS Push Registration Success Response:" + resp);
				deviceId = JSON.parse(resp).deviceId;
				deferred.resolve(deviceId);
			};
			var failure = function(resp) {
				console.log("BMS Push Registration Failure Response:" + resp);
				deferred.reject(resp);
			};
			var showNotification = function(notif) {
				$rootScope.$broadcast("push$Notification$CallBack$Listner", notif);
			};
			setTimeout(function() {
				var options = {};
				$window.BMSPush.registerDevice(options, success, failure);
				if ($localStorage.push_accepted) {
					$window.BMSPush.registerNotificationsCallback(showNotification);
				}
			}, 500);
			deviceId = deferred.promise;
		} else {
			deviceId = "Web View";
			$localStorage.push_accepted = 0;
		}
		return $q.when(deviceId);
	};
}).factory('Users', function() {
	var usernames = [];
	usernames.numUsers = 0;
	return {
		getUsers: function() {
			return usernames;
		},
		addUsername: function(username) {
			usernames.push(username);
		},
		deleteUsername: function(username) {
			var index = usernames.indexOf(username);
			if (index != -1) {
				usernames.splice(index, 1);
			}
		},
		setNumUsers: function(data) {
			usernames.numUsers = data.numUsers;
		}
	};
}).factory('Socket', function(socketFactory, SOCKET_ROOT) {
	var myIoSocket = io.connect(SOCKET_ROOT, {
		'reconnection': true,
		'reconnectionDelay': 500
	});
	mySocket = socketFactory({
		ioSocket: myIoSocket
	});
	return myIoSocket;
}).service('SocketBroadCastEvents', function(Socket, myService, $localStorage, utilityService) {
	this.typing = function(data) {
		data.deviceType = $localStorage.deviceType;
		data.fingerPrint = $localStorage.deviceFingerPrint;
		Socket.emit('$typing$event', data);
	};
	this.onAppPause = function() {
		var user_data = myService.getUserInfo(),
			task_data = myService.getTaskInfo();
		try {
			
			//update counts on node-red server before going in background;
			//if(!utilityService.isEmpty(user_data)) CommonRequestHandler.updateCountsOnServer();
			
			if (user_data !== undefined && task_data !== undefined) {
				if (task_data.page_id !== 1 || task_data.page_id !== 11) {
					Socket.emit('$onAppPause$event', {
						deviceType: $localStorage.deviceType,
						fingerPrint: $localStorage.deviceFingerPrint,
						user_id: user_data._id || $localStorage.user_id,
						subcription_ids: task_data.page_id,
						identifier: ((task_data.page_id == 18) ? user_data.virtual_phone : task_data.name),
						current_page_id: task_data.page_id,
						outbound_message: null
					});
				}
			}
		} catch (e) {
			console.log("Exception raised on Socket onAppStart event", e);
		}
	};
	this.onAppResume = function() {
		var user_data = myService.getUserInfo(),
			task_data = myService.getTaskInfo(),
			group_ids = utilityService.getUserGroups(user_data);
		try {
			Socket.emit('$onAppResume$event', {
				deviceType: $localStorage.deviceType,
				fingerPrint: $localStorage.deviceFingerPrint,
				user_id: user_data._id || $localStorage.user_id,
				group_ids: group_ids,
				identifier: ((task_data.page_id == 18) ? user_data.virtual_phone : task_data.task_name),
				subcription_ids: task_data.page_id,
				current_page_id: task_data.page_id,
				outbound_message: null
			});
		} catch (e) {
			console.log("Exception raised on Socket onAppStart event", e);
		}
	};
	this.onPageChangeSuccessfully = function(page_id) {
		var user_data = myService.getUserInfo(),
			task_data = myService.getTaskInfo();
		try {
			if (user_data !== undefined) {
				if (page_id !== 1 || page_id !== 11) {
					var group_ids = utilityService.getUserGroups(user_data);
					Socket.emit('$onPageChange$Event', {
						deviceType: $localStorage.deviceType,
						fingerPrint: $localStorage.deviceFingerPrint,
						user_id: user_data._id || $localStorage.user_id,
						group_ids: group_ids,
						identifier: ((page_id == 18) ? user_data.virtual_phone : task_data.task_name),
						subcription_ids: page_id,
						current_page_id: page_id,
						outbound_message: null
					});
				}
			}
		} catch (e) {
			console.log("Exception raised on Socket onAppStart event", e);
		}
	};
	this.stopTyping = function(data) {
		data.deviceType = $localStorage.deviceType;
		data.fingerPrint = $localStorage.deviceFingerPrint;
		Socket.emit('$stop$typing$event', data);
	};
	this.pushMessage = function(data) {
		Socket.emit('$push$message$event', data);
	};
	this.logout = function(data) {
		if (utilityService.isEmpty(data)) data = {};
		data.deviceType = $localStorage.deviceType || null;
		data.fingerPrint = $localStorage.deviceFingerPrint || null;
		Socket.emit("disconnect", data);
	};
	this.sendNewPagesToWebSocketServer = function(userId, data) {
		Socket.emit("$Store$New$Page$data", {
			userId: userId,
			deviceType: $localStorage.deviceType || null,
			fingerPrint: $localStorage.deviceFingerPrint || null,
			newPages: data
		});
	};
	this.getUpdatedPageIds = function(fingerPrint, userId) {
		if (utilityService.isEmpty(fingerPrint) || utilityService.isEmpty(userId)) {
			console.warn("Cannot get updatedPages from web-socket due to either fingerPrint or userID is not available", fingerPrint, userId);
		} else {
			Socket.emit("$check$Updated$Pages$On$App$Init", {
				fingerPrint: fingerPrint,
				userId: userId
			});
		}
	};
}).service('SocketListnerEvents', function(Socket) {
	this.typingListner = function(callback) {
		Socket.on('$typing$event', function(data) {
			callback(null, data);
		});
	};
	this.stopTypingListner = function(callback) {
		Socket.on('$stop$typing$event', function(data) {
			callback(null, data);
		});
	};
	this.messageListner = function(callback) {
		Socket.on('$push$message$event', function(data) {
			callback(null, data);
		});
	};
	this.newDataFromRecievedServer = function(callback) {
		Socket.on('$new$Item$pushed$By$server', function(data) {
			callback(null, data);
		});
	}; // not in use
	this.isPageRefreshRequired = function(callback) {
		Socket.on('$notify$Connected$Users$From$Server', function(data) {
			callback(null, data);
		});
	};// in use
	this.updateLocalDbPagesWithServer = function(callback) {
		Socket.on('$check$Updated$Pages$On$App$Init', function(page_ids) {
			callback(null, page_ids);
		});
	};
	this.someDataIsAddedByOperator = function(callback) {
		Socket.on('$added$data$from$operator', function(data) {
			callback(null, data);
		});
	};//in use
});