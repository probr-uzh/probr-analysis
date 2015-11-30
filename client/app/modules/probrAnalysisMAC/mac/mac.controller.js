'use strict';

angular.module('probrAnalysisMAC')
    .controller('MacCtrl', function ($scope, $state, $stateParams, Socket, $cookies, Session) {

        $scope.packets = [];
        $scope.watchedAddresses = $cookies.getObject('probrMACAnalyzerAddresses') || [];

        var listenTo = function (watchedAddress) {
            Socket.listenTo('packet:' + watchedAddress.mac_address, function (packet) {
                console.log(packet);
                if ($scope.packets.length < 25) {
                    $scope.packets.unshift(packet);
                } else {
                    $scope.packets.pop();
                    $scope.packets.unshift(packet);
                }
            });
        };

        angular.forEach($scope.watchedAddresses, function (watchedAddress) {
            listenTo(watchedAddress);
        });

        $scope.addMAC = function () {
            var address = {mac_address: $scope.macInput, alias: $scope.alias};
            address.mac_address = address.mac_address.replace(/:/g, "");

            angular.forEach($scope.watchedAddresses, function (watchedAddress) {
                if (watchedAddress.mac_address == address) {
                    $scope.macInput = '';
                    return;
                }
            });

            listenTo(address);

            // remember watched addresses in cookies.
            $scope.watchedAddresses.push(address);
            $scope.macInput = '';

            $cookies.putObject('probrMACAnalyzerAddresses', $scope.watchedAddresses);

            updateSessions();

        }

        $scope.removeMAC = function (address) {
            Socket.unlistenTo('packet:' + address);

            $scope.packets.splice(_.findIndex($scope.packets, function (packet) {
                return packet.mac_address_src === address;
            }), 1);

            $scope.watchedAddresses.splice($scope.watchedAddresses.indexOf(address), 1);
            $cookies.putObject('probrMACAnalyzerAddresses', $scope.watchedAddresses);

            updateSessions();

        }

        //Swimlane related controller code:

        var constructQueryObject = function (mac_address_list) {
            var sessionQueryDisjunctionList = [];

            for (var i = 0; i < mac_address_list.length; i++) {
                sessionQueryDisjunctionList.push({mac_address: mac_address_list[i].mac_address});
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
            if ($scope.watchedAddresses.length > 0) {
                var query = constructQueryObject($scope.watchedAddresses);
                Session.query(query, function (results) {
                    $scope.swimlaneSessions = results;
                });
            } else {
                $scope.swimlaneSessions = [];
            }
        };
        updateSessions();


    });

