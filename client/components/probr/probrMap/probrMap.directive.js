'use strict';

angular.module('probrMap', ['leaflet-directive'])
  .directive('probrMap', function () {
    return {
      restrict: 'E',
      scope: {
        geojson: '=geodata',
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
