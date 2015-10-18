'use strict';

angular.module('probrAnalysisCommon')
    .factory('Location', function ($resource) {
        var Location = $resource('api/locations/:locationId/', {locationId: '@_id'},
            {
                count: {method: 'GET', url: 'api/locations/count', isArray: false},
            }
        );
        return Location;
    });
