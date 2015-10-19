'use strict';

angular.module('probrAnalysisPacketsFilter')
    .controller('PacketsCtrl', function ($scope, $state, $stateParams, Packet, Socket) {

        $scope.fields = ['mac_address_src: ', 'mac_address_dst: ', 'lat: ', 'lon: ', 'tags: ', 'ssid: ', 'signal_strength: '];
        $scope.newPackets = 0;
        $scope.pageLength = 100;
        $scope.resource = Packet;

        $scope.params = {skip: 0, limit: $scope.pageLength, sort: "-time"};
        $scope.query = {};

        Socket.listenTo('packet:create', function (item) {
            $scope.newPackets++;
        });

        $scope.submit = function (query) {
            $scope.query = query;
        }

    });

