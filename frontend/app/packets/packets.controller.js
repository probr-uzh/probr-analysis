'use strict';

angular.module('probrAnalysis')
    .controller('PacketsCtrl', function ($scope, $state, $stateParams, Packet) {

        $scope.pageLength = 100;
        $scope.currentPage = $stateParams.page;
        $scope.isSearching = true;

        $scope.changePage = function () {
            $scope.queryPackets();
        }

        $scope.queryPackets = function () {
            $scope.isSearching = true;
            Packet.query({
                offset: ($scope.currentPage - 1) * $scope.pageLength,
                limit: $scope.pageLength
            }, function (resultObj) {
                $scope.packetsCount = resultObj.count
                $scope.packets = resultObj.results;
                $scope.isSearching = false;
            });
        }

        $scope.queryPackets();

    })
    .controller('PacketsMacSearchCtrl', function ($scope, Packet) {

        Packet.query({limit: pageLength}, function (resultObj) {
            $scope.packets = resultObj.results;
            $scope.packtsCount = resultObj.count;
        });

    });
;
