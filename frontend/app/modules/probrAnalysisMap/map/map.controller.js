/**
 * Created by gmazlami on 30.07.15.
 */
'use strict'

angular.module('probrAnalysisMap')
    .controller('MapCtrl', function ($scope, $state, $stateParams, Packet) {

        $scope.pageLength = 50;
        $scope.resource = Packet;
        $scope.query = {loc_exists: 'True'};

        $scope.search = function (query) {
            $scope.query = {loc_exists: true, mac_address_src: query.replace(/:/g, '')};
        }


    });