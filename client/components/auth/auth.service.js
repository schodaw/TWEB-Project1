'use strict';

angular.module('twebProject1App')
  .factory('Auth', function Auth($location, $rootScope, $http, User, $cookieStore, $q) {
    var currentUser = {};
    if($cookieStore.get('token')) {
      currentUser = User.get();
    }

    return {

      /**
       * Authenticate user and save token
       *
       * @param  {Object}   user     - login info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      login: function (user, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post('/auth/local', {
          email: user.email,
          password: user.password
        }).
        /* ORIGINAL CODE -- promise is resolved too early
        success(function (data) {
          $cookieStore.put('token', data.token);
          currentUser = User.get();
          deferred.resolve(data);
          return cb();
        }).
        */
        /* PROPOSED FIX -- promise is resolved once HTTP call has returned */
        success(function (data) {
          $cookieStore.put('token', data.token);
          currentUser = User.get(function() {
            deferred.resolve(data);
            return cb();
          });
        }).
        error(function (err) {
          this.logout();
          deferred.reject(err);
          return cb(err);
        }.bind(this));

        return deferred.promise;
      },

      /**
       * Delete access token and user info
       *
       * @param  {Function}
       */
      logout: function() {
        $cookieStore.remove('token');
        currentUser = {};
      },

      /**
       * Create a new user
       *
       * @param  {Object}   user     - user info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      createUser: function (user, callback) {
        var cb = callback || angular.noop;

         /* ORIGINAL CODE ---------------------
         return User.save(user,
          function(data) {
            $cookieStore.put('token', data.token);
            currentUser = User.get();
            return cb(user);
          },
          function(err) {
            this.logout();
            return cb(err);
          }.bind(this)).$promise;
           --------------------- */

        /* PROPOSED FIX --------------------- */
        var deferred = $q.defer();
        User.save(user,
          function (data) {
            $cookieStore.put('token', data.token);
            currentUser = User.get(function () {
              console.log('User.save(), user role: ' + currentUser.role);
              deferred.resolve(data);
              return cb(currentUser);
            });
          },
          function (err) {
            this.logout();
            return cb(err);
            deferred.reject(err);
          });
        return deferred.promise;

      },

      /**
       * Change password
       *
       * @param  {String}   oldPassword
       * @param  {String}   newPassword
       * @param  {Function} callback    - optional
       * @return {Promise}
       */
      changePassword: function(oldPassword, newPassword, callback) {
        var cb = callback || angular.noop;

        return User.changePassword({ id: currentUser._id }, {
          oldPassword: oldPassword,
          newPassword: newPassword
        }, function(user) {
          return cb(user);
        }, function(err) {
          return cb(err);
        }).$promise;
      },

      /**
       * Gets all available info on authenticated user
       *
       * @return {Object} user
       */
      getCurrentUser: function() {
        return currentUser;
      },

      /**
       * Check if a user is logged in
       *
       * @return {Boolean}
       */
      isLoggedIn: function() {
        return currentUser.hasOwnProperty('role');
      },

      /**
       * Waits for currentUser to resolve before checking if user is logged in
       */
      isLoggedInAsync: function(cb) {
        if(currentUser.hasOwnProperty('$promise')) {
          currentUser.$promise.then(function() {
            cb(true);
          }).catch(function() {
            cb(false);
          });
        } else if(currentUser.hasOwnProperty('role')) {
          cb(true);
        } else {
          cb(false);
        }
      },

      /**
       * Check if a user is an admin
       *
       * @return {Boolean}
       */
      isAdmin: function() {
        return currentUser.role === 'admin';
      },
        
      /**
       * Check if a user is a student
       *
       * @return {Boolean}
       */
      isStudent: function() {
        return currentUser.role === 'student';
      },
        
      /**
       * Check if a user is a teacher
       *
       * @return {Boolean}
       */
      isTeacher: function() {
        return currentUser.role === 'teacher';
      },
        
      /**
       * Get auth token
       */
      getToken: function() {
        return $cookieStore.get('token');
      }
    };
  });
