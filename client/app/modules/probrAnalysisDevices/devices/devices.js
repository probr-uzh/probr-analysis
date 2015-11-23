/**
 * Created by gmazlami on 29.09.15.
 */

'use strict';

angular.module('probrAnalysisDevices')
  .config(function ($stateProvider) {
    $stateProvider
      .state('devices', {
        url: '/devices?:startTimestamp&:endTimestamp&:tags',
        templateUrl: 'app/modules/probrAnalysisDevices/devices/devices.html',
        controller: 'DevicesCtrl'
      });
    ;
  });
