'use strict';

angular.module('probrAnalysis', [
    'ui.router',
    'ui.bootstrap',
    'ngResource',

    // Helper-Module
    'probrAnalysisCommon',

    // Analysis-Module
    'probrAnalysisPacketsFilter',
    'probrAnalysisVendors',
    'probrAnalysisRoomUtilization'

    ])
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $resourceProvider) {
        $urlRouterProvider.otherwise('packets');
        $locationProvider.html5Mode({enabled: true, requireBase: true, rewriteLinks: true});

        $resourceProvider.defaults.stripTrailingSlashes = false;
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    })

    .run(function ($rootScope, resourceSocket) {
        resourceSocket.connect();
    })
;
