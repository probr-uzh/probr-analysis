'use strict';

angular.module('probrAnalysisLoyalty')
  .factory('Loyalty', function ($resource) {
    var Loyalty = $resource('api/loyalty/histogram', {},
      {
        query: {method: 'GET', isArray: true},
      }
    );
    return Loyalty;
  });
