'use strict';

angular.module('probrAnalysisMAC')
    .controller('MacDetailCtrl', function ($scope, $stateParams, Session) {

        $scope.target = {mac_address: $stateParams.macaddress, alias: ''};
        $scope.aliases = [$scope.target];
        $scope.startDate = new Date(parseInt($stateParams.startTimestamp));
        $scope.endDate = new Date(parseInt($stateParams.endTimestamp));

        var constructQueryObject = function () {
            return {
                query: {
                    $and: [
                        {
                            $or: [{mac_address: $stateParams.macaddress}]
                        },
                        {
                            startTimestamp: {$gte: $stateParams.startTimestamp, $lte: $stateParams.endTimestamp},
                            endTimestamp: {$gte: $stateParams.startTimestamp, $lte: $stateParams.endTimestamp}
                        }
                    ]
                }
            };
        }

        $scope.swimlaneSessions = [];

        var updateSessions = function () {
            var query = constructQueryObject($scope.watchedAddresses);
            if (query.query.$and[0].$or.length > 0) {
                Session.query(query, function (results) {
                    $scope.swimlaneSessions = results;
                });
            } else {
                $scope.swimlaneSessions = [];
            }
        };

        updateSessions();

    });

