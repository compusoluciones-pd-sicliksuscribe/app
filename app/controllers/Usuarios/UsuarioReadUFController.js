(function () {
    var UsuarioReadUFController = function ($scope, $rootScope, $log, $location, $cookies, UsuariosFactory, jwtHelper, $sce) {
      var Session = {};
  
      Session = $cookies.getObject('Session');
      $scope.currentDistribuidor = $cookies.getObject('currentDistribuidor');
      const currentDistribuidor = $scope.currentDistribuidor;
      $scope.Usuario = {};

      $scope.Confirmar = function (IdUsuario) {
        $scope.Usuarios.forEach(function (Usuario) {
          if (Usuario.IdUsuario === IdUsuario) {
            Usuario.Mostrar = !Usuario.Mostrar;
          }
        }, this);
      };
  
      $scope.BajaUsuario = function (Usuario) {
        UsuariosFactory.putDeleteFinalUser(Usuario)
        .success(function (data) {
          if (data) {
            $scope.ShowToast(data.message, 'success');
  
            $scope.init();
          } else {
            $scope.ShowToast(data.message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos dar de baja tu solicitud, por favor intenta de nuevo más tarde', 'danger');
  
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
      };

      $scope.ObtenerUsuariosPropios = function () {
        UsuariosFactory.getUsuariosPropios()
          .success(function (UsuariosXEmpresas) {
            $scope.Usuarios = UsuariosXEmpresas.data;
          })
          .error(function (data, status, headers, config) {
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      };

      $scope.init = function () {
        $scope.ObtenerUsuariosPropios();
      };

      $scope.init();
    };

    UsuarioReadUFController.$inject = ['$scope', '$rootScope', '$log', '$location', '$cookies', 'UsuariosFactory', 'jwtHelper', '$sce'];
  
    angular.module('marketplace').controller('UsuarioReadUFController', UsuarioReadUFController);
  }());
  