/**
 * Created by gmazlami on 29.09.15.
 */
'use strict';

angular.module('probrAnalysisCommon')
  .factory('Device', function ($resource) {
    var Device = $resource('api/devices/:packetId/', {packetId: '@_id'},
      {
        count: {method: 'GET', url: 'api/devices/count', isArray: false},
      }
    );
    return Device;
  });
