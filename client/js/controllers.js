'use strict';

/* Controllers */

angular.module('myApp')
.controller('NavCtrl', ['$scope', '$location', 'Auth', function($scope, $location, Auth) {
    $scope.user = Auth.user;

    $scope.logout = function() {
        Auth.logout(function() {
            $location.path('/login');
        }, function() {
            $rootScope.error = "Failed to logout";
        });
    };
}]);

angular.module('myApp')
.controller('statCtrl', ['$scope','serviceStat', function($scope,serviceStat) {
  $scope.statistique = serviceStat.get();

}]);

angular.module('myApp')
.controller('uploadCtrl', ['$scope', '$location', 'Auth', function($scope, $location, Auth) {
  

}]);

angular.module('myApp')
.controller('LoginCtrl',
['$rootScope', '$scope', '$location', '$window', 'Auth', function($rootScope, $scope, $location, $window, Auth) {

    $scope.rememberme = true;
    $scope.login = function() {
        Auth.login({
                username: $scope.username,
                password: $scope.password,
                rememberme: $scope.rememberme
            },
            function(res) {
                $location.path('/');
            },
            function(err) {
                $rootScope.error = "Failed to login";
            });
    };
}]);

angular.module('myApp')
.controller('CustomersCtrl', ['$scope','$rootScope','$routeParams','$location', '$anchorScroll','serviceClient', function($scope,$rootScope,$routeParams,$location, $anchorScroll,serviceClient) {
    /*Récupération de la liste des clients*/
    $scope.datasource = serviceClient.query();
    $scope.nbResults = $rootScope.nbResults || 0;
    $scope.currentPage = 0;
    $scope.pageSize = 30;
    $scope.results = $rootScope.results || [];

    if ($scope.results.length > 0 && $routeParams.id) {
    var customers = $scope.results.filter(function(item) { return ~item.id.toLowerCase().indexOf($routeParams.id.toLowerCase()); });
    $scope.customer = customers[0];
    }

    $scope.matcher = function(item, query) {
      return ~item.toLowerCase().indexOf(query.toLowerCase());
    };

    var attributes = function(obj) {
      var result = [];
      for ( var attr in obj) {
        (typeof obj[attr] == 'string') ? result.push(attr) : null
      }
      return result;
    }

    $scope.search = function() {
      $rootScope.loading = true;
      if($scope.query) {
        var terms = $scope.query.split(' ');
        var results = $scope.datasource.filter(function(result){
          var found = [];
          var attrs = attributes(result);
          for (var i = 0; i < this.length; i++) {
            found[i] = 0
            for (var attr in attrs) {
              ( $scope.matcher(result[attrs[attr]], this[i]) ) ? found[i]++ : null;
            }
          }
          if (found.filter(function(value) { return value >= 1 }).length == this.length) return true;
          return false;
        }, terms);
      }
      $rootScope.loading = false;
      if (results != undefined) {
        $scope.results = $rootScope.results = results.sort(function(a, b){
         var nameA=a.Nomouraisonsociale.toLowerCase(), nameB=b.Nomouraisonsociale.toLowerCase()
         if (nameA < nameB) //sort string ascending
          return -1
         if (nameA > nameB)
          return 1
         return 0 //default return value (no sorting)
        });
        $scope.nbResults = $rootScope.nbResults = results.length;
      }else{
        $scope.results = [];
        $scope.nbResults = $rootScope.nbResults = 0;
      }
    };

    $scope.gotoTop = function (){
      var old = $location.hash();
      $location.hash('top');
      $anchorScroll();
      $location.hash(old);
    }

  }]);

angular.module('myApp')
.controller('AddCtrl', ['$scope', '$routeParams', '$location', 'serviceClient', function($scope, $routeParams, $location, serviceClient) {
    /*Récupération de la liste des clients*/
    $scope.customers = serviceClient.query();
    /* Fonction de création d'un nouveau client*/
    $scope.customerCreate = function (customer) {
      alert("entree add");
      /*si les champs sont remplis*/
      if (customer != null || customer != undefined) {
          /*envoi de la requete de création*/
          serviceClient.create({id: customer.id},customer,function() {
            /*Récupération de la nouvelle liste*/
            /*console.log(customer);*/
            $scope.customers = serviceClient.get();
          });
      }
      /*Redirection vers le liste des clients à jour*/
      $location.path('/').replace();
    };

    /*Retour à la liste des clients en cas d'appui sur la touche annuler*/
    $scope.customerReset = function() {
      $location.path('/').replace();
    };
}]);

