
angular.module('marketplace')

  .run(function ($rootScope) {
    $rootScope.rsTitle = 'click suscribe | CompuSoluciones';
    $rootScope.rsVersion = '2.1.0';
     $rootScope.API = 'http://10.3.102.52:8080/';
     $rootScope.MAPI = 'http://10.3.102.52:8083/';
     $rootScope.dominio = 'localhost';
    /* $rootScope.API = 'https://pruebas.compusoluciones.com/';
     $rootScope.MAPI = 'http://microsoft-api.us-east-1.elasticbeanstalk.com/';
     $rootScope.dominio = 'clicksuscribe'; */
  });
