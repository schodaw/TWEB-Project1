'use strict';

angular.module('twebProject1App')
  .controller('GivelectureCtrl', function ($scope, $http, socket, $location, Auth, $window) {
    /* ** PDFJS function ** */
    /**
    * Get page info from document, resize canvas accordingly, and render page.
    * @param num Page number.
    */
    function renderPage(num) {
        pageRendering = true;
        // Using promise to fetch the page
        pdfDoc.getPage(num).then(function(page) {
          var viewport = page.getViewport(scale);
          canvas.height = viewport.height;
          canvas.width = viewport.width;

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
    
    if(Auth.isTeacher()) {
    
        //the lecture that we are giving
        $scope.lectureId = $location.search().lecture

        /*
        * Chat
        */

        $scope.chatMessages = [];

        //get chat messages of lecture
        $http.get('/api/lectures/' + $scope.lectureId + '/chats').success(function(chatMessages) {
            $scope.chatMessages = chatMessages;
            socket.syncUpdates('chat', $scope.chatMessages, function(event, item, object) {
                $scope.chatMessages = object.filter(function(chat) {return chat.lectureId == $scope.lectureId;}); //TODO : bad practice, all the chats are retrive and filtered bug the GET /api/lectures/:id/chats works
            });
        });

        /*
        *   PDFJS
        */

        var pdfDoc = null,
          pageNum = 1,
          pageRendering = false,
          pageNumPending = null,
          scale = 0.8,
          canvas = document.getElementById('the-canvas'),
          ctx = canvas.getContext('2d');

        $http.get('/api/lectures/' + $scope.lectureId).success(function(lecture) {

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
