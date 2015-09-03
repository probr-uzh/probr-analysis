/**
 * Created by gmazlami on 30.07.15.
 */
'use strict'

angular.module('probrAnalysisMap')
    .controller('MapCtrl', function ($scope, $state, $stateParams, $rootScope, Packet, Room, Utilization, Utilizations) {

        // map
        angular.element(document).ready(function () {
            $rootScope.$emit("updatePositions");

            angular.element(window).resize(function () {
                $rootScope.$emit("updatePositions");
            });
        });

        // collapse devices
        $scope.isCollapsed = true;
        $scope.isQuerying = false;
        $scope.datepickerOpened = false;
        $scope.overlays = {};

        // From:
        $scope.fromDate = new Date('2015-08-19');
        $scope.fromDate.setHours(13);
        $scope.fromDate.setMinutes(30);

        $scope.dateChange = function () {
            var toDate = angular.copy($scope.fromDate);
            toDate.setHours($scope.fromDate.getHours() + 1)
            $scope.toDate = toDate;
        }

        $scope.fromChange = function () {
            var fromDate = angular.copy($scope.fromDate);
            fromDate.setHours(fromDate.getHours() + 1);
            $scope.toDate = fromDate;
        }

        $scope.toChange = function () {
            var toDate = angular.copy($scope.toDate);
            toDate.setHours(toDate.getHours() - 1);
            $scope.fromDate = toDate;
        }

        // Trigger first DateChange to Update
        $scope.dateChange();

        $scope.query = function () {
            $scope.isQuerying = true;
            Utilization.query({type: 'triangulation', begin: $scope.fromDate.getTime(), end: $scope.toDate.getTime()}, function (result, err) {

                var timeQuery = {query: {$and: [{_id: '>%' + $scope.fromDate.toISOString()}, {_id: '<%' + $scope.toDate.toISOString()}]}};

                Utilizations.query(timeQuery, function (result, err) {

                    var data = [];

                    angular.forEach(result, function (obj) {
                        data.push([obj.value.location.coordinates[1], obj.value.location.coordinates[0], 0.01]);
                    })

                    var overlays = {
                        heatmap: {
                            name: "Heat Map",
                            type: "webGLHeatmap",
                            data: data,
                            visible: true,
                            layerOptions: {size: 0.3},
                            doRefresh: true
                        }
                    }

                    angular.extend($scope.overlays, overlays);

                    timeQuery.distinct = 'value.mac_address_src';

                    Utilizations.query(timeQuery, function (result, err) {
                        $scope.distinctDevices = result;
                        $scope.isQuerying = false;
                    });
                });


            });

        }

        // Get all registered Rooms
        Room.query({}, function (rooms) {
            $scope.rooms = rooms;
            $scope.selectedRoom = rooms[1] // seallab;
        });

        // DatePicker
        $scope.status = {
            opened: false
        };

        $scope.open = function ($event) {
            $scope.status.opened = true;
        };

    });