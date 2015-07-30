'use strict';

angular.module('probrMap', [])
    .directive('probrMap', function () {
        return {
            restrict: 'E',
            templateUrl: '/static/components/probrMap/map.html'
        };
    });