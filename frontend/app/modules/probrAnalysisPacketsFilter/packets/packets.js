'use strict';

angular.module('probrAnalysisPacketsFilter')
    .config(function ($stateProvider) {
        $stateProvider
            .state('packets', {
                url: '/packets',
                templateUrl: '/static/app/modules/probrAnalysisPacketsFilter/packets/packets.html',
                controller: 'PacketsCtrl'
            });
        ;
    });