angular.module('myApp')
.controller('EditCtrl', ['$scope', '$routeParams', '$location', 'serviceClient', function($scope, $routeParams, $location, serviceClient) {
    /*Récupération de la liste des clients*/
    $scope.customers = serviceClient.query();
    /*Récupération du détail du customer*/
    $scope.customer = serviceClient.get({id: $routeParams.id});
    
    /*Fonction d'édition d'un client*/
    $scope.customerEdit = function (customer) {
      /*si les sont remplis*/
      if (customer != null || customer != undefined) {
        /*envoi de la requete de création*/
        serviceClient.update({id: customer.id},customer);
      }
      /*Redirection vers le liste des clients à jour*/
      $location.path('/customer/' + $routeParams.id).replace();
    };

    /*Fonction de suppression d'un client*/
    $scope.customerDelete = function (customer) {
      /*si les sont remplis*/
      if (customer != null || customer != undefined) {
        alert(customer.id);
        /*envoi de la requete de suppression*/
        serviceClient.erase({id: customer.id},customer, function() {
            $location.path('/').replace();
        });
      }      
    };

    /*Retour à la liste des clients en cas d'appui sur la touche annuler*/
      $scope.customerReset = function() {
        $location.path('/').replace();
    };
}]);

angular.module('myApp')
.controller('ContactCtrl', ['$scope', '$routeParams', '$location', 'serviceClient', function($scope, $routeParams, $location, serviceClient) {
  //Récupération du client
  $scope.customer = serviceClient.get({id: $routeParams.id});
  // Récupération de la liste des contact du client

  /* Fonction de création d'un nouveau contact*/
    $scope.contactCreate = function (customer) {
      alert(customer);
      /*si les champs sont remplis*/
      if (customer.contact != null || customer.contact != undefined) {
        /*envoi de la requete de création*/
          serviceClient.update({id: customer.name},customer,function() {
            /*Récupération de la nouvelle liste*/
            /*console.log(customer);*/
            $scope.customer = serviceClient.get({id: $routeParams.id});
            $scope.customer.contact = $scope.customer.contact || [];
          });
      }
      /*Redirection vers le liste des clients à jour*/
      $location.path('/customer/' + $routeParams.id + '/contact').replace();
    };

    /*Retour à la liste des contacts en cas d'appui sur la touche annuler*/
    $scope.contactReset = function() {
      $location.path('/customer/' + $routeParams.id + '/contact').replace();
    };


}]);

angular.module('myApp')
.controller('MachineCtrl', ['$scope', '$routeParams', '$location', 'serviceClient', function($scope, $routeParams, $location, serviceClient) {
  //Récuprération du client
  $scope.customer = serviceClient.get({id: $routeParams.id});
  //Récupération de la liste des machines
  $scope.customer.machine = $scope.customer.machine || [];
  //Définition de la variable machine
  $scope.machine = ($routeParams.cId) ? $scope.customer.machine[$routeParams.cId] : {};

  /* Fonction de création d'un nouveau machine*/
    $scope.machineCreate = function (customer) {
      alert(customer);
      /*si les champs sont remplis*/
      if (customer.machine != null || customer.machine != undefined) {
        /*envoi de la requete de création*/
          serviceClient.update({id: customer.name},customer,function() {
            /*Récupération de la nouvelle liste*/
            /*console.log(customer);*/
            $scope.customer = serviceClient.get({id: $routeParams.id});
            $scope.customer.machine = $scope.customer.machine || [];
          });
      }
      /*Redirection vers le liste des clients à jour*/
      $location.path('/customer/' + $routeParams.id + '/machine').replace();
    };

    /*Retour à la liste des machines en cas d'appui sur la touche annuler*/
    $scope.machineReset = function() {
      $location.path('/customer/' + $routeParams.id + '/machine').replace();
    };


}]);