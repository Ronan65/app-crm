'use strict';

angular.module('myApp')
.directive('onBlur', function() {
  return {
        restrict: 'A',
        link: function(scope, elm, attrs) {
        	var onblurFn = scope.$eval(attrs.onBlur);
            elm.bind('blur', function(evt) {
                scope.$apply(function() {
                	onblurFn.call(scope, evt.which);
            	});
            });
            elm.bind('keyup', function(evt){
            	if(evt.which == 13 || evt.which == 39) {
					scope.$apply(function() {
                		onblurFn.call(scope, evt.which);
            		});
            	}
            });
        }
    };
});
