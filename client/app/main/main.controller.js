'use strict';

angular.module('twebProject1App')
  .controller('MainCtrl', function ($scope, $http, socket, $window) {
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
                                $window.location = '/display_teacher?lecture=' + lecture._id;
                            });
    }
    
    /**
    * Join a lecture (student)
    */
    $scope.joinLecture = function() {
        $window.location = '/display_student?lecture=' + $scope.lecture.id;
    }
    
    /*
    $scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });
    */
});
