'use strict';
var app = angular.module("detailApp", ['app', 'ngMaterial', 'ngMessages']);


app.controller("detailController", function ($scope, $http, api, $mdDialog, $filter, alertas, idCot, dataCombos, Auth) {
    $scope.nombre = ""; 
    $scope.posts = {};
    var det = this;
    $scope.bandMOD = false;

    var existe = false;
    $scope.bandPP = false;
    $scope.bandPS = false;
    $scope.bandPD = false;
    $scope.bandPA = false;
    $scope.bandPDS = false;
    $scope.bandPOT = false;
    
    
    var tabs =  [],
                selected = null,
                previous = null;
    $scope.tabs = tabs;
    $scope.tabs.bandEnable = true;
    var ordenT = {};
    
    $scope.muestraPanel = function(numP)
    {
        switch(numP)
        {
            case 1:
                if($scope.bandPS==false)
                    $scope.bandPS = true;
                else
                    $scope.bandPS = false;
            break;
            case 2:
                if($scope.bandPP==false)
                    $scope.bandPP = true;
                else
                    $scope.bandPP = false;
            break;
            case 3:
                if($scope.bandPD==false)
                    $scope.bandPD = true;
                else
                    $scope.bandPD = false;
            break;
            case 4:
                if($scope.bandPA==false)
                    $scope.bandPA = true;
                else
                    $scope.bandPA = false;
            break;
            case 5:
                if($scope.bandPDS==false)
                    $scope.bandPDS = true;
                else
                    $scope.bandPDS = false;
            break;
            case 6:
                if($scope.bandPOT==false)
                {
                     $scope.bandPOT = true;        
                }
                else
                    $scope.bandPOT = false;
            break;
        }
    };

   
    $scope.detalle = {};
    inicializadetalle();
    inicializaSOS();
    $scope.url = "http://localhost:3000/pdf/imprimeSOS/" + idCot;
    $scope.urlOT = "http://localhost:3000/pdf/imprimeOT/";
    $scope.urlLibera = "http://localhost:3000/pdf/imprimeLibera/" + idCot;

    function inicializadetalle()
    {
        $scope.detalle.idSOS = idCot;
    }
    
    function inicializaSOS()
    {
        
    }
    
 
    var modalConfDeleteOT = function() 
    {
      $mdDialog.show({
          autoWrap: true,
        skipHide: true,
        controllerAs: 'dialogCtrl',
          keyboard:false,
          keypress: false,
        controller: function($mdDialog)
        {
          this.click = function()
          {
              $scope.eliminaOT();
              $mdDialog.hide();
          }
          
          this.cancel = function()
          {
              $mdDialog.hide();
          }
        },
        template: '<md-dialog class="confirm" md-autofocus><div class="modal-header" style="background-color: #e55656; text-aling:center;"><h4 class="modal-title">ORDEN DE TRABAJO</h4></div><div class="modal-body" style="background-color: #e55656;"><p>¿Esta seguro que desea eliminar la Orden de Trabajo con Id: <strong>'+id+'</strong>?</p></div><div class="modal-footer" style="background-color: #e55656;"><button type="button" class="btn btn-default" ng-click="dialogCtrl.cancel()">Cancelar</button><button type="button" class="btn btn-default" data-dismiss="modal" ng-click="dialogCtrl.click()">Aceptar</button></div></md-dialog>', 
      })
    };
    
    api.get("/detalle/SOS/" + $scope.detalle.idSOS).then(function success(data) 
    {  
        console.log(data);
        $scope.posts = data.data;
        $scope.sos=data.data[0];
    })
    //--------------------------------------------------------------------------------------------//
    //------------------------------------------get  ramo-----------------------------------------//
    $scope.ramo =[];
    $scope.bandR = true;
    $scope.ramoSeleccionado={};
    $scope.labelRamo = "Introduzca un ramo";
    $scope.otroRamo = "";
 
    dataCombos.obtenRamo()
        .then(function success(data) {
            console.log(data);
            $scope.ramo = data.data;
         })
      
    
    $scope.compare = function() 
    {
        if($scope.ramoSeleccionado.nombreRamo == "Otro")
        {
            $scope.result = true;
            $scope.bandR = false;   
        }
    };
    
     $scope.cancelarRamo = function() 
    {
        $scope.result = false;
        $scope.bandR = true;
        $scope.ramoSeleccionado={
              idRamo:4,
              nombreRamo:"--Elige un ramo--"
            }
        $scope.otroRamo = "";
        $scope.labelRamo = "Introduzca un ramo";
    };
     
     $scope.checaPack=function()
     {
         /*if (!existe) {
             if (
                 $scope.detalle.empleadoN != null &&
                 
                 $scope.detalle.ramoN != null &&
                 $scope.detalle.tipomatenimientoN != null) {
                 api.post("/detalle/detalle", $scope.detalle)
                                    .then(function sucess(response) {
                                        console.log(response);
                                        $mdDialog.show({
                                            autoWrap: true,
                                            skipHide: true,
                                            controllerAs: 'dialogCtrl',
                                            controller: function ($mdDialog) {
                                                this.click = function () {
                                                    $mdDialog.hide();
                                                }
                                            },
                                            template: '<md-dialog class="confirm"><div class="modal-header" style="background-color: #e0faea; text-aling:center;"><h4 class="modal-title">Se a guardado exitosamente</h4></div><div class="modal-body" style="background-color: #e0faea;"><p>Se guardo</p></div><div class="modal-footer" style="background-color: #e0faea;"><button type="button" class="btn btn-default" data-dismiss="modal" ng-click="dialogCtrl.click()">Aceptar</button></div></md-dialog>',
                                        })
                                    });

             } else {
                 alertas.aviso("Faltan campos por llenar");
             }
         }
         else*/
         //{
             /*if (
                  $scope.detalle.empleadoN != null &&
                  $scope.detalle.prioridadN != null &&
                  $scope.detalle.ramoN != null &&
                  $scope.detalle.tipomatenimientoN != null) {
                  api.post("/detalle/detalleMOD", $scope.detalle)
                                    .then(function sucess(response) {
                                        console.log(response);
                                        $mdDialog.show({
                                            autoWrap: true,
                                            skipHide: true,
                                            controllerAs: 'dialogCtrl',
                                            controller: function ($mdDialog) {
                                                this.click = function () {
                                                    $mdDialog.hide();
                                                }
                                            },
                                            template: '<md-dialog class="confirm"><div class="modal-header" style="background-color: #e0faea; text-aling:center;"><h4 class="modal-title">Se a guardado exitosamente</h4></div><div class="modal-body" style="background-color: #e0faea;"><p>Se guardo</p></div><div class="modal-footer" style="background-color: #e0faea;"><button type="button" class="btn btn-default" data-dismiss="modal" ng-click="dialogCtrl.click()">Aceptar</button></div></md-dialog>',
                                        })
                                      
                                    });

             } else {
                 alertas.aviso("Faltan campos por llenar");
             }*/
         //}
         if(verificaEmpleado()==true)
             if(verificaPrioridad()==true)
                if(verificaRamo() == true)
                    if(verificaTipoMant() == true)
                    {
                        if (!existe)
                        {
                            api.post("/detalle/detalle", $scope.detalle)
                                    .then(function sucess(response) {
                                        console.log(response);
                                        alertas.aviso("Se a guardado exitosamente");
                                    });
                        }
                        else
                        {
                            api.post("/detalle/detalleMOD", $scope.detalle)
                                    .then(function sucess(response) {
                                        console.log(response);
                                        alertas.aviso("Se a guardado exitosamente");
                                    });
                        }
                    }
                
     }
     
     var verificaEmpleado = function()
     {
         if($scope.detalle.empleadoN == null)
         {
             alertaValidacionDet("operario", "Asignación");
             $scope.bandPA = true;
             return false;
         }
         else
         {
             return true;
         }
     }
     
     var verificaPrioridad = function()
     {
         if($scope.detalle.prioridadN == null)
         {
             alertaValidacionDet("prioridad", "Detalle de servicio");
             $scope.bandPDS = true;
             return false;
         }
         else
             return true;
     }
     
     var verificaRamo = function()
     {
         if($scope.detalle.ramoN == null)
         {
             alertaValidacionDet("ramo", "Detalle de servicio");
             $scope.bandPDS = true;
             return false;
         }
         else
             return true;
     }
     
     var verificaTipoMant = function()
     {
         if($scope.detalle.tipomatenimientoN == null)
         {
             alertaValidacionDet("tipo de Mantenimiento", "Detalle de servicio");
             $scope.bandPDS = true;
             return false;
         }
         else
             return true;
     }
     
     $scope.cancelarModif = function()
     {
         $scope.bandMOD = false;
     }
     $scope.modificarSOS = function modificarSOS() 
     {
         $scope.bandMOD = true;
         $scope.bandPP = true;
         $scope.bandPD = true;
         $scope.bandPS = true;
     }
    
     $scope.guardaSOS = function guardaSOS() {
         $scope.sos.hraDispI1 = $filter('date')($scope.sos.hraDispI1, 'HH:mm:ss');
         $scope.sos.hraDispI2 = $filter('date')($scope.sos.hraDispI2, 'HH:mm:ss');
         $scope.sos.hraDispF1 = $filter('date')($scope.sos.hraDispF1, 'HH:mm:ss');
         $scope.sos.hraDispF2 = $filter('date')($scope.sos.hraDispF2, 'HH:mm:ss');
         $scope.bandMOD = false;
         console.log($scope.sos);
         ///modSOS
         api.post("/detalle/modSOS",$scope.sos).then(function success(data) {
             $mdDialog.show({
                 autoWrap: true,
                 skipHide: true,
                 controllerAs: 'dialogCtrl',
                 controller: function ($mdDialog) {
                     this.click = function () {
                         $mdDialog.hide();
                     }
                 },
                 template: '<md-dialog class="confirm"><div class="modal-header" style="background-color: #e0faea; text-aling:center;"><h4 class="modal-title">Solicitud de orden de trabajo</h4></div><div class="modal-body" style="background-color: #e0faea;"><p>Se a guardado exitosamente</p></div><div class="modal-footer" style="background-color: #e0faea;"><button type="button" class="btn btn-default" data-dismiss="modal" ng-click="dialogCtrl.click()">Aceptar</button></div></md-dialog>',
             })
             api.get("/detalle/SOS/" + $scope.detalle.idSOS).then(function success(data) {

                 console.log(data);
                 $scope.posts = data.data;
                 $scope.sos = data.data[0];
                 console.log('sos');
                 console.log($scope.sos);
             })
         })
        
    }
    //--------------------------------------------------------------------------------------------//
    //----------------------------------------get  operador---------------------------------------//
    $scope.operadorOT ={operador:[], selected: {}};
    $scope.operadorSeleccionado = {};
   

    api.get("/detalle/empleado").then(function success(data) {
                    console.log(data);
                    $scope.operador = data.data;
                    $scope.operador.selected = '';
                    $scope.operadorOT.operador = data.data;
                    
                    //$scope.makeArr();
    })
    
    //----------------------------------------get usuario-----------------------------------------//
    /*api.get("/detalle/usuarios").then(function success(data) 
    {  
        console.log("usuario");
        console.log(data);
        //$scope.posts = data.data;
        //$scope.sos=data.data[0];
    })*/
    
    //$scope.usuarios = [];

         //api.get("/adm/dameUsuariosID/" + $scope.posts[8].idUsuario ).then(function success(data) {
         //console.log(data);
         //$scope.usuarios = data.data;})
   

    //--------------------------------------------------------------------------------------------//
    //----------------------------------------get  prioridad--------------------------------------//
    $scope.prioridad = [];
    $scope.prioridadSel = {};

    dataCombos.obtenPrioridad()
        .then(function success(data) {
        
                    console.log(data);
                    $scope.prioridad = data.data;

                    api.get("/detalle/detalle/" + $scope.detalle.idSOS).then(function success(data) {

                        console.log(data);
                        if (data.status==200)
                        {
                        var dat = data.data[0];
                        //prioridad
                        $scope.detalle.prioridadN = {};
                        $scope.detalle.prioridadN.prioridad = dat.prioridad;
                        $scope.detalle.prioridadN.color = dat.color;
                        $scope.detalle.prioridadN.idPrioridad = dat.idPrioridad;
                        //ramo
                        $scope.detalle.ramoN = {};
                        $scope.detalle.ramoN.nombreRamo = dat.nombreRamo;
                        $scope.detalle.ramoN.idRamo = dat.idRamo;
                        //empleado
                        $scope.detalle.empleadoN = {};
                        $scope.detalle.empleadoN.nombreEmpleado= dat.nombreEmpleado;
                        $scope.detalle.empleadoN.idEmpleado = dat.idEmpleado;
                        $scope.detalle.empleadoN.cargo = dat.cargo;
                        //Tipo de mantenimiento
                        $scope.detalle.tipomatenimientoN={};
                        $scope.detalle.tipomatenimientoN.tipoMantenimiento = dat.tipoMantenimiento;
                        $scope.detalle.tipomatenimientoN.idTipoMant = dat.idTipoMant;

                        $scope.detalle.comentario = dat.comentarios;
                        $scope.detalle.idSOS = dat.idDetalleSOS;
                        $scope.sos.NombreUsuario = dat.NombreUsuario
                        existe = true;
                        } 
                    })

                 })
    //--------------------------------------------------------------------------------------------//
    //--------------------------------get  tipo de Mantenimiento----------------------------------//
    $scope.tipoMant = [];
    $scope.tipoMantSel = {};
    $scope.bandM = true;
    $scope.labelTipoM = "Introduzca un tipo de Mantenimiento";
    $scope.otroTipoM = "";
    
    api.get("/detalle/tipoMantenimiento").then(function success(data) {
        
                    console.log(data);
                     $scope.tipoMant = data.data;
                 })
    $scope.compareMant = function() 
    {
        if($scope.tipoMantSel.tipoMantenimiento == "Otro")
        {
            $scope.resultM = true;
            $scope.bandM = false;   
        }
    };
    
     $scope.cancelarMant = function() 
    {
        $scope.resultM = false;
        $scope.bandM = true;
        $scope.tipoMantSel={
              idRamo:4,
              nombreRamo:"--Elige un tipo de Mantenimiento--"
            }
        $scope.otroTipoM = "";
    };
    //------------------------------------------------------------------//
    //Alerta para alta de detalle
    $scope.formData = {};
    $scope.submitForm = function (formData) 
    {
          var conf = alertas.confirma("Seguro de levantar la orden de solicitud?", "Se realizara con el seguimiento de la incidencia");

          $mdDialog.show(conf).then(

              );
        
     };
    
    //---------------------------------------------------------------------------//
    //por el momento no se usa, pero si se tratara de validar de manera diferente la utilizaria
    $scope.checkTableVal = function()
    {
        $scope.bandV=false;
        angular.forEach($scope.itemDetails, function(itemDetail) {
            alert(itemDetail.unidad);
            if(itemDetail.unidad != "")
            {
                 $scope.bandV=true;       
            }
        });
        
         return $scope.bandV;
    };
    
    $scope.verSOS = function(ev, idC)
    {        
        idCotiPaDeta = $scope.detalle.idSOS;
        console.log(idCotiPaDeta);
        $scope.status = "";
        $rootScope.idCotiPaDeta = idCotiPaDeta;
           $mdDialog.show({
          controller: "woController as w",
          templateUrl: 'ordenTrabajo.html',
          parent: angular.element(document.body),
          targetEvent: ev,
           keyboard: false,
           show:false
        })
        .then(function(answer) {
         //scope.status = 'You said the information was "' + answer + '".';
        }, function() {
        //scope.status = 'You cancelled the dialog.';
        });
    };
    
    //---------------------------ORDEN DE TRABAJO-----------------------//
  
    $scope.selectedIndex = 0;
    var tabActual = {};
    
    //Obtener ordenes de trabajo de la BD
    api.get("/detalle/ordenTrabajo/" + $scope.detalle.idSOS).then(function success(data) 
    {  
        console.log(data);
        $scope.tabs = data.data;
    });
    
    $scope.$watch('selectedIndex', function(current, old){
      previous = selected;
      selected = tabs[current];
    });
    $scope.addTab = function (title) 
    {
        var hoy = new Date();
        var dd = hoy.getDate();
        var mm = hoy.getMonth()+1; //hoy es 0!
        var yyyy = hoy.getFullYear();

        hoy = yyyy+'/'+mm+'/'+dd;

        $scope.tabs.push({ title:"",idOT:"", idSOS: $scope.posts[0].idSOS, idDetalleSOS: "", accion:"", operario: "", idOperario: "" , fecha: hoy, hraIniOT: "",  instruccion: "", hraAtencion: "", reporte: "", descripcion: $scope.posts[0].descripcion, estado: "Sin guardar", save: 0 });
    };
  
    var removeTab = function (tab) {
      var index = $scope.tabs.indexOf(tab);
      $scope.tabs.splice(index, 1);
    };
    
    $scope.guardarOT = function(index)
    {
        if(validaCampoAccion(index) == true)
            if(validaCampoOperario(index)==true)
                if(validaCampoIntrucc(index)==true)
                    if(validaCampoReporte(index)==true)
                    {
                        llenaOT();
                        if(ordenT.idOT == "")
                        {
                            altaOT();
                        }
                        else
                        {
                            modificaOT();
                        }
                    }
    }
    
    var validaCampoAccion = function(index)
    {
        if($scope.tabs[index].accion=="")
        {
            alertaValidacion(" ACCIÓN ");
            return false;
        }
        else
            return true;
    }
    
    var validaCampoOperario = function(index)
    {
        if($scope.tabs[index].operario=="")
        {
            alertaValidacion(" OPERARIO ");
            return false;
        }
        else
            return true;
    }
    
    var validaCampoIntrucc = function(index)
    {
        if($scope.tabs[index].instruccion=="")
        {
            alertaValidacion(" INSTRUCCIÓN ");
            return false;
        }
        else
            return true;
    }
    
    var validaCampoReporte = function(index)
    {
        if($scope.tabs[index].reporte=="")
        {
            alertaValidacion(" REPORTE ");
            return false;
        }
        else
            return true;
    }
    
    var altaOT = function()
    {
        llenaOT();//prepare JSON
        console.log(ordenT);
        api.post("/detalle/ordenTrabajo",ordenT)
        .then(function sucess(response) 
        {
            console.log("insercion correcta");
            alertaAlta();
            limpiaOT();
            actualizaValores();
        }, function myError(response) {
            console.log("Error al insertar Orden de Trabajo");
            alertaError();
            });
    }
    
    var modificaOT = function()
    {
        llenaOT();
        console.log(ordenT);
        
        api.post("/detalle/updateOT",ordenT)
        .then(function sucess(response) 
        {
            console.log("modificacion correcta");
            actualizaValores();
            alertaModifica();
            limpiaOT();
        }, function myError(response) {
            console.log("Error en modificación de Orden de Trabajo");
            alertaError();
        });
    }

    $scope.eliminaOT = function()
    {
        llenaOT();
        console.log(ordenT);

        if(ordenT.idOT != "")
        {
            api.post("/detalle/deleteOT",ordenT)
            .then(function sucess(response) 
            {
                console.log("eliminacion correcta");
                alertaBaja();
                limpiaOT();
                actualizaValores();
            }, function myError(response) {
                console.log("Error al insertar Orden de Trabajo");
                alertaError();
            });
        }
    }
    
    $scope.updateOT = function()
    {
        $scope.tabs[$scope.selectedIndex].save = false;
        $scope.tabs[$scope.selectedIndex].estado = "Modificación no guardada";
    }
    
    var deleteOT = function(idOT)
    {
        modalConfDeleteOT(idOT);
    }
    
    $scope.eliminarOT = function(objTab)
    {
        llenaOT();

        if(ordenT.idOT != "")
        {
            var idOrden = ordenT.idOT;
            deleteOT(idOrden);
        }
        else
        {
            removeTab(objTab);
        }
            
    }
    var limpiaOT = function()
    {
        ordenT = {};  
    }

    var actualizaValores = function()
    {
        api.get("/detalle/ordenTrabajo/" + $scope.posts[0].idSOS).then(function success(data) 
        {  
            console.log(data);
            $scope.tabs = data.data;
        })
    }
    
    var llenaOT = function()
    {
        //prepare the JSON 
        getCurrentTab();
        ordenT = {};
        $scope.fecha1 = new Date();
        var hora1 = $filter('date')(tabActual.hraIniOT, 'HH:mm:ss');
        var hora2 = $filter('date')(tabActual.hraAtencion, 'HH:mm:ss');
        //idDetSOS no esta validado para su funcionamiento, estaba esperando la alta detalle
        ordenT = {
            idOT: tabActual.idOT,
            idSOS: $scope.posts[0].idSOS,
            idDetalleSOS: $scope.posts[0].idDetalleSOS,
            accion: tabActual.accion,
            operario: tabActual.operario.nombreEmpleado,
            idOperario: tabActual.operario.idEmpleado,
            fecha: tabActual.fecha,
            hraIniOT: hora1,
            instruccion: tabActual.instruccion,
            hraAtencion: hora2,
            reporte: tabActual.reporte,
            descripcion: $scope.posts[0].descripcion,
            estado: "Guardado",
            save: true,
        };
    }
    
    var getCurrentTab = function()
    {
        tabActual = $scope.tabs[$scope.selectedIndex];
    }
    
    $scope.setFecha = function(valor)
    {
        $scope.tabs[valor].fecha = new Date($scope.tabs[valor].fecha);
    }
    
    $scope.setHora1 = function(valor)
    {
        var hora = new Date("1990-12-28 "+$scope.tabs[valor].hraIniOT);
        
        $scope.tabs[valor].hraIniOT = hora;
    }
    
    $scope.setHora2 = function(valor)
    {
        $scope.tabs[valor].hraAtencion = new Date("1990-12-28 "+$scope.tabs[valor].hraAtencion);
    }
    
    $scope.setOperario = function(valor)
    {
        $scope.result = $filter('filter')($scope.operador, {nombreEmpleado: $scope.tabs[valor].operario})[0];
        $scope.tabs[valor].operario = $scope.result;
    }
    
    var alertaError = function() 
    {
      $mdDialog.show({
          autoWrap: true,
        skipHide: true,
        controllerAs: 'dialogCtrl',
        controller: function($mdDialog)
          {
          this.click = function()
          {
              $mdDialog.hide();
          }
        },
        template:  '<md-dialog class="confirm" md-autofocus><div class="modal-header" style="background-color: #e55656; text-aling:center;"><h4 class="modal-title">ERROR</h4></div><div class="modal-body" style="background-color: #e55656;"><p>Ocurrió un error, intentelo otra vez</p></div><div class="modal-footer" style="background-color: #e55656;"><button type="button" class="btn btn-default" data-dismiss="modal" ng-click="dialogCtrl.click()">Aceptar</button></div></md-dialog>',
      })
    };
    
    var alertaAlta = function() 
    {
      $mdDialog.show({
          autoWrap: true,
        skipHide: true,
        controllerAs: 'dialogCtrl',
        controller: function($mdDialog)
          {
          this.click = function()
          {
              $mdDialog.hide();
          }
        },
        template:  '<md-dialog class="confirm" md-autofocus><div class="modal-header" style="background-color: #e0faea; text-aling:center;"><h4 class="modal-title">ORDEN DE TRABAJO</h4></div><div class="modal-body" style="background-color: #e0faea;"><p>La alta se realizó con éxito</p></div><div class="modal-footer" style="background-color: #e0faea;"><button type="button" class="btn btn-default" data-dismiss="modal" ng-click="dialogCtrl.click()">Aceptar</button></div></md-dialog>',
      })
    };
    
    var alertaModifica = function() 
    {
      $mdDialog.show({
        autoWrap: true,
        skipHide: true,
        controllerAs: 'dialogCtrl',
        controller: function($mdDialog)
          {
          this.click = function()
          {
              $mdDialog.hide();
          }
        },
        template:  '<md-dialog class="confirm" md-autofocus><div class="modal-header" style="background-color: #e0faea; text-aling:center;"><h4 class="modal-title">ORDEN DE TRABAJO</h4></div><div class="modal-body" style="background-color: #e0faea;"><p>La modificación se realizó con éxito</p></div><div class="modal-footer" style="background-color: #e0faea;"><button type="button" class="btn btn-default" data-dismiss="modal" ng-click="dialogCtrl.click()">Aceptar</button></div></md-dialog>',
      })
    };
    
    var alertaBaja = function() 
    {
      $mdDialog.show({
          autoWrap: true,
        skipHide: true,
        controllerAs: 'dialogCtrl',
        controller: function($mdDialog)
          {
          this.click = function()
          {
              $mdDialog.hide();
          }
        },
        template:  '<md-dialog class="confirm" md-autofocus><div class="modal-header" style="background-color: #e0faea; text-aling:center;"><h4 class="modal-title">ORDEN DE TRABAJO</h4></div><div class="modal-body" style="background-color: #e0faea;"><p>La Eliminación se realizó con éxito</p></div><div class="modal-footer" style="background-color: #e0faea;"><button type="button" class="btn btn-default" data-dismiss="modal" ng-click="dialogCtrl.click()">Aceptar</button></div></md-dialog>',
      })
    };
    
    var alertaValidacion = function(nameControl) 
    {
      $mdDialog.show({
          autoWrap: true,
        skipHide: true,
        controllerAs: 'dialogCtrl',
        controller: function($mdDialog)
          {
          this.click = function()
          {
              $mdDialog.hide();
          }
        },
        template:  '<md-dialog class="confirm" md-autofocus><div class="modal-header" style="background-color: #ea4c4c; text-aling:center;"><h4 class="modal-title">ERROR DE VALIDACIÓN</h4></div><div class="modal-body" style="background-color: #ea4c4c;"><p>Verifique que el campo<strong>'+nameControl+'</strong>contenga un valor, es un campo requerido.</p></div><div class="modal-footer" style="background-color: #ea4c4c;"><button type="button" class="btn btn-default" data-dismiss="modal" ng-click="dialogCtrl.click()">Aceptar</button></div></md-dialog>',
      })
    };
    
    var alertaValidacionDet = function(nameControl, seccion) 
    {
      $mdDialog.show({
          autoWrap: true,
        skipHide: true,
        controllerAs: 'dialogCtrl',
        controller: function($mdDialog)
          {
          this.click = function()
          {
              $mdDialog.hide();
          }
        },
        template:  '<md-dialog class="confirm" md-autofocus><div class="modal-header" style="background-color: #ea4c4c; text-aling:center;"><h4 class="modal-title">ERROR DE VALIDACIÓN</h4></div><div class="modal-body" style="background-color: #ea4c4c;"><p>Verifique que el campo<strong> '+nameControl+' </strong> de la sección <strong>'+seccion+'</strong> <br>contenga un valor, es un campo requerido.</p></div><div class="modal-footer" style="background-color: #ea4c4c;"><button type="button" class="btn btn-default" data-dismiss="modal" ng-click="dialogCtrl.click()">Aceptar</button></div></md-dialog>',
      })
    };
    //-----------------------------------------------------------------------------//
    
    $scope.esAdmin = function()
    {
        return Auth.esAdmin();
    }
    
});

