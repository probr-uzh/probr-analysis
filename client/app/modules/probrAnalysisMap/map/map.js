'use strict';

angular.module('probrAnalysisMap')
    .config(function ($stateProvider) {
        $stateProvider
            .state('heatmap', {
                url: '/heatmap?:startTimestamp&:endTimestamp&:tags&:mac_address',
                templateUrl: 'app/modules/probrAnalysisMap/map/map.html',
                controller: 'MapCtrl'
            });
        ;
    });
