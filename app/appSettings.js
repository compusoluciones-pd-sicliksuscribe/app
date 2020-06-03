angular.module('marketplace')

.run(function($rootScope, $location, $anchorScroll, $routeParams) {
  $rootScope.rsTitle = 'click suscribe | CompuSoluciones';
  $rootScope.rsVersion = '2.1.1';
  $rootScope.API = 'http://localhost:8080/';
  $rootScope.MAPI = 'http://localhost:8083/';
  $rootScope.PAGOS = 'http://localhost:8443/';
  $rootScope.dominio = 'localhost';
  $rootScope.SICLIK_USER = 'osestrad@compusoluciones.com';
  $rootScope.SICLIK_PASS = 'holahola2671';
  // $rootScope.SICLIK_API = 'http://10.3.112.97:8998/'
  $rootScope.SICLIK_FRONT = 'http://10.3.112.113:3000/'
  // $rootScope.SICLIK_FRONT = 'https://wwww.siclik.mx/'
  $rootScope.SICLIK_API = 'https://fargate.siclik.mx:8999/'
  // $rootScope.API = 'https://pruebas.compusoluciones.com/';
  // $rootScope.MAPI = 'http://microsoft-api.us-east-1.elasticbeanstalk.com/';
  // $rootScope.dominio = 'clicksuscribe';
  // $rootScope.secureCookie = true;
});
