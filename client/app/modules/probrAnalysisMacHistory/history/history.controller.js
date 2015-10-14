'use strict';

angular.module('probrAnalysisMacHistory')
  .controller('MacHistoryCtrl', function ($scope, $state, $stateParams, Socket, $cookies) {

    $scope.macaddress = $stateParams["macaddress"];


  });
