'use strict';

angular.module('probrAnalysisCommon')
    .factory('Packet', function ($resource) {
        var Packet = $resource('api/packets/:packetId/', {packetId: '@_id'},
            {
                count: {method: 'GET', url: 'api/packets/count', isArray: false},
            }
        );
        return Packet;
    });
