'use strict';

angular.module('twebProject1App')
  .controller('MainCtrl', function ($scope, $http, socket, $window, Auth, $upload) {
    
    $scope.isTeacher = Auth.isTeacher();
    
    // roles are not working most of the time
    // if(Auth.isTeacher()) {
        /*
        * Create a lectureModel
        */
        //we are using the module angular-file-upload : https://github.com/danialfarid/angular-file-upload#node
        $scope.onFileSelect = function($files) {
            //$files: an array of files selected, each file has name, size, and type.
            for (var i = 0; i < $files.length; i++) {
              var file = $files[i];
              $scope.upload = $upload.upload({
                url: '/upload',
                data: {title: $scope.newLectureModelTitle, author: $scope.newLectureModelAuthor},
                file: file
              }).progress(function(evt) {
                document.getElementById('uploadProgress').textContent = 'upload progress : ' + parseInt(100.0 * evt.loaded / evt.total) + '%';
                console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
              }).success(function(data, status, headers, config) {
                // file is uploaded successfully
                console.log(data);
              });
            }
          };

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
        };
    //}
    
    /**
    * Join a lecture (student)
    */
    $scope.joinLecture = function() {
        $window.location = '/attendLecture?lecture=' + $scope.lecture.id;
    };
    
});
