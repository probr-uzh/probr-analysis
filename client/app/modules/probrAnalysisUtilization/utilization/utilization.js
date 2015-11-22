'use strict';

angular.module('probrAnalysisUtilization')
  .config(function ($stateProvider) {
    $stateProvider
      .state('utilization', {
        url: '/utilization?:startTimestamp&:endTimestamp&:tags',
        templateUrl: 'app/modules/probrAnalysisUtilization/utilization/utilization.html',
        controller: 'UtilizationCtrl'
      });
    ;
  });
