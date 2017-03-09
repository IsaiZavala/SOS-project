(function () {
    'use strict';

    angular.module('enc', ['app'])
    .controller('encuestaController', function (api, alertas, $mdDialog,idCot, Auth) {

        var enc = this;       
        //////////////////aqui agrega
        enc.guardaDATOS = function()
        {
            //alert('oye si');
            var conf = alertas.confirma("Seguro de agregar datos?");
            $mdDialog.show(conf).then(function () {

                llenaS0S();
                api.post("/encuesta/inserta", eseoese).then(function sucess(response) {
                                 
                }, function myError(response) {
                    //    console.log("adios");
                });
            }, function () {
                console.log("adios");
            });
        }

        enc.solicitante = {};
        var eseoese = {};

        var llenaS0S = function () {
           
            enc.informante = {};
            enc.informante.idSOS = idCot;//idsos
            enc.informante.r1 = enc.respuestas.r1;
            enc.informante.r2 = enc.respuestas.r2;
            enc.informante.r3 = enc.respuestas.r3;
            enc.informante.r4 = enc.respuestas.r4;
            enc.informante.r5 = enc.respuestas.r5;
            enc.informante.r6 = enc.respuestas.r6;
            enc.informante.r7 = enc.respuestas.r7;
            enc.informante.r8 = enc.respuestas.r8;
            enc.informante.comentario = enc.respuestas.comentario;

            eseoese = {
                 informante: enc.informante           
            };
        }      

        enc.enviaSOS = function ()
        {
            var conf = alertas.confirma("Seguro de agregar datos?");
            $mdDialog.show(conf).then(function () {

                llenaS0S();
                api.post("/encuesta/inserta", eseoese).then(function sucess(response) {
                                          
                }, function myError(response) {
                    //    console.log("adios");
                });
            }, function () {
                console.log("adios");
            });
        }

        //var idEncuesta = 3;
        enc.obtenDatos = function ()
        {
            api.get("/encuesta/detalle/" + idEncuesta).then(function success(data) {

                //console.log(data + ' <- esos son los datos');
                console.log(data.data[0] + ' <- esos son los datos');
                var dat = data.data[0];
                console.log('nombre: ' + dat.nombre);
                console.log('edad: ' + dat.edad);               
            })
        }

        var idEncuesta = 2; // <-------- idEncuesta
        var recogeDATOS = [];
        enc.traeDatosAGrafica = function()
        {
            console.log('hola grafica consola');
            //alertas('hola grafica');
              //api.get("/encuesta/traeRespuestas/" + idEncuesta).then(function success(data) {
            api.get("/encuesta/traeRespuestas/" + idCot).then(function success(data) {
                console.log(data.data[0] + ' <- esos son los datos');
                var dat = data.data[0];
                //nuevo
                //recogeDATOS = dat;
                recogeDATOS.push(dat.r1);
                recogeDATOS.push(dat.r2);
                recogeDATOS.push(dat.r3);
                recogeDATOS.push(dat.r4);
                recogeDATOS.push(dat.r5);
                recogeDATOS.push(dat.r6);
                recogeDATOS.push(dat.r7);
                recogeDATOS.push(dat.r8);
               
                console.log('respuesta1: ' + dat.r1);
                console.log('respuesta2: ' + dat.r2);
                console.log('respuesta3: ' + dat.r3);
                console.log('respuesta4: ' + dat.r4);
                console.log('respuesta5: ' + dat.r5);
                console.log('respuesta6: ' + dat.r6);
                console.log('respuesta7: ' + dat.r7);
                console.log('respuesta8: ' + dat.r8);
                console.log('comentario: ' + dat.comentario);



                Chart.defaults.global.animationSteps = 300;
                var chrt = document.getElementById("mycanvas").getContext("2d");
                  //var myarr = [65, 59, 80, 81, 56, 55, 40];
                var myarr = recogeDATOS;
                var data = {
                    labels: ["Resp1", "Resp2", "Resp3", "Resp4", "Resp5", "Resp6", "Resp7", "Resp8"],
                    datasets: [
                        {
                            label: "My Second dataset", //optional
                            fillColor: "rgba(0,0,128,0.8)",
                            strokeColor: "rgba(255,255,0,1)",
                            highlightFill: "rgba(255,255,0,0.75)",
                            highlightStroke: "rgba(0,0,128,1)",
                            data: myarr
                        }
                    ]
                };
                var myFirstChart = new Chart(chrt).Bar(data);     //Bar,Radar,Line,;


            })
        }




        var obten = function()
        {
            api.get("/encuesta/traeRespuestas/" + idEncuesta).then(function success(data) {
                console.log(data.data[0] + ' <- esos son los datos');
                var dat = data.data[0];
                //recogeDATOS = dat;
                recogeDATOS.push(dat.r1);
                recogeDATOS.push(dat.r2);
                recogeDATOS.push(dat.r3);
                recogeDATOS.push(dat.r4);
                recogeDATOS.push(dat.r5);
                recogeDATOS.push(dat.r6);
                recogeDATOS.push(dat.r7);
                recogeDATOS.push(dat.r8);
            })
        }


        //FUNCION PARA CREAR GRAFICA EN BASE A LAS RESPUESTAS
        enc.angularMuestraGRAFICA = function()
        {
            
            obten();
              //Chart.defaults.global.responsive = true;
              Chart.defaults.global.animationSteps = 300;
              var chrt = document.getElementById("mycanvas").getContext("2d");
            //var myarr = [65, 59, 80, 81, 56, 55, 40];
              var myarr = recogeDATOS;
              var data = {                 
                  labels:["Resp1", "Resp2", "Resp3", "Resp4", "Resp5", "Resp6", "Resp7", "Resp8"],
                  datasets: [                    
                      {
                          label: "My Second dataset", //optional
                          fillColor: "rgba(0,0,128,0.8)",
                          strokeColor: "rgba(255,255,0,1)",
                          highlightFill: "rgba(255,255,0,0.75)",
                          highlightStroke: "rgba(0,0,128,1)",
                          data: myarr
                      }
                  ]
              };
              var myFirstChart = new Chart(chrt).Bar(data);     //Bar,Radar,Line,;
        }

        enc.esAdmin = function()
        {
            return Auth.esAdmin();
        }

        enc.esSoli = function()
        {
            return Auth.esSoli();
        }


    });
}());





