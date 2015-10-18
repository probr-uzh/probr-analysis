'use strict';

angular.module('probrAnalysisMAC')
  .factory('PacketConcurrency', function ($resource) {
    var PacketConcurrency = $resource('api/packet/concurrency_count', {},
      {
        query: {method: 'GET', isArray: true},
      }
    );
    return PacketConcurrency;
  });

angular.module('probrAnalysisMAC')
  .factory('PunchcardData', function ($resource) {
    var PunchcardData = $resource('api/packet/punchcard_data', {},
      {
        query: {method: 'GET', isArray: true},
      }
    );
    return PunchcardData;
  });
