/**
 * Created by gmazlami on 30.07.15.
 */
'use strict'

angular.module('probrAnalysisMap')
    .controller('MapCtrl', function ($scope, $state, $stateParams, Packet) {

        $scope.pageLength = 50;
        $scope.resource = Packet;

        Packet.query({
                offset: 0,
                limit: $scope.pageLength
            }, function (resultObj) {
                $scope.packetsCount = resultObj.count;
                $scope.packets = resultObj.results;
            }
        );

      // initialize the map
      var map = L.map('map').setView([42.35, -71.08], 13);

      // load a tile layer
      L.tileLayer('http://tiles.mapc.org/basemap/{z}/{x}/{y}.png',
        {
          attribution: 'Tiles by <a href="http://mapc.org">MAPC</a>, Data by <a href="http://mass.gov/mgis">MassGIS</a>',
          maxZoom: 17,
          minZoom: 9
        }).addTo(map);



      map.invalidateSize();

    });