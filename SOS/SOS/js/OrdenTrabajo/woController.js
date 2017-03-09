'use strict';
var app =angular.module("otApp", ['app', 'ngMaterial']);


app.controller("woController", function ($scope, $http, api, $mdDialog, $filter, alertas, idCotiPaDeta, $rootScope) {
    $scope.idSOS = $rootScope.idCotiPaDeta;; 
    $scope.fecha = ""; 
    $scope.hora1 = "";
    $scope.operador = ""; 
    $scope.instruccion = ""; 
    $scope.hora2 = ""; 
    $scope.reporte = ""; 
    
    $scope.closeModal = function(){
      $mdDialog.hide();
    }
    
    $scope.$on('modal.closing', function(event, reason, closed) {
      var r = prompt("Are you sure you wanna close the modal? (Enter 'YES' to close)");

      if (r !== 'YES') {
        event.preventDefault();
      }
  });
});
