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

        resultObj.forEach(function(entry) {
          if(lastDate === undefined){
            $scope.weekDataPoints[0].push(entry["value"]);
            $scope.weekLabels.push(new Date(entry["_id"]*(1000 * 60 * 60)));
            lastDate = new Date(entry["_id"]*(1000 * 60 * 60));
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
