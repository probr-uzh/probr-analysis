'use strict';

angular.module('probrAnalysisVendors')
    .controller('VendorsCtrl', function ($scope, $state, $stateParams, Packet) {

        Packet.query({
                offset: 0,
                limit: $scope.pageLength
            }, function (resultObj) {
                $scope.packetsCount = resultObj.count;
                $scope.packets = resultObj.results;
            }
        );
    });
;
