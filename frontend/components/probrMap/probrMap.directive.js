'use strict';

angular.module('probrMap', [])
    .directive('probrMap', function () {
        return {
            restrict: 'E',
            scope: {
                resource: '=',
                items: '=',
                itemsCount: '=',
                pageLength: '=',
                query: '='
            },
            templateUrl: '/static/components/probrMap/map.html',

        };
    });