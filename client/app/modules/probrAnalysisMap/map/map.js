'use strict';

angular.module('probrAnalysisMap')
    .config(function ($stateProvider) {
        $stateProvider
            .state('map', {
                url: '/map',
                templateUrl: 'app/modules/probrAnalysisMap/map/map.html',
                controller: 'MapCtrl'
            });
        ;
    });