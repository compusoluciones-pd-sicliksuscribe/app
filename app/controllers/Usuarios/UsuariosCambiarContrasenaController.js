(function () {
    var UsuariosCambiarContrasenaController = function ($scope, $log, $routeParams, $location, UsuariosFactory) {
      $scope.Usuario = {};

      $scope.init = function () {
        $scope.navCollapsed = true;
      };

      $scope.init();

      $scope.CambiarContrasena = function () {
        if ($scope.Usuario.CnfrmContrasena !== '' && $scope.Usuario.NvaContrasena !== '') {
          if ($scope.Usuario.CnfrmContrasena === $scope.Usuario.NvaContrasena){
            if ($scope.Usuario.CnfrmContrasena.length >= 8 && $scope.Usuario.NvaContrasena.length >= 8){
              UsuariosFactory.postCambiarContrasena($scope.Usuario, $routeParams.encryptedObject)
            .success(function (result) {
              if (result.name === "Error"){$scope.ShowToast(result.message, 'danger');}
              else if (typeof (result) === 'string'){$scope.ShowToast(result, 'warning');}
              else {
                $scope.ShowToast(result.message, 'success');
                $scope.goToPage('Login');
              }
            })
            .error(function (data, status, headers, config) {
              $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
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
