'use strict';

angular.module('probrAnalysisSessions')
  .controller('SessionsCtrl', function ($scope, $state, $stateParams, $filter, Session, SessionConcurrency) {

    $scope.query = function () {

      SessionConcurrency.query({daysFactor: 7, tags: $scope.tags}, function (result, err) {

        $scope.chartOptions = {
          scaleShowGridLines: false,
          bezierCurve: false,
          pointDot: false,
          scaleShowLabels: false,
        }
        $scope.weekDataPoints = [[]];
        $scope.weekLabels = [];

        result.forEach(function (entry) {
          $scope.weekDataPoints[0].push(entry["value"]);
          $scope.weekLabels.push($filter('date')(new Date(entry["_id"] * (1000 * 60 * 20 * 7)), "short"));
        });
      });

      SessionConcurrency.query({daysFactor: 1, tags: $scope.tags}, function (result, err) {
        $scope.chartOptions = {
          scaleShowGridLines: false,
          bezierCurve: false,
          pointDot: false,
          showLabels: false,
        }
        $scope.dayDataPoints = [[]];
        $scope.dayLabels = [];


        result.forEach(function (entry) {
          $scope.dayDataPoints[0].push(entry["value"]);
          $scope.dayLabels.push($filter('date')(new Date(entry["_id"] * (1000 * 60 * 20 * 1)), "short"));
        });
      });
    };

    $scope.query();
  });

