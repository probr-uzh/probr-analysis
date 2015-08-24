'use strict';

angular.module('probrAnalysisPacketsFilter')
  .controller('PacketsCtrl', function ($scope, $state, $stateParams, Packet) {

    $scope.pageLength = 50;
    $scope.query = {};
    $scope.resource = Packet;
    $scope.filters = {skip: 0, limit: $scope.pageLength};

    Packet.query({
        skip: 0,
        limit: $scope.pageLength
      }, function (resultObj) {
        $scope.packets = resultObj.results;
      }
    );


  });

