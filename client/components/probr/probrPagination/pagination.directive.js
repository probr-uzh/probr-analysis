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
                        var copiedQuery = angular.copy(query);

                        var params = $scope.params !== undefined ? $scope.params : {};

                        // converting the start/endtimestamp thing
                        if (copiedQuery.startTimestamp && copiedQuery.endTimestamp) {
                            var expression = [];
                            expression.push({time: {$gt: copiedQuery.startTimestamp}});
                            expression.push({time: {$lt: copiedQuery.endTimestamp}});
                            copiedQuery.$and = expression;
                            delete(copiedQuery.startTimestamp);
                            delete(copiedQuery.endTimestamp);
                        }

                        var searchQuery = angular.extend(angular.copy(params), {query: JSON.stringify(copiedQuery)});

                        // constract query parameters
                        searchQuery.skip = (($scope.pageCurrent - 1) * $scope.pageLength) || 0;
                        searchQuery.limit = $scope.pageLength;

                        $scope.isSearching = true;

                        var locationParams = angular.extend(query, {startTimestamp: query.startTimestamp, endTimestamp: query.endTimestamp});
                        $location.search(locationParams);

                        var countQuery = angular.copy(searchQuery);
                        delete countQuery.skip;
                        delete countQuery.limit;
                        delete countQuery.sort;

                        $scope.resource.count(countQuery, function (resultObj) {
                            $scope.itemsCount = resultObj.count;
                            console.log(searchQuery)
                            $scope.resource.query(searchQuery, function (resultObj) {
                                $scope.items = resultObj;
                                $scope.isSearching = false;
                            });
                        });

                    }

                    $scope.$watch('query', function () {
                        $scope.pageChanged();
                    }, true);

                }
            }
        }
    );
