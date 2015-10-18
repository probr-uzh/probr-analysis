'use strict';

angular.module('probrMap', ['leaflet-directive'])
    .directive('probrMap', function () {
        return {
            restrict: 'E',
            scope: {
                room: '=',
                overlays: '=',
            },
            templateUrl: 'components/probr/probrMap/probrMap.html',
            controller: function ($scope, $rootScope, $timeout, leafletData) {

                leafletData.getMap().then(function (map) {
                        $timeout(function () {
                            $rootScope.$emit('updatePositions');
                        });
                    }
                );

                $scope.geojson = {
                    style: {
                        fillColor: "green",
                        weight: 2,
                        opacity: 1,
                        color: 'white',
                        dashArray: '3',
                        fillOpacity: 0.7
                    }
                }

                $scope.$watch('room', function (newVal, oldVal) {
                    if (newVal !== undefined) {
                        $scope.geojson.data = $scope.room.bounds;
                        leafletData.getMap().then(function (map) {
                            var latlngs = [];
                            for (var i in newVal.bounds.features[0].geometry.coordinates) {
                                var coord = newVal.bounds.features[0].geometry.coordinates[i];
                                for (var j in coord) {
                                    var points = coord[j];
                                    latlngs.push(angular.copy(points).reverse()); // copy it, or else it changes the reference points in the geojson
                                }
                            }
                            map.fitBounds(latlngs);
                        });
                    }
                })

                $scope.layers = {
                    baselayers: {
                        googleRoadmap: {
                            name: 'Google Streets',
                            layerType: 'ROADMAP',
                            type: 'google',
                            layerOptions: {maxZoom: 21, maxNativeZoom: 21}
                        }
                    },
                    overlays: $scope.overlays
                };

                // Awesome Marker
                var awesomeMarker = {
                    type: 'awesomeMarker',
                    icon: 'tag',
                    prefix: 'fa',
                    markerColor: 'gray'
                };

            }

        }
            ;
    })
;
