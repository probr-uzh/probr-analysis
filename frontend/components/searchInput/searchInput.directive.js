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

				$scope.submitInput = function (query) {
					$scope.onSubmit({query: query});
				};

				$scope.inputChanged = function (query) {
					$scope.onChange({query: query});
				};

			}
		};
	});