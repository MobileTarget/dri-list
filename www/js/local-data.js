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
	}
];
