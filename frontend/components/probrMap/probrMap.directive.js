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

                $scope.$watch('items', function(newVal, oldVal, scope){
                    if(newVal){
                        //CAUTION:!!!! longitude and latitude are swapped (since datamodel has swapped them wrongly..)
                        for(var i = 0; i < $scope.pageLength ; i++){
                            L.marker([$scope.items[i].longitude, $scope.items[i].latitude]).addTo(map).bindPopup("Source: " + $scope.items[i].mac_address_src + " , Tags: " + $scope.items[i].tags + " , SSID: " + $scope.items[i].ssid + " Signalstrength: " + $scope.items[i].signal_strength);
                        };
                    }
                });
            }

        };
    });