'use strict';

angular.module('probrAnalysisMAC')
  .controller('HistoryCtrl', function ($scope, $state, $stateParams, PacketConcurrency, PunchcardData) {

    $scope.macaddress = $stateParams["macaddress"];

    $scope.lineHidden = false;
    $scope.cardHidden = true;

    $scope.toggleLine = function() {
      $scope.lineHidden = false;
      $scope.cardHidden = true;
    }

    $scope.toggleCard = function(){
      $scope.lineHidden = true;
      $scope.cardHidden = false;
    }



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

    PunchcardData.query({mac_address_src: $scope.macaddress },function (resultObj){


      //intialize the array for the days
      var dayList = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

      $scope.days = [];



      //initialize the punchcard data with zeros
      var punchCardData = [];
      for(var i=0 ; i < 7 ; i++){
        punchCardData[i] = new Array(24);
        for(var k = 0 ; k < 24 ; k++){
          punchCardData[i][k]= 0;
        }
      }


      resultObj.forEach(function(entry){
        var day = entry["_id"].split("_")[0];
        var hour = entry["_id"].split("_")[1];
        punchCardData[day-1][hour] = entry["value"];
      });


      $scope.punchCardData = [];

      //find out at which day punchcard starts
      var startDay = (new Date()).getDay();

      var k=0;
      for( var i = 0 ; i < 7 ; i++ ){
        var dayIndex = (startDay + i) % 7;
        var dayName ;
        if(dayIndex === 0){
          dayName = "Sunday";
          dayIndex = 7;
        }else{
          dayName = dayList[dayIndex-1];
        }
        $scope.days.push(dayName);
        $scope.punchCardData.push(punchCardData[dayIndex-1]);

      }

      console.log($scope.punchCardData);

    });

  });
