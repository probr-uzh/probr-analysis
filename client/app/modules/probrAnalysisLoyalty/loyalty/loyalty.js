'use strict';

angular.module('probrAnalysisLoyalty')
    .config(function ($stateProvider) {
        $stateProvider
            .state('loyalty', {
                url: '/loyalty',
                templateUrl: 'app/modules/probrAnalysisLoyalty/loyalty/loyalty.html',
                controller: 'LoyaltyCtrl'
            });
        ;
    });
