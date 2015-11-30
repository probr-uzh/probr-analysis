'use strict';

angular.module('probrAnalysisPacketsFilter')
    .factory('PacketQuery', function ($resource) {
        var PacketQuery = $resource('api/packets/?query=:query', {},
            {
                query: {method: 'GET', isArray: true},
                count: {method: 'GET', url: 'api/packets/count?query=:query', isArray: false},

            }
        );
        return PacketQuery;
    });
