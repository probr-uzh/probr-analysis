/**
 * Created by gmazlami on 29.09.15.
 */

'use strict';

angular.module('probrAnalysisDevices')
  .controller('DevicesCtrl', function ($scope, $state, $stateParams, Device) {

    $scope.pageLength = 50;
    $scope.query = {};
    $scope.resource = Device;
    $scope.filters = {skip: 0, limit: $scope.pageLength};

    Device.query({
        skip: 0,
        limit: $scope.pageLength
      }, function (resultObj) {
        $scope.devices = resultObj;
      }
    );
  });

