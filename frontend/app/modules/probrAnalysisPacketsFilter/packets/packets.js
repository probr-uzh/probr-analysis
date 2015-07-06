'use strict';

angular.module('probrAnalysisPacketsFilter')
    .config(function ($stateProvider) {
        $stateProvider
            .state('packets', {
                url: '/packets',
                templateUrl: '/static/app/modules/probrAnalysisPacketsFilter/packets/packets.html',
                controller: 'PacketsCtrl'
            })
            .state('packets-mac-search', {
                url: '/mac-search',
                templateUrl: '/static/app/modules/probrAnalysisPacketsFilter/packets/packets-mac-search.html',
                controller: 'PacketsMACSearchCtrl'
            });
        ;
    });