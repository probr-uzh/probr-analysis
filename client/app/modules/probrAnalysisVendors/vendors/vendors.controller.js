'use strict';

angular.module('probrAnalysisVendors')
    .controller('VendorsCtrl', function ($scope, $state, $stateParams, $http) {

        $scope.isLoading = true;
        $scope.populationData = undefined;

        $http.get('/api/vendors').
            success(function (data, status, headers, config) {
                var populationData = {'_id': 'Device Vendors', children: data};
                $scope.populationData = populationData;
                $scope.isLoading = false;
            }).
            error(function (data, status, headers, config) {

            });

    });
;
