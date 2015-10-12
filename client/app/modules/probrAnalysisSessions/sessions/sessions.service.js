'use strict';

angular.module('probrAnalysisSessions')
  .factory('SessionConcurrency', function ($resource) {
    var SessionConcurrency = $resource('api/session/concurrency_count/:type', {},
      {
        query: {method: 'GET', isArray: true},
      }
    );
    return SessionConcurrency;
  });
