'use strict';

angular.module('probrAnalysisLive')
    .factory('LiveCount', function ($resource) {
        var LiveCount = $resource('api/device', {},
            {
                lastFive: {method: 'GET', url: 'api/device/lastFive', isArray: true},
                lastHour: {method: 'GET', url: 'api/device/lastHour', isArray: true},
                lastDay: {method: 'GET', url: 'api/device/lastDay', isArray: true},

            }
        );
        return LiveCount;
    });
