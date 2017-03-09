'use strict';

angular.module("app")
.service('dataCombos', function(api){
   var combos = {};
    
   combos.obtenEstados = function(){
       return api.get("/buzon/estados");
   }
   
   combos.obtenEmpleados = function(){
       return api.get("/buzon/personal");
   }
   
   combos.obtenRamo = function(){
       return api.get("/detalle/ramo");
   }
   
   combos.obtenPrioridad = function(){
       return api.get("/detalle/prioridad");
   }
   
   return combos;
});

