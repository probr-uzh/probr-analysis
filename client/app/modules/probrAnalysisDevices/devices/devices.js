/**
 * Created by gmazlami on 29.09.15.
 */

'use strict';

angular.module('probrAnalysisDevices')
  .config(function ($stateProvider) {
    $stateProvider
      .state('devices', {
        url: '/devices',
        templateUrl: 'app/modules/probrAnalysisDevices/devices/devices.html',
        controller: 'DevicesCtrl'
      });
    ;
  });
