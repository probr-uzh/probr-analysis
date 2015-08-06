'use strict';

angular.module('probrAnalysisRoomUtilization')
    .controller('UtilizationCtrl', function ($scope, $state, $stateParams, $http) {

        //resourceSocket.updateResource($scope, $scope.devices, 'packet', 0, true);

        $http.get('/api/utilization/punchcard').
            success(function (data, status, headers, config) {
                var payload = [];
                for (var dayRunner = 0; dayRunner < 7; dayRunner++) {
                    payload.push([])
                    for (var hourRunner = 0; hourRunner < 24; hourRunner++) {
                        payload[dayRunner].push(0);
                    }
                }

                for (var index in data) {
                    var key = data[index]['_id'];
                    // since we dont start from 0
                    var dayIndex = parseInt(key.split("-")[0], 10)
                    dayIndex -= 1
                    var hourIndex = parseInt(key.split("-")[1], 10)
                    payload[dayIndex][hourIndex] += data[index]['count'];

                }
                $scope.punchCardData = payload;
            }).
            error(function (data, status, headers, config) {

            });

        $http.get('/api/utilization/max').
            success(function (data, status, headers, config) {
                $scope.maxUtilization = data[0]["count"];
            }).
            error(function (data, status, headers, config) {

            });
    });
;
