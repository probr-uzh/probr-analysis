'use strict';

angular.module('probrAnalysis')
    .directive('searchInput', function () {
        return {
            restrict: 'EA',
            scope: {
                onSubmit: '&'
            },
            templateUrl: '/static/components/probrPacketSearch/probrPacketSearch.html',
            controller: function ($scope) {

                $scope.fields = ['mac_address_src: ', 'mac_address_dst: ', 'lat: ', 'lon: ', 'tags: ', 'ssid: ', 'signal_strength: ', 'limit', 'offset'];
                $scope.filters = {offset: 0, limit: $scope.pageLength};
                $scope.query = {};

                $scope.submitInput = function () {
                    if ($scope.typeaheadQuery.split(':', 2)[1].length <= 1) return;

                    var params = $scope.typeaheadQuery.split(':', 1);
                    var fieldName = params[0];
                    var fieldContent = $scope.typeaheadQuery.substr($scope.typeaheadQuery.indexOf(':'), $scope.typeaheadQuery.length).replace(/:/g, '').trim();
                    $scope.filters[fieldName] = fieldContent;
                    $scope.typeaheadQuery = '';
                }

                $scope.removeLabel = function (key) {
                    $scope.filters[key] = undefined;
                }

                $scope.search = function () {
                    $scope.query = angular.copy($scope.filters);
                }

                $scope.submitInput = function (query) {
                    $scope.onSubmit({query: query});
                };

            }
        };
    });