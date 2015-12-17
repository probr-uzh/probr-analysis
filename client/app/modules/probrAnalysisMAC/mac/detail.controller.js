'use strict';

angular.module('probrAnalysisMAC')
    .controller('MacDetailCtrl', function ($scope, $stateParams, Session) {

        $scope.target = {mac_address: $stateParams.mac_address, alias: ''};
        $scope.aliases = [$scope.target];

        var constructQueryObject = function () {
            return {
                query: {
                    $and: [
                        {
                            $or: [{mac_address: $stateParams.mac_address}]
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

