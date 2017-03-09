'use strict';

var app = angular.module("admUser", ['app', 'ngMaterial', 'ngMessages']);

app.controller("admUserController", function (alertas,api, $mdDialog) {
    var scope = this;

    scope.usuarios = {};
    scope.ramo = {};
    cargaUsuarios();
    function cargaUsuarios()
    {
        api.get("/adm/dameUsuarios").then(function success(data) {
        console.log(data);
        scope.usuarios = data.data;})
    }
    cargaEmpleados();
    function cargaEmpleados() {
        api.get("/adm/dameEmpleados").then(function success(data) {
            console.log(data);
            scope.empleados = data.data;
        })
    }
    cargaRamos();
    function cargaRamos() {
        api.get("/adm/dameRamos").then(function success(data) {
            console.log(data);
            scope.ramos = data.data;
        })
    }
    scope.agregaUsuario= function (ev,id,tip)
    {
        $mdDialog.show({
            controller: "agregarUsuarioController as agreUs",
            templateUrl: 'agregarUsuario.html',
            locals: { idU: id , tipo: tip},
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            targetEvent: ev
        })
        .finally(function(){
            if(tip==0)
                cargaUsuarios();  
            if(tip==1)
                cargaEmpleados();
            if(tip==2)
                cargaRamos();
        });
        
    }

    scope.eliminarUsuario = function (id) {

        var conf = alertas.confirma("Seguro que desea eliminar?", "Se eliminara usuario");
        $mdDialog.show(conf).then(function () {
            api.get("/adm/eliminaUsuario/" + id).then(function success(data) {
                console.log(data);
                scope.id = data.data;
                cargaUsuarios();
            })

        }, function () {
            console.log("adios");
            
        });
       
    }

    scope.eliminaRamo = function (id) {

        var conf = alertas.confirma("Seguro que desea Ramo?", "Se eliminara Ramo");
        $mdDialog.show(conf).then(function () {
            api.get("/adm/eliminaRamo/" + id).then(function success(data) {
                console.log(data);
                scope.id = data.data;
                cargaRamos();
            })

        }, function () {
            console.log("adios");
           
        });
    }

    scope.eliminarEmpleado = function (id) {

        var conf = alertas.confirma("Seguro que desea eliminar?", "Se eliminara Empleado");
        $mdDialog.show(conf).then(function () {
            api.get("/adm/eliminaEmpleado/" + id).then(function success(data) {
                console.log(data);
                scope.id = data.data;
                cargaEmpleados();
            })

        }, function () {
            console.log("adios");
            
        });

    }

});