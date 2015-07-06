'use strict';

angular.module('probrAnalysisVendors')
    .controller('VendorsCtrl', function ($scope, $state, $stateParams, Packet) {

        $scope.vendors =

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
            count: 63181775,
            children: [
                {
                    label: 'England',
                    count: 53012456
                },
                {
                    label: 'Scotland',
                    count: 5295000
                },
                {
                    label: 'Wales',
                    count: 3063456
                },
                {
                    label: 'Northern Ireland',
                    count: 1810863
                }
            ]
        };


    });
;
