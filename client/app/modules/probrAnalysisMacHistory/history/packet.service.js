'use strict';

angular.module('probrAnalysisMacHistory')
  .factory('PacketConcurrency', function ($resource) {
    var PacketConcurrency = $resource('api/packet/concurrency_count', {},
      {
        query: {method: 'GET', isArray: true},
      }
    );
    return PacketConcurrency;
  });
