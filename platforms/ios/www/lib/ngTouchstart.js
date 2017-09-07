(function(angular, undefined){
  "use strict";
  angular.module("ngTouchstart", []).directive("ngTouchstart", function () {
    return {
      controller: function ($scope, $element) {
        $element.bind('touchstart click', onTouchStart);
        
        function onTouchStart(event) {
          var method = $element.attr('ng-touchstart');
          $scope.$event = event;
          $scope.$apply(method);
        }
      }
    };
  });
})(angular);

