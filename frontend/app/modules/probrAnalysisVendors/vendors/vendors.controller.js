'use strict';

angular.module('probrAnalysisVendors')
    .controller('VendorsCtrl', function ($scope, $state, $stateParams, Packet) {

        $scope.populationData = undefined;

        Packet.query({
                offset: 0,
                limit: 1000
            }, function (resultObj) {
                $scope.packetsCount = resultObj.count;
                $scope.packets = resultObj.results;
            }
        );

        $scope.populationData = {
            label: 'Device Vendors',
            children: [
                {
                    label: 'England',
                    count: 25
                },
                {
                    label: 'Scotland',
                    count: 25
                },
                {
                    label: 'Wales',
                    count: 25
                },
                {
                    label: 'Northern Ireland',
                    count: 25
                }
            ]
        };


    });
;
