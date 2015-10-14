'use strict';



angular.module('probrAnalysisRoomUtilization')
    .controller('UtilizationCtrl', function ($scope, $state, $filter, $stateParams, Utilization) {

    var EXPECTED_PUNCHCARD_LIST_LENGTH = 7*24;
        var HOURS_PER_DAY = 24;
        var DAYS_PER_WEEK = 7;

        $scope.isSearching = false;

        $scope.submit = function (query) {
            $scope.loadPunchcard(query);
        }

        $scope.loadPunchcard = function (query) {
            $scope.isSearching = true;

            var params = query || {};
            params.type = 'punchcard';

            Utilization.query(params, function (result, err) {

                var payload = [];
                for (var dayRunner = 0; dayRunner < DAYS_PER_WEEK; dayRunner++) {
                    payload.push([]);
                    for (var hourRunner = 0; hourRunner < HOURS_PER_DAY; hourRunner++) {
                        payload[dayRunner].push(0);
                    }
                }



                if (result.length != 168){
                    console.error("Punchcard not full, hell will break loose")
                } else {
                    var TIMEZONE_OFFSET = 2;
                    result=$filter('orderBy')(result, "_id");

                    for(var i = 0; i<EXPECTED_PUNCHCARD_LIST_LENGTH; i++){
                      var obj = result[i];
                      console.log("mapping "+obj._id+" to "+((i+TIMEZONE_OFFSET)/HOURS_PER_DAY)%DAYS_PER_WEEK+"/"+(i+TIMEZONE_OFFSET)%HOURS_PER_DAY)
                      payload[~~((i+TIMEZONE_OFFSET)/HOURS_PER_DAY)%DAYS_PER_WEEK][~~(i+TIMEZONE_OFFSET)%HOURS_PER_DAY] += obj.count;
                    }
                }

                $scope.punchCardData = payload;
                $scope.isSearching = false;

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
