'use strict';

angular.module('twebProject1App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('display_student', {
        url: '/display_student',
        templateUrl: 'app/display/display_student/display_student.html',
        controller: 'DisplayStudentCtrl'
      });
  });