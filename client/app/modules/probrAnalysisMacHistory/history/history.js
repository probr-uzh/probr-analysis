'use strict';

angular.module('probrAnalysisMacHistory')
  .config(function ($stateProvider) {
    $stateProvider
      .state('history', {
        url: '/mac/{macaddress}',
        templateUrl: 'app/modules/probrAnalysisMacHistory/history/history.html',
        controller: 'MacHistoryCtrl'
      });
    ;
  });
