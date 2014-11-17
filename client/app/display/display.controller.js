'use strict';

angular.module('twebProject1App')
  .controller('DisplayCtrl', function ($scope, $http, socket, $location, Auth, $window) {
    
    /*
    *   redirection of the client using his credentials
    */
    if(Auth.isStudent()) {
        $window.location = "/display_student";
    } else if(Auth.isTeacher()) {
        $window.location = "/display_teacher";
    }
  });
