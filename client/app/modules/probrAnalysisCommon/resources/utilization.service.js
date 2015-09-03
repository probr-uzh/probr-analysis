'use strict';

angular.module('probrAnalysisCommon')
    .factory('Utilizations', function ($resource) {
        var Utilizations = $resource('api/utilizations/:utilizationId/', {utilizationId: '@_id'},
            {
                count: {method: 'GET', url: 'api/utilizations/count', isArray: false},
            }
        );
        return Utilizations;
    });
