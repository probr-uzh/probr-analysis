'use strict';

angular.module('probrAnalysisUtilization')
    .controller('UtilizationCtrl', function ($scope, $state, $stateParams, $filter, Session, SessionConcurrency, Loyalty) {
        $scope.isLoadingSession = true;
        $scope.isLoadingLoyalty = true;

        $scope.sessionBarChartOptions = {
            axes: {x: {type: "date", ticksFormat: "%H:%M", ticks: 24, ticksInterval: d3.time.hour}},
            stacks: [{axis: "y", series: ["id_0"]}],
            lineMode: "cardinal",
            series: [{
                id: "id_0",
                y: "val_0",
                label: "Number of sessions",
                type: "column",
                color: "#1f77b4"
            }]
        };

        $scope.loyaltyBarChartOptions = {
            axes: {x: {type: "linear", ticksFormat: ".0f"}},
            stacks: [{axis: "y", series: ["id_0"]}],
            lineMode: "cardinal",
            series: [{
                id: "id_0",
                y: "val_0",
                label: "Number of devices",
                type: "column",
                color: "#771fb4"
            }]
        };


        if ($stateParams.endTimestamp - $stateParams.startTimestamp < (1000 * 60 * 60 * 24)) {
            $scope.sessionBarChartOptions.axes = {x: {type: "date", ticksFormat: "%H:%M", ticks: 24, ticksInterval: d3.time.hour}};
        } else {
            $scope.sessionBarChartOptions.axes = {x: {type: "date", ticksFormat: "%a %d, %H:%M", ticks: 7, ticksInterval: d3.time.day}};
        }

        var sessionQuery = {
            startTimestamp: $stateParams.startTimestamp,
            endTimestamp: $stateParams.endTimestamp,
            tags: $stateParams.tags
        };

        SessionConcurrency.query(sessionQuery, function (result, err) {
            $scope.sessionData = [];

            result.forEach(function (entry) {
                $scope.sessionData.push({x: new Date(entry["_id"]), val_0: entry["value"]})
            });

            $scope.isLoadingSession = false;

        });

        Loyalty.query(sessionQuery, function (result, err) {

            $scope.loyaltyData = [];

            result.forEach(function (entry) {
                $scope.loyaltyData.push({x: entry["_id"], val_0: entry["count"]})
            });

            $scope.isLoadingLoyalty = false;
        });

    });

