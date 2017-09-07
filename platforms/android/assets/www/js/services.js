DomenowApp.service('utilityService', function ($ionicLoading, $ionicPopup, $loading) {
	var appName = "Dri Lists";
	this.sortByKey = function (array, key, order) {
		return array.sort(function (a, b) {
			var x = a[key];
			var y = b[key];
			if (order == "asc")
				return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			else
				return ((x > y) ? -1 : ((x < y) ? 1 : 0));
		});
	};
	this.showAlert = function (txt, title) {
		if (title === void 0) {
			title = appName;
		}
		var alertPopup = $ionicPopup.alert({
			title: title,
			template: txt
		});
		return alertPopup;
	};
	this.showConfirm = function (title, message, cancelText, okText) {
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
	this.busyState = false;
	this.setBusy = function (state, message, key) {
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
	this.loadingState = false;
	this.setLoading = function (state, message) {
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
	this.getJsonFromUrl = function (location) {
		var query = location.search.substr(1);
		var result = {};
		query.split("&").forEach(function (part) {
			var item = part.split("=");
			result[item[0]] = decodeURIComponent(item[1]);
		});
		return result;
	};

	this.isEmpty = function (obj) {
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
})

.service('HttpService', function ($rootScope, $localStorage, $http, $cordovaNetwork, APIROOT) {
		this.server = {
			//baseURL: "https://platform.mybluemix.net"
			baseURL: APIROOT
		};
		this.isOnline = function () {
			//console.log("$cordovaNetwork", $cordovaNetwork.isOnline(), navigator);
			try {
				return $cordovaNetwork.isOnline();
			} catch (err) {
				return navigator.onLine;
			}
		};
		this.getServerPage = function (page_id) {
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
			return $http.get(endpoint, config).then(function (res) {
				res_data = res.data;
				res_data.status = 1;
				return res_data;
			}, function (err) {
				console.log("get server page err>>>", err);
				res_data.status = -1;
				res_data.error = true;
				return res_data;
			});
		};
		this.updateGetUserTask = function (user_task_list) {
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
					"filter": {

					},
					"user_task_list": user_task_list
				}
			};
			var res_data = {};
			return $http.post(endpoint, request_data, config).then(function (res) {
				res_data = res.data;
				return res_data;
			}, function (err) {
				console.log("update_get_user_tasks err>>>", err);
				res_data.status = -1;
				return res_data;
			});
		};
		this.updateGetPages = function (user_task_list) {
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
			return $http.post(endpoint, request_data, config).then(function (res) {
				res_data = res.data;
				return res_data;
			}, function (err) {
				console.log("update_get_pages err>>>", err);
				res_data.status = -1;
				return res_data;
			});
		};
	})
	.service('myService', function () {
		var self = this;

		this.apiResult = {};
		this.getUserInfo = function () {
			var apiResult = self.getApiResult();
			return apiResult.user;
		};

		this.getTaskInfo = function () {
			var apiResult = self.getApiResult();
			var task_info = {
				from_page_id: apiResult.task.from_page_id,
				task_id: apiResult.task.task_id,
				task_name: apiResult.task.task_name,
				child_task_id: apiResult.task.child_task_id
			};
			return task_info;
		};

		this.getTemplateHtml = function (part) {
			var apiResult = self.getApiResult();
			var temp_str = "apiResult.task.template." + part + ".html";
			var template_html = eval(temp_str);
			//console.log(template_html);
			return template_html;
		};

		this.getTemplateJs = function () {
			var apiResult = self.getApiResult();
			var template_js = "apiResult.task.template.header.js";
			template_js = eval(template_js);
			//console.log(template_js);
			return template_js;
		};
		this.getDetail = function () {
			var apiResult = self.getApiResult();
			var detailData = apiResult.detail;
			//console.log("from myService.getDetail", detailData);
			return detailData;
		};
		this.getApiResult = function () {
			return self.apiResult;
		};
	})
	.service('dbService', function ($localStorage, utilityService, HttpService,
		Localpages, User, Usertask, Detail, Task, Template) {
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

		this.doSync = function () {
			utilityService.setBusy(true, self.syncMessage);

			User.doSync();
			Detail.doSync();
			Task.doSync();
			Template.doSync();
		};

		this.syncPage = function (local_usertask, server_page) {
			//update template
			var updateTemplate = function () {
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
				//console.log(templateObj);
				return Template.updateData(templateObj).then(function (result) {
					return result;
				});
			};
			//update local page
			var updateLocalPage = function () {
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
				return Localpages.updatePageData(pageObj).then(function (result) {
					return result;
				});
			};
			//update user-task
			var updateUserTask = function () {
				local_usertask.synchronized = 1;
				local_usertask.dirty = 1;
				local_usertask.task_id = server_page.task.task_id;
				return Usertask.updateData(local_usertask).then(function (result) {
					return result;
				});
			};
			//proceed sync
			return updateTemplate().then(function (result) {
				console.log("1. template update response>>>", result);
				return updateLocalPage();
			}).then(function (result) {
				console.log("2. local page update response>>>", result);
				return updateUserTask();
			}).then(function (result) {
				console.log("3. user task update response>>>", result);
				return Localpages.getPage(server_page.page_id).then(function (pageResult) {
					return pageResult;
				});
			});
		};
		this.getLocalPage = function (page_id) {
			return Usertask.getUserTask(page_id).then(function (local_usertask) {
				console.log("get local user_task>>>", local_usertask);
				var isOnline = HttpService.isOnline();
				//local_usertask.synchronized=0;isOnline = false;
				if (!local_usertask.synchronized && isOnline) { //synchronized = false, online
					utilityService.setBusy(false);
					utilityService.setBusy(true, self.syncMessage);

					return HttpService.getServerPage(page_id).then(function (server_page) {
						console.log("server page response>>>", server_page);
						if (server_page.status == -1) {
							return {
								error: true
							};
						}
						return self.syncPage(local_usertask, server_page);
					});
				} else if (local_usertask.synchronized) {
					return Localpages.getPage(page_id).then(function (pageResult) {
						if (typeof pageResult.error != "undefined" && pageResult.error) {
							local_usertask.synchronized = 0;
							local_usertask.dirty = 1;
							Usertask.updateData(local_usertask).then(function (result) {
								console.log("user task set sync=0>>>", result);
							});
						}
						return pageResult;
					});
				} else { //synchronized = false, offline
					return Localpages.getPage(page_id).then(function (pageResult) {
						return pageResult;
					});
				}
			});
		};
		this.getDirtyUserTask = function () {
			return Usertask.getDirtyList().then(function (res) {
				return res;
			});
		};
		this.updateLocalPage = function (update_page) {
			var page_id = update_page.page_id;
			return Usertask.getUserTask(page_id).then(function (local_usertask) {
				console.log("get update local user_task>>>", local_usertask);
				return self.syncPage(local_usertask, update_page);
			});
		};
	})

.service('BluemixService', function ($window, $q, $localStorage, utilityService, $rootScope) {
	var appGuid = "f9fb70f7-e91f-4e62-b713-a609fb81be59"; //f9fb70f7-e91f-4e62-b713-a609fb81be59
	var clientSecret = "0956be68-ad37-4abd-9f98-8215dd9dc680"; //0956be68-ad37-4abd-9f98-8215dd9dc680

	this.connect = function () {
		// create deferred object using $q
		var deferred = $q.defer(),
			deviceId;

		console.log("$localStorage.push_accepted>>>" + $localStorage.push_accepted);
		if (window.cordova) {
			// currently no need to manually ask to accept push notification
			// when system already asked to accept .
      var isIOS = ionic.Platform.isIOS();
      if(!isIOS){
        var isAccepted = $localStorage.push_accepted ;
        ///home/acer/.gradle/caches/modules-2/files-2.1/com.ibm.mobilefirstplatform.clientsdk.android/push/3.6.3/92cb73a4e022b7b99b511767ef80788325a4823d/push-3.6.3-sources.jar!/com/ibm/mobilefirstplatform/clientsdk/android/push/api/MFPPushNotificationListener.java
        if (!isAccepted) {
          var confirm_msg = 'Would Like to Send You Push Notifications';
          utilityService.showConfirm("", confirm_msg, "Don't Allow", "OK")
            .then(function (res) {
              if (res) {
                $localStorage.push_accepted = 1;
              }else {
                $localStorage.push_accepted = 0;
              }
            });
        }
      }else{
        $localStorage.push_accepted = 1; 
      }
			utilityService.setBusy(true);
			$window.BMSClient.initialize(BMSClient.REGION_US_SOUTH);

			var category = {};
			$window.BMSPush.initialize(appGuid, clientSecret, category);

			var success = function (resp) {
				console.log("BMS Push Registration Success Response:" + resp);
				deviceId = JSON.parse(resp).deviceId;
				deferred.resolve(deviceId);
				utilityService.setBusy(false);
			};
			var failure = function (resp) {
				console.log("BMS Push Registration Failure Response:" + resp);
				deferred.reject(resp);
				utilityService.setBusy(false);
			};
			var showNotification = function (notif) {
				console.log("Push notificatoin recieved successfully in bluemixServcie from here>>>>>>>>>", JSON.stringify(notif));
        $rootScope.$broadcast("pushNotificationCallBackListner", notif);
				$window.navigator.notification.alert(notif.message, function () {}, "Dri List notification", "ok");
			};
			setTimeout(function () {
				//alert("call register");
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
  
  
  
})




.factory('Users', function () {
	var usernames = [];
	usernames.numUsers = 0;

	return {
		getUsers: function () {
			return usernames;
		},
		addUsername: function (username) {
			usernames.push(username);
		},
		deleteUsername: function (username) {
			var index = usernames.indexOf(username);
			if (index != -1) {
				usernames.splice(index, 1);
			}
		},
		setNumUsers: function (data) {
			usernames.numUsers = data.numUsers;
		}
	};
})

.factory('Socket', function (socketFactory, SOCKET_ROOT) {
		//var server = 'http://offlinechat.mybluemix.net';
		//'http://offlinechat.mybluemix.net'; //http://chat.socket.io:80
		var myIoSocket = io.connect(SOCKET_ROOT);
		mySocket = socketFactory({
			ioSocket: myIoSocket
		});
		return myIoSocket;
	})
	.service('SocketBroadCastEvents', function (Socket, myService, $localStorage) {
		this.typing = function (data) {
			Socket.emit('$typing$event', data);
		};

		this.stopTyping = function (data) {
			Socket.emit('$stop$typing$event', data);
		};

		this.pushMessage = function (data) {
			Socket.emit('$push$message$event', data);
		};

		this.onAppPause = function () {
			console.log("going to triger event onAppPause");
			Socket.emit('$onAppPause$event', {
				id: $localStorage.access_token
			});
		};

		this.onAppResume = function () {
			console.log("going to triger event onAppResume event", JSON.stringify($localStorage));
			Socket.emit('$onAppResume$event', {
				id: $localStorage.access_token
			});
		};
	})
	.service('SocketListnerEvents', function (Socket) {
		this.typingListner = function (callback) {
			Socket.on('$typing$event', function (data) {
				callback(null, data);
			});
		};

		this.stopTypingListner = function (callback) {
			Socket.on('$stop$typing$event', function (data) {
				callback(null, data);
			});
		};

		this.messageListner = function (callback) {
			Socket.on('$push$message$event', function (data) {
				callback(null, data);
			});
		};
    this.newDataFromRecievedServer = function(callback){
      Socket.on('$new$Item$pushed$By$server', function(data){
        callback(null, data);
      });
    };
	});
