'use strict';

angular.module('probrAnalysisMAC')
    .controller('LocationCtrl', function ($scope, $state, $stateParams, $rootScope, Location, Room) {

        // Get MAC-Address
        $scope.macAddress = $stateParams["macaddress"];

        // Room
        Room.query({}, function (rooms) {
            $scope.rooms = rooms;
        });

        $scope.overlays = {};

        Location.query({query: {mac_address: $scope.macAddress, area: {"$lt": 1000}}}, function (resultObj) {

            var data = [];

            angular.forEach(resultObj, function (obj) {
                data.push([obj.location.coordinates[1], obj.location.coordinates[0], 0.8]);
            });

            var overlays = {
                heatmap: {
                    name: "Heat Map",
                    type: "webGLHeatmap",
                    data: data,
                    visible: true,
                    layerOptions: {size: 0.5},
                    doRefresh: true
                }
            }

            angular.extend($scope.overlays, overlays);

        });

    });
