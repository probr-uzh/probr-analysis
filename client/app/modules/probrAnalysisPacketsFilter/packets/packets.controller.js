'use strict';

angular.module('probrAnalysisPacketsFilter')
    .controller('PacketsCtrl', function ($scope, $state, $location, $stateParams, PacketQuery) {

        $scope.fields = ['mac_address_src: ', 'mac_address_dst: ', 'lat: ', 'lon: ', 'ssid: ', 'signal_strength: '];
        $scope.newPackets = 0;
        $scope.pageLength = 100;
        $scope.resource = PacketQuery;

        $scope.params = {skip: 0, limit: $scope.pageLength, sort: "-time"};

        $scope.query = {};
        $scope.query.tags = $stateParams.tags;
        $scope.query.startTimestamp = $stateParams.startTimestamp;
        $scope.query.endTimestamp = $stateParams.endTimestamp;

        if ($stateParams.mac_address_src) {
            $scope.query.mac_address_src = $stateParams.mac_address_src;
        }

        if ($stateParams.ssid) {
            $scope.query.ssid = $stateParams.ssid;
        }

        $scope.setFilter = function (filterObj) {
            if (filterObj.value) {
                var searchParams = {};
                searchParams[filterObj.type] = filterObj.value;
                $scope.query = angular.extend($scope.query, searchParams);
            }
        }

        $scope.submit = function (query) {
            $scope.query = query;
            $scope.query.tags = $stateParams.tags;
            $scope.query.startTimestamp = $stateParams.startTimestamp;
            $scope.query.endTimestamp = $stateParams.endTimestamp;
        }

        $scope.packets = [];
    });

