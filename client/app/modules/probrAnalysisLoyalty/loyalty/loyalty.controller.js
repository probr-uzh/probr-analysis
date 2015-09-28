'use strict';


angular.module('probrAnalysisLoyalty')
  .controller('LoyaltyCtrl', function ($scope, $state, $filter, $stateParams, Loyalty) {

    $scope.loadHistogram = function (query) {
      var params = {};
      params.type = 'histogram';

      Loyalty.query(params, function (result, err) {
        $scope.histogramDataPoints = [[]];
        $scope.histogramLabels = [];

        result.forEach(function(entry) {
          $scope.histogramDataPoints[0].push(entry["count"]);
          $scope.histogramLabels.push(entry["_id"]);
          console.log($scope.histogramLabels)
        });
      });
    }

    $scope.loadHistogram();
  });
;
