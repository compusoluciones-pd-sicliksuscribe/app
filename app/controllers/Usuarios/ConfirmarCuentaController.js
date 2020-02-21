(function () {
  var ConfirmarCuentaController = function ($scope, $routeParams, $log, $cookies, $location, UsuariosFactory) {
    var encryptedObject = $routeParams.encryptedObject;
    $scope.result = {};
    $scope.encryptedObject = $routeParams.encryptedObject;

    $scope.iniciarSesion = () => {
      $location.path('/Login');
    };

    $scope.init = function () {
      $scope.navCollapsed = true;
      $scope.result = UsuariosFactory.confirmarCuenta($scope.encryptedObject)
        .success(function (result) {
          $scope.result = result[0];
          $log.log('result ' + $scope.result);
        })
        .error(function (error) {
          $scope.result = 'Ha ocurrido un error, comuniquese con su equipo de soporte.';
          $log.log('data error: ' + error);
        });
    };
    $scope.init();
  };

  ConfirmarCuentaController.$inject = ['$scope', '$cookies', '$routeParams', '$log', '$location', 'UsuariosFactory'];

  angular.module('marketplace').controller('ConfirmarCuentaController', ConfirmarCuentaController);
}());
