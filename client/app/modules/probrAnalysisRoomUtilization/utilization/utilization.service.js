'use strict';

angular.module('probrAnalysisRoomUtilization')
  .factory('Utilization', function ($resource) {
    var Utilization = $resource('api/utilization/:type', {},
      {
        query: {method: 'GET', isArray: true},
      }
    );
    return Utilization;
  });
