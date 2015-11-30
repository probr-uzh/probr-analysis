'use strict';

angular.module('probrAnalysisPacketsFilter')
    .config(function ($stateProvider) {
        $stateProvider
            .state('packets', {
                url: '/packets?:startTimestamp&:endTimestamp&:tags',
                templateUrl: 'app/modules/probrAnalysisPacketsFilter/packets/packets.html',
                controller: 'PacketsCtrl'
            });
        ;
    });
