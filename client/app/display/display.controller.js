'use strict';

angular.module('twebProject1App')
  .controller('DisplayCtrl', function ($scope, $http, socket, $location, Auth) {
    
    /*
    *   redirection of the client using his credentials
    */
    if(Auth.isStudent()) {
        $location.pah("/display_student");
    } else if(Auth.isTeacher()) {
        $location.pah("/display_teacher");
    }
  });
