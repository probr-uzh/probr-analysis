'use strict';

angular.module('probrAnalysisPacketsFilter')
    .controller('PacketsCtrl', function ($scope, $state, $stateParams, Packet, Socket) {

        $scope.fields = ['mac_address_src: ', 'mac_address_dst: ', 'lat: ', 'lon: ', 'tags: ', 'ssid: ', 'signal_strength: ', 'limit', 'skip'];
        $scope.newPackets = [];
        $scope.pageLength = 100;
        $scope.resource = Packet;
        $scope.query = {skip: 0, limit: $scope.pageLength, sort: "-time"};

        Socket.listenTo('packet:create', function (item) {
            $scope.newPackets.push(item);
        });

        $scope.submit = function (query) {
            $scope.query = query;
        }

    });

