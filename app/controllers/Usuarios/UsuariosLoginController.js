(function () {
  var UsuariosLoginController = function ($scope, $log, $cookieStore, $location, UsuariosFactory, jwtHelper, $routeParams, EmpresasFactory) {
    $scope.Subdominio = $routeParams.Subdominio;
    $scope.validarSubdominio = function () {
      if ($scope.Subdominio) {
        EmpresasFactory.getSitio($scope.Subdominio)
          .success(function (sitio) {
            if (sitio.success) {
              if (sitio.data[0]) {
                var expireDate = new Date();
                expireDate.setTime(expireDate.getTime() + 600 * 60000);
                $cookieStore.put('currentDistribuidor', sitio.data[0], { 'expires': expireDate });
                $scope.currentDistribuidor = $cookieStore.get('currentDistribuidor');
              }
            }
          })
          .error(function (data, status, headers, config) {
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      }
    };

    $scope.init = function () {
      $scope.esNavegadorSoportado();
      $scope.navCollapsed = true;
      /* $scope.validarSubdominio();*/
      $scope.ActualizarMenu();
    };

    $scope.init();

    $scope.IniciarSesion = function () {
      $cookieStore.remove('Session');
      $cookieStore.remove('Pedido');
      $scope.Usuario.IdEmpresa = $scope.currentDistribuidor.IdEmpresa;
      $cookieStore.remove('currentDistribuidor');
      $scope.SessionCookie = {};
      UsuariosFactory.postUsuarioIniciarSesion($scope.Usuario)
        .success(function (result) {
          if (result[0].Success) {
            var Session = {};

            var tokenPayload = jwtHelper.decodeToken(result[0].Token);

            var expireDate = new Date();

            expireDate.setTime(expireDate.getTime() + 600 * 60000);

            Session = {
              Token: result[0].Token,
              CorreoElectronico: tokenPayload.CorreoElectronico,
              Nombre: tokenPayload.Nombre,
              IdUsuario: tokenPayload.IdUsuario,
              ApellidoPaterno: tokenPayload.ApellidoPaterno,
              ApellidoMaterno: tokenPayload.ApellidoMaterno,
              IdTipoAcceso: tokenPayload.IdTipoAcceso,
              NombreTipoAcceso: tokenPayload.NombreTipoAcceso,
              IdEmpresa: tokenPayload.IdEmpresa,
              NombreEmpresa: tokenPayload.NombreEmpresa,
              LeyoTerminos: tokenPayload.LeyoTerminos,
              distribuidores: tokenPayload.distribuidores,
              Expira: expireDate.getTime()
            };

            $cookieStore.put('Session', Session, { 'expires': expireDate });

            if (Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === '4' ||
              Session.IdTipoAcceso === 5 || Session.IdTipoAcceso === '5' ||
              Session.IdTipoAcceso === 6 || Session.IdTipoAcceso === '6') {
              $cookieStore.put('currentDistribuidor', Session.distribuidores[0], { 'expires': expireDate });
            }

            $scope.detectarSitioActivoURL();

            $scope.ActualizarMenu();

            if (Session.LeyoTerminos === 1 || Session.LeyoTerminos === '1') {
              $location.path('/');
            } else {
              $scope.ShowToast('Para usar el sitio necesitas aceptar los terminos y condiciones', 'danger');
              $location.path('/TerminosCondiciones');
            }
          } else {
            $scope.ShowToast(result[0].Message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('Error al iniciar sesión', 'danger');
          $log.log('data error: ' + data + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };
  };

  UsuariosLoginController.$inject = ['$scope', '$log', '$cookieStore', '$location', 'UsuariosFactory', 'jwtHelper', '$routeParams', 'EmpresasFactory'];

  angular.module('marketplace').controller('UsuariosLoginController', UsuariosLoginController);
} ());
