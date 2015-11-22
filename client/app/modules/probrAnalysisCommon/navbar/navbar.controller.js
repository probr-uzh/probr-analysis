'use strict';

angular.module('probrAnalysisCommon')
    .controller('NavbarCtrl', function ($scope, $location) {

        $scope.menu = [
            {
                'title': 'Analysis',
                'link': 'packets'
            },
            {
              'title': 'Live',
              'link': 'live'
            },
            {
              'title': 'Utilization',
              'link': 'utilization'
            },
            {
                'title': 'Location',
                'link': 'heatmap'
            },
            {
                'title': 'Track',
                'link': 'mac'
            },
            {
                'title': 'Stats',
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
