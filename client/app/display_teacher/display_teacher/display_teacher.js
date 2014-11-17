'use strict';

angular.module('twebProject1App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('display_teacher', {
        url: '/display_teacher',
        templateUrl: 'app/display_teacher/display_teacher/display_teacher.html',
        controller: 'DisplayTeacherCtrl'
      });
  });