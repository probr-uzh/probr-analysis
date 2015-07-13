'use strict';

angular.module('probrAnalysisVendors')
    .controller('VendorsCtrl', function ($scope, $state, $stateParams, $http) {

        $scope.populationData = undefined;

        $http.get('/api/vendors').
            success(function (data, status, headers, config) {
                var populationData = {'_id': 'Device Vendors', children: data};
                $scope.populationData = populationData;
            }).
            error(function (data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });

    });
;
