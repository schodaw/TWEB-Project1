/*
* Home page.
* On this page the teacher can : create a new lectureModel (slide deck) by uploading a pdf file. And start to give a lecture.
* On this page the student can : start attending a lecture by giving it's id.
*/
'use strict';

angular.module('twebProject1App')
  .controller('MainCtrl', function ($scope, $http, socket, $window, Auth) {
    
    Auth.isLoggedInAsync(function(success) {
        console.log("Current user role: " + Auth.getCurrentUser().role);
        $scope.isTeacher = Auth.isTeacher();
        if(Auth.isTeacher()) {
                /*
                * Create a lectureModel
                */
                /**
                * Amazon S3
                */
                $scope.onFileSelect = function($files) {
                  $scope.file = $files[0];
                }


                //Amazon S3 credentials


                $scope.createLectureModel = function() {            
                  // Configure The S3 Object 
                  AWS.config.update({ accessKeyId: $scope.creds.access_key, secretAccessKey: $scope.creds.secret_key });
                  AWS.config.region = 'eu-central-1';
                  var bucket = new AWS.S3({ params: { Bucket: $scope.creds.bucket } });

                  if($scope.file) {
                    var params = { Key: $scope.file.name, ContentType: $scope.file.type, Body: $scope.file, ServerSideEncryption: 'AES256' };

                    bucket.putObject(params, function(err, data) {
                      if(err) {
                        // There Was An Error With Your S3 Config
                        alert(err.message);
                        return false;
                      }
                      else {
                        // Success!
                        alert('Upload Done');
                        //creating the lecture model in the database
                        $http.post('/api/lectureModels', { title: $scope.newLectureModelTitle, author: $scope.newLectureModelAuthor, pdfPath: "https://s3.eu-central-1.amazonaws.com/tweb-project-pdf/" + $scope.file.name });
                      }
                    })
                    .on('httpUploadProgress',function(progress) {
                          // Log Progress Information
                          var progress = Math.round(progress.loaded / progress.total * 100);
                          console.log(progress + '% done');
                          document.getElementById('uploadProgress').textContent = 'upload progress : ' + progress + ' %';
                        });
                  }
                  else {
                    // No File Selected
                    alert('No File Selected');
                  }
                }

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
        }

        /**
        * Join a lecture (student)
        */
        $scope.joinLecture = function() {
            $http.get('/api/lectures/byUserFriendlyId/' + $scope.lecture.userFriendlyId).success(function(lecture) {
                $window.location = '/attendLecture?lecture=' + lecture._id;
            });
        };
    });
});
