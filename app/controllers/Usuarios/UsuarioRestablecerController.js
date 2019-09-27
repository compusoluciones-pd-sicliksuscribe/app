(function () {
  var UsuariosRestablecerController = function ($scope, $log, $location, UsuariosFactory) {
    $scope.Usuario = {};

    $scope.init = function () {
      $scope.navCollapsed = true;
      $scope.correoCorrecto = false;
    };

    $scope.init();
    $scope.RestablecerContrasena = function () {
      if ($scope.Usuario.CorreoElectronico !== undefined ) {
        UsuariosFactory.postRestablecer($scope.Usuario)
          .success(function (result) {
            $scope.Usuario.Respuesta = result.message;
            if (result.name === 'Error'){$scope.ShowToast(result.message, 'danger');}
            else {
              $scope.ShowToast(result.message, 'success');
              $scope.correoCorrecto = true;
            }
          })
          .error(function (data, status, headers, config) {
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      }
    };
  };

  UsuariosRestablecerController.$inject = ['$scope', '$log', '$location', 'UsuariosFactory'];

  angular.module('marketplace').controller('UsuariosRestablecerController', UsuariosRestablecerController);
}());
