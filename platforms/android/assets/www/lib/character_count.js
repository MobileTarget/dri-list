(function (angular, undefined) {
	'use strict';

	angular.module('chatacterCount', [])
		.directive('chatacterCount', charCount);

	function charCount() {
		return {
			restrict: 'A',
			link: function (scope, element, attr) {
				element.bind('keypress', function (e) {
					var ele     = $(this).next('span') ,
              string  = attr.value;

          if(parseInt(string.length) > parseInt(attr.maxlength)){
            e.preventDefault();
            return false;
          }else{
            var charLength = (attr.maxlength - string.length ) + " char. left";
            ele.text(charLength);
          }
				});
			}
		};
	}
}(angular));