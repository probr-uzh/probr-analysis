'use strict';

angular.module('probrLoading', [])
  .directive('probrLoading', function () {
    return {
      restrict: 'E',
      scope: {
        isLoading: '=',
      },
      templateUrl: 'components/probr/probrLoading/loading.html',
      controller: function ($scope) {

      }
    }
  }
);
