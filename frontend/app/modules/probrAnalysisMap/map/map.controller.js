/**
 * Created by gmazlami on 30.07.15.
 */
'use strict'

angular.module('probrAnalysisMap')
    .controller('MapCtrl', function ($scope, $state, $stateParams, Packet) {

        //TODO: avoid hardcoding the initial center coordinates (how to compute them from the data?)
        // initialize the map
        var map = L.map('map').setView([47.3731,8.552033], 12);

        // load a tile layer in order to have a visual representation of the map
        var OpenStreetMap_DE = L.tileLayer('http://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
        	maxZoom: 18,
        	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });
        OpenStreetMap_DE.addTo(map);

        //CAUTION:!!!! longitude and latitude are swapped (since datamodel has swapped them wrongly..)
        var printMarkers = function(count, packets, mymap){
            for(var i = 0; i < count ; i++){
                L.marker([packets[i].longitude, packets[i].latitude]).addTo(mymap).bindPopup("Source: " + packets[i].mac_address_src + " , Tags: " + packets[i].tags + " , SSID: " + packets[i].ssid + " Signalstrength: " + packets[i].signal_strength);
            }
        };

        $scope.pageLength = 50;
        $scope.resource = Packet;

        Packet.query({
                offset: 0,
                limit: $scope.pageLength
            }, function (resultObj) {
                $scope.packetsCount = resultObj.count;
                $scope.packets = resultObj.results;
                printMarkers($scope.pageLength,resultObj.results, map);
            }
        );


    });