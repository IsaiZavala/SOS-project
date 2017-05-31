/// <reference path="buzonController.js" />
'use strict';

angular.module('buzon')
.controller('buzonController', function (alertas, api, dataCombos, $mdDialog, $http, $rootScope, Auth, $window, $location) {
    var scope = this;
    
         
    scope.arraySOS = [];
    scope.estadosSOS = [];
    scope.empleados = [];
    scope.idCoti = "";
    scope.search = {};
    scope.filtro = {}
    scope.ramo = {};

    scope.filtroBusqueda = "";
    scope.search.selectedPrioridad = "";
    var aceptados = false;
    var feltro = "";
    var tab = 0;
    scope.sortReverse = false;
    scope.sortType = "idSOS";
    scope.loadActivated = false;
    
    var idEdo = "";
    
    cargaInicio();
    
    scope.cancelarFiltro = function()
    {
        scope.filtro = {} 
        scope.busquedaOpcionSelected = ''; 
        scope.search.selectedPrioridad = '';
        scope.search.selectedNoSOS = '';
        scope.search.selectedEstado = '';
        scope.search.selectedRamo = '';
        scope.search.selectedAsunto = '';
    }
    
    
    scope.setFiltro = function(index, band)
    {
        
        if(index == 1)
            {
                tab = index;
            obtenSOSs(1);
            }
        if(index == 2)
            {
                tab = index;
            obtenSOSs(2);
            }
         if(index == 3)
             {
                 tab = index;
            obtenSOSs(3);
             }
    }
    
    scope.ajustaFiltro = function()
    {
         if(scope.busquedaOpcionSelected == 'Prioridad')
            scope.filtro.prioridad = scope.search.selectedPrioridad.prioridad; 
        if(scope.busquedaOpcionSelected == 'Estado')
            scope.filtro.Nombre = scope.search.selectedEstado.Nombre;
        if(scope.busquedaOpcionSelected == 'No.SOS')
            scope.filtro.idSOS = scope.search.selectedNoSOS;
         if(scope.busquedaOpcionSelected == 'Ramo')
            scope.filtro.nombreRamo = scope.search.selectedRamo.nombreRamo;
        if(scope.busquedaOpcionSelected == 'Asunto')
            scope.filtro.asunto = scope.search.selectedAsunto;
    }
    
    function checkSOS(element)
    {
        return element.idSOS == scope.idCoti;
    }
    
    function checkStatus(element)
    {
        return element.IdEstado == idEdo;
    }
    
    scope.verSOS = function(ev, idC)
    {        
       
           $mdDialog.show({
          controller: "detailController",
          locals: { idCot: idC },
          templateUrl: 'detalleSOS.html',
          targetEvent: ev,
          clickOutsideToClose:true,
        })
            .finally(function(){
               
                scope.idCoti = idC;      
        var el = scope.arraySOS.find(checkSOS);     
        if(el.IdEstado == 1 && Auth.esAdmin())
        {                          
            idEdo = 2;
            var sta = scope.estadosSOS.find(checkStatus);
                var data = {
                    idStatus: 2,
                    idSOS: idC,
                    estado: sta.Nombre
                    }
        
        
                    cambiaStatus(data);
        }
               
               
               
        });
//        .then(function(answer) {
//               obtenSOSs(tab);
//       //  scope.status = 'You said the information was "' + answer + '".';
//        }, function() {
//    //    scope.status = 'You cancelled the dialog.';
//        });
    };

    //mostrar encuesta
    scope.verENCUESTA = function (ev, idC) {
            $mdDialog.show({
            controller: "encuestaController as enc",
                locals: { idCot: idC },
                //locals: { idCot:1},
            templateUrl: 'rosel.html',
            targetEvent: ev,
            clickOutsideToClose: true,
        })
           .finally(function () {

           });
    };

    
    function cargaInicio()
    {
        obtenSOSs(1);
        obtenCombos();
    }
    
    function obtenCombos()
    {
       obtenComboEstados();
       obtenComboEmpleados();
       obtenComboPrioridad();
       obtenComboRambo();
    }
    
    function obtenComboRambo()
    {
        dataCombos.obtenRamo()
          .then(function success(data) {
            scope.ramo = data.data.d;
         }, function err(res){
            
        });
    }
    
    function obtenComboPrioridad()
    {
        dataCombos.obtenPrioridad()
          .then(function succ(res){
            scope.prioridad = res.data.d;
        }, function err(res){
            
        });
    }
    
    
    function obtenComboEmpleados()
    {
        dataCombos.obtenEmpleados()
          .then(function succ(res){
          //   console.log(res.data);
            scope.empleados = res.data.d;
            scope.selectedEmpleado = scope.empleados[0];

        }, function err(res){
          //  console.log(res);
        });
        
    }
    
    
    function obtenComboEstados()
    {
        dataCombos.obtenEstados()
            .then(function succ(res){
         //console.log(res.data);
            scope.estadosSOS = res.data.d;
           scope.selectedStatus = scope.estadosSOS[0];
        }, function err(res){
          //console.log(res);
        });
    }
//         api.get("/buzon/estados")
//        .then(function succ(res){
//             console.log(res.data);
//            scope.estadosSOS = res.data;
//        }, function err(res){
//            console.log(res);
//        });
    
    
    
    function obtenSOSs(band)
    {
        scope.loadActivated = true;

        var idRol =  $window.sessionStorage.getItem('idRol');
        var idUsu = $window.sessionStorage.getItem('idUsuario');
        var datoss = { bandera: band, idRol: parseInt(idRol), idUsuario: parseInt(idUsu) };

    //    usuario.consulta();
        //api.post("/buzon/sos", datoss)
        api.post("/Services/WebServiceAPI.asmx/buzonSOS", JSON.stringify({ 'data': datoss}))
        .then(function succ(res){
                    scope.loadActivated = false;

            // console.log(res.data);
            scope.arraySOS = res.data.d;
        }, function err(res){
            scope.loadActivated = false;
            console.log(res.data); 
        });
    }
    
    scope.abreStatus = function(idSOS)
    {
         scope.idCoti = idSOS;
        $("#modalStatus").modal();
       
    }
    
     scope.abreReasignar = function(idSOS)
    {
         scope.idCoti = idSOS;
        $("#modalReasignar").modal();
       
    }
     
     scope.confirmaStatus = function()
     {
       //  console.log(scope.selectedStatus.IdEstado);
       //  console.log(scope.idCoti);
         
         var conf = alertas.confirma("¿Seguro de cambiar el estatus?", "Se cambiara el estado del SOS: " + scope.idCoti + " a: " + scope.selectedStatus.Nombre);
         
           $mdDialog.show(conf).then(function () 
           {
                 var data = {
                     idSOS: scope.idCoti,
                     idStatus: scope.selectedStatus.IdEstado
                    };
               
               cambiaStatus(data);
               actualizaBuzon();
               
            },
            function () 
            {
             //   console.log("adios");
            });

       
       
     }
     
     function cambiaStatus(data)
    {
          
         api.post("/buzon/reasignaStatus", data)
            .then(function succ(res){
         //   console.log(res.data);
                        if(data.estado != undefined)
                             alertas.aviso("Se reasigno el status a:" + data.estado);
             else
             alertas.aviso("Se reasigno el status a:" + scope.selectedStatus.Nombre);
             
             actualizaBuzon(tab);
             // actualizaBuzon();
            //obtenSOSs();
        }, function err(res){
         //  console.log(res.data); 
        });
    }
     
     scope.actualizaEmpleado = function(idDetalle)
     {
       //  console.log(scope.selectedEmpleado.idEmpleado);
       //  console.log(scope.idCoti);
         
         var data = {
             idDeta: scope.idCoti,
             idEmpleado: scope.selectedEmpleado.idEmpleado
         };
         
         api.post("/buzon/reasignaEmpleado", data)
          .then(function succ(res){
         //   console.log(res.data);
             alertas.aviso("Se reasigno el SOS a:" + scope.selectedEmpleado.nombreEmpleado);
          
        }, function err(res){
         //  console.log(res.data); 
        });
     }
     
    
    
    scope.cerrarSOS = function(idSOS)
    {
        var conf = alertas.confirma("¿Seguro de cerrar el SOS?", "El SOS quedara como SOS resuelto");
        
        $mdDialog.show(conf).then(function () 
        {
             var data = {
                     idSOS: idSOS,
                     idStatus: 5
                    };
               
               cambiaStatus(data);
             // actualizaBuzon();
        },
        function () 
        {
        //    console.log("adios");
        });
    }
    
    scope.cancelarSOS = function(idSOS)
    {
        var conf = alertas.confirma("Cancelar SOS", "Ya no se dara seguimiento al SOS");
        
          $mdDialog.show(conf).then(function () 
        {
               var data = {
                     idSOS: idSOS,
                     idStatus: 6
                    };
               
               cambiaStatus(data);
             //  actualizaBuzon();
        },
        function () 
        {
          //  console.log("adios");
        });
    }
    
    function actualizaBuzon()
    {
        if(tab == 1)
            obtenSOSs(1);
        if(tab == 2)
            obtenSOSs(2);
        if(tab == 3)
            obtenSOSs(3);
    }
    
    scope.esAdmin = function()
    {
        return Auth.esAdmin();
    }
    
    scope.logOut = function()
    {
        $window.sessionStorage.clear();
        $location.path('/login');
     //   Auth.logOut();
    }
    
});