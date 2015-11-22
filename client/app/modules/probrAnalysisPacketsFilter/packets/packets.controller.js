'use strict';

angular.module('probrAnalysisPacketsFilter')
    .controller('PacketsCtrl', function ($scope, $state, $location, $stateParams, PacketQuery) {

        $scope.fields = ['mac_address_src: ', 'mac_address_dst: ', 'lat: ', 'lon: ', 'tags: ', 'ssid: ', 'signal_strength: '];
        $scope.newPackets = 0;
        $scope.pageLength = 100;
        $scope.resource = PacketQuery;

        $scope.params = {skip: 0, limit: $scope.pageLength, sort: "-time"};
        $scope.query = {};


        $scope.submit = function (query) {
          $scope.query = query;
          $scope.query.tags = $location.search().tags;
          $scope.query.startTimestamp = $location.search().startTimestamp;
          $scope.query.endTimestamp = $location.search().endTimestamp;

        }

        $scope.packets = [];
    });

