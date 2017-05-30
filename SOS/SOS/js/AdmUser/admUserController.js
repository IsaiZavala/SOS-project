'use strict';

var app = angular.module("admUser", ['app', 'ngMaterial', 'ngMessages']);

app.controller("admUserController", function (alertas,api, $mdDialog) {
    var scope = this;

    scope.usuarios = {};
    scope.ramo = {};
    cargaUsuarios();
    function cargaUsuarios()
    {
        // api.get("/adm/dameUsuarios")
        api.post("/Services/WebServiceAPI.asmx/dameUsuarios", null)
            .then(function success(data) {
                // console.log(data);
                scope.usuarios = data.data.d;
            }, function myError(response) {
                console.log("error");
                console.log(response.data);
            });
            
    }
    cargaEmpleados();
    function cargaEmpleados() {
        // api.get("/adm/dameEmpleados")
        api.post("/Services/WebServiceAPI.asmx/dameEmpleados", null)
            .then(function success(data) {
            // console.log(data);
            scope.empleados = data.data.d;
        }, function myError(response) {
            console.log("error");
            console.log(response.data);
        });
    }
    cargaRamos();
    function cargaRamos() {
        // api.get("/adm/dameRamos")
        api.post("/Services/WebServiceAPI.asmx/dameRamos", null)
            .then(function success(data) {
            // console.log(data);
            scope.ramos = data.data.d;

        }, function myError(response) {
            console.log("error");
            console.log(response.data);
        });
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
            //api.get("/adm/eliminaUsuario/" + id)
            api.post("/Services/WebServiceAPI.asmx/eliminarUsuario", JSON.stringify({ 'id': id }))
                .then(function success(data) {
                scope.id = data.data.d;
                cargaUsuarios();
            })

        }, function () {
            // en caso de cancelar el eliminar usuario hace esta funcion
            // console.log("adios");
        });
       
    }

    scope.eliminaRamo = function (id) {

        var conf = alertas.confirma("Seguro que desea Ramo?", "Se eliminara Ramo");
        $mdDialog.show(conf).then(function () {
            //api.get("/adm/eliminaRamo/" + id)
            api.post("/Services/WebServiceAPI.asmx/eliminaRamo", JSON.stringify({ 'IdRamo': id })).then(function success(data) {
                // console.log(data);
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
            //api.get("/adm/eliminaEmpleado/" + id)
            api.post("/Services/WebServiceAPI.asmx/eliminaEmpleado", JSON.stringify({ 'strEmpleado': id }))
                .then(function success(data) {
                // console.log(data);
                scope.id = data.data.d;
                cargaEmpleados();
            })

        }, function () {
            // cuando no se da click en confirmar eliminacion
            // console.log("adios");
        });

    }

});