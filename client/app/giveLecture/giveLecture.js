'use strict';

angular.module('twebProject1App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('giveLecture', {
        url: '/giveLecture',
        templateUrl: 'app/giveLecture/giveLecture.html',
        controller: 'GivelectureCtrl',
        authenticate: true
      });
  });