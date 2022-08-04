(function () {
  var UsuariosRestablecerController = function ($scope, $log, $location, UsuariosFactory) {
    $scope.Usuario = {};

    $scope.init = function () {
      $scope.navCollapsed = true;
    };

    $scope.init();
    $scope.RestablecerContrasena = function () {
      if ($scope.Usuario.CorreoElectronico !== undefined) {
        UsuariosFactory.postRestablecer($scope.Usuario)
          .then(result => {
            $scope.Usuario.Respuesta = result.data.message;
            if (result.data.name === 'Error') { $scope.ShowToast(result.data.message, 'success'); } else {
              $scope.ShowToast(result.data.message, 'success');
            }
          })
          .catch(error => {
            $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
          });
      }
    };
  };

  UsuariosRestablecerController.$inject = ['$scope', '$log', '$location', 'UsuariosFactory'];

  angular.module('marketplace').controller('UsuariosRestablecerController', UsuariosRestablecerController);
}());
