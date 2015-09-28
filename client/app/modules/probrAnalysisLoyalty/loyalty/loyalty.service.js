'use strict';

angular.module('probrAnalysisLoyalty')
  .factory('Loyalty', function ($resource) {
    var Loyalty = $resource('api/loyalty/:type', {},
      {
        query: {method: 'GET', isArray: true},
      }
    );
    return Loyalty;
  });
