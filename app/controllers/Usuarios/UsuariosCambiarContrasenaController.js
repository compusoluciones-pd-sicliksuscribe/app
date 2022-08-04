(function () {
  var UsuariosCambiarContrasenaController = function ($scope, $log, $routeParams, $location, UsuariosFactory) {
    $scope.Usuario = {};

    $scope.init = function () {
      $scope.navCollapsed = true;
    };

    $scope.init();

    $scope.CambiarContrasena = function () {
      if ($scope.Usuario.CnfrmContrasena !== '' && $scope.Usuario.NvaContrasena !== '') {
        if ($scope.Usuario.CnfrmContrasena === $scope.Usuario.NvaContrasena) {
          if ($scope.Usuario.CnfrmContrasena.length >= 8 && $scope.Usuario.NvaContrasena.length >= 8) {
            UsuariosFactory.postCambiarContrasena($scope.Usuario, $routeParams.encryptedObject)
              .then(result => {
                if (result.data.name === 'Error') {
                  $scope.ShowToast(result.data.message, 'danger');
                } else if (typeof (result.data) === 'string') {
                  $scope.ShowToast(result.data, 'warning');
                } else {
                  $scope.ShowToast(result.data.message, 'success');
                  $scope.goToPage('Login');
                }
              })
              .catch(error => {
                $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
              });
          } else {
            $scope.ShowToast('La contraseña debe ser de al menos 8 caracteres.', 'warning');
          }
        } else {
          $scope.ShowToast('Las contraseñas no coinciden.', 'warning');
        }
      }
    };
  };

  UsuariosCambiarContrasenaController.$inject = ['$scope', '$log', '$routeParams', '$location', 'UsuariosFactory'];

  angular.module('marketplace').controller('UsuariosCambiarContrasenaController', UsuariosCambiarContrasenaController);
}());
