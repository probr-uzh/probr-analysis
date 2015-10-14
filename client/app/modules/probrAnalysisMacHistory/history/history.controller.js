'use strict';

angular.module('probrAnalysisMacHistory')
  .controller('MacHistoryCtrl', function ($scope, $state, $stateParams, PacketConcurrency) {

    $scope.macaddress = $stateParams["macaddress"];

    var queryParam = { mac_address_src : angular.copy($scope.macaddress)};
    console.log(queryParam);

    PacketConcurrency.query(queryParam,function (resultObj) {
        $scope.packetCount = resultObj;
        console.log($scope.packetCount);
      }
    );


  });
