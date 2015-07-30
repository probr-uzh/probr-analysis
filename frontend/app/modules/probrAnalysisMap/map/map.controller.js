/**
 * Created by gmazlami on 30.07.15.
 */
'use strict'

angular.module('probrAnalysisMap')
    .controller('MapCtrl', function ($scope, $state, $stateParams, Packet) {

        $scope.pageLength = 50;
        $scope.resource = Packet;

        Packet.query({
                offset: 0,
                limit: $scope.pageLength
            }, function (resultObj) {
                $scope.packetsCount = resultObj.count;
                $scope.packets = resultObj.results;
            }
        );

    });