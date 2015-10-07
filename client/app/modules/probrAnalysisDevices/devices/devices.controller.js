/**
 * Created by gmazlami on 29.09.15.
 */

'use strict';

angular.module('probrAnalysisDevices')
  .controller('DevicesCtrl', function ($scope, $state, $stateParams, Device) {

    $scope.pageLength = 50;
    $scope.query = {};
    $scope.resource = Device;

    Device.query({
      }, function (resultObj) {
        $scope.devices = resultObj;

        var devices = $scope.devices;

        var vendorMap = new Object();
        var vendorList = [];

        var totalCount = 0;

        var currentDate = new Date();

        var lastHourDate = new Date();
        lastHourDate.setHours(currentDate.getHours() - 1);
        var lastHourDevices = [];

        var lastDayDate = new Date();
        lastDayDate.setDate(currentDate.getDate() - 1);
        var lastDayDevices = [];

        var lastWeekDate = new Date();
        lastWeekDate.setDate(currentDate.getDate() - 7);
        var lastWeekDevices = [];

        devices.forEach(function(element){
          var vendor = element.vendor;
          if(vendor !== undefined){
            totalCount++;
            if(vendorMap[vendor] === undefined){ //vendor not yet encountered --> add new entry to map
              vendorMap[vendor] = 1;
              vendorList.push(vendor);
            }else{ //vendor already encountered --> increase count for that vendor
              vendorMap[vendor] = vendorMap[vendor] + 1;
            }
          }

          var elementDate = new Date(element.last_seen);
          if(elementDate > lastHourDate){
            lastHourDevices.push(element);
          }
          if(elementDate > lastDayDate){
            lastDayDevices.push(element);
          }
          if(elementDate > lastWeekDate){
            lastWeekDevices.push(element);
          }

        });


        //assign data for lasthour, lastday, lastweek lists
        $scope.lasthour = lastHourDevices;
        $scope.lastday = lastDayDevices;
        $scope.lastweek = lastWeekDevices;

        var data = [];

        var inverseVendorMap = new Object();

        vendorList.forEach(function(element){
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

        for(var i=0; i < 15 ; i++){
          var percent = Number(((sortArray[i] / totalCount) * 100).toFixed(1));
          ranking.push({rank: i+1, vendor: inverseVendorMap[sortArray[i]] , count: sortArray[i], percentage: (percent + " %")});
        }

        $scope.ranking = ranking;

      }
    );

  });

