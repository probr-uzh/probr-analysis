'use strict';

angular.module('probrMap', ['leaflet-directive'])
    .directive('probrMap', function () {
        return {
            restrict: 'E',
            scope: {
                resource: '=',
                items: '=',
                itemsCount: '=',
                pageLength: '='
            },
            templateUrl: '/static/components/probrMap/probrMap.html',
            controller: function ($scope, leafletBoundsHelpers) {

                $scope.bounds = leafletBoundsHelpers.createBoundsFromArray([[47.360190, 8.590874], [47.401570, 8.486075]]);

                // Awesome Marker
                var awesomeMarker = {
                    type: 'awesomeMarker',
                    icon: 'tag',
                    prefix: 'fa',
                    markerColor: 'gray'
                };

                $scope.$watch('items', function () {

                    $scope.markers = {};
                    var latLngArray = [];

                    angular.forEach($scope.items, function (item) {
                        if (item.loc !== undefined) {
                            latLngArray.push([item.loc.coordinates[1], item.loc.coordinates[0]]);
                            $scope.markers[item.id] = {
                                lat: item.loc.coordinates[1],
                                lng: item.loc.coordinates[0],
                                title: item.mac_address_src,
                                label: {
                                    message: "Source: " + item.mac_address_src + " , Tags: " + item.tags + " , SSID: " + item.ssid + " Signalstrength: " + item.signal_strength,
                                    options: {
                                        noHide: true
                                    }
                                },
                                icon: awesomeMarker
                            }
                        }
                    });

                    if (latLngArray.length > 0) {
                        $scope.bounds = leafletBoundsHelpers.createBoundsFromArray(latLngArray);
                    }

                });

                /*
                 if(newVal){
                 if(lastMarkers.length !== 0){
                 for(var k = 0; k < lastMarkers.length; k++){
                 map.removeLayer(lastMarkers[k]);
                 }
                 lastMarkers = [];
                 }

                 var length = (scope.pageLength > scope.itemsCount) ? scope.itemsCount : scope.pageLength;

                 for(var i = 0; i < length ; i++){
                 if (scope.items[i].loc !== undefined) {
                 var marker = L.marker([scope.items[i].loc.coordinates[1], scope.items[i].loc.coordinates[0]]).addTo(map).bindPopup("Source: " + scope.items[i].mac_address_src + " , Tags: " + scope.items[i].tags + " , SSID: " + scope.items[i].ssid + " Signalstrength: " + scope.items[i].signal_strength);
                 lastMarkers.push(marker);
                 }
                 };
                 }
                 */
            }

        }
            ;
    })
;
