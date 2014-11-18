'use strict';

angular.module('twebProject1App')
  .controller('MainCtrl', function ($scope, $http, socket, $window, Auth) {
    
    
    if(Auth.isTeacher()) {
        /*
        * Managing lectureModels
        */

        $scope.lectureModels = [];

        /**
        * Display lectureModels
        */
        $http.get('/api/lectureModels').success(function(lectureModels) {
            $scope.lectureModels = lectureModels;
            socket.syncUpdates('lectureModel', $scope.lectureModels);
        });


        /**
        * Start a new lecture (teacher)
        */
        $scope.startLecture = function(index) {
          var lectureModel = $scope.lectureModels[index];
          $http.post('/api/lectures', { title:  lectureModel.title, author: lectureModel.author, pdfPath: lectureModel.pdfPath, currentPage: 1 })
                                .success(function(lecture) {
                                    $window.location = '/giveLecture?lecture=' + lecture._id;
                                });
        }
    }
    
    /**
    * Join a lecture (student)
    */
    $scope.joinLecture = function() {
        $window.location = '/attendLecture?lecture=' + $scope.lecture.id;
    }
    
});
