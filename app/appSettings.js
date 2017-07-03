
angular.module('marketplace')

  .run(function ($rootScope) {
    $rootScope.rsTitle = 'click suscribe | CompuSoluciones';
    $rootScope.rsVersion = '2.1.1';
    /*  $rootScope.API = 'http://localhost:8080/';
      $rootScope.MAPI = 'http://localhost:8083/';
      $rootScope.dominio = 'localhost'; */
    $rootScope.API = 'https://pruebas.compusoluciones.com/';
    $rootScope.MAPI = 'http://microsoft-api.us-east-1.elasticbeanstalk.com/';
    $rootScope.dominio = 'clicksuscribe';
  });
