(function () {
    'use strict';
    angular.module('app', ['ui.bootstrap', 'ngMaterial', 'ngRoute', 'buzon', 'detailApp', 'otApp', 'login', 'admUser', 'agregarUser', 'enc'])
//    .constant("url", 'http://jsonplaceholder.typicode.com');
    .constant("url", 'http://localhost:3000')
   .run(function ($rootScope, $location, Auth, $window) //Auth
        {
    $rootScope.$on('$routeChangeStart', function (event) {

       // console.log($location.url());
        if (!Auth.isLoggedIn()) {
         //   console.log('DENY');
           // event.preventDefault();
        //    $window.location.href = '/login.html';
            $location.path('/login');
        }
        else {
          //  console.log('ALLOW');
           // $window.location.href = '/pagina1.html';
            //$location.path('/home');
        }
    });
})
    
    .controller("index", function(Auth, $window, $location){
        var i = this;
        
        i.isLogged = function()
        {
            return Auth.isLoggedIn();
        }
        
        i.esAdmin = function()
        {
            return Auth.esAdmin();
        }
        
        i.close = function()
        {
              $window.sessionStorage.clear();
        $location.path('/login');
        }
        
    }) ;
})();

