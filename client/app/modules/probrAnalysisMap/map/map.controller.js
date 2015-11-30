'use strict'

angular.module('probrAnalysisMap')
    .controller('MapCtrl', function ($scope, $state, $stateParams, $rootScope, Location, Room) {

        // Room
        Room.query({}, function (rooms) {
            $scope.rooms = rooms;
        });

        $scope.overlays = {};

        $scope.query = function () {

            $scope.isLoading = true;
            var areaCutoff = 10;

            var startTimestamp = parseInt($stateParams.startTimestamp);
            var endTimestamp = parseInt($stateParams.endTimestamp);

            Location.query({
                query: {
                    area: {$lte: areaCutoff},
                    noOfCircles: {$gte: 4},
                    time: {$gt: startTimestamp, $lt: endTimestamp}
                }
            }, function (resultObj) {

                $scope.nrOfLocations = resultObj.length;

                var data = [];
                var areaSum = 0;

                angular.forEach(resultObj, function (obj) {
                    //var intensity = Math.log(areaCutoff / obj.area) / 150;
                    areaSum = areaSum + obj.area;
                    data.push([obj.location.coordinates[1], obj.location.coordinates[0], 0.3]);
                });

                var overlays = {
                    heatmap: {
                        name: "Heat Map",
                        type: "webGLHeatmap",
                        data: data,
                        visible: true,
                        layerOptions: {size: 1},
                        doRefresh: true
                    }
                }

                angular.extend($scope.overlays, overlays);
                $scope.isLoading = false;

            });
        };

        $scope.query();

    });
