'use strict';

angular.module('twebProject1App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('attendLecture', {
        url: '/attendLecture',
        templateUrl: 'app/attendLecture/attendLecture.html',
        controller: 'AttendlectureCtrl',
        authenticate: true
      });
  });