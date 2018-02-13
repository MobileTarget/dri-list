DomenowApp.directive('input', function($timeout) {
	return {
		restrict: 'E',
		scope: {
			'returnClose': '=',
			'onReturn': '&',
			'onFocus': '&',
			'onBlur': '&'
		},
		link: function(scope, element) {
			element.bind('focus', function() {
				if (scope.onFocus) {
					$timeout(function() {
						scope.onFocus();
					});
				}
			});
			element.bind('blur', function() {
				if (scope.onBlur) {
					$timeout(function() {
						scope.onBlur();
					});
				}
			});
			element.bind('keydown', function(e) {
				if (e.which == 13) {
					if (scope.returnClose) element[0].blur();
					if (scope.onReturn) {
						$timeout(function() {
							scope.onReturn();
						});
					}
				}
			});
		}
	};
});
DomenowApp.directive('dynamic', function($compile) {
	return {
		restrict: 'A',
		replace: true,
		link: function(scope, ele, attrs) {
			scope.$watch(attrs.dynamic, function(html) {
				ele.html(html);
				$compile(ele.contents())(scope);
			});
		}
	};
});
(function() {
	DomenowApp.directive('companyMessageList', companyMessageList);

	function companyMessageList() {
		return {
			restrict: 'E',
			replace: true,
			scope: {},
			templateUrl: '/cachedCompanyMessageTemplate.html',
			bindToController: {
				messageData: '=',
				isPaginated: '='
			},
			link: linkFn,
			controller: controllerFn,
			controllerAs: 'messageCtrl'
		};
	}

	function controllerFn($ionicScrollDelegate, $scope) {
		var vm = this;
		vm.checkClass = function(item) {
			if ((item.type == "mine") || ("company_bot_detail" in item.detail_type)) {
				return "";
			} else if (item.processed == 1 && item.status == 2) {
				return "processed";
			} else if ((item.processed === 0 && item.status === 1) && (item.date_created > new Date().getTime())) {
				return "future_detail";
			} else if ((item.processed === 0 && item.status === 1) && (item.date_created < new Date().getTime())) {
				return "processed";
			} else {
				return "other";
			}
		};
		vm.doesMessageIsScheduled = function(item) {
			if ((item.processed == 0 && item.status == 1) && (item.date_created > new Date().getTime())) {
				return true;
			} else {
				return false;
			}
		};
		$ionicScrollDelegate.scrollBottom();
		$scope.$on("$newMesages$Comes$From$Server", function(evt, obj) {
			$scope.$evalAsync(function() {
				vm.messageList.push({
					"detail_id": new Date().getTime(),
					"type": "mine",
					"isSecondOperator": false,
					"message": obj.msg.user_data,
					"date_created": new Date().getTime(),
					"processed": 1,
					"status": 2,
					"detail_type": {
						"public": "public",
						"company_bot_detail": "company_bot_detail"
					}
				});
				vm.messageList.push({
					"detail_id": new Date().getTime(),
					"type": "other",
					"isSecondOperator": false,
					"message": obj.msg.bot_data,
					"date_created": new Date().getTime() + 100,
					"processed": 0,
					"status": 0,
					"detail_type": {
						"public": "public"
					},
					"annotation": "...(CB)"
				});
				vm.messageList.push({
					"detail_id": new Date().getTime(),
					"type": "other",
					"isSecondOperator": false,
					"message": obj.msg.user_data,
					"date_created": new Date().getTime() + 200,
					"processed": 1,
					"status": 2,
					"detail_type": {
						"public": "public"
					},
					"annotation": "...(1st Resp.)"
				});
				vm.messageList.push({
					"detail_id": new Date().getTime(),
					"type": "other",
					"isSecondOperator": true,
					"message": obj.msg.user_data,
					"date_created": new Date().getTime() + 10000,
					"processed": 0,
					"status": 1,
					"detail_type": {
						"public": "public"
					},
					"annotation": "...(2nd Resp.)"
				});
				$ionicScrollDelegate.resize();
			});
		});
		$scope.$on("$added$data$from$operator", function(evt, obj) {
			$scope.$evalAsync(function() {
				vm.messageList.push({
					"detail_id": new Date().getTime(),
					"type": "other",
					"isSecondOperator": false,
					"message": obj.msg,
					"date_created": new Date().getTime() + 100,
					"processed": 0,
					"status": 0,
					"detail_type": {
						"public": "public"
					},
					"annotation": "...(CB)"
				});
				$ionicScrollDelegate.resize();
			});
		});
	}

	function linkFn($scope, $element, $attrs, ctrl) {
		var vm = ctrl;
		vm.messageList = [];
		$scope.swipeUpEvent = function(index) {
			if (index >= (vm.messageList.length - 5)) {
				$scope.$emit('loadmore');
			}
		};

		function renderDetail(sortedMesages) {
			var newMessages = [];
			if (vm.isPaginated) {
				for (var ind in sortedMesages) {
					if (sortedMesages[ind]) {
						var item = sortedMesages[ind];
						if (checkFromUserId(item)) {
							if (item.user_incoming) {
								vm.messageList.unshift({
									"detail_id": item._id,
									"type": "mine",
									"message": item.user_incoming.message,
									"date_created": item.due_date,
									"processed": item.processed,
									"status": item.status,
									"detail_type": item.type,
									"isSecondOperator": item.isSecondOperator,
									"annotation": item.user_incoming.annotation ? item.user_incoming.annotation : checkAnnotation("mine", item)
								});
							}
						} else {
							if (item.user_incoming) {
								vm.messageList.unshift({
									"detail_id": item._id,
									"type": "other",
									"message": item.user_incoming.message,
									"date_created": item.due_date,
									"processed": item.processed,
									"status": item.status,
									"detail_type": item.type,
									"isSecondOperator": item.isSecondOperator,
									"annotation": item.user_incoming.annotation ? item.user_incoming.annotation : checkAnnotation("mine", item)
								});
							}
						}
					}
				}
			} else {
				for (var itr in sortedMesages) {
					if (sortedMesages[itr]) {
						var local_item = sortedMesages[itr];
						if (checkFromUserId(local_item)) {
							if (local_item.user_incoming) {
								newMessages.push({
									"detail_id": local_item._id,
									"type": "mine",
									"message": local_item.user_incoming.message,
									"date_created": local_item.due_date,
									"processed": local_item.processed,
									"status": local_item.status,
									"detail_type": local_item.type,
									"isSecondOperator": local_item.isSecondOperator,
									"annotation": local_item.user_incoming.annotation ? local_item.user_incoming.annotation : checkAnnotation("mine", local_item)
								});
							}
						} else {
							if (local_item.user_incoming) {
								newMessages.push({
									"detail_id": local_item._id,
									"type": "other",
									"message": local_item.user_incoming.message,
									"date_created": local_item.due_date,
									"processed": local_item.processed,
									"status": local_item.status,
									"detail_type": local_item.type,
									"isSecondOperator": local_item.isSecondOperator,
									"annotation": local_item.user_incoming.annotation ? local_item.user_incoming.annotation : checkAnnotation("mine", local_item)
								});
							}
						}
					}
				}
				$scope.$evalAsync(function() {
					vm.messageList = newMessages;
				});
			}
		}

		function checkAnnotation(type, item) {
			if ((type == "mine") && ("company_bot_detail" in item.type)) {
				return "";
			} else if (item.processed == 1 && item.status == 2 && item.isSecondOperator) {
				return "...(2nd Resp.)";
			} else if (item.processed == 1 && item.status == 2 && !item.isSecondOperator) {
				return "...(1st Resp.)";
			} else if (item.processed === 0 && item.status === 1 && item.isSecondOperator) {
				return "...(2nd Resp.)";
			} else {
				return "...(CB)";
			}
		}

		function checkFromUserId(detail_obj) {
			if ("company_bot_detail" in detail_obj.type) {
				return true;
			} else {
				return false;
			}
		}
		$scope.$watchCollection(angular.bind(vm, function() {
			return this.messageData;
		}), renderDetail);
	}
})();
(function() {
	DomenowApp.directive('userMessageList', userMessageList);

	function userMessageList() {
		return {
			restrict: 'E',
			replace: true,
			scope: {},
			templateUrl: '/cachedUserMessageTemplate.html',
			bindToController: {
				messageData: '=',
				loggedUser: '=',
				isPaginated: '='
			},
			link: linkFn,
			controller: controllerFn,
			controllerAs: 'userMessageCtrl'
		};

		function controllerFn($ionicScrollDelegate, $scope) {
			var vm = this;
			vm.checkClass = function(item) {
				if (item.type == "mine") {
					return "mine";
				} else {
					return "other";
				}
			};
			vm.futureMessage = function(item) {
				if (new Date().getTime() > item.date_created) {
					return true;
				} else {
					return false;
				}
			};
			$ionicScrollDelegate.scrollBottom();
			$scope.$on("$newMesages$Comes$From$Server", function(evt, obj) {
				$scope.$evalAsync(function() {
					vm.messages.push({
						detail_id: "user_data_id",
						type: "mine",
						message: obj.msg.user_data,
						date_created: new Date().getTime()
					});
					vm.messages.push({
						detail_id: "bot_data_id",
						type: "other",
						message: obj.msg.bot_data,
						date_created: new Date().getTime() + 100
					});
					$ionicScrollDelegate.resize();
				});
			});
			$scope.$on("$added$data$from$operator", function(evt, obj) {
				$scope.$evalAsync(function() {
					vm.messages.push({
						detail_id: "bot_data_id",
						type: "other",
						message: obj.msg,
						date_created: new Date().getTime() + 100
					});
					$ionicScrollDelegate.resize();
				});
			});
		}

		function linkFn($scope, $element, $attrs, ctrl) {
			var vm = ctrl;
			vm.messages = [];
			angular.bind(vm, function() {
				return this.isPaginated;
			});
			angular.bind(vm, function() {
				return this.loggedUser;
			});
			$scope.swipeUpEvent = function(index) {
				if (index >= (vm.messages.length - 5)) {
					$scope.$emit('loadmore');
				}
			};

			function renderDetailMessage(sortedMesages) {
				if (vm.isPaginated) {
					for (var ind in sortedMesages) {
						if (sortedMesages[ind]) {
							var item = sortedMesages[ind];
							if (item.from_user_id) {
								if ((item.from_user_id.phone == vm.loggedUser.virtual_phone)) {
									if (item.user_incoming.watson === undefined) {
										vm.messages.unshift({
											"detail_id": item._id,
											"type": "mine",
											"message": item.user_incoming.message,
											"date_created": item.createdAt,
											"detail_type": item.type
										});
									} else {
										vm.messages.unshift({
											"detail_id": item._id,
											"type": "other",
											"message": item.user_incoming.message,
											"date_created": item.createdAt,
											"detail_type": item.type
										});
									}
								}
							}
						}
					}
				} else {
					var newMessages = [];
					for (var itr in sortedMesages) {
						if (sortedMesages[itr]) {
							var local_item = sortedMesages[itr];
							if (local_item.from_user_id) {
								if ((local_item.from_user_id.phone == vm.loggedUser.virtual_phone)) {
									if (local_item.user_incoming.watson === undefined) {
										newMessages.push({
											"detail_id": local_item._id,
											"type": "mine",
											"message": local_item.user_incoming.message,
											"date_created": local_item.createdAt,
											"detail_type": local_item.type
										});
									} else {
										newMessages.push({
											"detail_id": local_item._id,
											"type": "other",
											"message": local_item.user_incoming.message,
											"date_created": local_item.createdAt,
											"detail_type": local_item.type
										});
									}
								}
							}
						}
					}
					$scope.$evalAsync(function() {
						vm.messages = newMessages;
					});
				}
			}
			$scope.$watchCollection(angular.bind(vm, function() {
				return this.messageData;
			}), renderDetailMessage);
		}
	}
})();