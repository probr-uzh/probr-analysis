'use strict';

angular.module('probrAnalysisLive')
  .controller('LiveCtrl', function ($scope, Socket, Device) {


    //Packets

    $scope.livePackets = [];

    Socket.listenTo('packet:create', function (packet) {
      packet.time = new Date(packet.time["$date"]);
      if($scope.livePackets.length < 20){
        $scope.livePackets.unshift(packet);
      }else{
        $scope.livePackets.pop();
        $scope.livePackets.unshift(packet);

      }
    });



    // Devices

    $scope.pageLength = 50;
    $scope.query = {};
    $scope.resource = Device;

    Device.query({
    }, function(resultObj){
      var devices = resultObj;

      var currentDate = new Date();

      var lastFiveMinDate = new Date(currentDate.getTime()-1000*60*5);
      $scope.lastFiveMinDevices = [];

      var lastHourDate = new Date(currentDate.getTime()-1000*60*60);
      $scope.lastHourDevices = [];

      var lastDayDate = new Date(currentDate.getTime()-1000*60*60*24);
      $scope.lastDayDevices = [];

      $scope.notDisplayedMin = 0;
      $scope.notDisplayedHour = 0;
      $scope.notDisplayedDay = 0;

      var MAX_DISPLAY = 20;

      devices.forEach(function(element){
        var elementDate = new Date(element.last_seen);
        if(elementDate > lastFiveMinDate){
          if($scope.lastFiveMinDevices.length < MAX_DISPLAY){
            $scope.lastFiveMinDevices.push(element);
          }else{
            $scope.notDisplayedMin++;
          }
        }
        if(elementDate > lastHourDate){
          if($scope.lastHourDevices.length < MAX_DISPLAY){
            $scope.lastHourDevices.push(element);
          }else{
            $scope.notDisplayedHour++;
          }
        }
        if(elementDate > lastDayDate){
          if($scope.lastDayDevices.length < MAX_DISPLAY){
            $scope.lastDayDevices.push(element);
          }else{
            $scope.notDisplayedDay++;
          }
        }
      });




    });


  });
