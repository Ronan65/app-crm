'use strict';

angular.module('myApp')
.factory('Auth', function($http, $cookieStore){

    var currentUser = $cookieStore.get('user') || { username: ''};

    $cookieStore.remove('user');

    function changeUser(user) {
        _.extend(currentUser, user);
    };

    return {
        login: function(user, success, error) {
            $http.post('/login', user).success(function(user){
                changeUser(user);
                success(user);
            }).error(error);
        },
        logout: function(success, error) {
            $http.post('/logout').success(function(){
                changeUser({
                    username: ''
                });
                success();
            }).error(error);
        },
        user: currentUser
    };
});

angular.module('myApp.services', ['ngResource'])
.factory('serviceClient', function($resource) {
    return $resource('https://localhost\\:8443/customers/:id',{id: '@id'}, {
        /*définition des méthode CRUD*/
        'get': {method: 'GET', isArray: true},
        'update': {method: 'PUT'},
        'create': {method: 'POST'},
        'erase': {method: 'DELETE'}
    });
});

angular.module('myApp.serviceST', ['ngResource'])
.factory('serviceStat', function($resource) {
    return $resource('https://localhost\\:8443/db/stat');
});