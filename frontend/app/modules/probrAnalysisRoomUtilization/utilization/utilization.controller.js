'use strict';

angular.module('probrAnalysisRoomUtilization')
    .controller('UtilizationCtrl', function ($scope, $state, $stateParams, $http) {

        $scope.punchCardData = [];

        $scope.search = function (query) {
            $scope.query = {mac_address_src: query.replace(/:/g, '')};

            $http.get('/api/utilization').
                success(function (data, status, headers, config) {
                    $scope.punchCardData = [
                        [12, 17, 10, 20, 0, 12, 12, 12, 12, 20, 12, 10],
                        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                        [10, 30, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 24],
                        [],
                        [3, 10],
                        [],
                        [0, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 10, 12, 14, 20, 10, 3]
                    ];
                }).
                error(function (data, status, headers, config) {

                });
        }

    });
;
