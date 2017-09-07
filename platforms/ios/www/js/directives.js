// All this does is allow the message
// to be sent when you tap return
DomenowApp.directive('input', function($timeout) {
  return {
    restrict: 'E',
    scope: {
      'returnClose': '=',
      'onReturn': '&',
      'onFocus': '&',
      'onBlur': '&'
    },
    link: function(scope, element, attr) {
      element.bind('focus', function(e) {
        if (scope.onFocus) {
          $timeout(function() {
            scope.onFocus();
          });
        }
      });
      element.bind('blur', function(e) {
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
DomenowApp.directive('dynamic', function ($compile) {
  return {
	restrict: 'A',
	replace: true,
	link: function (scope, ele, attrs) {
	  scope.$watch(attrs.dynamic, function(html) {
		ele.html(html);
		$compile(ele.contents())(scope);
	  });
	}
  };
});