'use strict';

angular.module('probrMap', [])
    .directive('probrMap', function () {
        return {
            restrict: 'E',
            scope: {
                resource: '=',
                items: '=',
                itemsCount: '=',
                pageLength: '='
            },
            templateUrl: '/static/components/probrMap/map.html',
            controller: function($scope){
                //TODO: avoid hardcoding the initial center coordinates (how to compute them from the data?)
                // initialize the map
                var map = L.map('map').setView([47.3731,8.552033], 12);

                // load a tile layer in order to have a visual representation of the map
                var OpenStreetMap_DE = L.tileLayer('http://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
                    maxZoom: 18,
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                });
                OpenStreetMap_DE.addTo(map);

                var lastMarkers = [];

                $scope.$watch('items', function(newVal, oldVal, scope){
                    if(newVal){
                        if(lastMarkers.length !== 0){
                            for(var k = 0; k < lastMarkers.length; k++){
                                map.removeLayer(lastMarkers[k]);
                            }
                            lastMarkers = [];
                        }

                        var length = (scope.pageLength > scope.itemsCount) ? scope.itemsCount : scope.pageLength;
                        //CAUTION:!!!! longitude and latitude are swapped (since datamodel has swapped them wrongly..)
                        for(var i = 0; i < length ; i++){
                            console.log(scope.items[0])
                            var marker = L.marker([scope.items[i].coordinates.coordinates[0], scope.items[i].coordinates.coordinates[1]]).addTo(map).bindPopup("Source: " + scope.items[i].mac_address_src + " , Tags: " + scope.items[i].tags + " , SSID: " + scope.items[i].ssid + " Signalstrength: " + scope.items[i].signal_strength);
                            lastMarkers.push(marker);
                        };
                    }
                });
            }

        };
    });