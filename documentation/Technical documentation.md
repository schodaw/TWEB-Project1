Technical documentation
=========================

This section targets people who wish to know more about how our <a href="http://tweb-project3-jollien-ngo.herokuapp.com/" target="_blank">**Classroom Conference WebApp**</a> works inside, including software developers who wish to contribute to its development, or users who want to investigate a problem with our wepapp in greater depth. (If you are only looking for information on how to download and run the app localy, see the [End-user documentation page](https://github.com/schodaw/TWEB-Project1/blob/master/README.md "End-user documentation page (on Github)") instead.)

---

Frameworks and Libraries
=========================



# Summary

* [**Scaffolding and Pipelining**](#Scaffolding_and_Pipelining)
	* [Yo](#Yo)
	* [Grunt.js](#Grunt.js)
* [**Frontend**](#Frontend)
	* [Bower](#Bower)
	* [Bootstrap](#Bootstrap)
	* [AngularJS](#AngularJS)
	* [PDF.js](#PDF.js)
* [**Backend**](#Backend)
	* [](#)
	* [](#)
	* [](#)
	* [](#)
	* [Jade](#Jade)
	* [Stylus](#Stylus)

[](#)

------------

# Scaffolding and Pipelining <a id="Scaffolding_and_Pipelining"></a>

At the beginning, we start our project from scratch and generate an application skeleton. In order to setup a complete, automated, efficient and reliable development workflow, we will use **Yo** and **Grunt**. 

## Yo <a id="Yo"></a>

**Yo** is a tool for generating project skeletons (scaffolding), and we use the **AngularJS Full-Stack** generator like framework. 

Runs the generator and sets up a new AngularJS + Express app : 

	yo angular-fullstack twebProject1App

Generates a new API endpoint :

	yo angular-fullstack:endpoint chat
	yo angular-fullstack:endpoint lecture
	yo angular-fullstack:endpoint lectureModel


Generates a new route :

	yo angular-fullstack:route giveLecture
	yo angular-fullstack:route attendLecture


## Grunt.js <a id="Grunt.js"></a>

**Grunt.js** is a JavaScript based task runner and using JSON for configuration. It is used to automate repetitive tasks in our development workflow. We use it to automate tasks like compilation, versioning, testing, deploying etc.
To use Grunt, first create a gruntfile.js file where you configure the different tasks that will be performed by Grunt. Then launch the different tasks with command line by giving the name of the task you want to run.

For building in the `dist` folder  : 

	grunt build

For previewing the app on the local machine : 

	grunt serve

Commit and push the resulting build to heroku (must be executed in the /dist folder) :

	grunt buildcontrol:heroku

Extract from `Gruntfile.js` :

	// Define the configuration for all the tasks
	grunt.initConfig({
		// Project settings
		pkg: grunt.file.readJSON('package.json'),
		yeoman: {
		  // configurable paths
		  client: require('./bower.json').appPath || 'client',
		  dist: 'dist'
		},
		express: {
		  options: {
			port: process.env.PORT || 9000
		},
		...
	});

# Frontend <a id="Frontend"></a>

## Bower <a id="Bower"></a>

**Bower** is a tool for managing web dependencies for the front-end : frameworks, libraries, assets and utilities. Bower uses a flat dependency tree, requiring only one version for each package, reducing page load to a minimum. It works by fetching and installing packages, taking care of finding and downloading. Bower keeps track of these packages in a manifest file `bower.json`.

Install packages to the folder `bower_components` and update the file `bower.json`:

	bower install [component-name] --save

or install all packages from the files `bower.json` : 

	bower install


Example of dependencies :

	{
	  "name": "tweb-project1",
	  "version": "0.0.0",
	  "dependencies": {
	    "angular": ">=1.2.*",
	    "json3": "~3.3.1",
	    "es5-shim": "~3.0.1",
	    "jquery": "~1.11.0",
	    "bootstrap": "~3.1.1",
		 ...
	    "angular-socket-io": "~0.6.0",
	    "angular-ui-router": "~0.2.10",
	    "pdfjs-dist": "~1.0.931",	    
	    "aws-sdk-js": "~2.1.2"
	  },
	  "devDependencies": {
	    "angular-mocks": ">=1.2.*",
	    "angular-scenario": ">=1.2.*"
	  }
	}

A version can be :
- semver version : `1.2.3`
- version range : `>=1.2.`, `~2.1.2`

## Bootstrap <a id="Bootstrap"></a>

**Bootstrap** is the most popular HTML, CSS and Javascript framework for developing faster and easier front-end web project. It is a free collection of HTML and CSS-based design templates for typography, forms, buttons, navigation and other interface components. 

Using the system of layout grid, Bootstrap scales our web application by resizing differents components according to the percentages of space occupied. It totally supports  responsive web design for laptops, tablets or mobile phones. 

An example of a simple form and a button, wrapped by two columns and a row :
	
	<div class="row">
	  <div class="col-lg-12">
	    <h1>Join a lecture</h1>
	    <p>The lecture code is displayed in the upper-right corner of the page displaying a lecture currently given by a teacher</p>
	  </div>
	  <div class="col-sm-6">
	    <form class="thing-form">
	      <p class="input-group">
	        <input type="text" placeholder="Type the lecture code given by the teacher" ng-model="lecture.userFriendlyId" class="form-control"/><span class="input-group-btn">
	          <button type="submit" ng-click="joinLecture()" class="btn btn-primary">Join</button></span>
	      </p>
	    </form>
	  </div>
	</div>		


## AngularJS <a id="AngularJS"></a>

**AngularJS** is an open-source web application framework for client-side model-view-controller architecture which allows to develop single-page applications. 

It works by reading the HTML page, which has embedded into it additional tag attributes. Those attributes are interpreted as directives telling Angular to bind input or output parts of the page to a model that is represented by JavaScript variables. The binding is two-ways.

An example of the directive `ng-repeat` and the variable `chat` :

With `$scope`, we can expose data and function to our view :

`giveLecture.controller.js` :

	$scope.chatMessages = [];

    //get chat messages of lecture
    $http.get('/api/lectures/' + $scope.lectureId + '/chats').success(function(chatMessages) {
        $scope.chatMessages = chatMessages;
        //live syncronization of chat messages 
        socket.syncUpdates('chat', $scope.chatMessages, function(event, item, object) {
            $scope.chatMessages = object.filter(function(chat) {return chat.lectureId == $scope.lectureId;});
        });
    });

In the view, we use the **directive** `ng-repeat` and **variable** `chat` to refer to the scope : 

`giveLecture.jade` :

	.row.no-glutter(ng-repeat='chat in chatMessages' ng-init='scrollDown()')
	 hr
	  .col-md-1.col-centered.col1on3 {{chat.time}}
	  .col-md-1.col-centered.col2on3 {{chat.author}}
	  .col-md-1.col-centered.col3on3 {{chat.content}} 
	
With this code, the chat messages are stored in the scope in the variable chatMessages. Angular generates a new line for every chat message to display in HTML it's attributes "time", "author" and "content".
The function syncUpdates provided by the scaffolding provides a dynamic update of the chat messages with Socket.IO.

## PDF.js <a id="PDF.js"></a>

**PDF.js** is a JavaScript library intended to render PDF files using the HTML5 Canvas. It relies on the use of promises.

The function `renderParge(pageNumber)` gets page info from document, resize canvas accordingly, and render page. The function `queueRenderPage(pageNumber)` handles the queue of pages rendering. The three functions `onPrevPage()`, `onNextPage()` and `changePage(pageNumber)` allow to change the page

Extract from "attendLectureController.js" :

    var pdfDoc = null,
      pageNum = 1,
      pageRendering = false,
      pageNumPending = null,
      scale = 1,
      canvas = document.getElementById('the-canvas'),
      ctx = canvas.getContext('2d');
	...
	//retreiving the PDF file
	PDFJS.getDocument(lecture.pdfPath).then(function (pdfDoc_) {
		pdfDoc = pdfDoc_;
		//display the number of pages of the PDF
		document.getElementById('page_count').textContent = pdfDoc.numPages;

		// Initial/first page rendering
		renderPage(pageNum);
	});
	...
	function renderPage(num) {
        pageRendering = true;
        // Using promise to fetch the page
        pdfDoc.getPage(num).then(function(page) {
          ...
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


## Jade <a id="Jade"></a>

**Jade** is a template engine implemented with JavaScript for server side templating in NodeJS, at the request processing time. The client sends
an HTTP request. The server builds a model and injects it into a compiled template. The result is sent back to the client. 

Jade is a templating language for html, so it makes writing html less verbose. It's whitespace sensitive, we can nest tags within other tags just by indenting them. Simple short hands help to reduce typing effort like adding IDs and classes, adding attributes to tags, etc.

Here are some examples of theses advantages in `giveLecture.jade`.

Example of using indent : 

	div
	.container-fluid  
	  .row.no-gutter
	    .col-md-9.col-centered.fill.left

Result in HTML :

	<div>
		<div class="container-fluid">
			<div class="row no-gutter">
				<div class="col-md-9 col-centered fill left"></div>
			</div>
		</div>
	</div>
		
Examples of adding IDs and classes : 

	.col-md-3.col-centered.right

	div#msgWrapper

Result in HTML :

	<div class="col-md-3 col-centered right"></div>
	<div id="msgWrapper"></div>
	
Examples of adding attributes to tags :

	input.form-control(type='text', placeholder='Write a title', ng-model='newLectureModelTitle')

Result in HTML :

	<input type="text" placeholder="Write a title" ng-model="newLectureModelTitle" class="form-control"/>


## Stylus <a id="Stylus"></a>

**Stylus** is a dynamic stylesheet language, an expressive CSS preprocessor syntax for NodeJS. Compared to CSS, with Stylus, we can omit braces, semi-colons, colons, and we can define functions.

An example from `giveLecture.styl` :

	h3
	    margin-top: 0px
	    margin-bottom: 0px
	    
	#msgWrapper
	    height:550px
	    width:100%
	    overflow-y: scroll
	    overflow-x: hidden
	    
	.col1on3
	    width:25%


# Source code organization

## client/


## server/

