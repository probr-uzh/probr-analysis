'use strict';

angular.module('probrAnalysisMACAnalyzer')
    .config(function ($stateProvider) {
        $stateProvider
            .state('analyzer', {
                url: '/analyzer',
                templateUrl: 'app/modules/probrAnalysisMACAnalyzer/analyzer/analyzer.html',
                controller: 'AnalyzerCtrl'
            });
        ;
    });
