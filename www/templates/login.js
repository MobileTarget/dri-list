var task_info = myService.getTaskInfo();
$scope.title = task_info.task_name;
$scope.user = {phone: "", country_code: "1"};
$scope.login = function(user) {
	var number = user.phone ;
	if (!number) {
		utilityService.showAlert("Please enter phone number").then(function(res) {
			$timeout(function() { $("#phone").focus(); }, 100);
		});
		return false;
	}
	
	number = number.replace(/[- )(]/g,'').trim();
	var reg = new RegExp('^(0|[1-9][0-9]*)$');
	
	if(!reg.test(number)){
		utilityService.showAlert("Please enter valid phone number").then(function(res) {
			$timeout(function() { $("#phone").focus(); }, 100);
		});
		return false;
	}
	number = user.country_code + number ;
	var endpoint = $scope.api_url + "/api/login";
	var parameters = {
		phone:			number,
		access_token:	$localStorage.access_token
	};
	var config = {params: parameters};
	$http.get(endpoint, config).then(function(res) {
		var res_data = res.data;
		console.log("login res_data>>>"+ JSON.stringify(res_data));
		$localStorage.access_token = res_data.access_token;
		myService.apiResult = res_data;
		$scope.goPage(res_data.page_id);
	});
};

$scope.checkNumber = function(){
	if ($scope.user !== undefined && $scope.user.phone !== "") {
		var charLength = ('' + $scope.user.phone).length;
		if (charLength == 9) {
			if (phone1 === '') {
				phone1 = $scope.user.phone.toString();
				$scope.user.phone = $scope.user.phone.toString();
			} else {
				$scope.user.phone = phone1;
				phone1 = '';
			}
		} else if (charLength == 10) {
			var phone = $scope.user.phone.toString();
			formatted = '(' + phone.substr(0, 3) + ') ' + phone.substr(3, 3) + '-' + phone.substr(6, 4);
			$scope.user.phone = formatted;
		} else {
			if (charLength < 9) {
				phone1 = '';
			}
			var phone2 = $scope.user.phone.toString();
			$scope.user.phone = phone2;
		}
	}
};









