'use strict';

angular.module('probrAnalysis')
    .directive('pbPagination', function () {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                resource: '=',
                items: '=',
                itemsCount: '=',
                pageLength: '=',
                searchQuery: '=query'
            },
            templateUrl: '/static/components/pagination/pagination.html',
            link: function (scope, element, attrs) {

                scope.isSearching = false;

                scope.pageChanged = function () {

                    // constract query parameters
                    var query = {};
                    query.offset = (scope.pageCurrent - 1) * scope.pageLength;
                    query.limit = scope.pageLength;

                    // copy all searchQuery attr to query
                    for (var attrname in scope.searchQuery) {
                        query[attrname] = scope.searchQuery[attrname];
                    }

                    scope.isSearching = true;

                    scope.resource.query(query, function (resultObj) {
                        scope.itemsCount = resultObj.count;
                        scope.items = resultObj.results;
                        scope.isSearching = false;
                    });

                };

            }
        };
    });