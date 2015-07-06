'use strict';

angular.module('probrAnalysisPacketsFilter')
    .controller('PacketsCtrl', function ($scope, $state, $stateParams, Packet) {

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

        $scope.search = function(query) {
            $scope.query = { mac_address_src: query.replace(/:/g, '') };
        }

    });
;
