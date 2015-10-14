'use strict';

angular.module('probrAnalysisMacHistory')
  .controller('MacHistoryCtrl', function ($scope, $state, $stateParams, PacketConcurrency) {

    $scope.macaddress = $stateParams["macaddress"];

    var queryParam = { mac_address_src : angular.copy($scope.macaddress)};
    console.log(queryParam);

    PacketConcurrency.query(queryParam,function (resultObj) {
        $scope.chartOptions = {
          scaleShowGridLines: false,
          bezierCurve : false,
          pointDot : false,
          scaleShowLabels: false,
        }

        $scope.weekDataPoints = [[]];
        $scope.weekLabels = [];

        resultObj.forEach(function(entry) {
          $scope.weekDataPoints[0].push(entry["value"]);
          $scope.weekLabels.push(new Date(entry["_id"]*(1000 * 60 * 60)));
        });

      }
    );


  });
