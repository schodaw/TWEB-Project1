/*
* The attendLecture page is used to attend to a lecture started by a teacher.
* Both students and teachers can use this page, they can send chat messages and see the lecture's slides.
* The attended lecture id is given in the query string parameter "lecture".
*/
'use strict';

angular.module('twebProject1App')
  .controller('AttendlectureCtrl', function ($scope, $http, socket, $location, Auth, $window) {

    /*
    * function to handle automatic scrolldown of chat messages display
    */
    $scope.scrollDown = function() {
        var scrollBar = document.getElementById("msgWrapperStudent");
        scrollBar.scrollTop = scrollBar.scrollHeight;
    }
    
    /*
    *   PDFJS
    */
    // Calculate the navigator size
    var viewportHeight = document.documentElement.clientHeight;           

    var pdfDoc = null,
      pageNum = 1,
      pageRendering = false,
      pageNumPending = null,
      scale = 1,
      canvas = document.getElementById('the-canvas'),
      ctx = canvas.getContext('2d');

    /* ** PDFJS function ** */
    /**
    * If another page rendering in progress, waits until the rendering is
    * finised. Otherwise, executes rendering immediately.
    */
    function queueRenderPage(num) {
        if (pageRendering) {
          pageNumPending = num;
        } else {
          renderPage(num);
        }
    }

    /* ** PDFJS function ** */
    /**
    * Get page info from document, resize canvas accordingly, and render page.
    * @param num Page number.
    */
    function renderPage(num) {
        pageRendering = true;
        // Using promise to fetch the page
        pdfDoc.getPage(num).then(function(page) {
           // Detect the document's format
          var portrait = (page.getViewport(1.0).width < page.getViewport(1.0).height);
          
          // Set canvas's height
          canvas.setAttribute('style', "height:" + viewportHeight +"px");     

          // If portrait, calculate new canvas's width with a scale
          if (portrait) {                 
            var desiredScale = viewportHeight / page.getViewport(1.0).height;

            var viewportWidth = page.getViewport(1.0).width * desiredScale;
            canvas.setAttribute('style', "width:" + viewportWidth + "px");

            var viewport = page.getViewport(desiredScale);

            canvas.height = viewportHeight;
            canvas.width = viewport.width;
          }
          else {
            var viewport = page.getViewport(scale);
            canvas.height = viewport.height;        
            canvas.width = viewport.width;
          }              
          // Render PDF page into canvas context
          var renderContext = {
            canvasContext: ctx,
            viewport: viewport
          };
          var renderTask = page.render(renderContext);

          // Wait for rendering to finish
          renderTask.promise.then(function () {
            pageRendering = false;
            if (pageNumPending !== null) {
              // New page rendering is pending
              renderPage(pageNumPending);
              pageNumPending = null;
            }
          });
        });

        // Update page counters
        document.getElementById('page_num').textContent = num;
    }
    
        
    //the lecture that we are attending is passed as a query string
    $scope.lectureId = $location.search().lecture

    //true if the slides are synchronized with the changes made by the teacher
    $scope.syncEnabled = true;

    /*
    * Chat
    */
    $scope.chatMessages = [];

    //get chat messages of lecture
    $http.get('/api/lectures/' + $scope.lectureId + '/chats').success(function(chatMessages) {
        $scope.chatMessages = chatMessages;
        //live syncronization of chat messages 
        socket.syncUpdates('chat', $scope.chatMessages, function(event, item, object) {
            $scope.chatMessages = object.filter(function(chat) {return chat.lectureId == $scope.lectureId;});
        });
    });

    //add a message to the chat entered in the input field
    $scope.addMessage = function() {
      if($scope.newMessage === '') {
        return;
      }
      sendChatMessage($scope.newMessage);
      $scope.newMessage = '';
    };
    //add a message to the chat on the click of a mood button
    $scope.addMoodMessage = function(message) {
      sendChatMessage(message);
    };
    //add a message to the chat
    function sendChatMessage(message) {
      var date = new Date();
      $http.post('/api/chats', { lectureId: $scope.lectureId, time: date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(), author: Auth.getCurrentUser().name, content: message });
    }

    //get lecture info
    $http.get('/api/lectures/' + $scope.lectureId).success(function(lecture) {

        $scope.lectureUserFriendlyId = lecture.userFriendlyId;

        pageNum = lecture.currentPage;

        /**
        * Asynchronously downloads PDF.
        */
        PDFJS.getDocument(lecture.pdfPath).then(function (pdfDoc_) {
            pdfDoc = pdfDoc_;
            document.getElementById('page_count').textContent = pdfDoc.numPages;

            // Initial/first page rendering
            renderPage(pageNum);
        });
    });

    /*
    * receive event from teacher
    */
    socket.socket.on('changePage', function(data) {
        if($scope.syncEnabled && data.lectureId === $scope.lectureId) {
            pageNum = data.pageNum;
            queueRenderPage(data.pageNum);
        }
    });

    /*
    * start or stop pdf slide change syncronisation
    */
    $scope.toggleSync = function() {
        $scope.syncEnabled = !$scope.syncEnabled;
    };

    /**
    * Displays previous page if synchronisation is disabled.
    */
    $scope.onPrevPage = function() {
        if (pageNum <= 1 || $scope.syncEnabled) {
          return;
        }
        //display pdf page
        queueRenderPage(--pageNum);
    }

    /**
    * Displays next page if synchronisation is disabled.
    */
    $scope.onNextPage = function() {
        //change page number
        if (pageNum >= pdfDoc.numPages || $scope.syncEnabled) {
          return;
        }
        //display pdf page
        queueRenderPage(++pageNum);
    }
  });
