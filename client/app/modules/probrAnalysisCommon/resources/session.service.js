'use strict';

angular.module('probrAnalysisCommon')
  .factory('Session', function ($resource) {
    var Session = $resource('api/sessions/:packetId/', {packetId: '@_id'},
      {
        count: {method: 'GET', url: 'api/sessions/count', isArray: false},
      }
    );
    return Session;
  });
