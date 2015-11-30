'use strict';

angular.module('probrAnalysisPacketsFilter')
    .factory('PacketQuery', function ($resource) {
        var PacketQuery = $resource('api/packet/query/', {},
            {
                query: {method: 'GET', isArray: true},
                count: {method: 'GET', url: 'api/packet/countquery', isArray: false},

            }
        );
        return PacketQuery;
    });
