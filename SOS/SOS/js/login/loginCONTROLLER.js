(function(){
    'use strict';
    
    angular.module('login' ,['app'])
    .controller('loginCONTROLLER', function (api, Auth, $rootScope, $location, $window, $interval) {
        
        var login = this;
        login.messageError = "";
        login.usuario = "";
        login.password = "";
        login.activated = false;
  

        login.validaCodigo2 = function()
        {
             login.messageError = "";    

             login.activated = true;
            //sos.validacionCode.aparece = false;
            if((login.usuario === undefined || login.usuario == "") || (login.password === undefined || login.password == "" ))
            {
                 login.messageError = "";    
                  login.activated = false;
            }
            else
            {
                 var data = {
                    userName: login.usuario,
                    userPassword: login.password
                }
                //sos.seccion = $filter('uppercase')(sos.seccion);
                api.post("/login/verificaUsuario/", data)
              
                .then(function success(response) {

                    login.activated = false;
                    
                    
                     login.messageError = "";
                    Auth.setCredentials(response.data);
                
                    $location.path('/pagina1');
                    
                    
                    
                    
            }, function myError(response) {
                  
                    login.activated = false;
                    if(response.status == 500)
                    {
                         login.messageError = response.data;
                            
                    }

                });
            }
                     
       }


});
}());