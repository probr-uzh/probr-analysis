'use strict';

angular.module('probrAnalysisSessions')
  .controller('SessionsCtrl', function ($scope, $state, $stateParams, Session, SessionConcurrency) {

    $scope.pageLength = 50;
    $scope.query = {};
    $scope.resource = Session;
    $scope.filters = {skip: 0, limit: $scope.pageLength};
    SessionConcurrency.query({type:"week"}, function (result, err) {
      $scope.chartOptions = {
        scaleShowGridLines: false,
        bezierCurve : false,
        pointDot : false,
        scaleShowLabels: false,
      }
      $scope.weekDataPoints = [[]];
      $scope.weekLabels = [];


      result.forEach(function(entry) {
        $scope.weekDataPoints[0].push(entry["value"]);
        $scope.weekLabels.push(new Date(entry["_id"]*(1000 * 60 * 60)));
      });
    });

    SessionConcurrency.query({type:"day"}, function (result, err) {
      $scope.chartOptions = {
        scaleShowGridLines: false,
        bezierCurve : false,
        pointDot : false,
        showLabels: false,
      }
      $scope.dayDataPoints = [[]];
      $scope.dayLabels = [];


      result.forEach(function(entry) {
        $scope.dayDataPoints[0].push(entry["value"]);
        $scope.dayLabels.push(new Date(entry["_id"]*(1000 * 60 * 5)));
      });
    });

    Session.query({
        skip: 0,
        limit: $scope.pageLength
      }, function (resultObj) {
        $scope.sessions = resultObj;
      }
    );
  });

