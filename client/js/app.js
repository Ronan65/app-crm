'use strict';

angular.module('myApp', ['ngRoute','myApp.services','myApp.serviceST','ngCookies'])

    .config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {

    // Route home
    $routeProvider.when('/',
        {
            templateUrl:    '/partials/listeClient',
            controller:     'CustomersCtrl',
        });

    // Route login
    $routeProvider.when('/login',
        {
            templateUrl:    '/partials/login',
            controller:     'LoginCtrl',
        });

    // Route customer
    $routeProvider.when('/customer/new',
        {
            templateUrl:    '/partials/addClient',
            controller:     'AddCtrl',
        });
    $routeProvider.when('/customer/:id/edit',
        {
            templateUrl:    '/partials/editClient',
            controller:     'EditCtrl',
        });
     $routeProvider.when('/customer/:id',
        {
            templateUrl:    '/partials/readClient',
            controller:     'EditCtrl',
        });
     //Route upload
     $routeProvider.when('/db/upload',
        {
            templateUrl:    '',
            controller:     '',
        });
     // Route statistique
     $routeProvider.when('/statistique',
        {
            templateUrl:    '/partials/stat.html',
            controller:     'statCtrl',
        });
    // Route contact
    $routeProvider.when('/customer/:id/contact', 
        {
            templateUrl:    '/partials/listeContact.html',
            controller:     'ContactCtrl'
        });
    $routeProvider.when('/customer/:id/contact/new', 
        {
            templateUrl:    '/partials/addContact.html',
            controller:     'ContactCtrl'
        });
    $routeProvider.when('/customer/:id/contact/:cId', 
        {
            templateUrl:    '/partials/contact.write.html',
            controller:     'ContactCtrl'
        });

    // Route machine
    $routeProvider.when('/customer/:id/machine', 
        {
            templateUrl:    '/partials/listeMachines.html',
            controller:     'MachineCtrl'
        });
    $routeProvider.when('/customer/:id/machine/new', 
        {
            templateUrl:    '/partials/addMachines.html',
            controller:     'MachineCtrl'
        });
    $routeProvider.when('/customer/:id/machine/:cId', 
        {
            templateUrl:    '/partials/machine.write.html',
            controller:     'MachineCtrl'
        });

    // Route erreur
    $routeProvider.when('/404',
        {
            templateUrl:    '/partials/404',
        });

    // Redirection autres
    $routeProvider.otherwise({redirectTo:'/404'});

    $locationProvider.html5Mode(true);

    var interceptor = ['$location', '$q', function($location, $q) {
        function success(response) {
            return response;
        }

        function error(response) {

            if(response.status === 401) {
                $location.path('/login');
                return $q.reject(response);
            }
            else {
                return $q.reject(response);
            }
        }

        return function(promise) {
            return promise.then(success, error);
        }
    }];

    $httpProvider.responseInterceptors.push(interceptor);

}]);