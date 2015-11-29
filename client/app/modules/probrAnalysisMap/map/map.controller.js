'use strict'

angular.module('probrAnalysisMap')
    .controller('MapCtrl', function ($scope, $state, $stateParams, $rootScope, Location, Room) {

        // MultiRange Slider
        $scope.rangeArray = [
            {value: 6 / 24, name: 'Start'},
            {value: 18 / 24, name: 'End'},
        ]

        // StepSize
        $scope.views = [{
            zoom: 0.95, step: 1 / 48, units: [{
                value: 1 / 24, labeller: function (n) {
                    return "" + Math.floor(n * 24) + ":00";
                }
            }, {value: 1}]
        }];

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

            // Add Seconds of Range
            startTimestamp = startTimestamp + ($scope.rangeArray[0].value * 24) * 3600 * 1000;
            endTimestamp = endTimestamp + ($scope.rangeArray[1].value * 24) * 3600 * 1000;

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

    });
