'use strict';

angular.module('probrAnalysisLive')
  .config(function ($stateProvider) {
    $stateProvider
      .state('live', {
        url: '/live',
        templateUrl: 'app/modules/probrAnalysisLive/live/live.html',
        controller: 'LiveCtrl'
      });
  });
