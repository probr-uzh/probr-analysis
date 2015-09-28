'use strict';

angular.module('probrAnalysisSessions')
  .config(function ($stateProvider) {
    $stateProvider
      .state('sessions', {
        url: '/sessions',
        templateUrl: 'app/modules/probrAnalysisSessions/sessions/sessions.html',
        controller: 'SessionsCtrl'
      });
    ;
  });
