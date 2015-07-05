'use strict';

angular.module('probrAnalysis')
	.directive('searchInput', function () {
		return {
			restrict: 'EA',
			scope: {
				onChange: '&',
				onSubmit: '&'
			},
			templateUrl: '/static/components/searchInput/searchInput.html',
			controller: function ($scope) {

				$scope.submitInput = function () {
					$scope.onSubmit({query: $scope.query});
				};

				$scope.inputChanged = function () {
					$scope.onChange({query: $scope.query});
				};

			}
		};
	});