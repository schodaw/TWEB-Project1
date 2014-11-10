'use strict';

angular.module('twebProject1App')
  .controller('DisplayCtrl', function ($scope, $http, socket, Auth) {
    
    $scope.chatMessages = [];
    
    getChatMessages();
    
    function getChatMessages() {
        $http.get('/api/chats').success(function(chatMessages) {
            $scope.chatMessages = chatMessages;
            socket.syncUpdates('chatMessages', $scope.chatMessages);
        });
    }

    $scope.addMessage = function() {
      if($scope.newMessage === '') {
        return;
      }
      var date = new Date();
      $http.post('/api/chats', { time: date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(), author: Auth.getCurrentUser().name, content: $scope.newMessage });
      $scope.newMessage = '';
      //refresh messages from the chat to display the new message
      getChatMessages();
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


    //
    // Disable workers to avoid yet another cross-origin issue (workers need
    // the URL of the script to be loaded, and dynamically loading a cross-origin
    // script does not work).
    //
    // PDFJS.disableWorker = true;

    //
    // In cases when the pdf.worker.js is located at the different folder than the
    // pdf.js's one, or the pdf.js is executed via eval(), the workerSrc property
    // shall be specified.
    //
    // PDFJS.workerSrc = 'components/pfjs/pdf.worker.js';

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
    * Displays previous page.
    */
    $scope.onPrevPage = function() {
        if (pageNum <= 1) {
          return;
        }
        pageNum--;
        queueRenderPage(pageNum);
    }

    /**
    * Displays next page.
    */
    $scope.onNextPage = function() {
        if (pageNum >= pdfDoc.numPages) {
          return;
        }
        pageNum++;
        queueRenderPage(pageNum);
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
  });
