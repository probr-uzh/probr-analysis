'use strict';

angular.module('probrAnalysisSessions')
  .controller('SessionsCtrl', function ($scope, $state, $stateParams, $filter, Session, SessionConcurrency) {

    // n3-line charts
    $scope.optionsWeek = {
      axes: {x: {type: "date", ticksFormat: "%A", ticksInterval: d3.time.day}},
      stacks: [{axis: "y", series: ["id_0"]}],
      lineMode: "cardinal",
      series: [{
        id: "id_0",
        y: "val_0",
        label: "Sessions",
        type: "column",
        color: "#1f77b4"
      }]
    };

    $scope.optionsDay = {
      axes: {x: {type: "date", ticksFormat: "%H:%M", ticks: 12, ticksInterval: d3.time.hour}},
      stacks: [{axis: "y", series: ["id_0"]}],
      lineMode: "cardinal",
      series: [{
        id: "id_0",
        y: "val_0",
        label: "Sessions",
        type: "column",
        color: "#1f77b4"
      }]
    };

    $scope.query = function () {
      SessionConcurrency.query({days: 7, tags: $scope.tags}, function (result, err) {
        $scope.dataWeek = [];

        result.forEach(function (entry) {
          $scope.dataWeek.push({x: new Date(entry["_id"]), val_0: entry["value"]})
        });

      });


      SessionConcurrency.query({days: 1}, function (result, err) {
        $scope.dataDay = [];

        result.forEach(function (entry) {
          $scope.dataDay.push({x: new Date(entry["_id"]), val_0: entry["value"]})
        });

      });
    }

    $scope.query();

  });

