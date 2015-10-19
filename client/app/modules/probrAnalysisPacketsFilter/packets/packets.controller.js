'use strict';

angular.module('probrAnalysisPacketsFilter')
    .controller('PacketsCtrl', function ($scope, $state, $stateParams, Packet, Socket) {

        $scope.archiveHidden = false;
        $scope.liveHidden = true;

        $scope.toggleArchive = function () {
          $scope.archiveHidden = false;
          $scope.liveHidden = true;
        }

        $scope.toggleLive = function () {
          $scope.archiveHidden = true;
          $scope.liveHidden = false;
        }

        $scope.fields = ['mac_address_src: ', 'mac_address_dst: ', 'lat: ', 'lon: ', 'tags: ', 'ssid: ', 'signal_strength: '];
        $scope.newPackets = 0;
        $scope.pageLength = 100;
        $scope.resource = Packet;

        $scope.params = {skip: 0, limit: $scope.pageLength, sort: "-time"};
        $scope.query = {};

        Socket.listenTo('packet:create', function (item) {
            $scope.newPackets++;
        });

        $scope.submit = function (query) {
            $scope.query = query;
        }

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

    });

