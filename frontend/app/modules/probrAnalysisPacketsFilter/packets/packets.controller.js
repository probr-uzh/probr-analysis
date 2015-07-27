'use strict';

angular.module('probrAnalysisPacketsFilter')
    .controller('PacketsCtrl', function ($scope, $state, $stateParams, Packet) {

        $scope.pageLength = 50;
        $scope.fields = ['mac_address_src: ', 'mac_address_dst: ', 'lat: ', 'lon: ', 'tags: ', 'ssid: ', 'signal_strength: ', 'limit', 'offset'];
        $scope.filters = { offset: 0, limit: $scope.pageLength };
        $scope.query = {};

        $scope.submitInput = function () {
            if ($scope.typeaheadQuery.split(':', 2)[1].length <= 1) return;

            var params = $scope.typeaheadQuery.split(':', 1);
            var fieldName = params[0];
            var fieldContent = $scope.typeaheadQuery.substr($scope.typeaheadQuery.indexOf(':'), $scope.typeaheadQuery.length).replace(/:/g, '').trim();
            $scope.filters[fieldName] = fieldContent;
            $scope.typeaheadQuery = '';
        }

        $scope.removeLabel = function(key) {
            delete $scope.filters[key];
        }

        $scope.resource = Packet;

        Packet.query({
                offset: 0,
                limit: $scope.pageLength
            }, function (resultObj) {
                $scope.packetsCount = resultObj.count;
                $scope.packets = resultObj.results;
            }
        );

        $scope.search = function () {
            $scope.query = angular.copy($scope.filters);
        }


    });
;
