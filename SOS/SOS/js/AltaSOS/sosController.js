(function(){
    'use strict';
    
    angular.module('app')
    .controller('sosController', function (alertas, api, $mdDialog, $interval, $filter, Auth) {
        var sos = this;
        sos.solicitante = {};
        sos.seccion = "";
        sos.descripcion = "";
        sos.ordenID = "";
        sos.asunto = "";
        sos.validacionCode = {
            aparece: false,
            valido: false,
            server: true
        };
        sos.activated = false;
        sos.enviaActivated = false;
        var eseoese = {};
        sos.fechaHoy = new Date();
        sos.ErrorMessage = "";
        
        cargaDatos();
        
        function cargaDatos()
        {
            sos.solicitante.nombre = Auth.getNombreUsu();
        }
        
    
        var validaInformante = function()
        {
            var band = true;
            if(sos.solicitante.telefono == undefined && sos.solicitante.celular == undefined)
                {
                    alertas.aviso("Introduce por lo menos un telefono");
                    band = false;
                }
            else
                if(sos.solicitante.hora1 == undefined || sos.solicitante.hora2 == undefined)
                {
                     alertas.aviso("Introduce el horario");
                     band = false;
                }
            
            return band;
        }
        
        var validaDescripcion_Codigo = function()
        {
            var band = true;
            if(sos.seccion == "")
                {
                    alertas.aviso("Introduce la seccion");
                    band = false;
                }
            else
                if(sos.descripcion == "")
                    {
                        alertas.aviso("Introduce la descripcion");
                        band = false;
                    }
            
            return band;
        }
        
        var validaAsunto = function()
        {
            var band = true;
            if(sos.asunto == "")
                {
                    alertas.aviso("Introduzca asunto de SOS");
                    band = false;
                }
            
            return band;
        }
        
        var llenaS0S = function () {
            
            var idUsu = parseInt(Auth.getIdUsu());
            
            sos.informante= {};
            sos.informante.hora1 = $filter('date')(sos.solicitante.hora1, 'HH:mm:ss');
            sos.informante.hora2 = $filter('date')(sos.solicitante.hora2, 'HH:mm:ss');
            sos.informante.hora3 = $filter('date')(sos.solicitante.hora3, 'HH:mm:ss');
            sos.informante.hora4 = $filter('date')(sos.solicitante.hora4, 'HH:mm:ss');
            sos.informante.nombre = 'Julia';
            sos.informante.celular = sos.solicitante.celular;
            sos.informante.telefono = sos.solicitante.telefono;
            eseoese = {
                fechaReporte: new Date(),
                informante: sos.informante,
                claveCadena: sos.seccion,
                descripcion: sos.descripcion,
                asunto:  sos.asunto,   
                idUsuario: idUsu,
                hraDispI1: sos.informante.hora1,
                hraDispI2: sos.informante.hora2,
                hraDispF1: sos.informante.hora3,
                hraDispF2: sos.informante.hora4,
                tel: sos.informante.telefono,
                cel: sos.informante.celular
            };
        }
        
        
        
        sos.enviaSOS = function(){
            
            if(validaInformante())
                if(validaDescripcion_Codigo())
                    if(validaAsunto())
                    {
                        if(sos.validacionCode.valido)
                        {
                            var conf = alertas.confirma("Seguro de levantar la orden de solicitud?", "Se realizara con el seguimiento de la incidencia");
                            $mdDialog.show(conf).then(function () {
                                sos.enviaActivated = true;
                                llenaS0S();
                                // api.post("/alta/SOS",eseoese)
                                api.post("/Forms/WebServiceAPI.aspx/SOS", JSON.stringify({ 'data': eseoese }))
                                .then(function sucess(response)
                                {
                                    // console.log(response.data);
                                    sos.enviaActivated = false;
                                    sos.ordenID = response.data.d.insertId;
                                    //scope.orden = response.data.insertId;
                                    $("#myModal3").modal();
                                    limpiaCampos();
                                }, function myError(response) {
                                    // console.log(response.data);
                                    sos.ErrorMessage = response.data.Message;
                                    sos.enviaActivated = false;
                                    });


                            }, function () {
                                  console.log("adios");
                                  sos.enviaActivated = false;
                            });
                        }
                        else
                            alertas.aviso("Valida que la seccion sea correcta");

                        
                    }    
        }
        
        sos.validaCodigo = function(){
           sos.validacionCode.aparece = false;
           if(sos.seccion != "")
           {
               sos.activated = true;

               // console.log("bien");
               sos.seccion = $filter('uppercase')(sos.seccion);
               // api.get("/alta/verificaCadena/" + sos.seccion)
               api.post("/Forms/WebServiceAPI.aspx/verificaCadena", JSON.stringify({ 'data': sos.seccion }))
               // api.get('/posts')
                .then(function success(response) {
                   sos.validacionCode.aparece = true;
                    console.log(response.data);
                    sos.validacionCode.server = true;
                    
                    if (response.data.d.cadenaregresada != null){
                         sos.activated = false;
                         sos.validacionCode.valido = true;

                      //  $("#myModal").modal();
                //        $("#idCodigo").addClass("has-success");
                    }
                    else {
                         sos.activated = false;
                         sos.validacionCode.valido = false;
                   //     $("#myModal2").modal();
                     //   $("#idCodigo").addClass("has-error");
                    }



                }, function myError(response) {
                    
                     $("#myModal").modal();
                    sos.validacionCode.aparece = true;
                    sos.validacionCode.valido = false;
                    sos.validacionCode.server = false;
                    console.log("request error verificaCadena");
                    sos.validaCode = false;
                    sos.activated = false;
                });
            }
            else
                sos.validacionCode.aparece = false;

          
       }
        
    function limpiaCampos()
    {
        sos.solicitante = {};
        sos.seccion = "";
        sos.descripcion = "";
        sos.asunto = "";
        sos.validacionCode = {
            aparece: false,
            valido: false,
            server: true
        };
        sos.activated = false;
        var eseoese = {};
    }
        
        
    });
}());