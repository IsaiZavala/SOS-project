(function(){
'use strict';
angular.module('app')
.service('api', function($http,url){
    
    var api = {};
    
    
    api.get = function(cad){
       var promise = $http({
                method: 'GET',
                url: url + cad 
            });
        
        return promise;
    }
    
    api.post = function(cad, data){
        var promise = $http({
            method: 'POST',
            url: url + cad,
            data: data
        });
        
        return promise;
    }
    
    return api;
});
}());