/**
 * Created by gmazlami on 29.09.15.
 */

'use strict';

angular.module('probrAnalysisDevices')
    .controller('DevicesCtrl', function ($scope, $stateParams, $location, DeviceQuery) {

        var query = {};
        query.endTimestamp = $stateParams.endTimestamp;
        query.startTimestamp = $stateParams.startTimestamp;
        query.tags = $stateParams.tags;

        $scope.pageLength = 50;
        $scope.resource = DeviceQuery;

        $scope.isLoading = true;
        DeviceQuery.query(query, function (resultObj) {
                $scope.devices = resultObj;
                $scope.randomizedDevices = [];

                console.log(resultObj);

                var devices = $scope.devices;

                var vendorMap = new Object();
                var vendorList = [];

                var totalCount = 0;

                var currentDate = new Date();

                var lastFiveMinDate = new Date(currentDate.getTime() - 1000 * 60 * 5);
                var lastFiveMinDevices = [];

                var lastHourDate = new Date(currentDate.getTime() - 1000 * 60 * 60);
                var lastHourDevices = [];

                var lastDayDate = new Date(currentDate.getTime() - 1000 * 60 * 60 * 24);
                var lastDayDevices = [];

                devices.forEach(function (element) {

                    if(element.mac_address.match(/.(2|3|6|7|a|b|e|f).{10}/i)){
                        $scope.randomizedDevices.push(element);
                    }

                    var vendor = element.vendor;
                    if (vendor !== undefined) {
                        totalCount++;
                        if (vendorMap[vendor] === undefined) { //vendor not yet encountered --> add new entry to map
                            vendorMap[vendor] = 1;
                            vendorList.push(vendor);
                        } else { //vendor already encountered --> increase count for that vendor
                            vendorMap[vendor] = vendorMap[vendor] + 1;
                        }
                    }

                    var elementDate = new Date(element.last_seen);
                    if (elementDate > lastFiveMinDate) {
                        lastFiveMinDevices.push(element);
                    }
                    if (elementDate > lastHourDate) {
                        lastHourDevices.push(element);
                    }
                    if (elementDate > lastDayDate) {
                        lastDayDevices.push(element);
                    }


                });


                //assign data for lasthour, lastday, lastweek lists
                $scope.lastfivemin = lastFiveMinDevices;
                $scope.lasthour = lastHourDevices;
                $scope.lastday = lastDayDevices;


                var data = [];

                var inverseVendorMap = new Object();

                vendorList.forEach(function (element) {
                    inverseVendorMap[vendorMap[element]] = element;
                    data.push(vendorMap[element]);
                });

                //assign data for pie chart
                $scope.pieLabels = vendorList;
                $scope.pieData = data;

                //compute data for the ranking table
                var sortArray = Object.keys(inverseVendorMap);

                sortArray.reverse();

                var ranking = [];

                for (var i = 0; i < 15; i++) {
                    if (sortArray[i] !== undefined) {
                        var percent = Number(((sortArray[i] / totalCount) * 100).toFixed(1));
                        ranking.push({rank: i + 1, vendor: inverseVendorMap[sortArray[i]], count: sortArray[i], percentage: (percent + " %")});
                    }
                }

                $scope.ranking = ranking;
                $scope.isLoading = false;

            }
        );

    });

