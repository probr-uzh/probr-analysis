'use strict';

angular.module('probrAnalysisApp')
  .directive('probrSearch', function () {
    return {
      restrict: 'E',
      scope: {
        onSubmit: '&',
        pageLength: '=',
        query: '=',
        fields: '='
      },
      templateUrl: 'components/probr/probrSearch/probrSearch.html',
      link: function ($scope, element, attrs) {

        $scope.submitInput = function () {
          if ($scope.typeaheadQuery.split(':', 2)[1] === undefined || $scope.typeaheadQuery.split(':', 2)[1].length <= 1) return;

          var params = $scope.typeaheadQuery.split(':', 1);
          var fieldName = params[0];
          var fieldContent = $scope.typeaheadQuery.substr($scope.typeaheadQuery.indexOf(':'), $scope.typeaheadQuery.length).replace(/:/g, '').trim();

          if(fieldName === 'tags'){
            return;
          }

          $scope.query[fieldName] = fieldContent;
          $scope.typeaheadQuery = '';
        }

        $scope.removeLabel = function (key) {
          delete $scope.query[key];
          $scope.search();
        }

        $scope.search = function () {
          $scope.onSubmit({query: angular.copy($scope.query)});
        }

      }
    };
  });
