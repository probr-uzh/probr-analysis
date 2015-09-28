'use strict';

angular.module('probrAnalysisMACAnalyzer')
  .controller('AnalyzerCtrl', function ($scope, $state, $stateParams, Socket) {

    $scope.packets = [];
    $scope.watchedAddresses = [];

    $scope.addMAC = function() {
      var address = $scope.macInput;

      Socket.listenTo('packet:' + address, function (packet) {
        $scope.packets.push(packet);
      });

      $scope.watchedAddresses.push(address);
      $scope.macInput = '';

    }

    $scope.removeMAC = function(address) {
      Socket.unlistenTo('packet:' + address);

      $scope.packets.splice(_.findIndex($scope.packets, function (packet) {
        return packet.mac_address_src === address;
      }), 1);

      $scope.watchedAddresses.splice($scope.watchedAddresses.indexOf(address) , 1);
    }

  });

