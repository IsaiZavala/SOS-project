(function(){
'use strict';

angular.module("app")
.service('alertas', function($mdDialog){
   var alerta = {};
    
    alerta.aviso = function(cadena){
        $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title('')
                .textContent(cadena)
                .ariaLabel('Alert Dialog Demo')
                .ok('Aceptar')
                //.target(ev)
         
            );
    }
    
    alerta.confirma = function(cadena1,cadena2){
        var confirm = $mdDialog.confirm()
                  .title(cadena1)
                  .textContent(cadena2)
                  .ariaLabel('Lucky day')
                //  .targetEvent(ev)
                  .ok('Aceptar')
                  .cancel('Cancelar');
        
        return confirm;
         
    }
    
    return alerta;
});
}());