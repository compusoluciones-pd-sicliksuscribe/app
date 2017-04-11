(function () {
  const DesbloquearCuentaController = function ($scope, $routeParams, $log, $location, UsuariosFactory) {
    var encryptedObject = $routeParams.encryptedObject;
    $scope.result = {};

    $scope.init = function () {
      $scope.navCollapsed = true;
      $scope.result = UsuariosFactory.desbloquearCuenta(encryptedObject)
        .success(function (result) {
          $scope.result = result[0];
          $log.log('result ' + $scope.result);
        })
        .error(function (error) {
          $log.log('data error: ' + error);
        });
    };
    $scope.init();
  };
  DesbloquearCuentaController.$inject = ['$scope', '$routeParams', '$log', '$location', 'UsuariosFactory'];

  angular.module('marketplace').controller('DesbloquearCuentaController', DesbloquearCuentaController);
}());
