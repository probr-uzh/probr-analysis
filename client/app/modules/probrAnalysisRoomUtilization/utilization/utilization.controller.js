'use strict';

angular.module('probrAnalysisRoomUtilization')
  .controller('UtilizationCtrl', function ($scope, $state, $stateParams, Utilization) {

    $scope.submit = function (query) {
      $scope.loadPunchcard(query);
    }

    $scope.loadPunchcard = function (query) {

      var params = query || {};
      params.type = 'punchcard';

      Utilization.query(params, function (result, err) {

        var payload = [];
        for (var dayRunner = 0; dayRunner < 7; dayRunner++) {
          payload.push([])
          for (var hourRunner = 0; hourRunner < 24; hourRunner++) {
            payload[dayRunner].push(0);
          }
        }

        angular.forEach(result, function(obj) {
          
          var key = obj._id;
          // since we dont start from 0
          var dayIndex = parseInt(key.split("-")[0], 10)
          dayIndex -= 1
          var hourIndex = parseInt(key.split("-")[1], 10)
          payload[dayIndex][hourIndex] += obj.count;

        });

        $scope.punchCardData = payload;

      });

    }

    // Load Default
    $scope.loadPunchcard(null);

    /*
     $http.get('/api/utilization/max').
     success(function (data, status, headers, config) {
     $scope.maxUtilization = data[0]["count"];
     }).
     error(function (data, status, headers, config) {

     });
     */
  });
;
