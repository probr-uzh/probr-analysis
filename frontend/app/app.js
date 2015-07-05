'use strict';

angular.module('probrAnalysis', [
    'probrAnalysisFilters',
    'ui.router',
    'ui.bootstrap',
    'ngResource',
    'angular-websocket',
    'chart.js'
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
