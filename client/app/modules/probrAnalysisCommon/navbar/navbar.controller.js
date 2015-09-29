'use strict';

angular.module('probrAnalysisCommon')
  .controller('NavbarCtrl', function ($scope, $location) {

    $scope.menu = [
      {
        'title': 'Packets',
        'link': 'packets'
      },
      {
        'title': 'Room Utilization',
        'link': 'utilization'
      },
      {
        'title': 'Map',
        'link': 'map'
      },
      {
        'title': 'Sessions',
        'link': 'sessions'
      },
      {
        'title': 'MAC-Analyzer',
        'link': 'analyzer'
      },
      {
        'title': 'Loyalty',
        'link': 'loyalty'
      },
      {
        'title':'Devices',
        'link':'devices'
      }
    ];

    $scope.isActive = function (route) {
      return route === $location.path();
    };

    $scope.isActiveRoot = function (route) {
      var subStr = $location.path().split("/")[1];
      return route.indexOf(subStr.substr(0, subStr.length - 1)) !== -1;
    };

  });
