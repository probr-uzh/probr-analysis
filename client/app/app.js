'use strict';

angular.module('probrAnalysisApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  'angular.filter',

  // Helper-Module
  'probrAnalysisCommon',

  // Analysis-Module
  'probrAnalysisPacketsFilter',
  'probrAnalysisVendors',
  'probrAnalysisRoomUtilization',
  'probrAnalysisLoyalty',
  'probrAnalysisMap',
  'probrAnalysisMACAnalyzer',
  'probrAnalysisSessions',
  'probrAnalysisDevices',

])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/packets');
    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function (response) {
        if (response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function ($rootScope, $location, Auth, $window) {

    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function (loggedIn) {
        if (next.authenticate && !loggedIn) {
          event.preventDefault();
          $location.path('/login');
        }
      });
    });

    $rootScope.$on("updatePositions", function () {
      if ($('.stretch').length > 0) {
        var height = $(window).height() - $('.stretch')[0].getBoundingClientRect().top;
        $('.stretch').css({'height': height, 'min-height': height});
      }
    });


  });
