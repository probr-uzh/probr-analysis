'use strict';

angular.module('probrAnalysisPacketsFilter')
    .config(function ($stateProvider) {
        $stateProvider
            .state('packets', {
                url: '/packets?:startTimestamp&:endTimestamp&:mac_address_src&:ssid&:tags',
                templateUrl: 'app/modules/probrAnalysisPacketsFilter/packets/packets.html',
                controller: 'PacketsCtrl'
            });
        ;
    });
