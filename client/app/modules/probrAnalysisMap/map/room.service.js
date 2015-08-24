'use strict';

angular.module('probrAnalysisMap')
    .factory('Room', function ($resource) {
        var Room = $resource('api/rooms/:id', {id: '@_id'});
        return Room;
    });
