angular.module('app')
.config(function($routeProvider){
	

	$routeProvider.when('/', {
		templateUrl : 'pagina1.html',
            controller  : 'mainController'
	})
    
    $routeProvider.when('/login', {
        templateUrl: 'login.html',
        controller: 'loginCONTROLLER as login'
    })
    
    $routeProvider.when('/alta',{
		templateUrl : 'altaSOS.html',
		controller : 'sosController as sos'
	})
    
    $routeProvider.when('/detalle', {
        templateUrl: 'detalleSOS.html',
        controller: 'detailController as det'
    })
    $routeProvider.when('/buzon', {
        templateUrl: 'buzon.html',
        controller: 'buzonController as buzon'
    })
    $routeProvider.when('/admUser', {
        templateUrl: 'adminUser.html',
        controller: 'admUserController as admUser'
    })    
    $routeProvider.when('/diagrama', {
        templateUrl: 'diagramaSOS.html'
        
    })
    
    /*
    $routeProvider.when('/prueba', {
        templateUrl: 'rosel.html',
        controller: 'encuestaController as enc'
    })*/

	.otherwise({ redirectTo: '/' });
});

/*angular.module('app')
.controller('mainController', function($scope) {
    //$scope.message = 'Hola, Mundo!';
});*/



angular.module('app')
.controller('mainController', function ($scope) {
  $scope.myInterval = 3000;
  $scope.noWrapSlides = false;
  $scope.active = 0;
  var slides = $scope.slides = [];
  var currIndex = 0;
    
  var arrImg = ['/img/unoF.jpg', '/img/dosF.jpg', '/img/tresF.jpg'];

  $scope.addSlide = function(img) 
  {
    var newWidth = 600 + slides.length + 1;
   
      slides.push({
      //image: '//unsplash.it/' + newWidth + '/300',
          image: img,
          //image: '/img/g ssjb.jpg',
     // text: ['Nice image','Awesome photograph','That is so cool','I love that'][slides.length % 4],
      id: currIndex++
    });
  }

  $scope.randomize = function() {
    var indexes = generateIndexesArray();
    assignNewIndexesToSlides(indexes);
  };

  for (var i = 0; i < arrImg.length; i++) {
    $scope.addSlide(arrImg[i]);
  }
});



