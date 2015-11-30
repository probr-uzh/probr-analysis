'use strict';

angular.module('probrAnalysisMAC')
    .controller('MacCtrl', function ($scope, $state, $stateParams, Socket, Target, Session) {

        $scope.packets = [];
        $scope.watchedAddresses = [];

        var listenTo = function (targetobj) {
            Socket.listenTo('packet:' + targetobj.mac_address_src, function (packet) {
                console.log(packet);
                if ($scope.packets.length < 25) {
                    $scope.packets.unshift(packet);
                } else {
                    $scope.packets.pop();
                    $scope.packets.unshift(packet);
                }
            });
        };

        Target.query({}, function (targets) {
            $scope.watchedAddresses = targets;

            angular.forEach(targets, function (targetObj) {
                listenTo(targetObj);
            });

            updateSessions();

        });

        $scope.addMAC = function () {

            var newTarget = new Target();
            newTarget.mac_address = $scope.macInput.replace(/:/g, "");
            newTarget.alias = $scope.alias;
            newTarget.$save(function (err, resultObj) {
                $scope.watchedAddresses.push(resultObj);
                listenTo(resultObj);
                $scope.macInput = '';
                updateSessions();
            });

        }

        $scope.removeMAC = function (targetObj) {

            targetObj.$delete(function (err, resultObj) {

                Socket.unlistenTo('packet:' + targetObj.mac_address);

                $scope.packets.splice(_.findIndex($scope.packets, function (packet) {
                    return packet.mac_address === address;
                }), 1);

                $scope.watchedAddresses.splice($scope.watchedAddresses.indexOf(targetObj), 1);
                updateSessions();
            });

        }

        $scope.toggleMAC = function (targetObj) {
            targetObj.hidden = !targetObj.hidden;
            updateSessions();
        }

        //Swimlane related controller code:

        var constructQueryObject = function (targets) {
            var sessionQueryDisjunctionList = [];

            for (var i = 0; i < targets.length; i++) {
                var targetObj = targets[i];
                if (!targetObj.hidden) {
                    sessionQueryDisjunctionList.push({mac_address: targetObj.mac_address});
                }
            }

            return {
                query: {
                    $and: [
                        {
                            $or: sessionQueryDisjunctionList
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

    });

