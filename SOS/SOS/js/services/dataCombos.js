'use strict';

angular.module("app")
.service('dataCombos', function(api){
   var combos = {};
    
   combos.obtenEstados = function(){
       // return api.get("/buzon/estados");
       return api.post("/Services/WebServiceAPI.asmx/getEstados", null);
   }
   
   combos.obtenEmpleados = function(){
       // return api.get("/buzon/personal");
       return api.post("/Services/WebServiceAPI.asmx/dameEmpleados", null);
   }
   
   combos.obtenRamo = function(){
       // return api.get("/detalle/ramo");
       return api.post("/Services/WebServiceAPI.asmx/dameRamos", null);
   }
   
   combos.obtenPrioridad = function(){
       // return api.get("/detalle/prioridad");
       return api.post("/Services/WebServiceAPI.asmx/getPrioridad", null);
   }
   
   return combos;
});

