TWEB-Project1
=============

First project of the TWEB course.

This project consists of a teaching platform that allows students to follow lectures and give feedback to the teacher giving the lecture.

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
| See list of past lectures   | O     | O      |
| Access a lecture transcript | O     | O      |

| Student                                                           | Local | Heroku |
|-------------------------------------------------------------------|-------|--------|
| Join a lecture                                                    | O     | O      |
| Send chat messages                                                | O     | O      |
| Stop slide synchronisation to be able to browse the lecture's pdf | O     | O      |
| Answer poll                                                       | X     | X      |
| Send mood info                                                    | X     | X      |

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
| Monitor system          | O     | O      |
| Consult admin dashboard | O     | O      |


#Pending work#
- Expand the PDF display size
- Manage users roles for functionality access. (For the moment a student can create a lecture for example.)
- Change pdf upload functionnality to upload on amazone s3.

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
