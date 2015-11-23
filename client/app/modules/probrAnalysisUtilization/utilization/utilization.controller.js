'use strict';

angular.module('probrAnalysisUtilization')
  .controller('UtilizationCtrl', function ($scope, $filter, $location, SessionConcurrency, Loyalty) {

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

    $scope.isLoading = true;
    if ($location.search().endTimestamp - $location.search().startTimestamp < (1000 * 60 * 60 * 24)) {
      $scope.options.axes = {x: {type: "date", ticksFormat: "%H:%M", ticks: 24, ticksInterval: d3.time.hour}};
    } else {
      $scope.options.axes = {x: {type: "date", ticksFormat: "%a %d, %H:%M", ticks: 7, ticksInterval: d3.time.day}};
    }

    var sessionQuery = {
      startTimestamp : $location.search().startTimestamp,
      endTimestamp : $location.search().endTimestamp,
      tags : $location.search().tags
    };

    SessionConcurrency.query(sessionQuery, function (result, err) {
      $scope.data = [];

      result.forEach(function (entry) {
        $scope.data.push({x: new Date(entry["_id"]), val_0: entry["value"]})
      });

      $scope.isLoading = false;

    });

    Loyalty.query(sessionQuery, function (result, err) {
      $scope.histogramDataPoints = [[]];
      $scope.histogramLabels = [];

      result.forEach(function (entry) {
        $scope.histogramDataPoints[0].push(entry["count"]);
        $scope.histogramLabels.push(entry["_id"]);
        //console.log($scope.histogramLabels)
      });
    });

  });

