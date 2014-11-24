TWEB-Project1
=============

First project of the TWEB course.

https://tweb-project1-jollien-ngo.herokuapp.com/

Authors : Jollien Dominique and Ngo Dung

---

# Functionalities #


## For all users ##
- Signing up
- Logging in

## As a student ##
- Join a lecture
- Send chat messages
- Stop slide synchronisation to be able to browse the lecture's pdf

## As a teacher ##
- Creation of a new lecture model : uploading of a slide deck
- Creation of a lecture using a lecture model via `start lecture`
- Change slide for all the class to see

In fact, users roles are not taken in account for functionality access, so a student can create a lecture for example.



#Run project locally#

- In order to run the project locally, we need to run `mongodb` in administrator mode (use mongod executable).
- Make sure you have installed grunt and bower globaly with `npm install grunt-cli -g` and `npm install bower -g`
- clone repo : `git clone https://github.com/schodaw/TWEB-Project1.git`
- go at the root : `cd TWEB-Project1`
- install npm and bower modules : `npm install` and `bower install`
- make sure to have the right folder path for pdf upload set in server/routes.js, the line 14 should be :
  - var pdfUploadDir = './public/data'; if the project is on heroku
  - var pdfUploadDir = './client/data'; if the project is run locally
- build the project : `grunt build`
- run the project locally : `grunt serve`
- The project is now accessible at http://localhost:9000
