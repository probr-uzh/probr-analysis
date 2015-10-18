'use strict';

angular.module('probrAnalysisMAC', [
  'ui.router',
  'ui.bootstrap',
  'probrPagination',
  'probrAnalysisCommon',
  'ngCookies'
]).config(function ($stateProvider) {
  $stateProvider
    .state('mac', {
      url: '/mac',
      templateUrl: 'app/modules/probrAnalysisMAC/mac/mac.html',
      controller: 'MacCtrl'
    })
    .state('mac-history', {
      url: '/mac/history/{macaddress}',
      templateUrl: 'app/modules/probrAnalysisMAC/mac/history.html',
      controller: 'HistoryCtrl'
    });
});
