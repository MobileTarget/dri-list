var task_info = myService.getTaskInfo();
$scope.title = task_info.task_name;
$scope.verify = function(user){
	if (!user.code) {
		utilityService.showAlert("Please enter code number").then(function(res) {
			$timeout(function() { $("#code").focus(); }, 100);
		});
		return false;
	}
	var endpoint = $scope.api_url + "/api/verify";
	var parameters = {
		code:			user.code,
		access_token:	$localStorage.access_token,
		device_id:		$localStorage.device_id,
		push_accepted:	$localStorage.push_accepted || 0
	};
	var config = {params: parameters};
	console.log("verification config params>>>"+JSON.stringify(config));
	$http.get(endpoint, config).then(function(res) {
		var res_data = res.data;
		console.log("verification res_data>>>"+JSON.stringify(res_data));
		myService.apiResult = res_data;
		if (res_data.status == "valid") {
			$localStorage.user_id = res_data.user_id;
			$scope.goPage(res_data.page_id);
		}
		else {
			utilityService.showAlert("Invalid Code").then(function(res) {
				$scope.goPage(res_data.page_id);
			});
		}
	});
};