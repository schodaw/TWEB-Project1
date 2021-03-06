/*
* The giveLecture page is used to give a lecture started by a teacher.
* Only teachers can use this page, they can change the lecture's curent slide for the all class to see.
* They can also receive live feedback from students.
* The given lecture id is given in the query string parameter "lecture".
*/
'use strict';

angular.module('twebProject1App')
  .controller('GivelectureCtrl', function ($scope, $http, socket, $location, Auth, $window) {

    /*
    * function to handle automatic scrolldown of chat messages display
    */
    $scope.scrollDown = function() {
        var scrollBar = document.getElementById("msgWrapper");
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

    /*
    * Change the pdf page displayed by PDFJS.
    */
    function changePage(num) {
        //display pdf page
        queueRenderPage(num);

        //edit database with new page number
        $http.put('/api/lectures/' + $scope.lectureId, { currentPage: num });

        //send event to student
        socket.socket.emit('changePage', {lectureId: $scope.lectureId, pageNum:num});
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
              
            // Update page counters
            document.getElementById('page_num').textContent = num;
          });
        });
    }
    

    Auth.isLoggedInAsync(function(success) {
    console.log("Current user role: " + Auth.getCurrentUser().role);
    $scope.isTeacher = Auth.isTeacher();
    if(Auth.isTeacher()) {
        
        //the lecture that we are giving is passed as a query string
        $scope.lectureId = $location.search().lecture

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

        /**
        * Displays previous page.
        */
        $scope.onPrevPage = function() {
            if (pageNum <= 1) {
              return;
            }
            changePage(--pageNum);
        }

        /**
        * Displays next page.
        */
        $scope.onNextPage = function() {
            //change page number
            if (pageNum >= pdfDoc.numPages) {
              return;
            }
            changePage(++pageNum);
        }
    } else {
        $window.location = '/';
    }
  });
});