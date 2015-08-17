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
      templateUrl: 'components/probr/probrMap/probrMap.html',
      controller: function ($scope, leafletBoundsHelpers) {

        $scope.geojson = {
          data: [
            {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  id: "JPN",
                  properties: {
                    name: "Japan"
                  },
                  geometry: {
                    type: "MultiPolygon",
                    coordinates: [
                      [[[8.549658, 47.414515],
                        [8.549651, 47.414485],
                        [8.549587, 47.414488],
                        [8.549590, 47.414514]]]]
                  }
                }]
            }],
          style: {
            fillColor: "green",
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
          }
        };

        $scope.bounds = leafletBoundsHelpers.createBoundsFromArray([[47.414512, 8.549658], [47.414481, 8.549587]]);
        $scope.layers = {
          baselayers: {
            googleRoadmap: {
              name: 'Google Streets',
              layerType: 'ROADMAP',
              type: 'google',
              layerOptions: {minZoom: 18, maxZoom: 22, maxNativeZoom: 22}
            }
          }
        };

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
