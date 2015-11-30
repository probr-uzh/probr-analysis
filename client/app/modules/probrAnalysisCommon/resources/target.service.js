'use strict';

angular.module('probrAnalysisCommon')
    .factory('Target', function ($resource) {
        var Target = $resource('api/targets/:targetId/', {packetId: '@_id'},
            {
                count: {method: 'GET', url: 'api/targets/count', isArray: false},
            }
        );
        return Target;
    });
