'use strict';

angular.module('probrAnalysisPacketsFilter')
    .controller('PacketsCtrl', function ($scope, $state, $stateParams, Packet, Socket) {

        $scope.newPackets = [];
        $scope.pageLength = 50;
        $scope.query = {};
        $scope.resource = Packet;
        $scope.filters = {skip: 0, limit: $scope.pageLength};

        Socket.listenTo('packet:create', function(item) {
            $scope.newPackets.push(item);
        });


    });

