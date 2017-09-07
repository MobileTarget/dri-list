var samplePages = [
	{
        "page_id": 1,
        "user":{},
        "task": {
			"task_name": "Login",
            "template": {
                "header": {
                    "name": "",
                    "html": "",
                    "js": "var task_info = myService.getTaskInfo();\n$scope.title = task_info.task_name;\n$scope.login = function(user) {\n\tif (!user.phone) {\n\t\tutilityService.showAlert(\"Please enter phone number\").then(function(res) {\n\t\t\t$timeout(function() { $(\"#phone\").focus(); }, 100);\n\t\t});\n\t\treturn false;\n\t}\n\tvar endpoint = $scope.api_url + \"/api/login\";\n\tvar parameters = {\n\t\tphone:\t\t\tuser.phone,\n\t\taccess_token:\t$localStorage.access_token\n\t};\n\tvar config = {params: parameters};\n\t$http.get(endpoint, config).then(function(res) {\n\t\tvar res_data = res.data;\n\t\tconsole.log(\"res_data>>>\",res_data);\n\t\tmyService.apiResult = res_data;\n\t\t$scope.goPage(res_data.page_id);\n\t});\n};"
                },
				"detail": {
                    "name": "Login Form",
                    "html": "<ion-content padding=\"true\"><div class=\"wbox\" style=\"padding:30px;\"><h1 style=\"text-align:center;\">{{title}}</h1><ion-list style=\"\"><label class=\"item item-input\"><input type=\"text\" id=\"phone\" ng-model=\"user.phone\" placeholder=\"Phone\"></label></ion-list><div style=\"height: 40px;\" class=\"spacer\"></div><button class=\"button button-stable button-block\" id=\"login-button\" ng-click=\"login(user)\">NEXT</button></div></ion-content>",
                    "js": ""
                },
                "footer": {
                    "name": "",
                    "html": "",
                    "js": ""
                }
            },
			"from_page_id": 0,
            "to_page_id": 	0,
            "date_created": "1/26/2017 5:05 PM"
        },
        "detail": [],
		"access_token": "1490934989437.xddyx125s6hwipb9"
	},
	{
        "page_id": 11,
        "user":{},
        "task": {
			"task_name": "Verify Phone",
            "template": {
                "header": {
                    "name": "Verify Phone",
                    "html": "",
                    "js": "var task_info = myService.getTaskInfo();\n$scope.title = task_info.task_name;\n$scope.verify = function(user){\n\tif (!user.code) {\n\t\tutilityService.showAlert(\"Please enter code number\").then(function(res) {\n\t\t\t$timeout(function() { $(\"#code\").focus(); }, 100);\n\t\t});\n\t\treturn false;\n\t}\n\tvar endpoint = $scope.api_url + \"/api/verify\";\n\tvar parameters = {\n\t\tcode:\t\t\tuser.code,\n\t\taccess_token:\t$localStorage.access_token\n\t};\n\tvar config = {params: parameters};\n\t$http.get(endpoint, config).then(function(res) {\n\t\tvar res_data = res.data;\n\t\tconsole.log(\"res_data>>>\",res_data);\n\t\tif (res_data.status == \"valid\") {\n\t\t\t$localStorage.user_id = res_data.user_id;\n\t\t}\n\t\tmyService.apiResult = res_data;\n\t\t$scope.goPage(res_data.page_id);\n\t});\n};"
                },
				"detail": {
                    "name": "Code Form",
                    "html": "<ion-content padding=\"true\">\r\n\t<div class=\"wbox\" style=\"padding:30px;\">\r\n\t\t<form>\r\n\t\t\t<h1 style=\"text-align:center;\">{{title}}<\/h1>\r\n\t\t\t<ion-list style=\"\">\r\n\t\t\t\t<label class=\"item item-input\">\r\n\t\t\t\t\t<input type=\"text\" id=\"code\" ng-model=\"user.code\" placeholder=\"Verification code\">\r\n\t\t\t\t<\/label>\r\n\t\t\t<\/ion-list>\r\n\t\t\t<div style=\"height: 40px;\" class=\"spacer\"><\/div>\r\n\t\t\t<button class=\"button button-stable button-block\" id=\"verify-button\" ng-click=\"verify(user)\">SEND<\/button>\r\n\t\t<\/form>\r\n\t<\/div>\r\n<\/ion-content>",
                    "js": ""
                },
                "footer": {
                    "name": "",
                    "html": "",
                    "js": ""
                }
            },
			"from_page_id": 0,
            "to_page_id": 	0,
            "date_created": "1/26/2017 5:05 PM"
        },
        "detail": []
	},
	{
        "page_id": 2,
        "user":{
            "user_id":			1,
            "long_url": 		null,
            "access_token":		"1489106288366.re75jssjwrbpgb9",
            "security_level":	1,
            "phone":			123456,
            "virtual_phone":	456789,
            "email":			"roger@dri.com",
            "other":			"other content",
            "conversation_id":	12,
            "firstname": 		"roger",
            "lastname": 		"colburn",
			"type": {
			  "public": "public",
			  "admin": "admin"
			},
            "image":			"img/adam.jpg"
        },
        "task": {
			"task_id": "2_0",
			"task_name": "Categories",
			"from_page_id": 1,
            "date_created": "1/26/2017 5:05 PM",
            "template": {
                "header": {
                    "name": "Category",
                    "html": "<ion-header-bar class=\"bar-stable\">\n\t<button class=\"button button-icon\" ng-click=\"logout()\">\n\t <i class=\"icon ion-log-out\"></i>\n\t</button>\n\t<h1 class=\"title\">{{title}}</h1>\n\t<div class=\"buttons\">\n\t\t<button class=\"button button-icon\" ng-click=\"editUser()\">\n\t\t <i class=\"icon ion-person\"></i>\n\t\t</button>\n\t\t<button class=\"button button-icon\" ng-click=\"toggleDate()\">\n\t\t <i ng:class=\"(sort=='desc')?'icon ion-arrow-up-c':'icon ion-arrow-down-c'\"></i>\n\t\t</button>\n\t</div>\n</ion-header-bar>",
                    "js": "$scope.sort = \"asc\";\n$scope.sortKey = \"name\";\nvar task_info = myService.getTaskInfo();\n//$scope.config.page_id;\n$scope.config.from_page_id = task_info.from_page_id;\n$scope.config.task_id = task_info.task_id;\n$scope.config.task_name = task_info.task_name;\nconsole.log(\"$scope.config>>>\", $scope.config);\n$scope.title = $scope.config.task_name;\n$scope.isAdmin = true;\nfunction getDetail() {\n\tvar detailData = myService.getDetail();\n\tvar myDetail = [];\n\tfor (var ind = 0; ind<detailData.length; ind++) {\n\t\tvar item = detailData[ind];\n\t\tvar temp = {\n\t\t\t\"id\":\t\titem._id,\n\t\t\t\"name\":\t\titem.user_incoming.message,\n\t\t\t\"page_id\":\titem.to_page_id\n\t\t};\n\t\tmyDetail.push(temp);\n\t}\n\t$scope.details = utilityService.sortByKey(myDetail, $scope.sortKey, $scope.sort);\n};\ngetDetail();\n$scope.logout = function() {\n\t//$localStorage.$reset();\n\t$localStorage.access_token = null;\n\t$scope.goPage(1);\n};\n$scope.toggleDate = function() {\n\t$scope.sort = ($scope.sort == \"asc\")?\"desc\":\"asc\";\n\t$scope.details = utilityService.sortByKey($scope.details, $scope.sortKey, $scope.sort);\n};\n$scope.editUser = function(){\n\t$scope.config.from_page_id = 2;\n\t$scope.config.task_name = \"User edit\";\n\tvar page_id = 14;\n\t$scope.goPage(page_id);\n};\n$scope.subDetails = function(item){\n\t$scope.config.from_page_id = $scope.config.page_id;\n\t$scope.config.task_name = item.name;\n\t$scope.goPage(item.page_id);\n};\n$scope.add_category_detail = function() {\n\t//console.log($scope.data.message);\n\tvar endpoint = \"https://platform.mybluemix.net/add_detail\";\n\tvar postdata = {\n\t\tuser_id:\t\t$localStorage.user_id,\n\t\taccess_token: \t$localStorage.access_token,\n\t\tnote: \t\t\t$scope.data.message,\n\t\ttask_name:\t\t$scope.config.task_name,\n\t\tpage_id:\t\t$scope.config.page_id,\n\t\tfrom_page_id:\t$scope.config.from_page_id\n\t};\n\t//console.log(postdata);return true;\n\tvar headers = {\"Content-Type\": \"application/json\"};\n\tvar config = {headers:headers};\n\t$http.post(endpoint, postdata, config).then(function(res) {\n\t\tvar res_data = res.data;\n\t\tconsole.log(\"res_data>>>\",res_data);\n\t\t\n\t}, function(err) {\n\t\tconsole.log(\"err>>>\",err);\n\t});\n\tdelete $scope.data.message;\n};\n$scope.editDetails = function(item){\n\t$scope.config.from_page_id = $scope.config.page_id;\n\t$scope.config.task_name = item.name;\n\t$scope.short_info = {\n\t\t\"detail_id\": \titem.id,\n\t\t\"message\":\t \titem.name,\n\t\t\"task_id\":\t\t$scope.config.task_id,\n\t\t\"task_name\": \t$scope.config.task_name,\n\t\t\"task_status\":\t\"true\"\n\t};\n\tvar page_id = 15;\n\t$scope.goPage(page_id);\n};\n$scope.deleteDetails = function(item) {\n\tvar endpoint = \"https://platform.mybluemix.net/delete_detail\";\n\tvar parameters = {\n\t\t_id:\t\t item.id,\n\t\taccess_token: $localStorage.access_token\n\t};\n\t//console.log(parameters);return true;\n\tutilityService.setBusy(true, \"Processing...\");\n\tvar headers = {\"Content-Type\": \"application/json\"};\n\tvar config = {params:parameters, headers:headers};\n\t$http.get(endpoint, config).then(function(res){\n\t\tif(res.data.status == 200){\n\t\t\t$scope.details.splice($scope.details.indexOf(item), 1);\n\t\t}\n\t\telse {\n\t\t\t\n\t\t}\n\t\tutilityService.setBusy(false);\n\t}, function(err_task){\n\t\tconsole.log('err_task', err_task);\n\t\tutilityService.setBusy(false);\n\t});\n};\n$scope.moreDetails = function(item) {\n\t$scope.config.from_page_id = $scope.config.page_id;\n\t$scope.config.task_name = item.name;\n\tvar page_id = 16;\n\t$scope.goPage(page_id);\n};"
                },
				"detail": {
                    "name": "Detail",
                    "html": "<ion-content class=\"has-header\">\n\t<ion-list style=\"\">\n\t\t<ion-item ng-repeat=\"item in details\" type=\"item-text-wrap\"\n\t\t\tclass=\"item-remove-animate item-icon-right\">\n\t\t <div class=\"item-data\" ng-click=\"subDetails(item)\">\n\t\t\t <h2>{{item.name}}</h2>\n\t\t\t <i class=\"icon ion-chevron-right icon-accessory\"></i>\n\t\t </div>\n\t\t <item-swipe-pane class=\"left-pane\">\n\t\t\t<button class=\"button button-calm\" ng-click=\"editDetails(item)\">\n\t\t\t\t<div class=\"two-line-btn\">\n\t\t\t\t\t<ion-icon class=\"ion-edit\"></ion-icon>\n\t\t\t\t\t<label>Edit</label>\n\t\t\t\t</div>\n\t\t\t</button>\n\t\t\t<button class=\"button button-assertive\" ng-click=\"deleteDetails(item)\">\n\t\t\t\t<div class=\"two-line-btn\">\n\t\t\t\t\t<ion-icon class=\"ion-trash-a\"></ion-icon>\n\t\t\t\t\t<label>Delete</label>\n\t\t\t\t</div>\n\t\t\t</button>\n\t\t\t<button class=\"button button-balanced\" ng-click=\"moreDetails(item)\" ng-show=\"isAdmin\">\n\t\t\t\t<div class=\"two-line-btn\">\n\t\t\t\t\t<ion-icon class=\"ion-more\"></ion-icon>\n\t\t\t\t\t<label>More</label>\n\t\t\t\t</div>\n\t\t\t</button>\n\t\t </item-swipe-pane>\n\t\t</ion-item>\n\t</ion-list>\n</ion-content>",
                    "js": ""
                },
                "footer": {
                    "name": "",
                    "html": "<ion-footer-bar keyboard-attach class=\"bar-stable item-input-inset\">\n\t<form name=\"sendMessageForm\" class=\"sendmessage\" ng-submit=\"add_category_detail()\" novalidate>\n\t\t<label class=\"item-input-wrapper\">\n\t\t\t<input type=\"text\" placeholder=\"New Category\" ng-model=\"data.message\" ng-change=\"updateTyping()\" on-return=\"closeKeyboard()\" on-focus=\"inputUp()\" on-blur=\"inputDown()\" />\n\t\t</label>\n\t\t<div class=\"footer-btn-wrap\">\n\t\t\t<button type=\"submit\" class=\"button footer-btn\"\n\t\t\t\tng-disabled=\"!data.message\">Submit\n\t\t\t</button>\n\t\t</div>\n\t</form>\n</ion-footer-bar>",
                    "js": ""
                }
            }
        },
        "detail": [
			{
			  "_id": "2_1",
			  "image": "",
			  "to_page_id": 3,
			  "user_id": "23d5c58422026c68269cd6e9ac22ca4a",
			  "task_id": "2_0",
			  "page_id": 2,
			  "from_user_id": "9092618242e9895441bc9e978fa15098",
			  "user_incoming": {
				"message": "Books"
			  },
			  "watson_incoming": {},
			  "type": {},
			  "date_created": "",
			  "from_user": {},
			  "count": {
				"active": 1,
				"unread": 0
			  },
			  "task_name": "Categories"
			},
			{
			  "_id": "2_2",
			  "image": "",
			  "to_page_id": 4,
			  "user_id": "23d5c58422026c68269cd6e9ac22ca4a",
			  "task_id": "2_0",
			  "page_id": 2,
			  "from_user_id": "9092618242e9895441bc9e978fa15098",
			  "user_incoming": {
				"message": "Places"
			  },
			  "watson_incoming": {},
			  "type": {},
			  "date_created": "",
			  "from_user": {},
			  "count": {
				"active": 1,
				"unread": 0
			  },
			  "task_name": "Categories"
			},
			{
              "_id": 	"2_3",
                "image":		"img/taskimage1",
                "to_page_id": 	5,
                "user_id": 		"2",
                "from_user_id": "1",
                "user_incoming":{
					"message":	"SMS"
				},
                "watson_incoming":{},
                "date_created":	"1/26/2017 5:17 PM",
                "from_user":{},
				"count": {
					"active": 1,
					"unread": 0
				},
                "a":	"detail content b"
			},
			{
              "_id": 	"2_4",
                "image":		"img/taskimage1",
                "to_page_id": 	6,
                "user_id": 		"2",
                "from_user_id": "1",
                "user_incoming":{
					"message":	"Text"
				},
                "watson_incoming":{},
                "date_created":	"1/26/2017 5:17 PM",
                "from_user":{},
				"count": {
					"active": 1,
					"unread": 0
				},
                "a":	"detail content b"
			}
		]
	},
	{
        "page_id": 3,
		"user": {
			"user_id": "005c5e1411d38352a4fda07ffd565685",
			"firstname": "",
			"lastname": "",
			"email": "",
			"phone": "",
			"virtual_phone": 8164,
			"type": {}
		},
        "task": {
			"task_id": "3_0",
			"task_name": "Books",
			"parent_id": "2_0",
            "template": {
                "header": {
                    "name": "Books",
                    "html": "<ion-header-bar class=\"bar-stable\">\n\t<button class=\"button button-icon\" ng-click=\"goPage(config.from_page_id)\">\n\t <i class=\"icon ion-ios-arrow-back\">Back</i>\n\t</button>\n\t<h1 class=\"title\">{{title}}</h1>\n\t<div class=\"buttons\">\n\t\t<button class=\"button button-icon\" ng-click=\"editUser()\">\n\t\t <i class=\"icon ion-person\"></i>\n\t\t</button>\n\t\t<button class=\"button button-icon\" ng-click=\"toggleDate()\">\n\t\t <i ng:class=\"(sort=='desc')?'icon ion-arrow-up-c':'icon ion-arrow-down-c'\"></i>\n\t\t</button>\n\t</div>\n</ion-header-bar>",
                    "js": "$scope.sort = \"asc\";\n$scope.sortKey = \"name\";\nvar task_info = myService.getTaskInfo();\n//$scope.config.page_id;\n$scope.config.from_page_id = task_info.from_page_id;\n$scope.config.task_id = task_info.task_id;\n$scope.config.task_name = task_info.task_name;\nconsole.log(\"$scope.config>>>\", $scope.config);\n$scope.title = $scope.config.task_name;\n$scope.isAdmin = true;\nfunction getDetail() {\n\tvar detailData = myService.getDetail();\n\tvar myDetail = [];\n\tfor (var ind = 0; ind<detailData.length; ind++) {\n\t\tvar item = detailData[ind];\n\t\tvar temp = {\n\t\t\t\"id\":\t\titem._id,\n\t\t\t\"name\":\t\titem.user_incoming.message,\n\t\t\t\"page_id\":\titem.to_page_id,\n\t\t\t\"active\":\titem.count.active,\n\t\t\t\"unread\":\titem.count.unread\n\t\t};\n\t\tmyDetail.push(temp);\n\t}\n\t$scope.details = utilityService.sortByKey(myDetail, $scope.sortKey, $scope.sort);\n};\ngetDetail();\n$scope.toggleDate = function() {\n\t$scope.sort = ($scope.sort == \"asc\")?\"desc\":\"asc\";\n\t$scope.details = utilityService.sortByKey($scope.details, $scope.sortKey, $scope.sort);\n};\n$scope.editUser = function(){\n\t$scope.config.from_page_id = 2;\n\t$scope.config.task_name = \"User edit\";\n\tvar page_id = 14;\n\t$scope.goPage(page_id);\n};\n$scope.subDetails = function(item){\n\t$scope.config.from_page_id = $scope.config.page_id;\n\t$scope.config.task_name = item.name;\n\t$scope.goPage(item.page_id);\n};\n$scope.add_detail_sub_from_category = function() {\n\t//console.log($scope.data.message);\n\tvar endpoint = \"https://platform.mybluemix.net/add_detail\";\n\tvar postdata = {\n\t\tuser_id:\t\t$localStorage.user_id,\n\t\taccess_token: \t$localStorage.access_token,\n\t\tnote: \t\t\t$scope.data.message,\n\t\ttask_name:\t\t$scope.config.task_name,\n\t\tpage_id:\t\t$scope.config.page_id,\n\t\tfrom_page_id:\t$scope.config.from_page_id\n\t};\n\t//console.log(postdata);return true;\n\tvar headers = {\"Content-Type\": \"application/json\"};\n\tvar config = {headers:headers};\n\t$http.post(endpoint, postdata, config).then(function(res) {\n\t\tvar res_data = res.data;\n\t\tconsole.log(\"res_data>>>\",res_data);\n\t\t\n\t},function(err) {\n\t\tconsole.log(\"err>>>\",err);\n\t});\n\tdelete $scope.data.message;\n};\n$scope.editDetails = function(item){\n\t$scope.config.from_page_id = $scope.config.page_id;\n\t$scope.config.task_name = item.name;\n\t$scope.short_info = {\n\t\t\"detail_id\": \titem.id,\n\t\t\"message\":\t \titem.name,\n\t\t\"task_id\":\t\t$scope.config.task_id,\n\t\t\"task_name\": \t$scope.config.task_name,\n\t\t\"task_status\":\t\"true\"\n\t};\n\tvar page_id = 15;\n\t$scope.goPage(page_id);\n};\n$scope.deleteDetails = function(item) {\n\tvar endpoint = \"https://platform.mybluemix.net/delete_detail\";\n\tvar parameters = {\n\t\t_id:\t\t item.id,\n\t\taccess_token: $localStorage.access_token\n\t};\n\t//console.log(parameters);return true;\n\tutilityService.setBusy(true, \"Processing...\");\n\tvar headers = {\"Content-Type\": \"application/json\"};\n\tvar config = {params:parameters, headers:headers};\n\t$http.get(endpoint, config).then(function(res){\n\t\tif(res.data.status == 200){\n\t\t\t$scope.details.splice($scope.details.indexOf(item), 1);\n\t\t}\n\t\telse {\n\t\t\t\n\t\t}\n\t\tutilityService.setBusy(false);\n\t}, function(err_task){\n\t\tconsole.log('err_task', err_task);\n\t\tutilityService.setBusy(false);\n\t});\n};\n$scope.moreDetails = function(item) {\n\t$scope.config.from_page_id = $scope.config.page_id;\n\t$scope.config.task_name = item.name;\n\tvar page_id = 16;\n\t$scope.goPage(page_id);\n};"
                },
				"detail": {
                    "name": "Book list",
                    "html": "<ion-content class=\"has-header\">\n\t<ion-list style=\"\">\n\t <ion-item class=\"item-remove-animate item-icon-right\" ng-repeat=\"item in details\" type=\"item-text-wrap\" ng-click=\"subDetails(item)\">\n\t\t<h2 style=\"display:inline-block;\">{{item.name}}</h2>\n\t\t<i class=\"icon ion-chevron-right icon-accessory\"></i>\n\t </ion-item>\n\t</ion-list>\n</ion-content>",
                    "js": ""
                },
                "footer": {
                    "name": "",
                    "html": "<ion-footer-bar keyboard-attach class=\"bar-stable item-input-inset\">\n\t<form name=\"sendMessageForm\" class=\"sendmessage\" ng-submit=\"add_detail_sub_from_category()\" novalidate>\n\t\t<label class=\"item-input-wrapper\">\n\t\t\t<input type=\"text\" placeholder=\"New Book\" ng-model=\"data.message\" ng-change=\"updateTyping()\" on-return=\"closeKeyboard()\" on-focus=\"inputUp()\" on-blur=\"inputDown()\" />\n\t\t</label>\n\t\t<div class=\"footer-btn-wrap\">\n\t\t\t<button type=\"submit\" class=\"button footer-btn\"\n\t\t\t\tng-disabled=\"!data.message\">Submit\n\t\t\t</button>\n\t\t</div>\n\t</form>\n</ion-footer-bar>",
                    "js": ""
                }
            },
			"from_page_id": 2,
			"child_task_id": "80f37beb644eb8e365422286f051b5ca",
			"date_created": "2017-03-15T10:29:39.453Z"
        },
        "detail": [
			{
			  "_id": "3_1",
			  "image": "",
			  "to_page_id": 31,
			  "user_id": "23d5c58422026c68269cd6e9ac22ca4a",
			  "task_id": "3_0",
			  "page_id": 3,
			  "from_user_id": "9092618242e9895441bc9e978fa15098",
			  "user_incoming": {
				"message": "Paradise Lost"
			  },
			  "watson_incoming": {},
			  "type": {
				"public": "public"
			  },
			  "date_created": "",
			  "from_user": {},
			  "count": {
				"active": 3,
				"unread": 0
			  }
			},
			{
			  "_id": "3_2",
			  "image": "",
			  "to_page_id": 32,
			  "user_id": "23d5c58422026c68269cd6e9ac22ca4a",
			  "task_id": "3_0",
			  "page_id": 3,
			  "from_user_id": "9092618242e9895441bc9e978fa15098",
			  "user_incoming": {
				"message": "The Lean Startup"
			  },
			  "watson_incoming": {},
			  "type": {
				"public": "public"
			  },
			  "date_created": "",
			  "from_user": {},
			  "count": {
				"active": 3,
				"unread": 0
			  }
			}
		]
	},
	{
        "page_id": 31,
        "user": {
			"user_id": "005c5e1411d38352a4fda07ffd565685",
			"firstname": "",
			"lastname": "",
			"email": "",
			"phone": "",
			"virtual_phone": 8164,
			"type": {}
		},
        "task": {
			"task_id": "31_0",
			"task_name": "Paradise Lost",
			"parent_id": "3_0",
			"template": {
			  "header": {
				"_id": "31_h",
				"_rev": "3-82b4e111d96e9cb256b19a163e0e8244",
				"table": "template",
				"name": "",
				"html": "<ion-header-bar class=\"bar-stable\">\n\t<button class=\"button button-icon\" ng-click=\"goPage(3)\">\n\t <i class=\"icon ion-ios-arrow-back\">Back</i>\n\t</button>\n\t<h1 class=\"title\">{{title}}</h1>\n\t<button class=\"button button-icon\" ng-click=\"toggleDate()\">\n\t <i ng:class=\"(sort=='desc')?'icon ion-arrow-up-c':'icon ion-arrow-down-c'\"></i>\n\t</button>\n</ion-header-bar>",
				"js": "$scope.sort.order = \"asc\";\n$scope.sort.key = \"date_created\";\n$scope.messages = [];\n$scope.hideTime = false;\n$scope.typingStateStr = \". . .\";\n$scope.myMsgTypeStr = \"mine\";\n\nvar task_info = myService.getTaskInfo();\n$scope.config.from_page_id = task_info.from_page_id;\n$scope.config.task_id = task_info.task_id;\n$scope.config.task_name = task_info.task_name;\n$scope.title = $scope.config.task_name;\n\nthis.getDetail = function() {\n\tvar detailData = myService.getDetail();\n\tvar myDetail = [];\n\tfor (var ind = 0; ind<detailData.length; ind++) {\n\t\tvar item = detailData[ind];\n\t\tvar msg_type = \"\";\n\t\tvar message = \"\";\n\t\tif(typeof item.user_id == $localStorage.user_id){\n\t\t\tmsg_type = \"mine\";\n\t\t\tmessage = item.user_incoming.message;\n\t\t}\n\t\telse {\n\t\t\tmsg_type = \"other\";\n\t\t\tmessage = item.user_incoming.message;\n\t\t}\n\t\tvar temp = {\n\t\t\t\"detail_id\":\titem._id,\n\t\t\t\"type\":\t\t\tmsg_type,\n\t\t\t\"message\":\t\tmessage,\n\t\t\t\"date_created\":\titem.date_created\n\t\t};\n\t\tmyDetail.push(temp);\n\t}\n\t$scope.messages = utilityService.sortByKey(myDetail, $scope.sortKey, $scope.sort);\n};\nthis.getDetail();\n\n$scope.toggleDate = function() {\n\t$scope.sort = ($scope.sort == \"asc\")?\"desc\":\"asc\";\n\t$scope.messages = utilityService.sortByKey($scope.messages, $scope.sortKey, $scope.sort);\n};\n\n$scope.add_msg_from_sub_category = function() {\n\tvar endpoint = \"http://platform.mybluemix.net/api_handler\" ,\n\t\tpostdata = {\n\t\t\t\"type\": \"add_detail\",\n\t\t\t\"body\": {\n\t\t\t\t\"user_id\":\t\t\t$localStorage.user_id,\n\t\t\t\t\"access_token\": \t$localStorage.access_token,\n\t\t\t\t\"note\": \t\t\t$scope.data.message,\n\t\t\t\t\"task_id\":\t\t \ttask_info.task_id,\n\t\t\t\t\"page_id\":\t\t\t$scope.config.page_id,\n\t\t\t\t\"from_page_id\":\t\t$scope.config.from_page_id\n\t\t\t}\n\t\t};\n\tutilityService.setBusy(true, \"Sending...\");\n\tvar headers = {\"Content-Type\": \"application/json\"};\n\tvar config = {headers:headers};\n\t$http.post(endpoint, postdata, config).then(function(res) {\n\t\tvar res_data = res.data;\n\t\tconsole.log(\"res_data>>>\",res_data);\n\t\t\n\t\tvar msg_data = {\n\t\t\t\"detail_id\":\tres_data._id,\n\t\t\t\"type\":\t\t\t\"mine\",\n\t\t\t\"message\":\t\tres_data.user_incoming.message,\n\t\t\t\"date_created\":\tres_data.date_created\n\t\t};\n\t\t$scope.messages.push(msg_data);\n\t\tutilityService.setBusy(false);\n\t},function(err) {\n\t\tconsole.log(\"err>>>\",err);\n\t\tutilityService.setBusy(false);\n\t});\n\tdelete $scope.data.message;\n};"
			  },
			  "detail": {
				"_id": "31_d",
				"_rev": "2-437406201ae1d2ca6e918cab40d5ee00",
				"table": "template",
				"name": "Message list",
				"html": "<ion-content class=\"content-stable\"\n\t\t on-swipe-left=\"hideTime = false\"\n\t\t on-swipe-right=\"hideTime = true\">\n\t<div ng-repeat=\"message in messages\"\n\t ng-class=\"{other: message.type != myMsgTypeStr}\" class=\"messages\">\n\t\t<div class=\"message\">\n\t\t\t<p class=\"chat-typing\" ng-show=\"message.message==typingStateStr\">{{message.username}}</p>\n\t\t\t<span >{{ message.message }}</span>\n\t\t</div>\n\t</div>\n</ion-content>",
				"js": ""
			  },
			  "footer": {
				"_id": "31_f",
				"_rev": "3-00c894d09f4319f708a48e4ac4a4ce0a",
				"table": "template",
				"name": "",
				"html": "<ion-footer-bar keyboard-attach class=\"bar-stable item-input-inset\">\n\t<form name=\"sendMessageForm\" class=\"sendmessage\"\n\t\tng-submit=\"\tparams = {\n\t\t\t\t\t\tapi_type: 'ADD_DETAIL',\n\t\t\t\t\t\ttable: 'add_detail',\n\t\t\t\t\t\ttable_data: {\n\t\t\t\t\t\t\tnote:\t\tdata.message,\n\t\t\t\t\t\t\ttask_id:\tconfig.task_id,\n\t\t\t\t\t\t\ttask_name:\tconfig.task_name,\n\t\t\t\t\t\t\tpage_id:\tconfig.page_id,\n\t\t\t\t\t\t\tfrom_page_id: config.from_page_id\n\t\t\t\t\t\t}\n\t\t\t\t\t};\n\t\t\t\t\tcommon_request_handler(params)\">\n\t\t<label class=\"item-input-wrapper\">\n\t\t\t<input type=\"text\" placeholder=\"{{config.task_name}} message\" ng-model=\"data.message\" ng-change=\"updateTyping()\" on-return=\"closeKeyboard()\" on-focus=\"inputUp()\" on-blur=\"inputDown()\" />\n\t\t</label>\n\t\t<div class=\"footer-btn-wrap\">\n\t\t\t<button type=\"submit\" class=\"button footer-btn\"\n\t\t\t\tng-disabled=\"!data.message\">Submit\n\t\t\t</button>\n\t\t</div>\n\t</form>\n</ion-footer-bar>\n\n\n",
				"js": ""
			  }
			},
			"from_page_id": 3,
			"child_task_id": "ea1f86fe7bb573a145fb8e66ab08c49e",
			"date_created": "2017-03-15T10:29:39.453Z"
		},
        "detail": [
			{
			  "_id": "31_1",
			  "image": "",
			  "to_page_id": 31,
			  "user_id": "23d5c58422026c68269cd6e9ac22ca4a",
			  "task_id": "31_0",
			  "page_id": 31,
			  "from_user_id": "9092618242e9895441bc9e978fa15098",
			  "user_incoming": {
				"message": "mine message will be userincoming and the others will be wastonincoming?"
			  },
			  "watson_incoming": {},
			  "type": {
				"public": "public"
			  },
			  "date_created": "1/26/2017 5:17 PM",
			  "from_user": {},
			  "count": {
				"active": 3,
				"unread": 0
			  }
			},
			{
			  "_id": "31_2",
			  "image": "",
			  "to_page_id": 31,
			  "user_id": "23d5c58422026c68269cd6e9ac22ca4a",
			  "task_id": "31_0",
			  "page_id": 31,
			  "from_user_id": "9092618242e9895441bc9e978fa15098",
			  "user_incoming": {
				"message": "Yes a field inside there called message"
			  },
			  "watson_incoming": {
				"message": "Yes a field inside there called message"
			  },
			  "type": {
				"public": "public"
			  },
			  "date_created": "1/26/2017 6:27 PM",
			  "from_user": {},
			  "count": {
				"active": 3,
				"unread": 0
			  }
			},
			{
			  "_id": "31_3",
			  "image": "",
			  "to_page_id": 31,
			  "user_id": "23d5c58422026c68269cd6e9ac22ca4a",
			  "task_id": "31_0",
			  "page_id": 31,
			  "from_user_id": "9092618242e9895441bc9e978fa15098",
			  "user_incoming": {
				"message": "So just field changes and HTML changes."
			  },
			  "watson_incoming": {
				"message": "So just field changes and HTML changes."
			  },
			  "type": {
				"public": "public"
			  },
			  "date_created": "1/26/2017 7:11 PM",
			  "from_user": {},
			  "count": {
				"active": 3,
				"unread": 0
			  }
			}
		  ]
	},
	{
        "page_id": 32,
        "user":{
            "user_id":			"2",
            "access_token":		"1489106288366.re75jssjwrbpgb9",
            "security_level":	1,
            "phone":			123456,
            "firstname": 		"roger",
            "image":			"img/userimagedfdff"
        },
        "task": {
			"task_name": "The Lean Startup",
            "template": {
                "header": {
                    "name": "",
                    "html": "<ion-header-bar class=\"bar-stable\">\r\n\t<button class=\"button button-icon\" ng-click=\"goPage(3)\">\r\n\t   <i class=\"icon ion-ios-arrow-back\">Back<\/i>\r\n\t<\/button>\r\n\t<h1 class=\"title\">{{title}}<\/h1>\r\n\t\r\n\t<button class=\"button button-icon\" ng-click=\"toggleDate()\">\r\n\t  <i ng:class=\"(sort=='desc')?'icon ion-arrow-up-c':'icon ion-arrow-down-c'\"><\/i>\r\n\t<\/button>\r\n<\/ion-header-bar>",
                    "js": "$scope.title = myService.getTitle();\r\n\r\n$scope.sort = \"asc\";\r\n$scope.sortKey = \"date_created\";\r\n$scope.messages = [];\r\n$scope.hideTime = false;\r\n$scope.typingStateStr = \". . .\";\r\n$scope.myMsgTypeStr = \"mine\";\r\n$scope.data = {};\r\n\r\nthis.getDetail = function() {\r\n\tvar detailData = myService.getDetail();\r\n\tvar myDetail = [];\r\n\tfor (var ind = 0; ind<detailData.length; ind++) {\r\n\t\tvar item = detailData[ind];\r\n\t\tvar msg_type = \"\";\r\n\t\tvar message = \"\";\r\n\t\tif(typeof item.user_incoming.message != \"undefined\"){\r\n\t\t\tmsg_type = \"mine\";\r\n\t\t\tmessage = item.user_incoming.message;\r\n\t\t}\r\n\t\telse {\r\n\t\t\tmsg_type = \"other\";\r\n\t\t\tmessage = item.watson_incoming.message;\r\n\t\t}\r\n\t\tvar temp = {\r\n\t\t\t\"detail_id\":\titem.detail_id,\r\n\t\t\t\"type\":\t\t\tmsg_type,\r\n\t\t\t\"message\":\t\tmessage,\r\n\t\t\t\"date_created\":\titem.date_created\r\n\t\t};\r\n\t\tmyDetail.push(temp);\r\n\t}\r\n\t$scope.messages = utilityService.sortByKey(myDetail, $scope.sortKey, $scope.sort);\r\n};\r\nthis.getDetail();\r\n  \r\n$scope.toggleDate = function() {\r\n\t$scope.sort = ($scope.sort == \"asc\")?\"desc\":\"asc\";\r\n\t$scope.messages = utilityService.sortByKey($scope.messages, $scope.sortKey, $scope.sort);\r\n};\r\n  \r\n$scope.sendMsg=function(to,body){\r\n\tvar timestamp = new Date().getTime();\r\n\t\r\n};\r\n\r\n$scope.showSendMessage = function() {\r\n\t$scope.sendMsg($scope.parent_id,$scope.data.message);  \r\n\r\n\tvar d = new Date();\r\n\tdt = d.toLocaleDateString()+\" \"+d.toLocaleTimeString().replace(\/:\\d+ \/, \" \");\r\n\r\n\t$scope.messages.push({\r\n\t  user_id:\t$scope.user_id,\r\n\t  type:\t\t$scope.myMsgTypeStr,\r\n\t  message:\t$scope.data.message,\r\n\t  date_created: dt\r\n\t});\r\n\r\n\tdelete $scope.data.message;\r\n\t$ionicScrollDelegate.scrollBottom(true);\r\n};"
                },
				"detail": {
                    "name": "Message list",
                    "html": "<ion-content class=\"content-stable\"\r\n\t\t on-swipe-left=\"hideTime = false\"\r\n\t\t on-swipe-right=\"hideTime = true\">\r\n\t<div ng-repeat=\"message in messages\"\r\n\t   ng-class=\"{other: message.type != myMsgTypeStr}\"\r\n\t   class=\"messages\">\r\n\t\t<div class=\"message\" >\r\n\t\t\t<p class=\"chat-typing\" ng-show=\"message.message==typingStateStr\">{{message.username}}<\/p>\r\n\t\t\t<span >{{ message.message }}<\/span>\r\n\t\t<\/div>\r\n\t\t<div class=\"datetime\">{{message.date_created}}<\/div>\r\n\t<\/div>\r\n<\/ion-content>",
                    "js": ""
                },
                "footer": {
                    "name": "",
                    "html": "<ion-footer-bar keyboard-attach class=\"bar-stable item-input-inset\">\r\n\t<form name=\"sendMessageForm\" class=\"sendmessage\" ng-submit=\"showSendMessage()\" novalidate>\r\n\t\t<label class=\"item-input-wrapper\">\r\n\t\t\t<input type=\"text\" placeholder=\"Type your message\" ng-model=\"data.message\" ng-change=\"updateTyping()\" on-return=\"closeKeyboard()\" on-focus=\"inputUp()\" on-blur=\"inputDown()\" \/>\r\n\t\t<\/label>\r\n\t\t<div class=\"footer-btn-wrap\">\r\n\t\t\t<button type=\"submit\" class=\"button button-icon icon ion-ios-paperplane footer-btn\"\r\n\t\t\t\tng-disabled=\"!data.message\">\r\n\t\t\t<\/button>\r\n\t\t<\/div>\r\n\t<\/form>\r\n<\/ion-footer-bar>",
                    "js": ""
                }
            },
			"from_page_id": 3,
            "to_page_id": 	0,
            "date_created": "1/26/2017 5:05 PM"
        },
        "detail": [
			{
               "_id": 	1,
                "image":		"img/taskimage1",
                "page_id": 		32,
                "user_id": 		"2",
                "from_user_id": "1",
                "user_incoming":{
					"message":	"Chilling at my pool"
				},
                "watson_incoming":{},
                "date_created":	"1/26/2017 5:17 PM",
				"type": {
					"public": "public"
				},
                "from_user":{},
                "a":	"detail content b"
			},
			{
               "_id": 	2,
                "image":		"img/taskimage1",
                "page_id": 		32,
                "user_id": 		"4",
                "from_user_id": "1",
                "user_incoming":{},
                "watson_incoming":{
					"message":	"If not, Mom can get me."
				},
                "date_created":	"1/26/2017 6:27 PM",
				"type": {
					"public": "public"
				},
                "from_user":{},
                "a":	"detail content b"
			},
			{
               "_id": 	3,
                "image":		"img/taskimage1",
                "page_id": 		32,
                "user_id": 		"5f490c0ae2ee7321dc891a3e59bd64c6",
                "from_user_id": "1",
                "user_incoming":{
					"message":	"Want to have lunch and check out the office?"
				},
                "watson_incoming":{},
				"type": {
					"public": "public"
				},
                "date_created":	"1/26/2017 7:11 PM",
                "from_user":{},
                "a":	"detail content b"
			}
		]
	},
	{
        "page_id": 4,
        "user":{
            "user_id":			"2",
            "access_token":		"1489106288366.re75jssjwrbpgb9",
            "security_level":	1,
            "phone":			123456,
            "firstname": 		"roger",
            "image":			"img/userimagedfdff"
        },
        "task": {
			"task_id": "4_0",
			"task_name": "Travel",
            "template": {
                "header": {
                    "name": "Travel",
                    "html": "<ion-header-bar class=\"bar-stable\">\n\r<button class=\"button button-icon\" ng-click=\"goPage(2)\">\n\r<i class=\"icon ion-ios-arrow-back\">Back</i>\n\r</button>\n\r<h1 class=\"title\">{{title}}</h1>\n\r<button class=\"button button-icon\" ng-click=\"toggleDate()\">\n\r<i ng:class=\"(sort=='desc')?'icon ion-arrow-up-c':'icon ion-arrow-down-c'\"></i>\n\r</button>\n\r</ion-header-bar>",
                    "js": "$scope.sort = \"asc\";\n$scope.sortKey = \"name\";\nvar task_info = myService.getTaskInfo();\n//$scope.config.page_id;\n$scope.config.from_page_id = task_info.from_page_id;\n$scope.config.task_id = task_info.task_id;\n$scope.config.task_name = task_info.task_name;\nconsole.log(\"$scope.config>>>\", $scope.config);\n$scope.title = $scope.config.task_name;\n$scope.isAdmin = true;\nfunction getDetail() {\n\tvar detailData = myService.getDetail();\n\tvar myDetail = [];\n\tfor (var ind = 0; ind<detailData.length; ind++) {\n\t\tvar item = detailData[ind];\n\t\tvar temp = {\n\t\t\t\"id\":\t\titem._id,\n\t\t\t\"name\":\t\titem.user_incoming.message,\n\t\t\t\"page_id\":\titem.to_page_id,\n\t\t\t\"active\":\titem.count.active,\n\t\t\t\"unread\":\titem.count.unread\n\t\t};\n\t\tmyDetail.push(temp);\n\t}\n\t$scope.details = utilityService.sortByKey(myDetail, $scope.sortKey, $scope.sort);\n};\ngetDetail();\n$scope.toggleDate = function() {\n\t$scope.sort = ($scope.sort == \"asc\")?\"desc\":\"asc\";\n\t$scope.details = utilityService.sortByKey($scope.details, $scope.sortKey, $scope.sort);\n};\n$scope.editUser = function(){\n\t$scope.config.from_page_id = 2;\n\t$scope.config.task_name = \"User edit\";\n\tvar page_id = 14;\n\t$scope.goPage(page_id);\n};\n$scope.subDetails = function(item){\n\t$scope.config.from_page_id = $scope.config.page_id;\n\t$scope.config.task_name = item.name;\n\t$scope.goPage(item.page_id);\n};\n$scope.add_detail_sub_from_category = function() {\n\t//console.log($scope.data.message);\n\tvar endpoint = \"https://platform.mybluemix.net/add_detail\";\n\tvar postdata = {\n\t\tuser_id:\t\t$localStorage.user_id,\n\t\taccess_token: \t$localStorage.access_token,\n\t\tnote: \t\t\t$scope.data.message,\n\t\ttask_name:\t\t$scope.config.task_name,\n\t\tpage_id:\t\t$scope.config.page_id,\n\t\tfrom_page_id:\t$scope.config.from_page_id\n\t};\n\t//console.log(postdata);return true;\n\tvar headers = {\"Content-Type\": \"application/json\"};\n\tvar config = {headers:headers};\n\t$http.post(endpoint, postdata, config).then(function(res) {\n\t\tvar res_data = res.data;\n\t\tconsole.log(\"res_data>>>\",res_data);\n\t\t\n\t},function(err) {\n\t\tconsole.log(\"err>>>\",err);\n\t});\n\tdelete $scope.data.message;\n};\n$scope.editDetails = function(item){\n\t$scope.config.from_page_id = $scope.config.page_id;\n\t$scope.config.task_name = item.name;\n\t$scope.short_info = {\n\t\t\"detail_id\": \titem.id,\n\t\t\"message\":\t \titem.name,\n\t\t\"task_id\":\t\t$scope.config.task_id,\n\t\t\"task_name\": \t$scope.config.task_name,\n\t\t\"task_status\":\t\"true\"\n\t};\n\tvar page_id = 15;\n\t$scope.goPage(page_id);\n};\n$scope.deleteDetails = function(item) {\n\tvar endpoint = \"https://platform.mybluemix.net/delete_detail\";\n\tvar parameters = {\n\t\t_id:\t\t item.id,\n\t\taccess_token: $localStorage.access_token\n\t};\n\t//console.log(parameters);return true;\n\tutilityService.setBusy(true, \"Processing...\");\n\tvar headers = {\"Content-Type\": \"application/json\"};\n\tvar config = {params:parameters, headers:headers};\n\t$http.get(endpoint, config).then(function(res){\n\t\tif(res.data.status == 200){\n\t\t\t$scope.details.splice($scope.details.indexOf(item), 1);\n\t\t}\n\t\telse {\n\t\t\t\n\t\t}\n\t\tutilityService.setBusy(false);\n\t}, function(err_task){\n\t\tconsole.log('err_task', err_task);\n\t\tutilityService.setBusy(false);\n\t});\n};\n$scope.moreDetails = function(item) {\n\t$scope.config.from_page_id = $scope.config.page_id;\n\t$scope.config.task_name = item.name;\n\tvar page_id = 16;\n\t$scope.goPage(page_id);\n};"
                },
				"detail": {
                    "name": "Travel list",
                    "html": "<ion-content class=\"has-header\">\n\t<ion-list style=\"\">\n\t <ion-item class=\"item-remove-animate item-icon-right\" ng-repeat=\"item in details\" type=\"item-text-wrap\">\n\t\t<div class=\"item-data\" ng-click=\"subDetails(item)\">\n\t\t\t<h2 style=\"display:inline-block;\">{{item.name}}</h2>\n\t\t\t<i class=\"icon ion-chevron-right icon-accessory\">\n\t\t\t\t<span class=\"badge badge-assertive icon-badge\">{{item.active}} / {{item.unread}}</span>\n\t\t\t</i>\n\t\t</div>\n\t\t<item-swipe-pane class=\"left-pane\">\n\t\t\t<button class=\"button button-calm\" ng-click=\"editDetails(item)\">\n\t\t\t\t<div class=\"two-line-btn\">\n\t\t\t\t\t<ion-icon class=\"ion-edit\"></ion-icon>\n\t\t\t\t\t<label>Edit</label>\n\t\t\t\t</div>\n\t\t\t</button>\n\t\t\t<button class=\"button button-assertive\" ng-click=\"deleteDetails(item)\">\n\t\t\t\t<div class=\"two-line-btn\">\n\t\t\t\t\t<ion-icon class=\"ion-trash-a\"></ion-icon>\n\t\t\t\t\t<label>Delete</label>\n\t\t\t\t</div>\n\t\t\t</button>\n\t\t\t<button class=\"button button-balanced\" ng-click=\"moreDetails(item)\" ng-show=\"isAdmin\">\n\t\t\t\t<div class=\"two-line-btn\">\n\t\t\t\t\t<ion-icon class=\"ion-more\"></ion-icon>\n\t\t\t\t\t<label>More</label>\n\t\t\t\t</div>\n\t\t\t</button>\n\t\t</item-swipe-pane>\n\t </ion-item>\n\t</ion-list>\n</ion-content>",
                    "js": ""
                },
                "footer": {
                    "name": "",
                    "html": "<ion-footer-bar keyboard-attach class=\"bar-stable item-input-inset\">\n\t<form name=\"sendMessageForm\" class=\"sendmessage\" ng-submit=\"add_detail_sub_from_category()\" novalidate>\n\t\t<label class=\"item-input-wrapper\">\n\t\t\t<input type=\"text\" placeholder=\"New Sub Category\" ng-model=\"data.message\" ng-change=\"updateTyping()\" on-return=\"closeKeyboard()\" on-focus=\"inputUp()\" on-blur=\"inputDown()\" />\n\t\t</label>\n\t\t<div class=\"footer-btn-wrap\">\n\t\t\t<button type=\"submit\" class=\"button footer-btn\"\n\t\t\t\tng-disabled=\"!data.message\">Submit\n\t\t\t</button>\n\t\t</div>\n\t</form>\n</ion-footer-bar>",
                    "js": ""
                }
            },
			"from_page_id": 2,
            "date_created": "1/26/2017 5:05 PM"
        },
        "detail": [
			{
              "_id": 	1,
                "image":		"img/taskimage1",
                "to_page_id": 	41,
                "user_id": 		"2",
                "from_user_id": "1",
                "user_incoming":{
					"message":	"Germany"
				},
                "watson_incoming":{},
				"type": {
					"public": "public"
				},
				"count":		{"active":0, "unread":0},
                "date_created":	"1/26/2017 5:17 PM",
                "from_user":	{},
                "a":			"detail content b"
			},
			{
              "_id": 	2,
                "image":		"img/taskimage1",
                "to_page_id": 	42,
                "user_id": 		"2",
                "from_user_id": "1",
                "user_incoming":{
					"message":	"India"
				},
                "watson_incoming":{},
				"count":		{"active":1, "unread":0},
                "date_created":	"1/26/2017 5:17 PM",
                "from_user":{},
                "a":	"detail content b"
			}
		]
	},
	{
        "page_id": 41,
        "user":{
            "user_id":			"2",
            "access_token":		"1489106288366.re75jssjwrbpgb9",
            "security_level":	1,
            "phone":			123456,
            "firstname": 		"roger",
            "image":			"img/userimagedfdff"
        },
        "task": {
			"task_name": "Germany",
            "template": {
                "header": {
                    "name": "",
                    "html": "<ion-header-bar class=\"bar-stable\">\r\n\t<button class=\"button button-icon\" ng-click=\"goPage(4)\">\r\n\t   <i class=\"icon ion-ios-arrow-back\">Back</i>\r\n\t</button>\r\n\t<h1 class=\"title\">{{title}}</h1>\r\n\t\r\n\t<button class=\"button button-icon\" ng-click=\"toggleDate()\">\r\n\t  <i ng:class=\"(sort=='desc')?'icon ion-arrow-up-c':'icon ion-arrow-down-c'\"></i>\r\n\t</button>\r\n</ion-header-bar>",
                    "js": "$scope.title = myService.getTitle();\r\n\r\n$scope.sort = \"asc\";\r\n$scope.sortKey = \"date_created\";\r\n$scope.messages = [];\r\n$scope.hideTime = false;\r\n$scope.typingStateStr = \". . .\";\r\n$scope.myMsgTypeStr = \"mine\";\r\n$scope.data = {};\r\n\r\nthis.getDetail = function() {\r\n\tvar detailData = myService.getDetail();\r\n\tvar myDetail = [];\r\n\tfor (var ind = 0; ind<detailData.length; ind++) {\r\n\t\tvar item = detailData[ind];\r\n\t\tvar msg_type = \"\";\r\n\t\tvar message = \"\";\r\n\t\tif(typeof item.user_incoming.message != \"undefined\"){\r\n\t\t\tmsg_type = \"mine\";\r\n\t\t\tmessage = item.user_incoming.message;\r\n\t\t}\r\n\t\telse {\r\n\t\t\tmsg_type = \"other\";\r\n\t\t\tmessage = item.watson_incoming.message;\r\n\t\t}\r\n\t\tvar temp = {\r\n\t\t\t\"detail_id\":\titem.detail_id,\r\n\t\t\t\"type\":\t\t\tmsg_type,\r\n\t\t\t\"message\":\t\tmessage,\r\n\t\t\t\"date_created\":\titem.date_created\r\n\t\t};\r\n\t\tmyDetail.push(temp);\r\n\t}\r\n\t$scope.messages = utilityService.sortByKey(myDetail, $scope.sortKey, $scope.sort);\r\n};\r\nthis.getDetail();\r\n  \r\n$scope.toggleDate = function() {\r\n\t$scope.sort = ($scope.sort == \"asc\")?\"desc\":\"asc\";\r\n\t$scope.messages = utilityService.sortByKey($scope.messages, $scope.sortKey, $scope.sort);\r\n};\r\n  \r\n$scope.sendMsg=function(to,body){\r\n\tvar timestamp = new Date().getTime();\r\n\t\r\n};\r\n\r\n$scope.showSendMessage = function() {\r\n\t$scope.sendMsg($scope.parent_id,$scope.data.message);  \r\n\r\n\tvar d = new Date();\r\n\tdt = d.toLocaleDateString()+\" \"+d.toLocaleTimeString().replace(\/:\\d+ \/, \" \");\r\n\r\n\t$scope.messages.push({\r\n\t  user_id:\t$scope.user_id,\r\n\t  type:\t\t$scope.myMsgTypeStr,\r\n\t  message:\t$scope.data.message,\r\n\t  date_created: dt\r\n\t});\r\n\r\n\tdelete $scope.data.message;\r\n\t$ionicScrollDelegate.scrollBottom(true);\r\n};"
                },
				"detail": {
                    "name": "Message list",
                    "html": "<ion-content class=\"content-stable\"\r\n\t\t on-swipe-left=\"hideTime = false\"\r\n\t\t on-swipe-right=\"hideTime = true\">\r\n\t<div ng-repeat=\"message in messages\"\r\n\t   ng-class=\"{other: message.type != myMsgTypeStr}\"\r\n\t   class=\"messages\">\r\n\t\t<div class=\"message\" >\r\n\t\t\t<p class=\"chat-typing\" ng-show=\"message.message==typingStateStr\">{{message.username}}<\/p>\r\n\t\t\t<span >{{ message.message }}<\/span>\r\n\t\t<\/div>\r\n\t\t<div class=\"datetime\">{{message.date_created}}<\/div>\r\n\t<\/div>\r\n<\/ion-content>",
                    "js": ""
                },
                "footer": {
                    "name": "",
                    "html": "<ion-footer-bar keyboard-attach class=\"bar-stable item-input-inset\">\r\n\t<form name=\"sendMessageForm\" class=\"sendmessage\" ng-submit=\"showSendMessage()\" novalidate>\r\n\t\t<label class=\"item-input-wrapper\">\r\n\t\t\t<input type=\"text\" placeholder=\"Type your message\" ng-model=\"data.message\" ng-change=\"updateTyping()\" on-return=\"closeKeyboard()\" on-focus=\"inputUp()\" on-blur=\"inputDown()\" \/>\r\n\t\t<\/label>\r\n\t\t<div class=\"footer-btn-wrap\">\r\n\t\t\t<button type=\"submit\" class=\"button button-icon icon ion-ios-paperplane footer-btn\"\r\n\t\t\t\tng-disabled=\"!data.message\">\r\n\t\t\t<\/button>\r\n\t\t<\/div>\r\n\t<\/form>\r\n<\/ion-footer-bar>",
                    "js": ""
                }
            },
			"from_page_id": 4,
            "to_page_id": 	0,
            "date_created": "1/26/2017 5:05 PM"
        },
        "detail": [
			{
                "_id": 			1,
                "image":		"img/taskimage1",
                "to_page_id": 		0,
                "user_id": 		"2",
                "from_user_id": "1",
                "user_incoming":{
					"message":	"It's cups mom wanted for Jimmy."
				},
                "watson_incoming":{},
				"type": {
					"public": "public"
				},
                "date_created":	"1/26/2017 5:17 PM",
                "from_user":{},
                "a":	"detail content b"
			},
			{
               "_id": 	2,
                "image":		"img/taskimage1",
                "page_id": 		32,
                "user_id": 		"4",
                "from_user_id": "1",
                "user_incoming":{
					"message":	"If not, Mom can get me."
				},
                "watson_incoming":{},
                "date_created":	"1/26/2017 6:27 PM",
                "from_user":{},
                "a":	"detail content b"
			},
			{
               "_id": 	3,
                "image":		"img/taskimage1",
                "page_id": 		32,
                "user_id": 		"5f490c0ae2ee7321dc891a3e59bd64c6",
                "from_user_id": "1",
                "user_incoming":{},
                "watson_incoming":{
					"message":	"Want to have lunch and check out the office?"
				},
                "date_created":	"1/26/2017 7:11 PM",
                "from_user":{},
                "a":	"detail content b"
			}
		]
	},
	{
        "page_id": 42,
        "user":{
            "user_id":			"2",
            "access_token":		"1489106288366.re75jssjwrbpgb9",
            "security_level":	1,
            "phone":			123456,
            "firstname": 		"roger",
            "image":			"img/userimagedfdff"
        },
        "task": {
			"task_name": "India",
            "template": {
                "header": {
                    "name": "",
                    "html": "<ion-header-bar class=\"bar-stable\">\r\n\t<button class=\"button button-icon\" ng-click=\"goPage(4)\">\r\n\t   <i class=\"icon ion-ios-arrow-back\">Back</i>\r\n\t</button>\r\n\t<h1 class=\"title\">{{title}}</h1>\r\n\t\r\n\t<button class=\"button button-icon\" ng-click=\"toggleDate()\">\r\n\t  <i ng:class=\"(sort=='desc')?'icon ion-arrow-up-c':'icon ion-arrow-down-c'\"></i>\r\n\t</button>\r\n</ion-header-bar>",
                    "js": "$scope.title = myService.getTitle();\r\n\r\n$scope.sort = \"asc\";\r\n$scope.sortKey = \"date_created\";\r\n$scope.messages = [];\r\n$scope.hideTime = false;\r\n$scope.typingStateStr = \". . .\";\r\n$scope.myMsgTypeStr = \"mine\";\r\n$scope.data = {};\r\n\r\nthis.getDetail = function() {\r\n\tvar detailData = myService.getDetail();\r\n\tvar myDetail = [];\r\n\tfor (var ind = 0; ind<detailData.length; ind++) {\r\n\t\tvar item = detailData[ind];\r\n\t\tvar msg_type = \"\";\r\n\t\tvar message = \"\";\r\n\t\tif(typeof item.user_incoming.message != \"undefined\"){\r\n\t\t\tmsg_type = \"mine\";\r\n\t\t\tmessage = item.user_incoming.message;\r\n\t\t}\r\n\t\telse {\r\n\t\t\tmsg_type = \"other\";\r\n\t\t\tmessage = item.watson_incoming.message;\r\n\t\t}\r\n\t\tvar temp = {\r\n\t\t\t\"detail_id\":\titem.detail_id,\r\n\t\t\t\"type\":\t\t\tmsg_type,\r\n\t\t\t\"message\":\t\tmessage,\r\n\t\t\t\"date_created\":\titem.date_created\r\n\t\t};\r\n\t\tmyDetail.push(temp);\r\n\t}\r\n\t$scope.messages = utilityService.sortByKey(myDetail, $scope.sortKey, $scope.sort);\r\n};\r\nthis.getDetail();\r\n  \r\n$scope.toggleDate = function() {\r\n\t$scope.sort = ($scope.sort == \"asc\")?\"desc\":\"asc\";\r\n\t$scope.messages = utilityService.sortByKey($scope.messages, $scope.sortKey, $scope.sort);\r\n};\r\n  \r\n$scope.sendMsg=function(to,body){\r\n\tvar timestamp = new Date().getTime();\r\n\t\r\n};\r\n\r\n$scope.showSendMessage = function() {\r\n\t$scope.sendMsg($scope.parent_id,$scope.data.message);  \r\n\r\n\tvar d = new Date();\r\n\tdt = d.toLocaleDateString()+\" \"+d.toLocaleTimeString().replace(\/:\\d+ \/, \" \");\r\n\r\n\t$scope.messages.push({\r\n\t  user_id:\t$scope.user_id,\r\n\t  type:\t\t$scope.myMsgTypeStr,\r\n\t  message:\t$scope.data.message,\r\n\t  date_created: dt\r\n\t});\r\n\r\n\tdelete $scope.data.message;\r\n\t$ionicScrollDelegate.scrollBottom(true);\r\n};"
                },
				"detail": {
                    "name": "Message list",
                    "html": "<ion-content class=\"content-stable\"\r\n\t\t on-swipe-left=\"hideTime = false\"\r\n\t\t on-swipe-right=\"hideTime = true\">\r\n\t<div ng-repeat=\"message in messages\"\r\n\t   ng-class=\"{other: message.type != myMsgTypeStr}\"\r\n\t   class=\"messages\">\r\n\t\t<div class=\"message\" >\r\n\t\t\t<p class=\"chat-typing\" ng-show=\"message.message==typingStateStr\">{{message.username}}<\/p>\r\n\t\t\t<span >{{ message.message }}<\/span>\r\n\t\t<\/div>\r\n\t\t<div class=\"datetime\">{{message.date_created}}<\/div>\r\n\t<\/div>\r\n<\/ion-content>",
                    "js": ""
                },
                "footer": {
                    "name": "",
                    "html": "<ion-footer-bar keyboard-attach class=\"bar-stable item-input-inset\">\r\n\t<form name=\"sendMessageForm\" class=\"sendmessage\" ng-submit=\"showSendMessage()\" novalidate>\r\n\t\t<label class=\"item-input-wrapper\">\r\n\t\t\t<input type=\"text\" placeholder=\"Type your message\" ng-model=\"data.message\" ng-change=\"updateTyping()\" on-return=\"closeKeyboard()\" on-focus=\"inputUp()\" on-blur=\"inputDown()\" \/>\r\n\t\t<\/label>\r\n\t\t<div class=\"footer-btn-wrap\">\r\n\t\t\t<button type=\"submit\" class=\"button button-icon icon ion-ios-paperplane footer-btn\"\r\n\t\t\t\tng-disabled=\"!data.message\">\r\n\t\t\t<\/button>\r\n\t\t<\/div>\r\n\t<\/form>\r\n<\/ion-footer-bar>",
                    "js": ""
                }
            },
			"from_page_id": 4,
            "to_page_id": 	0,
            "date_created": "1/26/2017 5:05 PM"
        },
        "detail": [
			{
               "_id": 	1,
                "image":		"img/taskimage1",
                "page_id": 		32,
                "user_id": 		"2",
                "from_user_id": "1",
                "user_incoming":{},
                "watson_incoming":{
					"message":	"I have included a skeleton for local_data.js"
				},
                "date_created":	"1/26/2017 5:17 PM",
                "from_user":{},
                "a":	"detail content b"
			},
			{
               "_id": 	2,
                "image":		"img/taskimage1",
                "page_id": 		32,
                "user_id": 		"4",
                "from_user_id": "1",
                "user_incoming":{},
                "watson_incoming":{
					"message":	"“from_user”:{“image”:”img/file”}"
				},
                "date_created":	"1/26/2017 6:27 PM",
                "from_user":{},
                "a":	"detail content b"
			},
			{
               "_id": 	3,
                "image":		"img/taskimage1",
                "page_id": 		32,
                "user_id": 		"5f490c0ae2ee7321dc891a3e59bd64c6",
                "from_user_id": "1",
                "user_incoming":{
					"message":	"Big_record table will be used in webapp?"
				},
                "watson_incoming":{},
                "date_created":	"1/26/2017 7:11 PM",
                "from_user":{},
                "a":	"detail content b"
			}
		]
	},
	{
        "page_id": 5,
        "user":{
            "user_id":			"2",
            "access_token":		"1489106288366.re75jssjwrbpgb9",
            "security_level":	1,
            "phone":			123456,
            "firstname": 		"roger",
            "image":			"img/userimagedfdff"
        },
        "task": {
			"task_name": "Messages",
            "template": {
                "header": {
                    "name": "Messages",
                    "html": "<ion-header-bar class=\"bar-stable\">\n\r<button class=\"button button-icon\" ng-click=\"goPage(2)\">\n\r<i class=\"icon ion-ios-arrow-back\">Back</i>\n\r</button>\n\r<h1 class=\"title\">{{title}}</h1>\n\r<button class=\"button button-icon\" ng-click=\"toggleDate()\">\n\r<i ng:class=\"(sort=='desc')?'icon ion-arrow-up-c':'icon ion-arrow-down-c'\"></i>\n\r</button>\n\r</ion-header-bar>",
                    "js": "$scope.title = myService.getTitle();\n\r$scope.sort = \"asc\";\n\r$scope.sortKey = \"name\";\n\rthis.getDetail = function() {\n\rvar detailData = myService.getDetail();\n\rvar myDetail = [];\n\rfor (var ind = 0; ind<detailData.length; ind++) {\n\rvar item = detailData[ind];\n\rvar temp = {\n\r\"detail_id\":item._id,\n\r\"name\":item.user_incoming.message,\n\r\"image\":item.image,\n\r\"page_id\":item.to_page_id\n\r};\n\rmyDetail.push(temp);\n\r}\n\r$scope.details = utilityService.sortByKey(myDetail, $scope.sortKey, $scope.sort);\n\r};\n\rthis.getDetail();\n\r$scope.toggleDate = function() {\n\r$scope.sort = ($scope.sort == \"asc\")?\"desc\":\"asc\";\n\r$scope.details = utilityService.sortByKey($scope.details, $scope.sortKey, $scope.sort);\n\r};\n\r$scope.subDetails = function(page_id){\n\r$scope.goPage(page_id);\n\r};"
                },
				"detail": {
                    "name": "User list",
                    "html": "<ion-content class=\"has-header\">\n\r<ion-list style=\"\">\n\r<ion-item class=\"item-remove-animate item-avatar item-icon-right\" ng-repeat=\"item in details\" type=\"item-text-wrap\" ng-click=\"subDetails(item.page_id)\">\n\r<img ng-src=\"{{item.image}}\">\n\r<h2 style=\"display:inline-block;\">{{item.name}}</h2>\n\r<i class=\"icon ion-chevron-right icon-accessory\"></i>\n\r</ion-item>\n\r</ion-list>\n\r</ion-content>",
                    "js": ""
                },
                "footer": {
                    "name": "",
                    "html": "<ion-footer-bar keyboard-attach class=\"bar-stable item-input-inset\">\n\r<form name=\"sendMessageForm\" class=\"sendmessage\" ng-submit=\"addDetail()\" novalidate>\n\r<label class=\"item-input-wrapper\">\n\r<input type=\"text\" placeholder=\"Type your message\" ng-model=\"data.message\" ng-change=\"updateTyping()\" on-return=\"closeKeyboard()\" on-focus=\"inputUp()\" on-blur=\"inputDown()\" />\n\r</label>\n\r<div class=\"footer-btn-wrap\">\n\r<button type=\"submit\" class=\"button button-icon icon ion-ios-paperplane footer-btn\"\n\rng-disabled=\"!data.message\">\n\r</button>\n\r</div>\n\r</form>\n\r</ion-footer-bar>",
                    "js": ""
                }
            },
			"from_page_id": 2,
            "date_created": "1/26/2017 5:05 PM"
        },
        "detail": [
			{
                "_id": 	1,
                "image":		"img/adam.jpg",
                "to_page_id": 	51,
                "user_id": 		"2",
                "from_user_id": "1",
                "user_incoming":{
					"message":	"Adam"
				},
                "watson_incoming":{},
                "date_created":	"1/26/2017 5:05 PM",
                "from_user":{},
				"count": {
					"active": 1,
					"unread": 0
				},
                "a":	"detail content b"
			},
			{
               "_id": 	2,
                "image":		"img/ben.png",
                "to_page_id": 	52,
                "user_id": 		"2",
                "from_user_id": "1",
                "user_incoming":{
					"message":	"Ben"
				},
                "watson_incoming":{},
                "date_created": "1/26/2017 6:06 PM",
                "from_user":{},
				"count": {
					"active": 1,
					"unread": 0
				},
                "a":	"detail content b"
			},
			{
               "_id": 	3,
                "image":		"img/clemens.png",
                "to_page_id": 	53,
                "user_id": 		"2",
                "from_user_id": "1",
                "user_incoming":{
					"message":	"Clemens"
				},
                "watson_incoming":{},
                "date_created": "1/26/2017 7:07 PM",
                "from_user":{},
				"count": {
					"active": 1,
					"unread": 0
				},
                "a":	"detail content b"
			}
		]
	},
	{
        "page_id": 51,
        "user":{
            "user_id":			"2",
            "access_token":		"1489106288366.re75jssjwrbpgb9",
            "security_level":	1,
            "phone":			123456,
            "firstname": 		"roger",
            "image":			"img/userimagedfdff"
        },
        "task": {
			"task_name": "Adam",
            "template": {
                "header": {
                    "name": "",
                    "html": "<ion-header-bar class=\"bar-stable\">\n\r<button class=\"button button-icon\" ng-click=\"goPage(5)\">\n\r<i class=\"icon ion-ios-arrow-back\">Back</i>\n\r</button>\n\r<h1 class=\"title\">{{title}}</h1>\n\r<button class=\"button button-icon\" ng-click=\"toggleDate()\">\n\r<i ng:class=\"(sort=='desc')?'icon ion-arrow-up-c':'icon ion-arrow-down-c'\"></i>\n\r</button>\n\r</ion-header-bar>",
                    "js": "$scope.title = myService.getTitle();\n\r$scope.sort = \"asc\";\n\r$scope.sortKey = \"date_created\";\n\r$scope.messages = [];\n\r$scope.hideTime = false;\n\r$scope.typingStateStr = \". . .\";\n\r$scope.myMsgTypeStr = \"mine\";\n\rvar typing = false;\n\rvar lastTypingTime;\n\rvar TYPING_TIMER_LENGTH = 250;\n\rvar historyData = [];\n\rthis.getDetail = function() {\n\rvar detailData = myService.getDetail();\n\rvar myDetail = [];\n\rfor (var ind = 0; ind<detailData.length; ind++) {\n\rvar item = detailData[ind];\n\rvar msg_type = \"\";\n\rvar message = \"\";\n\rif(typeof item.user_incoming.message != \"undefined\"){\n\rmsg_type = \"mine\";\n\rmessage = item.user_incoming.message;\n\r}\n\relse if(typeof item.watson_incoming.message != \"undefined\"){\n\rmsg_type = \"other\";\n\rmessage = item.watson_incoming.message;\n\r}\n\rvar temp = {\n\r\"detail_id\":item._id,\n\r\"type\":msg_type,\n\r\"message\":message,\n\r\"date_created\":item.date_created\n\r};\n\rif(msg_type)\n\rmyDetail.push(temp);\n\r}\n\rhistoryData = utilityService.sortByKey(myDetail, $scope.sortKey, $scope.sort);\n\rreturn historyData;\n\r};\n\rhistoryData = this.getDetail();\n\rChat.setMessages(historyData);\n\r$scope.messages = Chat.getMessages();\n\rSocket.on(\"connect\",function(){\n\rSocket.emit(\"add user\", $scope.myName);\n\r});\n\rChat.scrollBottom();\n\rvar sendUpdateTyping = function(){\n\r if (!typing) {\n\r typing = true;\n\r Socket.emit(\"typing\");\n\r }\n\r lastTypingTime = (new Date()).getTime();\n\r $timeout(function () {\n\r var typingTimer = (new Date()).getTime();\n\r var timeDiff = typingTimer - lastTypingTime;\n\r if (timeDiff >= TYPING_TIMER_LENGTH && typing) {\n\r Socket.emit(\"stop typing\");\n\r typing = false;\n\r }\n\r }, TYPING_TIMER_LENGTH);\n\r };\n\r$scope.updateTyping = function(){\n\r sendUpdateTyping();\n\r};\n\r$scope.toggleDate = function() {\n\r$scope.sort = ($scope.sort == \"asc\")?\"desc\":\"asc\";\n\r$scope.messages = utilityService.sortByKey($scope.messages, $scope.sortKey, $scope.sort);\n\r};\n\r$scope.sendMsg=function(to,body){\n\rvar timestamp = new Date().getTime();\n\r};\n\r$scope.showSendMessage = function() {\n\r$scope.sendMsg($scope.parent_id,$scope.data.message);\n\rChat.sendMessage($scope.user_id, $scope.data.message);\n\rdelete $scope.data.message;\n\r};"
                },
				"detail": {
                    "name": "Message list",
                    "html": "<ion-content class=\"content-stable\"\n\r on-swipe-left=\"hideTime = false\"\n\r on-swipe-right=\"hideTime = true\">\n\r<div ng-repeat=\"message in messages\"\n\r ng-class=\"{other: message.type != myMsgTypeStr}\" class=\"messages\">\n\r<div class=\"message\" >\n\r<p class=\"chat-typing\" ng-show=\"message.message==typingStateStr\">{{message.username}}</p>\n\r<span >{{ message.message }}</span>\n\r</div>\n\r<div class=\"datetime\">{{message.date_created}}</div>\n\r</div>\n\r</ion-content>",
                    "js": ""
                },
                "footer": {
                    "name": "",
                    "html": "<ion-footer-bar keyboard-attach class=\"bar-stable item-input-inset\">\n\r<form name=\"sendMessageForm\" class=\"sendmessage\" ng-submit=\"showSendMessage()\" novalidate>\n\r<label class=\"item-input-wrapper\">\n\r<input type=\"text\" placeholder=\"Type your message\" ng-model=\"data.message\" ng-change=\"updateTyping()\" on-return=\"closeKeyboard()\" on-focus=\"inputUp()\" on-blur=\"inputDown()\" />\n\r</label>\n\r<div class=\"footer-btn-wrap\">\n\r<button type=\"submit\" class=\"button button-icon icon ion-ios-paperplane footer-btn\"\n\rng-disabled=\"!data.message\">\n\r</button>\n\r</div>\n\r</form>\n\r</ion-footer-bar>",
                    "js": ""
                }
            },
			"from_page_id": 4,
            "to_page_id": 	0,
            "date_created": "1/26/2017 5:05 PM"
        },
        "detail": [
			{
			  "detail_id": "51_0",
			  "image": "",
			  "to_page_id": 0,
			  "user_id": "23d5c58422026c68269cd6e9ac22ca4a",
			  "from_user_id": "9092618242e9895441bc9e978fa15098",
			  "user_incoming": {},
			  "watson_incoming": {},
			  "type": {},
			  "date_created": "",
			  "from_user": {}
			}
		]
	},
	{
        "page_id": 52,
        "user":{
            "user_id":			"2",
            "access_token":		"1489106288366.re75jssjwrbpgb9",
            "security_level":	1,
            "phone":			123456,
            "firstname": 		"roger",
            "image":			"img/userimagedfdff"
        },
        "task": {
			"task_name": "Ben",
            "template": {
                "header": {
                    "name": "",
                    "html": "<ion-header-bar class=\"bar-stable\">\n\r<button class=\"button button-icon\" ng-click=\"goPage(5)\">\n\r<i class=\"icon ion-ios-arrow-back\">Back</i>\n\r</button>\n\r<h1 class=\"title\">{{title}}</h1>\n\r<button class=\"button button-icon\" ng-click=\"toggleDate()\">\n\r<i ng:class=\"(sort=='desc')?'icon ion-arrow-up-c':'icon ion-arrow-down-c'\"></i>\n\r</button>\n\r</ion-header-bar>",
                    "js": "$scope.title = myService.getTitle();\n\r$scope.sort = \"asc\";\n\r$scope.sortKey = \"date_created\";\n\r$scope.messages = [];\n\r$scope.hideTime = false;\n\r$scope.typingStateStr = \". . .\";\n\r$scope.myMsgTypeStr = \"mine\";\n\rvar typing = false;\n\rvar lastTypingTime;\n\rvar TYPING_TIMER_LENGTH = 250;\n\rvar historyData = [];\n\rthis.getDetail = function() {\n\rvar detailData = myService.getDetail();\n\rvar myDetail = [];\n\rfor (var ind = 0; ind<detailData.length; ind++) {\n\rvar item = detailData[ind];\n\rvar msg_type = \"\";\n\rvar message = \"\";\n\rif(typeof item.user_incoming.message != \"undefined\"){\n\rmsg_type = \"mine\";\n\rmessage = item.user_incoming.message;\n\r}\n\relse if(typeof item.watson_incoming.message != \"undefined\"){\n\rmsg_type = \"other\";\n\rmessage = item.watson_incoming.message;\n\r}\n\rvar temp = {\n\r\"detail_id\":item._id,\n\r\"type\":msg_type,\n\r\"message\":message,\n\r\"date_created\":item.date_created\n\r};\n\rif(msg_type)\n\rmyDetail.push(temp);\n\r}\n\rhistoryData = utilityService.sortByKey(myDetail, $scope.sortKey, $scope.sort);\n\rreturn historyData;\n\r};\n\rhistoryData = this.getDetail();\n\rChat.setMessages(historyData);\n\r$scope.messages = Chat.getMessages();\n\rSocket.on(\"connect\",function(){\n\rSocket.emit(\"add user\", $scope.myName);\n\r});\n\rChat.scrollBottom();\n\rvar sendUpdateTyping = function(){\n\r if (!typing) {\n\r typing = true;\n\r Socket.emit(\"typing\");\n\r }\n\r lastTypingTime = (new Date()).getTime();\n\r $timeout(function () {\n\r var typingTimer = (new Date()).getTime();\n\r var timeDiff = typingTimer - lastTypingTime;\n\r if (timeDiff >= TYPING_TIMER_LENGTH && typing) {\n\r Socket.emit(\"stop typing\");\n\r typing = false;\n\r }\n\r }, TYPING_TIMER_LENGTH);\n\r };\n\r$scope.updateTyping = function(){\n\r sendUpdateTyping();\n\r};\n\r$scope.toggleDate = function() {\n\r$scope.sort = ($scope.sort == \"asc\")?\"desc\":\"asc\";\n\r$scope.messages = utilityService.sortByKey($scope.messages, $scope.sortKey, $scope.sort);\n\r};\n\r$scope.sendMsg=function(to,body){\n\rvar timestamp = new Date().getTime();\n\r};\n\r$scope.showSendMessage = function() {\n\r$scope.sendMsg($scope.parent_id,$scope.data.message);\n\rChat.sendMessage($scope.user_id, $scope.data.message);\n\rdelete $scope.data.message;\n\r};"
                },
				"detail": {
                    "name": "Message list",
                    "html": "<ion-content class=\"content-stable\"\n\r on-swipe-left=\"hideTime = false\"\n\r on-swipe-right=\"hideTime = true\">\n\r<div ng-repeat=\"message in messages\"\n\r ng-class=\"{other: message.type != myMsgTypeStr}\" class=\"messages\">\n\r<div class=\"message\" >\n\r<p class=\"chat-typing\" ng-show=\"message.message==typingStateStr\">{{message.username}}</p>\n\r<span >{{ message.message }}</span>\n\r</div>\n\r<div class=\"datetime\">{{message.date_created}}</div>\n\r</div>\n\r</ion-content>",
                    "js": ""
                },
                "footer": {
                    "name": "",
                    "html": "<ion-footer-bar keyboard-attach class=\"bar-stable item-input-inset\">\n\r<form name=\"sendMessageForm\" class=\"sendmessage\" ng-submit=\"showSendMessage()\" novalidate>\n\r<label class=\"item-input-wrapper\">\n\r<input type=\"text\" placeholder=\"Type your message\" ng-model=\"data.message\" ng-change=\"updateTyping()\" on-return=\"closeKeyboard()\" on-focus=\"inputUp()\" on-blur=\"inputDown()\" />\n\r</label>\n\r<div class=\"footer-btn-wrap\">\n\r<button type=\"submit\" class=\"button button-icon icon ion-ios-paperplane footer-btn\"\n\rng-disabled=\"!data.message\">\n\r</button>\n\r</div>\n\r</form>\n\r</ion-footer-bar>",
                    "js": ""
                }
            },
			"from_page_id": 4,
            "to_page_id": 	0,
            "date_created": "1/26/2017 5:05 PM"
        },
        "detail": []
	},
	{
        "page_id": 53,
        "user":{
            "user_id":			"2",
            "access_token":		"1489106288366.re75jssjwrbpgb9",
            "security_level":	1,
            "phone":			123456,
            "firstname": 		"roger",
            "image":			"img/userimagedfdff"
        },
        "task": {
			"task_name": "Clemens",
            "template": {
                "header": {
                    "name": "",
                    "html": "<ion-header-bar class=\"bar-stable\">\n\r<button class=\"button button-icon\" ng-click=\"goPage(5)\">\n\r<i class=\"icon ion-ios-arrow-back\">Back</i>\n\r</button>\n\r<h1 class=\"title\">{{title}}</h1>\n\r<button class=\"button button-icon\" ng-click=\"toggleDate()\">\n\r<i ng:class=\"(sort=='desc')?'icon ion-arrow-up-c':'icon ion-arrow-down-c'\"></i>\n\r</button>\n\r</ion-header-bar>",
                    "js": "$scope.title = myService.getTitle();\n\r$scope.sort = \"asc\";\n\r$scope.sortKey = \"date_created\";\n\r$scope.messages = [];\n\r$scope.hideTime = false;\n\r$scope.typingStateStr = \". . .\";\n\r$scope.myMsgTypeStr = \"mine\";\n\rvar typing = false;\n\rvar lastTypingTime;\n\rvar TYPING_TIMER_LENGTH = 250;\n\rvar historyData = [];\n\rthis.getDetail = function() {\n\rvar detailData = myService.getDetail();\n\rvar myDetail = [];\n\rfor (var ind = 0; ind<detailData.length; ind++) {\n\rvar item = detailData[ind];\n\rvar msg_type = \"\";\n\rvar message = \"\";\n\rif(typeof item.user_incoming.message != \"undefined\"){\n\rmsg_type = \"mine\";\n\rmessage = item.user_incoming.message;\n\r}\n\relse if(typeof item.watson_incoming.message != \"undefined\"){\n\rmsg_type = \"other\";\n\rmessage = item.watson_incoming.message;\n\r}\n\rvar temp = {\n\r\"detail_id\":item._id,\n\r\"type\":msg_type,\n\r\"message\":message,\n\r\"date_created\":item.date_created\n\r};\n\rif(msg_type)\n\rmyDetail.push(temp);\n\r}\n\rhistoryData = utilityService.sortByKey(myDetail, $scope.sortKey, $scope.sort);\n\rreturn historyData;\n\r};\n\rhistoryData = this.getDetail();\n\rChat.setMessages(historyData);\n\r$scope.messages = Chat.getMessages();\n\rSocket.on(\"connect\",function(){\n\rSocket.emit(\"add user\", $scope.myName);\n\r});\n\rChat.scrollBottom();\n\rvar sendUpdateTyping = function(){\n\r if (!typing) {\n\r typing = true;\n\r Socket.emit(\"typing\");\n\r }\n\r lastTypingTime = (new Date()).getTime();\n\r $timeout(function () {\n\r var typingTimer = (new Date()).getTime();\n\r var timeDiff = typingTimer - lastTypingTime;\n\r if (timeDiff >= TYPING_TIMER_LENGTH && typing) {\n\r Socket.emit(\"stop typing\");\n\r typing = false;\n\r }\n\r }, TYPING_TIMER_LENGTH);\n\r };\n\r$scope.updateTyping = function(){\n\r sendUpdateTyping();\n\r};\n\r$scope.toggleDate = function() {\n\r$scope.sort = ($scope.sort == \"asc\")?\"desc\":\"asc\";\n\r$scope.messages = utilityService.sortByKey($scope.messages, $scope.sortKey, $scope.sort);\n\r};\n\r$scope.sendMsg=function(to,body){\n\rvar timestamp = new Date().getTime();\n\r};\n\r$scope.showSendMessage = function() {\n\r$scope.sendMsg($scope.parent_id,$scope.data.message);\n\rChat.sendMessage($scope.user_id, $scope.data.message);\n\rdelete $scope.data.message;\n\r};"
                },
				"detail": {
                    "name": "Message list",
                    "html": "<ion-content class=\"content-stable\"\n\r on-swipe-left=\"hideTime = false\"\n\r on-swipe-right=\"hideTime = true\">\n\r<div ng-repeat=\"message in messages\"\n\r ng-class=\"{other: message.type != myMsgTypeStr}\" class=\"messages\">\n\r<div class=\"message\" >\n\r<p class=\"chat-typing\" ng-show=\"message.message==typingStateStr\">{{message.username}}</p>\n\r<span >{{ message.message }}</span>\n\r</div>\n\r<div class=\"datetime\">{{message.date_created}}</div>\n\r</div>\n\r</ion-content>",
                    "js": ""
                },
                "footer": {
                    "name": "",
                    "html": "<ion-footer-bar keyboard-attach class=\"bar-stable item-input-inset\">\n\r<form name=\"sendMessageForm\" class=\"sendmessage\" ng-submit=\"showSendMessage()\" novalidate>\n\r<label class=\"item-input-wrapper\">\n\r<input type=\"text\" placeholder=\"Type your message\" ng-model=\"data.message\" ng-change=\"updateTyping()\" on-return=\"closeKeyboard()\" on-focus=\"inputUp()\" on-blur=\"inputDown()\" />\n\r</label>\n\r<div class=\"footer-btn-wrap\">\n\r<button type=\"submit\" class=\"button button-icon icon ion-ios-paperplane footer-btn\"\n\rng-disabled=\"!data.message\">\n\r</button>\n\r</div>\n\r</form>\n\r</ion-footer-bar>",
                    "js": ""
                }
            },
			"from_page_id": 4,
            "to_page_id": 	0,
            "date_created": "1/26/2017 5:05 PM"
        },
        "detail": []
	},
	{
        "page_id": 6,
        "user":{
            "user_id": "37249ab4728dd103f714e83f49f1a129",
			"firstname": "",
			"lastname": "",
			"email": "",
			"phone": 11234,
			"virtual_phone": 11234,
			"type": {
			  "public": "public"
			}
        },
        "task": {
			"task_id": "6_0",
			"task_name": "Chat",
			"parent_id": "2_0",
			"from_page_id": 2,
			"child_task_id": "ea1f86fe7bb573a145fb8e66ab08c49e",
			"date_created": "2017-03-15T10:29:39.453Z",
            "template": {
                "header": {
                    "name": "SMS",
                    "html": "<ion-header-bar class=\"bar-stable\">\n\r<button class=\"button button-icon\" ng-click=\"goPage(2)\">\n\r<i class=\"icon ion-ios-arrow-back\">Back</i>\n\r</button>\n\r<h1 class=\"title\">{{title}}</h1>\n\r<button class=\"button button-icon\" ng-click=\"toggleDate()\">\n\r<i ng:class=\"(sort=='desc')?'icon ion-arrow-up-c':'icon ion-arrow-down-c'\"></i>\n\r</button>\n\r</ion-header-bar>",
                    "js": "$scope.title = myService.getTitle();\n\r$scope.sort = \"asc\";\n\r$scope.sortKey = \"name\";\n\rthis.getDetail = function() {\n\rvar detailData = myService.getDetail();\n\rvar myDetail = [];\n\rfor (var ind = 0; ind<detailData.length; ind++) {\n\rvar item = detailData[ind];\n\rvar temp = {\n\r\"detail_id\":item._id,\n\r\"name\":item.user_incoming.message,\n\r\"page_id\":item.to_page_id\n\r};\n\rmyDetail.push(temp);\n\r}\n\r$scope.details = utilityService.sortByKey(myDetail, $scope.sortKey, $scope.sort);\n\r};\n\rthis.getDetail();\n\r$scope.toggleDate = function() {\n\r$scope.sort = ($scope.sort == \"asc\")?\"desc\":\"asc\";\n\r$scope.details = utilityService.sortByKey($scope.details, $scope.sortKey, $scope.sort);\n\r};\n\r$scope.smsDetails = function(page_id){\n\r$scope.goPage(page_id);\n\r};"
                },
				"detail": {
                    "name": "User list",
                    "html": "<ion-content class=\"has-header\">\n\r<ion-list style=\"\">\n\r<ion-item class=\"item-remove-animate item-icon-right\" ng-repeat=\"item in details\" type=\"item-text-wrap\" ng-click=\"smsDetails(item.page_id)\">\n\r<h2 style=\"display:inline-block;\">{{item.name}}</h2>\n\r<i class=\"icon ion-chevron-right icon-accessory\"></i>\n\r</ion-item>\n\r</ion-list>\n\r</ion-content>",
                    "js": ""
                },
                "footer": {
                    "name": "",
                    "html": "<ion-footer-bar keyboard-attach class=\"bar-stable item-input-inset\">\n\r<form name=\"sendMessageForm\" class=\"sendmessage\" ng-submit=\"addDetail()\" novalidate>\n\r<label class=\"item-input-wrapper\">\n\r<input type=\"text\" placeholder=\"Type your message\" ng-model=\"data.message\" ng-change=\"updateTyping()\" on-return=\"closeKeyboard()\" on-focus=\"inputUp()\" on-blur=\"inputDown()\" />\n\r</label>\n\r<div class=\"footer-btn-wrap\">\n\r<button type=\"submit\" class=\"button button-icon icon ion-ios-paperplane footer-btn\"\n\rng-disabled=\"!data.message\">\n\r</button>\n\r</div>\n\r</form>\n\r</ion-footer-bar>",
                    "js": ""
                }
            }
        },
        "detail": [
			{
			  "_id": "6_1",
			  "image": "",
			  "to_page_id": 61,
			  "user_id": "23d5c58422026c68269cd6e9ac22ca4a",
			  "task_id": "6_0",
			  "page_id": 6,
			  "from_user_id": "9092618242e9895441bc9e978fa15098",
			  "user_incoming": {
				"message": "Adam"
			  },
			  "watson_incoming": {},
			  "type": {},
			  "date_created": "1/26/2017 5:05 PM",
			  "from_user": {},
			  "count": {
				"active": 3,
				"unread": 0
			  }
			},
			{
			  "_id": "6_2",
			  "image": "img/adam.jpg",
			  "to_page_id": 62,
			  "user_id": "23d5c58422026c68269cd6e9ac22ca4a",
			  "task_id": "6_0",
			  "page_id": 6,
			  "from_user_id": "9092618242e9895441bc9e978fa15098",
			  "user_incoming": {
				"message": "Ben"
			  },
			  "watson_incoming": {},
			  "type": {
				"public": "public"
			  },
			  "date_created": "1/26/2017 6:06 PM",
			  "from_user": {},
			  "count": {
				"active": 3,
				"unread": 0
			  }
			},
			{
			  "_id": "6_3",
			  "image": "img/adam.jpg",
			  "to_page_id": 63,
			  "user_id": "23d5c58422026c68269cd6e9ac22ca4a",
			  "task_id": "6_0",
			  "page_id": 6,
			  "from_user_id": "9092618242e9895441bc9e978fa15098",
			  "user_incoming": {
				"message": "Clemens"
			  },
			  "watson_incoming": {},
			  "type": {
				"public": "public"
			  },
			  "date_created": "1/26/2017 7:07 PM",
			  "from_user": {},
			  "count": {
				"active": 3,
				"unread": 0
			  }
			}
		]
	},
	{
        "page_id": 61,
        "user":{
            "user_id":			"2",
            "access_token":		"1489106288366.re75jssjwrbpgb9",
            "security_level":	1,
            "phone":			123456,
            "firstname": 		"roger",
            "image":			"img/userimagedfdff"
        },
        "task": {
			"task_name": "Adam",
            "template": {
                "header": {
                    "name": "",
                    "html": "<ion-header-bar class=\"bar-stable\">\n\r<button class=\"button button-icon\" ng-click=\"goPage(6)\">\n\r<i class=\"icon ion-ios-arrow-back\">Back</i>\n\r</button>\n\r<h1 class=\"title\">{{title}}</h1>\n\r<button class=\"button button-icon\" ng-click=\"toggleDate()\">\n\r<i ng:class=\"(sort=='desc')?'icon ion-arrow-up-c':'icon ion-arrow-down-c'\"></i>\n\r</button>\n\r</ion-header-bar>",
                    "js": "$scope.title = myService.getTitle();\n\r$scope.sort = \"asc\";\n\r$scope.sortKey = \"date_created\";\n\r$scope.messages = [];\n\r$scope.hideTime = false;\n\r$scope.typingStateStr = \". . .\";\n\r$scope.myMsgTypeStr = \"mine\";\n\rthis.getDetail = function() {\n\rvar detailData = myService.getDetail();\n\rvar myDetail = [];\n\rfor (var ind = 0; ind<detailData.length; ind++) {\n\rvar item = detailData[ind];\n\rvar msg_type = \"\";\n\rvar message = \"\";\n\rif(typeof item.user_incoming.message != \"undefined\"){\n\rmsg_type = \"mine\";\n\rmessage = item.user_incoming.message;\n\r}\n\relse {\n\rmsg_type = \"other\";\n\rmessage = item.watson_incoming.message;\n\r}\n\rvar temp = {\n\r\"detail_id\":item._id,\n\r\"type\":msg_type,\n\r\"message\":message,\n\r\"date_created\":item.date_created\n\r};\n\rmyDetail.push(temp);\n\r}\n\r$scope.messages = utilityService.sortByKey(myDetail, $scope.sortKey, $scope.sort);\n\r};\n\rthis.getDetail();\n\r \n\r$scope.toggleDate = function() {\n\r$scope.sort = ($scope.sort == \"asc\")?\"desc\":\"asc\";\n\r$scope.messages = utilityService.sortByKey($scope.messages, $scope.sortKey, $scope.sort);\n\r};\n\r \n\r$scope.sendMsg=function(to,body){\n\rvar timestamp = new Date().getTime();\n\r};\n\r$scope.showSendMessage = function() {\n\r$scope.sendMsg($scope.parent_id,$scope.data.message); \n\rvar d = new Date();\n\rdt = d.toLocaleDateString()+\" \"+d.toLocaleTimeString().replace(/:\\d+ /, \" \");\n\r$scope.messages.push({\n\r user_id:$scope.user_id,\n\r type:$scope.myMsgTypeStr,\n\r message:$scope.data.message,\n\r date_created: dt\n\r});\n\rdelete $scope.data.message;\n\r$ionicScrollDelegate.scrollBottom(true);\n\r};"
                },
				"detail": {
                    "name": "SMS list",
                    "html": "<ion-content class=\"content-stable\"\n\r on-swipe-left=\"hideTime = false\"\n\r on-swipe-right=\"hideTime = true\">\n\r<div ng-repeat=\"message in messages\"\n\r ng-class=\"{other: message.type != myMsgTypeStr}\" class=\"messages\">\n\r<div class=\"message\" >\n\r<p class=\"chat-typing\" ng-show=\"message.message==typingStateStr\">{{message.username}}</p>\n\r<span >{{ message.message }}</span>\n\r</div>\n\r<div class=\"datetime\">{{message.date_created}}</div>\n\r</div>\n\r</ion-content>",
                    "js": ""
                },
                "footer": {
                    "name": "",
                    "html": "<ion-footer-bar keyboard-attach class=\"bar-stable item-input-inset\">\n\r<form name=\"sendMessageForm\" class=\"sendmessage\" ng-submit=\"showSendMessage()\" novalidate>\n\r<label class=\"item-input-wrapper\">\n\r<input type=\"text\" placeholder=\"Type your message\" ng-model=\"data.message\" ng-change=\"updateTyping()\" on-return=\"closeKeyboard()\" on-focus=\"inputUp()\" on-blur=\"inputDown()\" />\n\r</label>\n\r<div class=\"footer-btn-wrap\">\n\r<button type=\"submit\" class=\"button button-icon icon ion-ios-paperplane footer-btn\"\n\rng-disabled=\"!data.message\">\n\r</button>\n\r</div>\n\r</form>\n\r</ion-footer-bar>",
                    "js": ""
                }
            },
			"from_page_id": 4,
            "to_page_id": 	0,
            "date_created": "1/26/2017 5:05 PM"
        },
        "detail": [
			{
               "_id": 	1,
                "image":		"img/taskimage1",
                "page_id": 		32,
                "user_id": 		"2",
                "from_user_id": "1",
                "user_incoming":{},
                "watson_incoming":{
					"message":	"the task that added these had a child_task_default \"add a detail\""
				},
                "date_created":	"1/26/2017 5:17 PM",
                "from_user":{},
                "a":	"detail content b"
			},
			{
               "_id": 	2,
                "image":		"img/taskimage1",
                "page_id": 		32,
                "user_id": 		"4",
                "from_user_id": "1",
                "user_incoming":{},
                "watson_incoming":{
					"message":	"I will give response a piece at a time"
				},
                "date_created":	"1/26/2017 6:27 PM",
                "from_user":{},
                "a":	"detail content b"
			},
			{
               "_id": 	3,
                "image":		"img/taskimage1",
                "page_id": 		32,
                "user_id": 		"5f490c0ae2ee7321dc891a3e59bd64c6",
                "from_user_id": "1",
                "user_incoming":{
					"message":	"you can add category more?"
				},
                "watson_incoming":{},
                "date_created":	"1/26/2017 7:11 PM",
                "from_user":{},
                "a":	"detail content b"
			}
		]
	},
	{
        "page_id": 62,
        "user":{
            "user_id":			"2",
            "access_token":		"1489106288366.re75jssjwrbpgb9",
            "security_level":	1,
            "phone":			123456,
            "firstname": 		"roger",
            "image":			"img/userimagedfdff"
        },
        "task": {
			"task_name": "Ben",
            "template": {
                "header": {
                    "name": "",
                    "html": "<ion-header-bar class=\"bar-stable\">\n\r<button class=\"button button-icon\" ng-click=\"goPage(6)\">\n\r<i class=\"icon ion-ios-arrow-back\">Back</i>\n\r</button>\n\r<h1 class=\"title\">{{title}}</h1>\n\r<button class=\"button button-icon\" ng-click=\"toggleDate()\">\n\r<i ng:class=\"(sort=='desc')?'icon ion-arrow-up-c':'icon ion-arrow-down-c'\"></i>\n\r</button>\n\r</ion-header-bar>",
                    "js": "$scope.title = myService.getTitle();\n\r$scope.sort = \"asc\";\n\r$scope.sortKey = \"date_created\";\n\r$scope.messages = [];\n\r$scope.hideTime = false;\n\r$scope.typingStateStr = \". . .\";\n\r$scope.myMsgTypeStr = \"mine\";\n\rthis.getDetail = function() {\n\rvar detailData = myService.getDetail();\n\rvar myDetail = [];\n\rfor (var ind = 0; ind<detailData.length; ind++) {\n\rvar item = detailData[ind];\n\rvar msg_type = \"\";\n\rvar message = \"\";\n\rif(typeof item.user_incoming.message != \"undefined\"){\n\rmsg_type = \"mine\";\n\rmessage = item.user_incoming.message;\n\r}\n\relse {\n\rmsg_type = \"other\";\n\rmessage = item.watson_incoming.message;\n\r}\n\rvar temp = {\n\r\"detail_id\":item._id,\n\r\"type\":msg_type,\n\r\"message\":message,\n\r\"date_created\":item.date_created\n\r};\n\rmyDetail.push(temp);\n\r}\n\r$scope.messages = utilityService.sortByKey(myDetail, $scope.sortKey, $scope.sort);\n\r};\n\rthis.getDetail();\n\r \n\r$scope.toggleDate = function() {\n\r$scope.sort = ($scope.sort == \"asc\")?\"desc\":\"asc\";\n\r$scope.messages = utilityService.sortByKey($scope.messages, $scope.sortKey, $scope.sort);\n\r};\n\r \n\r$scope.sendMsg=function(to,body){\n\rvar timestamp = new Date().getTime();\n\r};\n\r$scope.showSendMessage = function() {\n\r$scope.sendMsg($scope.parent_id,$scope.data.message); \n\rvar d = new Date();\n\rdt = d.toLocaleDateString()+\" \"+d.toLocaleTimeString().replace(/:\\d+ /, \" \");\n\r$scope.messages.push({\n\r user_id:$scope.user_id,\n\r type:$scope.myMsgTypeStr,\n\r message:$scope.data.message,\n\r date_created: dt\n\r});\n\rdelete $scope.data.message;\n\r$ionicScrollDelegate.scrollBottom(true);\n\r};"
                },
				"detail": {
                    "name": "SMS list",
                    "html": "<ion-content class=\"content-stable\"\n\r on-swipe-left=\"hideTime = false\"\n\r on-swipe-right=\"hideTime = true\">\n\r<div ng-repeat=\"message in messages\"\n\r ng-class=\"{other: message.type != myMsgTypeStr}\" class=\"messages\">\n\r<div class=\"message\" >\n\r<p class=\"chat-typing\" ng-show=\"message.message==typingStateStr\">{{message.username}}</p>\n\r<span >{{ message.message }}</span>\n\r</div>\n\r<div class=\"datetime\">{{message.date_created}}</div>\n\r</div>\n\r</ion-content>",
                    "js": ""
                },
                "footer": {
                    "name": "",
                    "html": "<ion-footer-bar keyboard-attach class=\"bar-stable item-input-inset\">\n\r<form name=\"sendMessageForm\" class=\"sendmessage\" ng-submit=\"showSendMessage()\" novalidate>\n\r<label class=\"item-input-wrapper\">\n\r<input type=\"text\" placeholder=\"Type your message\" ng-model=\"data.message\" ng-change=\"updateTyping()\" on-return=\"closeKeyboard()\" on-focus=\"inputUp()\" on-blur=\"inputDown()\" />\n\r</label>\n\r<div class=\"footer-btn-wrap\">\n\r<button type=\"submit\" class=\"button button-icon icon ion-ios-paperplane footer-btn\"\n\rng-disabled=\"!data.message\">\n\r</button>\n\r</div>\n\r</form>\n\r</ion-footer-bar>",
                    "js": ""
                }
            },
			"from_page_id": 4,
            "to_page_id": 	0,
            "date_created": "1/26/2017 5:05 PM"
        },
        "detail": [
			{
               "_id": 	1,
                "image":		"img/taskimage1",
                "page_id": 		32,
                "user_id": 		"2",
                "from_user_id": "1",
                "user_incoming":{
					"message":	"page to page traversal from data as before"
				},
                "watson_incoming":{},
                "date_created":	"1/26/2017 5:17 PM",
                "from_user":{},
                "a":	"detail content b"
			},
			{
               "_id": 	2,
                "image":		"img/taskimage1",
                "page_id": 		32,
                "user_id": 		"4",
                "from_user_id": "1",
                "user_incoming":{
					"message":	"obviously you will not know first name last name "
				},
                "watson_incoming":{},
                "date_created":	"1/26/2017 6:27 PM",
                "from_user":{},
                "a":	"detail content b"
			},
			{
               "_id": 	3,
                "image":		"img/taskimage1",
                "page_id": 		32,
                "user_id": 		"5f490c0ae2ee7321dc891a3e59bd64c6",
                "from_user_id": "1",
                "user_incoming":{},
                "watson_incoming":{
					"message":	"Send message is for note?"
				},
                "date_created":	"1/26/2017 7:11 PM",
                "from_user":{},
                "a":	"detail content b"
			}
		]
	},
	{
        "page_id": 63,
        "user":{
            "user_id":			"2",
            "access_token":		"1489106288366.re75jssjwrbpgb9",
            "security_level":	1,
            "phone":			123456,
            "firstname": 		"roger",
            "image":			"img/userimagedfdff"
        },
       "task": {
			"task_name": "Clemens",
            "template": {
                "header": {
                    "name": "",
                    "html": "<ion-header-bar class=\"bar-stable\">\n\r<button class=\"button button-icon\" ng-click=\"goPage(6)\">\n\r<i class=\"icon ion-ios-arrow-back\">Back</i>\n\r</button>\n\r<h1 class=\"title\">{{title}}</h1>\n\r<button class=\"button button-icon\" ng-click=\"toggleDate()\">\n\r<i ng:class=\"(sort=='desc')?'icon ion-arrow-up-c':'icon ion-arrow-down-c'\"></i>\n\r</button>\n\r</ion-header-bar>",
                    "js": "$scope.title = myService.getTitle();\n\r$scope.sort = \"asc\";\n\r$scope.sortKey = \"date_created\";\n\r$scope.messages = [];\n\r$scope.hideTime = false;\n\r$scope.typingStateStr = \". . .\";\n\r$scope.myMsgTypeStr = \"mine\";\n\rthis.getDetail = function() {\n\rvar detailData = myService.getDetail();\n\rvar myDetail = [];\n\rfor (var ind = 0; ind<detailData.length; ind++) {\n\rvar item = detailData[ind];\n\rvar msg_type = \"\";\n\rvar message = \"\";\n\rif(typeof item.user_incoming.message != \"undefined\"){\n\rmsg_type = \"mine\";\n\rmessage = item.user_incoming.message;\n\r}\n\relse {\n\rmsg_type = \"other\";\n\rmessage = item.watson_incoming.message;\n\r}\n\rvar temp = {\n\r\"detail_id\":item._id,\n\r\"type\":msg_type,\n\r\"message\":message,\n\r\"date_created\":item.date_created\n\r};\n\rmyDetail.push(temp);\n\r}\n\r$scope.messages = utilityService.sortByKey(myDetail, $scope.sortKey, $scope.sort);\n\r};\n\rthis.getDetail();\n\r \n\r$scope.toggleDate = function() {\n\r$scope.sort = ($scope.sort == \"asc\")?\"desc\":\"asc\";\n\r$scope.messages = utilityService.sortByKey($scope.messages, $scope.sortKey, $scope.sort);\n\r};\n\r \n\r$scope.sendMsg=function(to,body){\n\rvar timestamp = new Date().getTime();\n\r};\n\r$scope.showSendMessage = function() {\n\r$scope.sendMsg($scope.parent_id,$scope.data.message); \n\rvar d = new Date();\n\rdt = d.toLocaleDateString()+\" \"+d.toLocaleTimeString().replace(/:\\d+ /, \" \");\n\r$scope.messages.push({\n\r user_id:$scope.user_id,\n\r type:$scope.myMsgTypeStr,\n\r message:$scope.data.message,\n\r date_created: dt\n\r});\n\rdelete $scope.data.message;\n\r$ionicScrollDelegate.scrollBottom(true);\n\r};"
                },
				"detail": {
                    "name": "SMS list",
                    "html": "<ion-content class=\"content-stable\"\n\r on-swipe-left=\"hideTime = false\"\n\r on-swipe-right=\"hideTime = true\">\n\r<div ng-repeat=\"message in messages\"\n\r ng-class=\"{other: message.type != myMsgTypeStr}\" class=\"messages\">\n\r<div class=\"message\" >\n\r<p class=\"chat-typing\" ng-show=\"message.message==typingStateStr\">{{message.username}}</p>\n\r<span >{{ message.message }}</span>\n\r</div>\n\r<div class=\"datetime\">{{message.date_created}}</div>\n\r</div>\n\r</ion-content>",
                    "js": ""
                },
                "footer": {
                    "name": "",
                    "html": "<ion-footer-bar keyboard-attach class=\"bar-stable item-input-inset\">\n\r<form name=\"sendMessageForm\" class=\"sendmessage\" ng-submit=\"showSendMessage()\" novalidate>\n\r<label class=\"item-input-wrapper\">\n\r<input type=\"text\" placeholder=\"Type your message\" ng-model=\"data.message\" ng-change=\"updateTyping()\" on-return=\"closeKeyboard()\" on-focus=\"inputUp()\" on-blur=\"inputDown()\" />\n\r</label>\n\r<div class=\"footer-btn-wrap\">\n\r<button type=\"submit\" class=\"button button-icon icon ion-ios-paperplane footer-btn\"\n\rng-disabled=\"!data.message\">\n\r</button>\n\r</div>\n\r</form>\n\r</ion-footer-bar>",
                    "js": ""
                }
            },
			"from_page_id": 4,
            "to_page_id": 	0,
            "date_created": "1/26/2017 5:05 PM"
        },
        "detail": [
			{
               "_id": 	1,
                "image":		"img/taskimage1",
                "page_id": 		32,
                "user_id": 		"2",
                "from_user_id": "1",
                "user_incoming":{
					"message":	"I have included a skeleton for local_data.js"
				},
                "watson_incoming":{},
                "date_created":	"1/26/2017 5:17 PM",
                "from_user":{},
                "a":	"detail content b"
			},
			{
               "_id": 	2,
                "image":		"img/taskimage1",
                "page_id": 		32,
                "user_id": 		"4",
                "from_user_id": "1",
                "user_incoming":{},
                "watson_incoming":{
					"message":	"“from_user”:{“image”:”img/file”}"
				},
                "date_created":	"1/26/2017 6:27 PM",
                "from_user":{},
                "a":	"detail content b"
			},
			{
               "_id": 	3,
                "image":		"img/taskimage1",
                "page_id": 		32,
                "user_id": 		"5f490c0ae2ee7321dc891a3e59bd64c6",
                "from_user_id": "1",
                "user_incoming":{
					"message":	"Big_record table will be used in webapp?"
				},
                "watson_incoming":{},
                "date_created":	"1/26/2017 7:11 PM",
                "from_user":{},
                "a":	"detail content b"
			}
		]
	},
	{
        "page_id": 14,
        "user":{
            "user_id":			"2",
            "access_token":		"1489106288366.re75jssjwrbpgb9",
            "security_level":	1,
            "phone":			123456,
            "firstname": 		"roger"
        },
       "task": {
			"task_name": "User edit screen",
            "template": {
                "header": {
                    "name": "edit-user",
				    "html": "<ion-header-bar class=\"bar-stable\">\n\t<button class=\"button button-icon\" ng-click=\"goPage(2)\">\n\t\t<i class=\"icon ion-ios-arrow-back\">Back</i>\n\t</button>\n\t<h1 class=\"title\">{{title}}</h1>\n</ion-header-bar>",
					"js": "$scope.title = 'User edit screen';\nconsole.log('$scope.config', $scope.config);\nconsole.log('user_obj', myService.apiResult.user);\n$scope.user_data = myService.apiResult.user;\n$scope.update_user_info = function(d){\n\tvar url = $scope.config.host + '/update_user_info/'+ d.user_id;\n\t$http.put(url, d).then(function(res){\n\t\tconsole.log(\"res >>>>\", res); $scope.goPage(2);\n\t}, function(err){\n\t\tconsole.log(\"err >>>>>\", err);\n\t}); \n}"
				},
				"detail": {
                    "name": "edit_detail",
					"html": "<ion-content class=\"content-stable\">\n\t<form name=\"updateTaskForm\" class=\"updateTaskForm\" ng-submit=\"update_user_info(user_data)\" novalidate>\n\t\t<div class=\"list\">\n\t\t\t<label class=\"item item-input item-stacked-label\">\n\t\t\t\t<span class=\"input-label\">First name</span>\n\t\t\t\t<input type=\"text\" placeholder=\"First name\" ng-model=\"user_data.f_name\" />\n\t\t\t</label>\n\t\t\t<label class=\"item item-input item-stacked-label\">\n\t\t\t\t<span class=\"input-label\">Last name</span>\n\t\t\t\t<input type=\"text\" placeholder=\"Last name\" ng-model=\"user_data.l_name\" />\n\t\t\t</label>\n\t\t\t<label class=\"item item-input item-stacked-label\">\n\t\t\t\t<span class=\"input-label\">Email</span>\n\t\t\t\t<input type=\"text\" placeholder=\"Email\" ng-model=\"user_data.email\" /> \t\n\t\t\t</label> \t\t\t\n\t\t\t<label class=\"item item-input item-stacked-label\">\n\t\t\t\t<span class=\"input-label\">Phone</span>\n\t\t\t\t<input type=\"text\" placeholder=\"Phone\" ng-model=\"user_data.phone\" />\n\t\t\t</label>\n\t\t</div>\n\t\t<div class=\"padding\">\n\t\t\t<button class=\"button button-block button-positive\" type=\"submit\">Update</button>\n\t\t</div>\n\t</form>\n</ion-content>",
					"js": null
                },
                "footer": {
                    "name": "edit_footer",
					"html": null,
					"js": null
                }
            },
			"from_page_id": 2,
            "to_page_id": 	0,
            "date_created": "1/26/2017 5:05 PM"
        },
        "detail": [
			{
                "_id": 			"14_0",
                "image":		"img/taskimage1",
                "user_id": 		"2",
                "from_user_id": "1",
                "user_incoming":{
					"message": "Edit User Screen"
				},
                "watson_incoming":{},
                "date_created":	"1/26/2017 5:17 PM",
                "from_user":{},
                "a":	"detail content b"
			}
		]
	},
	{
        "page_id": 15,
        "user":{
            "user_id":			"2",
            "access_token":		"1489106288366.re75jssjwrbpgb9",
            "security_level":	1,
            "phone":			123456,
            "firstname": 		"roger"
        },
       "task": {
			"task_name": "Edit screen",
            "template": {
                "header": {
                    "name": "edit_detail_short_form_header",
				    "html": "<ion-header-bar class=\"bar-stable\">\n\t<button class=\"button button-icon\" ng-click=\"goPage(2)\">\n\t\t<i class=\"icon ion-ios-arrow-back\">Back</i>\n\t</button>\n\t<h1 class=\"title\">{{title}}</h1>\n</ion-header-bar>",
					"js": "$scope.title=\"Edit screen\";\n$scope.update_detail_short_info = function(d){\n\tvar req_obj = {\n\t\tdetail: {id: d.detail_id,message: d.message},\n\t\ttask: {id: d.task_id,task_name: d.task_name}\n\t};\n\t$http.put($scope.config.host + '/update_short_details', req_obj).then(function(res){\n\t\tconsole.log('res >>>', res);\n\t\t$scope.goPage(2);\n\t}, function(error){\n\t\tconsole.log('error >>>', err);\n\t});\n};"
				},
				"detail": {
                    "name": "edit_detail_short_form_detail",
					"html": "<ion-content class=\"content-stable\">\n\t<form name=\"updateTaskForm\" class=\"updateTaskForm\" ng-submit=\"update_detail_short_info(short_info)\" novalidate>\n\t\t<div class=\"list\">\n\t\t\t<label class=\"item item-input item-stacked-label\">\n\t\t\t\t<span class=\"input-label\">Message</span>\n\t\t\t\t<input type=\"text\" placeholder=\"User message\" ng-model=\"short_info.message\" />\n\t\t\t</label>\n\t\t\t<label class=\"item item-input item-stacked-label\">\n\t\t\t\t<span class=\"input-label\">Task name</span>\n\t\t\t\t<input type=\"text\" placeholder=\"Task name\" ng-model=\"short_info.task_name\" />\n\t\t\t</label>\n\t\t\t<label class=\"item item-input item-stacked-label\">\n\t\t\t\t<span class=\"input-label\">User task status</span>\n\t\t\t\t<input type=\"text\" placeholder=\"User task status\" ng-model=\"short_info.staus\" />\n\t\t\t</label>\n\t\t</div>\n\t\t<div class=\"padding\">\n\t\t\t<button class=\"button button-block button-positive\" type=\"submit\">Update</button>\n\t\t</div>\n\t</form>\n</ion-content>",
					"js": ""
                },
                "footer": {
                    "name": "edit_detail_short_form_footer",
					"html": "",
					"js": ""
                }
            },
			"from_page_id": 2,
            "to_page_id": 	0,
            "date_created": "1/26/2017 5:05 PM"
        },
        "detail": [
			{
                "_id": 			"15_0",
                "image":		"img/taskimage1",
                "user_id": 		"2",
                "from_user_id": "1",
                "user_incoming":{
					"message": "Edit screen with short info"
				},
                "watson_incoming":{},
                "date_created":	"1/26/2017 5:17 PM",
                "from_user":{},
                "a":	"detail content b"
			}
		]
	},
	{
        "page_id": 16,
        "user":{
            "user_id":			"2",
            "access_token":		"1489106288366.re75jssjwrbpgb9",
            "security_level":	1,
            "phone":			123456,
            "firstname": 		"roger"
        },
        "task": {
		    "task_id": 		"16_0",
			"task_name": 	"Edit screen",
			"from_page_id": 2,
            "date_created": "1/26/2017 5:05 PM",
			"status": 		"true",
            "template": {
                "header": {
                    "name": "edit_header",
				    "html": "<ion-header-bar class=\"bar-stable\">\r\n\t<button class=\"button button-icon\" ng-click=\"goPage(2)\">\r\n\t   <i class=\"icon ion-ios-arrow-back\">Back</i>\r\n\t</button>\r\n\t<h1 class=\"title\">{{title}}</h1></ion-header-bar>",
					"js": "$scope.title = \"Edit screen\"; \nvar endpoint = \"https://platform.mybluemix.net\"; \n$scope.update_task_info = function (task_data) {\n\t$http.post(endpoint + '/update_task' , task_data).then(function(res){\n\t\tconsole.log('response', res); $scope.goPage(2);\n\t}, function (err){\n\t\tconsole.log('error while updating record', err);\n\t});\n};\n$scope.get_template = function() {\n\t$http.get( endpoint + '/get_all_templates' ).then(function(res) {\n\t\tif(res.status == 200) {\n\t\t\t$scope.temp_data = res.data;\n\t\t}\n\t}, function (err_temp) {\n\t\tconsole.log('err_temp', err_temp);\n\t});\n};\n$scope.get_template();\n\n$scope.get_task_by_name = function () {\n\t$http.get(endpoint + '/get_task_names').then(function (res) {\n\t\tif (res.status == 200) {\n\t\t\t$scope.task_arr = res.data.data;\n\t\t}\n\t\telse {\n\t\t\t$scope.task_arr = [];\n\t\t}\n\t}, function (err_task) {\n\t\tconsole.log('err_task', err_task); }\n\t);\n};\n$scope.get_task_by_name();\n\n$scope.get_timeout_list = function () {\n\t$http.get(endpoint + '/get_all_timeout').then(function (res) {\n\t\tif (res.data.status == 200) {\n\t\t\t$scope.timeout_arr = res.data.data;\n\t\t}\n\t\telse {\n\t\t\t$scope.timeout_arr = [];\n\t\t}\n\t}, function (err_timeout) {\n\t\tconsole.log('err_timeout', err_timeout);\n\t});\n};\n$scope.get_timeout_list();\n\n$scope.get_location_list = function () {\n\t$http.get(endpoint + '/get_all_location').then(function (res) {\n\t\tif (res.data.status == 200) {\n\t\t\t$scope.location_arr = res.data.data;\n\t\t}\n\t\telse {\n\t\t\t$scope.location_arr = [];\n\t\t} \n\t},\n\tfunction (err_location) {\n\t\tconsole.log('err_timeout', err_location);\n\t});\n};\n$scope.get_location_list();\n\n$scope.get_users_list = function () {\n\t$http.get(endpoint + '/get_users').then(function (res) {\n\t\t$scope.user_list = res.data.data;\n\t}, function (err) {\n\t\tconsole.log(\"user_err\", err);\n\t});\n};\n$scope.get_users_list();\n\n$scope.get_selected_task = function () {\n\tvar url = endpoint + '/get_task_by/' + $scope.config.task_id;\n\t$http.get(url).then(function (res) {\n\t\tif (res.data.status == 200 && !angular.equals(res.data.data, {})) {\n\t\t\t$scope.task_data = res.data.data;\n\t\t\t$scope.task_data.status = JSON.parse($scope.task_data.status);\n\t\t\t$scope.task_data.display_if_empty = JSON.parse($scope.task_data.display_if_empty);\n\t\t\t$scope.task_data.additional_data_fn = $scope.task_data.additional_data_fn ? $scope.task_data.additional_data_fn:'N/A';\n\t\t\t$scope.task_data.optional_data = JSON.stringify($scope.task_data.optional_data);\n\t\t\t$scope.task_data.required_data = JSON.stringify($scope.task_data.required_data);\n\t\t}\n\t\telse {\n\t\t\t$scope.task_data = {};\n\t\t} \n\t}, function (task_err) {\n\t\tconsole.log('task_err', task_err);\n\t});\n}; \n$scope.get_selected_task();"
				},
				"detail": {
                    "name": "edit_detail",
					"html": "<ion-content class=\"content-stable\">\n\t<form name=\"updateTaskForm\" class=\"updateTaskForm\" ng-submit=\"update_task_info(task_data)\" novalidate>\n\t\t<div class=\"list\">\n\t\t\t<label class=\"item item-input item-stacked-label\">\n\t\t\t\t<span class=\"input-label\">Task Name</span>\n\t\t\t\t<input type=\"text\" placeholder=\"Task Name\" ng-model=\"task_data.task_name\" readonly/>\n\t\t\t</label>\n\t\t\t<div class=\"list\">\n\t\t\t\t\t<label class=\"item item-input item-select\">\n\t\t\t\t\t<div class=\"input-label\">User</div>\n\t\t\t\t\t<select ng-model=\"task_data.user_id\" disabled>\n\t\t\t\t\t\t<option ng-repeat=\"user in user_list track by $index\" value=\"{{user.id}}\">{{user.name}}</option>\n\t\t\t\t\t</select>\n\t\t\t\t</label>\n\t\t\t</div>\n\t\t\t<div class=\"list\">\n\t\t\t\t<label class=\"item item-input item-select\">\n\t\t\t\t\t<div class=\"input-label\">Header</div>\n\t\t\t\t\t<select ng-model=\"task_data.header_template_id\">\n\t\t\t\t\t\t<option ng-repeat=\"temp in temp_data track by $index\" value={{temp._id}}>{{temp.name}}</option>\n\t\t\t\t\t</select>\n\t\t\t\t</label>\n\t\t\t</div>\n\t\t\t<div class=\"list\">\n\t\t\t\t<label class=\"item item-input item-select\">\n\t\t\t\t\t<div class=\"input-label\">Detail</div>\n\t\t\t\t\t<select ng-model=\"task_data.detail_template_id\">\n\t\t\t\t\t\t<option ng-repeat=\"temp in temp_data track by $index\" value={{temp._id}}>{{temp.name}}</option>\n\t\t\t\t\t</select>\n\t\t\t\t</label>\n\t\t\t</div>\n\t\t\t<div class=\"list\">\n\t\t\t\t<label class=\"item item-input item-select\">\n\t\t\t\t\t<div class=\"input-label\">Footer</div>\n\t\t\t\t\t<select ng-model=\"task_data.footer_template_id\">\n\t\t\t\t\t\t<option ng-repeat=\"temp in temp_data track by $index\" value={{temp._id}}>{{temp.name}}</option>\n\t\t\t\t\t</select>\n\t\t\t\t</label>\n\t\t\t</div>\n\t\t\t<div class=\"list\">\n\t\t\t\t<label class=\"item item-input item-select\">\n\t\t\t\t\t<div class=\"input-label\">Timeout List</div>\n\t\t\t\t\t<select ng-model=\"task_data.timeout_id\">\n\t\t\t\t\t\t<option ng-repeat=\"timeout in timeout_arr track by $index\" value=\"{{timeout._id}}\">{{timeout.name}}</option>\n\t\t\t\t\t</select>\n\t\t\t\t</label>\n\t\t\t</div>\n\t\t\t<div class=\"list\">\n\t\t\t\t<label class=\"item item-input item-select\">\n\t\t\t\t\t<div class=\"input-label\">Location list</div>\n\t\t\t\t\t<select ng-model=\"task_data.location_ids\">\n\t\t\t\t\t\t<option ng-repeat=\"location in location_arr track by $index\" value=\"{{location.id}}\">{{location.name}}</option>\n\t\t\t\t\t</select>\n\t\t\t\t</label>\n\t\t\t</div>\n\t\t\t<div class=\"list\">\n\t\t\t\t<label class=\"item item-input item-select\">\n\t\t\t\t<div class=\"input-label\">Child task id</div>\n\t\t\t\t<select ng-mode=\"task_data.child_default_task_id\">\n\t\t\t\t\t<option ng-repeat=\"task in task_arr track by $index\" value=\"task.id\">{{task.task_name}}</option>\n\t\t\t\t</select>\n\t\t\t\t</label>\n\t\t\t</div>\n\t\t\t<label class=\"item item-input item-stacked-label\">\n\t\t\t\t<span class=\"input-label\">Date</span><input type=\"text\" placeholder=\"Task date\" ng-model=\"task_data.date_created\" readonly/>\n\t\t\t</label>\n\t\t\t<ul class=\"list\">\n\t\t\t\t<li class=\"item item-toggle\">\n\t\t\t\t\tTask status\n\t\t\t\t\t<label class=\"toggle toggle-positive\">\n\t\t\t\t\t\t<input type=\"checkbox\" ng-model=\"task_data.status\">\n\t\t\t\t\t\t<div class=\"track\">\n\t\t\t\t\t\t\t<div class=\"handle\"></div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</label>\n\t\t\t\t</li>\n\t\t\t\t<label class=\"item item-input item-stacked-label\">\n\t\t\t\t\t<span class=\"input-label\">Category Name</span>\n\t\t\t\t\t<input type=\"text\" placeholder=\"Category name\" ng-model=\"task_data.category\" />\n\t\t\t\t</label>\n\t\t\t\t<label class=\"item item-input item-stacked-label\">\n\t\t\t\t\t<span class=\"input-label\">Additional Fn</span>\n\t\t\t\t\t<input type=\"text\" placeholder=\"Addition function name\" ng-model=\"task_data.additional_data_fn\" />\n\t\t\t\t</label>\n\t\t\t\t<label class=\"item item-input item-stacked-label\">\n\t\t\t\t\t<span class=\"input-label\">Optional data</span>\n\t\t\t\t\t<input type=\"text\" placeholder=\"Optional data\" ng-model=\"task_data.optional_data\" />\n\t\t\t\t</label>\n\t\t\t\t<label class=\"item item-input item-stacked-label\">\n\t\t\t\t\t<span class=\"input-label\">Required data</span>\n\t\t\t\t\t<input type=\"text\" placeholder=\"Required data\" ng-model=\"task_data.required_data\" />\n\t\t\t\t</label>\n\t\t\t\t<label class=\"item item-input item-stacked-label\">\n\t\t\t\t\t<span class=\"input-label\">Offline expiration time</span>\n\t\t\t\t\t<input type=\"text\" placeholder=\"Offline expiration time\" ng-model=\"task_data.offline_expiration_time\" />\n\t\t\t\t</label>\n\t\t\t</ul>\n\t\t\t<ul class=\"list\">\n\t\t\t\t<li class=\"item item-toggle\">Display if empty ?<label class=\"toggle toggle-positive\">\n\t\t\t\t\t<input type=\"checkbox\" ng-model=\"task_data.display_if_empty\">\n\t\t\t\t\t<div class=\"track\"><div class=\"handle\"></div></div></label>\n\t\t\t\t</li>\n\t\t\t\t<div class=\"list\">\n\t\t\t\t\t<label class=\"item item-input item-select\">\n\t\t\t\t\t\t<div class=\"input-label\">Task type</div>\n\t\t\t\t\t\t<select ng-model=\"task_data.type.pubilc\">\n\t\t\t\t\t\t\t<option value=\"public\">Public</option>\n\t\t\t\t\t\t\t<option value=\"private\">Private</option>\n\t\t\t\t\t\t</select>\n\t\t\t\t\t</label>\n\t\t\t\t</div>\n\t\t\t\t<label class=\"item item-input item-stacked-label\">\n\t\t\t\t\t<span class=\"input-label\">Task image</span>\n\t\t\t\t\t<input type=\"text\" placeholder=\"Image\" ng-model=\"task_data.image\" />\n\t\t\t\t</label>\n\t\t\t</ul>\n\t\t</div>\n\t\t<div class=\"padding\">\n\t\t\t<button type=\"submit\" class=\"button button-block button-positive activated\">Update</button>\n\t\t</div>\n\t</form>\n</ion-content>",
					"js": ""
                },
                "footer": {
                    "name": "edit_footer",
					"html": "",
					"js": ""
                }
            }
        },
        "detail": [
			{
               "_id": 	"16_0",
                "image":		"img/taskimage1",
                "user_id": 		"2",
                "from_user_id": "1",
                "user_incoming":{
					"message":	"I have included a skeleton for local_data.js"
				},
                "watson_incoming":{},
                "date_created":	"1/26/2017 5:17 PM",
                "from_user":{},
                "a":	"detail content b"
			}
		]
	},
	{
        "page_id": 12,
        "task": {
			"task_name": "Offline",
            "template": {
                "header": {
                    "name": "Offline",
                    "html": "<ion-header-bar class=\"bar-stable\">\n\t<button class=\"button button-icon\" ng-click=\"goPrevPage(prev_page_id)\">\n\t <i class=\"icon ion-ios-arrow-back\">Back</i>\n\t</button>\n\t<h1 class=\"title\">Offline</h1>\n</ion-header-bar>",
                    "js": ""
                },
				"detail": {
                    "name": "Offline notification",
                    "html": "<ion-content padding=\"true\">\n\t<div class=\"wbox\" style=\"padding:30px;text-align:center;margin-top:80px;\">\n\t\t<h2>You are offline</h2>\n\t\t<div style=\"height: 40px;\" class=\"spacer\"></div>\n\t\t<p>Reconnect to the internet and try again.</p>\n\t</div>\n</ion-content>",
                    "js": ""
                },
                "footer": {
                    "name": "",
                    "html": "",
                    "js": ""
                }
            },
            "date_created": "05/29/2017 6:43 PM"
        }
	}
];