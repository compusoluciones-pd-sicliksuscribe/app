(function () {
  var ConfirmarCuentaController = function ($scope, $routeParams, $log, $location, UsuariosFactory) {
    var encryptedObject = $routeParams.encryptedObject;
    $scope.result = {};
    $scope.encryptedObject = $routeParams.encryptedObject;

    $scope.init = function () {
      $scope.navCollapsed = true;
      $scope.result = UsuariosFactory.confirmarCuenta($scope.encryptedObject)
        .then(result => {
          $scope.result = result.data[0];
          $log.log('result ' + $scope.result);
        })
        .catch(error => {
          $scope.result = 'Ha ocurrido un error, comuniquese con su equipo de soporte.';
          $log.log('data error: ' + error);
        });
    };
    $scope.init();
  };

  ConfirmarCuentaController.$inject = ['$scope', '$routeParams', '$log', '$location', 'UsuariosFactory'];

  angular.module('marketplace').controller('ConfirmarCuentaController', ConfirmarCuentaController);
}());
