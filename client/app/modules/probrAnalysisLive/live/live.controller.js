'use strict';

angular.module('probrAnalysisLive')
    .controller('LiveCtrl', function ($scope, Socket, LiveCount) {

        //Packets
        $scope.livePackets = [];

        Socket.listenTo('packet:create', function (packet) {
            packet.time = new Date(packet.time["$date"]);
            if ($scope.livePackets.length < 20) {
                $scope.livePackets.unshift(packet);
            } else {
                $scope.livePackets.pop();
                $scope.livePackets.unshift(packet);

            }
        });


        var MAX_DISPLAY = 20;


        LiveCount.lastFive({}, function (resultObj) {
            $scope.lastfivemin = resultObj.slice(0,MAX_DISPLAY);
            $scope.notDisplayedMin = resultObj.length - MAX_DISPLAY;

        });


        LiveCount.lastHour({}, function (resultObj) {
            $scope.lasthour = resultObj.slice(0,MAX_DISPLAY);
            $scope.notDisplayedHour = resultObj.length - MAX_DISPLAY;
        });


        LiveCount.lastDay({}, function (resultObj) {
            $scope.lastday = resultObj.slice(0,MAX_DISPLAY);
            $scope.notDisplayedDay = resultObj.length - MAX_DISPLAY;
        });


    });
