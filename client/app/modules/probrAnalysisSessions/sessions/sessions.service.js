'use strict';

angular.module('probrAnalysisSessions')
    .factory('SessionConcurrency', function ($resource) {
        var SessionConcurrency = $resource('api/session/reduce/', {},
            {
                query: {method: 'GET', isArray: true},
            }
        );
        return SessionConcurrency;
    });
