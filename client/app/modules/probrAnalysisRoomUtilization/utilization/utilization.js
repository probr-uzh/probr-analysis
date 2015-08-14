'use strict';

angular.module('probrAnalysisRoomUtilization')
    .config(function ($stateProvider) {
        $stateProvider
            .state('utilization', {
                url: '/utilization',
                templateUrl: 'app/modules/probrAnalysisRoomUtilization/utilization/utilization.html',
                controller: 'UtilizationCtrl'
            });
        ;
    });