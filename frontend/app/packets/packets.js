'use strict';

angular.module('probrAnalysis')
    .config(function ($stateProvider) {
        $stateProvider
            .state('packets', {
                url: '/packets',
                templateUrl: '/static/app/packets/packets.html',
                controller: 'PacketsCtrl'
            })
            .state('packets-mac-search', {
                url: '/mac-search',
                templateUrl: '/static/app/packets/packets-mac-search.html',
                controller: 'PacketsMACSearchCtrl'
            });
        ;
    });