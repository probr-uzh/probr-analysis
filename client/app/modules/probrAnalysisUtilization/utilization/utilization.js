'use strict';

angular.module('probrAnalysisUtilization')
    .config(function ($stateProvider) {
        $stateProvider
            .state('utilization', {
                url: '/utilization',
                templateUrl: 'app/modules/probrAnalysisUtilization/utilization/utilization.html',
                controller: 'UtilizationCtrl'
            });
        ;
    });
