/**
 * Created by gmazlami on 29.09.15.
 */
'use strict';

angular.module('probrAnalysisCommon')
  .factory('Device', function ($resource) {
    var Session = $resource('api/devices/:packetId/', {packetId: '@_id'},
      {
        count: {method: 'GET', url: 'api/devices/count', isArray: false},
      }
    );
    return Session;
  });
