(function(){
'use strict';

angular.module("app")
.service('Auth', function($rootScope, $window){
   var auth = {};
    $window.sessionStorage.user = {};
    
    auth.isLoggedIn = function(){
        var idRol = $window.sessionStorage.getItem('idRol');
        if(idRol == null)
            return false;
        else
            return true;
    } 
    
    auth.setCredentials = function(data){
//        $rootScope.user = {
//                    idRol: data.idRol,
//                    idUsuario: data.idUsuario,
//                };
          $window.sessionStorage.setItem('idRol', data.idRol);
          $window.sessionStorage.setItem('idUsuario', data.idUsuario);
          $window.sessionStorage.setItem('nombreUsu', data.NombreUsuario);
            }
    
  
    
    
    auth.esAdmin = function(cadena){
        
       if($window.sessionStorage.getItem('idRol') == 1)
           return true;
        else 
            return false;
    }

    auth.esSoli = function() {
        if ($window.sessionStorage.getItem('idRol') == 2)
            return true;
        else
            return false;
    }
    
    auth.getNombreUsu = function()
    {
        return $window.sessionStorage.getItem('nombreUsu');
    }
    
    auth.getIdUsu = function()
    {
        return $window.sessionStorage.getItem('idUsuario');
    }

    
    auth.consulta = function(){
  //      var s = $window.sessionStorage.user.idRol;
    //    var d = $window.sessionStorage.user.idUsuario;
    }
    
    auth.logOut = function(){
    //    $window.sessionStorage.clear();
      //  $window.location.href = '/login.html'
      //  $location.path('/login');
    }
        
    
     
    return auth;
});
}());