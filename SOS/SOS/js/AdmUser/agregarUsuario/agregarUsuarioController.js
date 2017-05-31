'use strict';
var app = angular.module('agregarUser', ['app', 'ngMaterial', 'ngMessages']);


app.controller("agregarUsuarioController", function ($scope, api, alertas, idU, $mdDialog,tipo) {
    var scope = this;
    scope.tipo = tipo;
    scope.band = false;
    scope.usuario = {
        idUsuario:idU,
        rol: {},
        usuario: "",
        pass:""
    }
    scope.empleado={
        nombre:null,
        cargo:null
    }
    scope.ramo = {
        nombre:null
    };
    cargaModelos();
    cargarUsuario();
    function cargarUsuario()
    {
        if(idU!=null)
        {
            //api.get("/adm/dameUsuariosID/" + idU)
            api.post("/Services/WebServiceAPI.asmx/dameUsuariosID", JSON.stringify({ 'IdUsuario' : idU})).then(function success(data) {
                // console.log(data);
                var usu = data.data.d[0];
                scope.usuario.usuario= usu.usuario;
                scope.usuario.pass = usu.pass;
                scope.usuario.nombre = usu.NombreUsuario;
                scope.usuario.correo = usu.correo;

                scope.usuario.rol = usu.rol = { 'idRol': usu.idRol, 'tipoROl': usu.tipoROl, 'descripcion': usu.descripcion };
            })
        }
    }
    function cargaModelos(){
        // api.get("/adm/dameRoles")
        api.post("/Services/WebServiceAPI.asmx/dameRoles", null)
            .then(function success(data) {
            // console.log(data);
            scope.roles = data.data.d;
        }, function myError(response) {
            console.log("error");
            console.log(response.data);
            // scope.band = true;
        });
    }

    scope.agregarUsuario= function()
    {

        
        // api.post("/adm/altaUsuario", scope.usuario)
        api.post("/Services/WebServiceAPI.asmx/altaUsuario", JSON.stringify({ 'data': scope.usuario })).then(function (data) {
            // console.log(data);
            if (data.status == 200) {
                scope.id = data.data.d;
                alertas.aviso("Se a guardado exitosamente");
            }
        }, function myError(response) {
            scope.band = true;
        });
    }

    scope.agregarEmpleado = function ()
    {
        // api.post("/adm/altaEmpleado", scope.empleado)
        api.post("/Services/WebServiceAPI.asmx/altaEmpleado", JSON.stringify ({ 'data' : scope.empleado})).then(function (data) {
            console.log(data);
            if (data.status == 200) {
                scope.id = data.data;
                alertas.aviso("Se a guardado exitosamente");
            }
        },
        function myError(response) {
            scope.band = true;
        });
    }
    scope.agregarRamo= function()
    {
        //api.post("/adm/altaRamo", scope.ramo)
        api.post("/Services/WebServiceAPI.asmx/altaRamo", JSON.stringify({'data' : scope.ramo})).then(function (data) {
            // console.log(data);
            if (data.status == 200) {
                scope.id = data.data.d;
                alertas.aviso("Se a guardado exitosamente");
            }
        },
        function myError(response) {
                scope.band = true;
            });
        
    }
    //eliminaEmpleado
    scope.cerrar= function()
    {
        $mdDialog.hide();
    }

});