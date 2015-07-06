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
            templateUrl: '/static/components/probrPagination/pagination.html',
            link: function (scope, element, attrs) {

                scope.isSearching = false;

                scope.pageChanged = function () {

                    var searchQuery = scope.query !== undefined ? scope.query : {};

                    // constract query parameters
                    searchQuery.offset = (scope.pageCurrent - 1) * scope.pageLength;
                    searchQuery.limit = scope.pageLength;

                    scope.isSearching = true;

                    scope.resource.query(searchQuery, function (resultObj) {
                        scope.itemsCount = resultObj.count;
                        scope.items = resultObj.results;
                        scope.isSearching = false;
                    });

                };

                scope.$watch('query', function() {
                    scope.pageChanged();
                })

            }
        };
    });