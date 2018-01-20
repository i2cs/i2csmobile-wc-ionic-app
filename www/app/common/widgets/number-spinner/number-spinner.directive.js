'use strict';

/**
* @ngdoc directive
* @name starter.directive:numberSpinner
* @description
* Widget to render number input spinner.
* @example
<pre>
    <number-spinner ng-model="value" minimum="1" maximum="15" step="1"></number-spinner>
</pre>
*/
angular.module('starter')
   .directive('numberSpinner', function () {
       return {
			scope: {
				ngModel: '=',
				ngChange: '&',
				step: '@',
				small: '@',
				minimum: '@',
				maximum: '@'
			},
			link: function (scope, element, attrs) {
               
			},
			replace: true,
			controller: ['$scope', '$timeout', function ($scope, $timeout) {
				var vm = this;
				$scope.ns = {};
				vm.step = vm.step || 1;
				vm.minimum = vm.minimum || 1;
				vm.maximum = vm.maximum || 15;
				$scope.ngModel = $scope.ngModel || vm.minimum;
				
				$scope.ns.incrementStep = function(){
					if(vm.maximum > $scope.ngModel){
						$scope.ngModel = parseInt($scope.ngModel);
						$scope.ngModel += vm.step;
						$timeout($scope.ngChange, 0);
					}
				}
				   
				$scope.ns.decrementStep = function(){
					$scope.ngModel = parseInt($scope.ngModel);
					if(vm.minimum < $scope.ngModel){
						$scope.ngModel -= vm.step;
						$timeout($scope.ngChange, 0);
					}
				}
			}],
			templateUrl: 'app/common/widgets/number-spinner/number-spinner-template.html'
       };
   });