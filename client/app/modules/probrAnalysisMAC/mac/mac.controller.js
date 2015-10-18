'use strict';

angular.module('probrAnalysisMAC')
    .controller('MacCtrl', function ($scope, $state, $stateParams, Socket, $cookies) {

        $scope.packets = [];
        $scope.watchedAddresses = $cookies.getObject('probrMACAnalyzerAddresses') || [];

        $scope.addMAC = function () {
            var address = $scope.macInput;
            address = address.replace(/:/g, "");

            if ($scope.watchedAddresses.indexOf(address) !== -1) {
                $scope.macInput = '';
                return;
            }

            Socket.listenTo('packet:' + address, function (packet) {
                $scope.packets.push(packet);
            });

            // remember watched addresses in cookies.
            $cookies.putObject('probrMACAnalyzerAddresses', $scope.watchedAddresses);

            $scope.watchedAddresses.push(address);
            $scope.macInput = '';

        }

        $scope.removeMAC = function (address) {
            Socket.unlistenTo('packet:' + address);

            $scope.packets.splice(_.findIndex($scope.packets, function (packet) {
                return packet.mac_address_src === address;
            }), 1);

            $scope.watchedAddresses.splice($scope.watchedAddresses.indexOf(address), 1);
            $cookies.putObject('probrMACAnalyzerAddresses', $scope.watchedAddresses);

        }

    });

