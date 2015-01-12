TWEB-Project1
=============

First project of the TWEB course.

This project consists of a teaching platform that allows students to follow lectures and give feedback to the teacher giving the lecture.

Presentation page :
http://quangdung.github.io/tweb-project2/

It is available online at the adress :
https://tweb-project1-jollien-ngo.herokuapp.com/

Authors : Jollien Dominique and Ngo Dung

---

# Functionalities #

O = working
X = not working

| Teacher and student         | Local | Heroku |
|-----------------------------|-------|--------|
| Signing in                  | O     | O      |
| Logging in                  | O     | O      |
| See list of past lectures   | X     | X      |
| Access a lecture transcript | X     | X      |

| Student                                                           | Local | Heroku |
|-------------------------------------------------------------------|-------|--------|
| Join a lecture                                                    | O     | O      |
| Send chat messages                                                | O     | O      |
| Stop slide synchronisation to be able to browse the lecture's pdf | O     | O      |
| Answer poll                                                       | X     | X      |
| Send mood info                                                    | O     | O      |

| Teacher                                                           | Local | Heroku |
|-------------------------------------------------------------------|-------|--------|
| Creation of a new lecture model : uploading of a slide deck       | O     | O      |
| Creation of a lecture using a lecture model via `start lecture`   | O     | O      |
| Stop slide synchronisation to be able to browse the lecture's pdf | O     | O      |
| Change slide for all the class to see                             | O     | O      |
| See chat messages                                                 | O     | O      |
| Submit poll                                                       | X     | X      |

| Administrator           | Local | Heroku |
|-------------------------|-------|--------|
| Monitor system          | X     | X      |
| Consult admin dashboard | X     | X      |


#Pending work#
- Manage users roles for functionality access. (For the moment a student can create a lecture for example.)

#Run project locally#

- In order to run the project locally, we need to run `mongodb` in administrator mode (use mongod executable).
- Make sure you have installed grunt and bower globaly with `npm install grunt-cli -g` and `npm install bower -g`
- clone repo : `git clone https://github.com/schodaw/TWEB-Project1.git`
- go at the root : `cd TWEB-Project1`
- install npm and bower modules : `npm install` and `bower install`
- In /client/app/main/main.controller.js you have to insert the Amazon S3 credentials of the ARN User able to publish and retrieve document in the Amazon S3 bucket used in the application at line 26 like this :
  ```javascript
$scope.creds = {
    bucket: 'tweb-project-pdf',
    access_key: 'ARN_USER_ACCESS_KEY',
    secret_key: 'ARN_USER_SECRET_KEY'
    
  }
  ```
- build the project : `grunt build`
- run the project locally : `grunt serve`
- The project is now accessible at http://localhost:9000
