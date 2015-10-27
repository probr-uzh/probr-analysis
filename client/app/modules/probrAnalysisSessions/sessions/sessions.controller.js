'use strict';

angular.module('probrAnalysisSessions')
  .controller('SessionsCtrl', function ($scope, $state, $stateParams, $filter, Session, SessionConcurrency) {

    $scope.datePickerDate = {startDate: new Date().getTime(), endDate: new Date().getTime() - (1000 * 60 * 60 * 24)};

    $scope.options = {
      axes: {x: {type: "date", ticksFormat: "%H:%M", ticks: 24, ticksInterval: d3.time.hour}},
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

      if ($scope.datePickerDate.endDate.valueOf() - $scope.datePickerDate.startDate.valueOf() < (1000 * 60 * 60 * 24)) {
        $scope.options.axes = {x: {type: "date", ticksFormat: "%H:%M", ticks: 24, ticksInterval: d3.time.hour}};
      } else {
        $scope.options.axes = {x: {type: "date", ticksFormat: "%H:%M", ticks: 7, ticksInterval: d3.time.day}};
      }

      SessionConcurrency.query({start: $scope.datePickerDate.startDate.valueOf(), end: $scope.datePickerDate.endDate.valueOf(), tags: $scope.tags}, function (result, err) {
        $scope.data = [];

        result.forEach(function (entry) {
          $scope.data.push({x: new Date(entry["_id"]), val_0: entry["value"]})
        });

      });

    }

    $scope.query();

  });

