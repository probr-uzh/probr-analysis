'use strict';

angular.module('probrAnalysisSessions')
  .controller('SessionsCtrl', function ($scope, $state, $stateParams, Session) {

    $scope.pageLength = 50;
    $scope.query = {};
    $scope.resource = Session;
    $scope.filters = {skip: 0, limit: $scope.pageLength};

    Session.query({
        skip: 0,
        limit: $scope.pageLength
      }, function (resultObj) {
        $scope.sessions = resultObj;
      }
    );
  });

