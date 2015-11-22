'use strict';

angular.module('probrAnalysisDevices')
    .factory('DeviceQuery', function ($resource) {
        var Device = $resource('api/device/query/', {},
            {
                query: {method: 'GET', isArray: true},
            }
        );
        return Device;
    });
