'use strict';

angular.module('probrAnalysisCommon')
    .controller('NavbarCtrl', function ($scope, $location) {

        $scope.menu = [
            {
                'title': 'Packets',
                'link': 'packets'
            },
            {
              'title': 'Utilization',
              'link': 'utilization'
            },
            {
                'title': 'Heatmap',
                'link': 'heatmap'
            },
            {
                'title': 'MAC',
                'link': 'mac'
            },
            {
                'title': 'Devices',
                'link': 'devices'
            }
        ];

        $scope.isActive = function (route) {
            return route === $location.path();
        };

        $scope.isActiveRoot = function (route) {
            var subStr = $location.path().split("/")[1];
            return route.slice(0, subStr.length) == subStr;
        };

    });
