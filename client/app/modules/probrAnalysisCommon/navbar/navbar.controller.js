'use strict';

angular.module('probrAnalysisCommon')
    .controller('NavbarCtrl', function ($scope, $location) {

        $scope.menu = [
            {
                'title': 'Analysis',
                'active': ['packets', 'utilization', 'heatmap', 'devices'],
                'link': 'packets'
            },
            {
                'title': 'Live',
                'active': ['live'],
                'link': 'live'
            },
            {
                'title': 'Tracking',
                'active': ['mac'],
                'link': 'mac'
            },
        ];

        $scope.isActive = function (route) {
            return route === $location.path();
        };

        $scope.isActiveRoot = function (route) {
            var isActive = false;
            angular.forEach(route, function (route) {
                var subStr = $location.path().split("/")[1];
                if (route.slice(0, subStr.length) == subStr) {
                    isActive = true;
                }
            });
            return isActive;
        };

    });
