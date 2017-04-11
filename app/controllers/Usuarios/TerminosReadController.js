(function () {
  var TerminosReadController = function ($scope, $log, $location, $cookieStore, UsuariosFactory, jwtHelper) {
    var Session = {};

    Session = $cookieStore.get('Session');

    $scope.Usuario = {};

    $scope.init = function () {
      $scope.navCollapsed = true;
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
        .success(function (resultLogin) {
          if (resultLogin[0].Success == true) {
            UsuariosFactory.putUsuario(UsuarioActualizar)
              .success(function (result) {
                if (result[0].Success == true) {
                  UsuariosFactory.postUsuarioIniciarSesion(LoginUsuario)
                    .success(function (result) {
                      if (result[0].Success == true) {
                        var Session = {};

                        var tokenPayload = jwtHelper.decodeToken(result[0].Token);

                        var expireDate = new Date();

                        expireDate.setTime(expireDate.getTime() + 600 * 60000);

                        Session =
                          {
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
                        $scope.ActualizarDatosSession();
                        $scope.ActualizarMenu();

                        if (UsuarioActualizar.LeyoTerminos == 1) {
                          $location.path("/");
                        }
                      } else {
                        $scope.ShowToast(result[0].Message, 'danger');
                      }
                    })
                    .error(function (data, status, headers, config) {
                      $scope.ShowToast('Error, inicie sesión de nuevo', 'danger');

                      $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
                    });
                } else {
                  $scope.ShowToast(result[0].Message, 'danger');
                }
              })
              .error(function (data, status, headers, config) {
                $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
              });
          } else {
            $scope.ShowToast(resultLogin[0].Message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('Error, inicie sesión de nuevo', 'danger');
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.init();
  };

  TerminosReadController.$inject = ['$scope', '$log', '$location', '$cookieStore', 'UsuariosFactory', 'jwtHelper'];

  angular.module('marketplace').controller('TerminosReadController', TerminosReadController);
} ());
