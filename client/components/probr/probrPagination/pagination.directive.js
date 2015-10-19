'use strict';

angular.module('probrPagination', [])
  .directive('probrPagination', function () {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        resource: '=',
        items: '=',
        itemsCount: '=',
        pageLength: '=',
        query: '=',
        params: '='
      },
      templateUrl: 'components/probr/probrPagination/pagination.html',
      controller: function ($scope, $location) {

        $scope.isSearching = false;
        $scope.pageChanged = function () {

          var query = $scope.query !== undefined ? $scope.query : {};
          var params = $scope.params !== undefined ? $scope.params : {};

          var searchQuery = angular.extend(angular.copy(params), {query: JSON.stringify(query)});

          // constract query parameters
          searchQuery.skip = (($scope.pageCurrent - 1) * $scope.pageLength) || 0;
          searchQuery.limit = $scope.pageLength;

          $scope.isSearching = true;

          // update location
          var locationParams = angular.copy(searchQuery);
          delete locationParams.query;
          $location.path($location.path(), false).search(angular.extend(angular.copy(locationParams), query));

          var countQuery = angular.copy(searchQuery);
          delete countQuery.skip;
          delete countQuery.limit;
          delete countQuery.sort;

          $scope.resource.count(countQuery, function (resultObj) {
            $scope.itemsCount = resultObj.count;

            $scope.resource.query(searchQuery, function (resultObj) {
              $scope.items = resultObj;
              $scope.isSearching = false;
            });
          });

        }

        $scope.$watch('query', function () {
          $scope.pageChanged();
        });

      }
    }
  }
);
