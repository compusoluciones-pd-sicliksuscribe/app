/* eslint-disable eqeqeq */
(function () {
  var TerminosReadController = function ($scope, $rootScope, $log, $location, $cookies, UsuariosFactory, jwtHelper, $sce) {
    var Session = {};

    Session = $cookies.getObject('Session');
    $scope.currentDistribuidor = $cookies.getObject('currentDistribuidor');
    const currentDistribuidor = $scope.currentDistribuidor;
    $scope.Usuario = {};

    $scope.getTerminosYCondiciones = function (currentDistribuidor) {
      if (!currentDistribuidor) {
        $scope.isClickTerminos = true;
      } else {
        if (currentDistribuidor.TerminosYCondiciones) {
          $scope.isClickTerminos = false;
          $scope.terminosPDF = $sce.trustAsResourceUrl(currentDistribuidor.TerminosYCondiciones);
        } else {
          $scope.isClickTerminos = true;
        }
      }
    };

    $scope.init = function () {
      $scope.navCollapsed = true;
      $scope.getTerminosYCondiciones(currentDistribuidor);
    };

    $scope.ActualizarTerminos = function () {
      if (!($scope.Usuario.CorreoElectronico)) {
        $scope.ShowToast('Escribe tu correo electrónico', 'danger');

        return;
      }

      if (!($scope.Usuario.Contrasena)) {
        $scope.ShowToast('Escribe tu contraseña', 'danger');

        return;
      }

      if ($scope.Usuario.LeyoTerminos !== true) {
        $scope.ShowToast('Para usar este sitio es necesario aceptar los terminos y condiciones.', 'danger');

        return;
      }

      var UsuarioActualizar =
        {
          IdUsuario: Session.IdUsuario,
          LeyoTerminos: $scope.Usuario.LeyoTerminos
        };

      var LoginUsuario =
        {
          CorreoElectronico: $scope.Usuario.CorreoElectronico,
          Contrasena: $scope.Usuario.Contrasena
        };

      UsuariosFactory.postUsuarioIniciarSesion(LoginUsuario)
        .then(resultLogin => {
          if (resultLogin.data[0].Success == true) {
            UsuariosFactory.putUsuario(UsuarioActualizar)
              .then(result => {
                if (result.data[0].Success == true) {
                  UsuariosFactory.postUsuarioIniciarSesion(LoginUsuario)
                    .then(result => {
                      if (result.data[0].Success == true) {
                        var Session = {};

                        var tokenPayload = jwtHelper.decodeToken(result.data[0].Token);

                        var expireDate = new Date();

                        expireDate.setTime(expireDate.getTime() + 600 * 60000);

                        Session =
                        {
                          Token: result.data[0].Token,
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

                        $cookies.putObject('Session', Session, { 'expires': expireDate, secure: $rootScope.secureCookie });

                        if (Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === '4' ||
                          Session.IdTipoAcceso === 5 || Session.IdTipoAcceso === '5' ||
                          Session.IdTipoAcceso === 6 || Session.IdTipoAcceso === '6') {
                          $cookies.putObject('currentDistribuidor', Session.distribuidores[0], { 'expires': expireDate, secure: $rootScope.secureCookie });
                        }
                        $scope.detectarSitioActivoURL();
                        $scope.ActualizarDatosSession();
                        $scope.ActualizarMenu();

                        if (UsuarioActualizar.LeyoTerminos == 1) {
                          $location.path('/');
                        }
                      } else {
                        $scope.ShowToast(result.data[0].Message, 'danger');
                      }
                    })
                    .catch(error => {
                      $scope.ShowToast('Error, inicie sesión de nuevo', 'danger');

                      $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
                    });
                } else {
                  $scope.ShowToast(result.data[0].Message, 'danger');
                }
              })
              .catch(error => {
                $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
              });
          } else {
            $scope.ShowToast(resultLogin.data[0].Message, 'danger');
          }
        })
        .catch(error => {
          $scope.ShowToast('Error, inicie sesión de nuevo', 'danger');
          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        });
    };

    $scope.init();
  };

  TerminosReadController.$inject = ['$scope', '$rootScope', '$log', '$location', '$cookies', 'UsuariosFactory', 'jwtHelper', '$sce'];

  angular.module('marketplace').controller('TerminosReadController', TerminosReadController);
}());
