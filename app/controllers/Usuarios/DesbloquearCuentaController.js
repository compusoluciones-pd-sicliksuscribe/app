(function () {
  const DesbloquearCuentaController = function ($scope, $routeParams, $log, $location, UsuariosFactory) {
    var encryptedObject = $routeParams.encryptedObject;
    $scope.result = {};

    $scope.init = function () {
      $scope.navCollapsed = true;
      $scope.result = UsuariosFactory.desbloquearCuenta(encryptedObject)
        .then(result => {
          $scope.result = result.data[0];
          $log.log('result ' + $scope.result);
        })
        .catch(error => {
          $log.log('data error: ' + error);
        });
    };
    $scope.init();
  };
  DesbloquearCuentaController.$inject = ['$scope', '$routeParams', '$log', '$location', 'UsuariosFactory'];

  angular.module('marketplace').controller('DesbloquearCuentaController', DesbloquearCuentaController);
}());
