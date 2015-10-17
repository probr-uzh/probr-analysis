'use strict';

angular.module('probrAnalysisMAC')
  .controller('HistoryCtrl', function ($scope, $state, $stateParams, PacketConcurrency) {

    $scope.macaddress = $stateParams["macaddress"];

    PacketConcurrency.query({ mac_address_src: $scope.macaddress },function (resultObj) {
        $scope.chartOptions = {
          scaleShowGridLines: false,
          bezierCurve : false,
          pointDot : false,
          scaleShowLabels: false,
        }

        $scope.weekDataPoints = [[]];
        $scope.weekLabels = [];

        var lastDate;

        var shouldStart = new Date();
        shouldStart.setDate(shouldStart.getDate() - 7);



        resultObj.forEach(function(entry) {
          //populate the line chart
          if(lastDate === undefined){ //this is the first execution of the loop
            lastDate = new Date(entry["_id"]*(1000 * 60 * 60));

            var startDifference = (lastDate.getTime() - shouldStart.getTime()) / (1000 * 60 * 60);

            for(var i=1; i < startDifference ; i++){
              $scope.weekDataPoints[0].push(0);
              $scope.weekLabels.push(new Date(shouldStart.getTime() + (i * 1000 * 60 * 60)));
            }

            $scope.weekDataPoints[0].push(entry["value"]);
            $scope.weekLabels.push(lastDate);

          }else{

            //compute how much hours to fill up with zero values
            var currentDate = new Date(entry["_id"]*(1000 * 60 * 60));
            var timeDiff = currentDate.getTime() - lastDate.getTime();
            var timeDiffHours = timeDiff / (1000 * 60 * 60);

            //fill non-present ours with zeros
            for(var i = 1; i< timeDiffHours; i++){
              $scope.weekDataPoints[0].push(0);
              $scope.weekLabels.push(new Date(lastDate.getTime() + (i * 1000 * 60 * 60)));
            }

            //continue with data
            $scope.weekDataPoints[0].push(entry["value"]);
            $scope.weekLabels.push(currentDate);


            lastDate = currentDate;
          }
        });

        // do the same zero-value padding at the end;

        if(lastDate !== undefined){
          var now = new Date();
          var hourDiff = (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60);

          //fill non-present ours with zeros
          for(var i = 1; i< hourDiff; i++){
            $scope.weekDataPoints[0].push(0);
            $scope.weekLabels.push(new Date(lastDate.getTime() + (i * 1000 * 60 * 60)));
          }
        }


    });


  });
