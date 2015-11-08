'use strict';

angular.module('probrAnalysisMap')
    .config(function ($stateProvider) {
        $stateProvider
            .state('heatmap', {
                url: '/heatmap',
                templateUrl: 'app/modules/probrAnalysisMap/map/map.html',
                controller: 'MapCtrl'
            });
        ;
    });