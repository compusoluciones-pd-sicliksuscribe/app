(function () {
  var UsuariosRecuperarController = function ($scope, $log, $location, UsuariosFactory) {
    $scope.Usuario = {};

    $scope.init = function () {
      $scope.navCollapsed = true;
    };

    $scope.init();

    $scope.RecuperarContrasena = function () {
      UsuariosFactory.postRecuperar($scope.Usuario)
        .then(Result => {
          $scope.Usuario.Respuesta = Result.data;
          $scope.ShowToast(Result.data, 'success');
        })
        .catch(error => {
          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        });
    };
  };

  UsuariosRecuperarController.$inject = ['$scope', '$log', '$location', 'UsuariosFactory'];

  angular.module('marketplace').controller('UsuariosRecuperarController', UsuariosRecuperarController);
}());
