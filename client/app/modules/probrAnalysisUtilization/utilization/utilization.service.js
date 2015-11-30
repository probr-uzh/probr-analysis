'use strict';

angular.module('probrAnalysisUtilization')
    .factory('SessionConcurrency', function ($resource) {
        var SessionConcurrency = $resource('api/session/reduce/', {},
            {
                query: {method: 'GET', isArray: true},
            }
        );
        return SessionConcurrency;
    });

angular.module('probrAnalysisUtilization')
  .factory('Loyalty', function ($resource) {
    var Loyalty = $resource('api/loyalty/histogram', {},
      {
        query: {method: 'GET', isArray: true},
      }
    );
    return Loyalty;
  });
