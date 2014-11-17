'use strict';

angular.module('twebProject1App')
  .controller('DisplayStudentCtrl', function ($scope, $http, socket, $location, Auth) {
    
    /*
    * Chat
    */
    
    $scope.chatMessages = [];
    
    $http.get('/api/chats').success(function(chatMessages) {
        $scope.chatMessages = chatMessages;
        socket.syncUpdates('chat', $scope.chatMessages);
    });

    $scope.addMessage = function() {
      if($scope.newMessage === '') {
        return;
      }
      var date = new Date();
      $http.post('/api/chats', { time: date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(), author: Auth.getCurrentUser().name, content: $scope.newMessage });
      $scope.newMessage = '';
    };
    
    
    /*
    *   PDFJS
    *  
    */
	
	//
    // If absolute URL from the remote server is provided, configure the CORS
    // header on that server.
    //
    var pdfUrl = 'data/compressed.tracemonkey-pldi-09.pdf';

    var pdfDoc = null,
      pageNum = 1,
      pageRendering = false,
      pageNumPending = null,
      scale = 0.8,
      canvas = document.getElementById('the-canvas'),
      ctx = canvas.getContext('2d');

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
        document.getElementById('page_num').textContent = pageNum;
    }

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

    /**
    * Asynchronously downloads PDF.
    */
    PDFJS.getDocument(pdfUrl).then(function (pdfDoc_) {
        pdfDoc = pdfDoc_;
        document.getElementById('page_count').textContent = pdfDoc.numPages;

        // Initial/first page rendering
        renderPage(pageNum);
    });
    
    
    /*
    * receive event from teacher
    */
    socket.socket.on('changePage', function(data) {
        renderPage(data.pageNum);
    });
  });