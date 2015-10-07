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
                query: '='
            },
            templateUrl: 'components/probr/probrPagination/pagination.html',
            link: function (scope, element, attrs) {

                scope.isSearching = false;

                scope.pageChanged = function () {

                    var searchQuery = scope.query !== undefined ? scope.query : {};

                    // constract query parameters
                    searchQuery.skip = scope.pageCurrent !== undefined ? (scope.pageCurrent - 1) * scope.pageLength : 0;
                    searchQuery.limit = scope.pageLength;

                    scope.isSearching = true;

                    scope.resource.count(searchQuery, function(resultObj) {
                        scope.itemsCount = resultObj.count;

                        scope.resource.query(searchQuery, function (resultObj) {
                            scope.items = resultObj;
                            scope.isSearching = false;
                        });
                    });


                };

                scope.$watch('query', function() {
                    scope.pageChanged();
                })

            }
        };
    });