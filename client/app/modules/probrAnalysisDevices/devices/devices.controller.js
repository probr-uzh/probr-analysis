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
        });

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

        //sortArray.sort();
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

