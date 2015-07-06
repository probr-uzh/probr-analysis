'use strict';

angular.module('probrAnalysis')
    .controller('PacketsCtrl', function ($scope, $state, $stateParams, Packet) {

        $scope.query = '';
        $scope.pageLength = 100;
        $scope.currentPage = $stateParams.page;
        $scope.isSearching = true;

        $scope.search = function(query) {
            $scope.query = query;
            $scope.queryPackets();
        }

        $scope.changePage = function () {
            $scope.queryPackets();
        }

        $scope.queryPackets = function () {

            var handleResult = function (resultObj) {
                $scope.packetsCount = resultObj.count
                $scope.packets = resultObj.results;
                $scope.isSearching = false;
            }

            $scope.isSearching = true;

            if ($scope.query !== undefined && $scope.query.length !== 0) {
                Packet.query({
                    mac_address_src: $scope.query,
                    offset: (parseInt($scope.currentPage) - 1) * $scope.pageLength,
                    limit: $scope.pageLength
                }, handleResult);
            } else {
                Packet.query({
                    offset: (parseInt($scope.currentPage) - 1) * $scope.pageLength,
                    limit: $scope.pageLength
                }, handleResult);
            }
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
