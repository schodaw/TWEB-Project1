'use strict';

angular.module('twebProject1App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('display', {
        url: '/display',
        templateUrl: 'app/display/display.html',
        controller: 'DisplayCtrl'
      });
  });