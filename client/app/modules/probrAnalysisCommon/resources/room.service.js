'use strict';

angular.module('probrAnalysisCommon')
    .factory('Room', function ($resource) {
        var Room = $resource('api/rooms/:id', {id: '@_id'});
        return Room;
    });
