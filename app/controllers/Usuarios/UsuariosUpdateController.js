(function () {
  var UsuariosUpdateController = function ($scope, $rootScope, $log, $location, $cookies, $routeParams, UsuariosFactory, jwtHelper, UsuariosXEmpresasFactory, TiposAccesosFactory) {
    var Session = {};
    Session = $cookies.getObject('Session');
    var IdUsuario = $routeParams.IdUsuario;
    $scope.Usuario = {};

    $scope.init = function () {
      $scope.Usuario.MuestraCamposContrasenas = 0;
      Session = $cookies.getObject('Session');

      $scope.CheckCookie();

      if (Session.IdTipoAcceso == 2 || Session.IdTipoAcceso == 4) {
        TiposAccesosFactory.getTiposAccesos()
          .success(function (TiposAccesos) {
            $scope.selectTiposAccesos = TiposAccesos;
          })
          .error(function (data, status, headers, config) {
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      }

      if (IdUsuario == Session.IdUsuario) {
        $scope.Usuario.IdUsuario = Session.IdUsuario;
        $scope.Usuario.Nombre = Session.Nombre;
        $scope.Usuario.ApellidoPaterno = Session.ApellidoPaterno;
        $scope.Usuario.ApellidoMaterno = Session.ApellidoMaterno;
        $scope.Usuario.CorreoElectronico = Session.CorreoElectronico;
        $scope.Usuario.ModificaContrasena = 1;

        UsuariosFactory.getUsuario($routeParams.IdUsuario)
          .success(function (Usuario) {
            if (Usuario[0].Success == true) {
              $scope.Usuario.Lada = Usuario[0].Lada;
              $scope.Usuario.Telefono = Usuario[0].Telefono;
            } else {
              $scope.ShowToast(Usuario[0].Message, 'danger');
              $location.path('/');
            }
          })
          .error(function (data, status, headers, config) {
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      } else {
        UsuariosFactory.getUsuario($routeParams.IdUsuario)
          .success(function (Usuario) {
            if (Usuario[0].Success == true) {
              $scope.Usuario = Usuario[0];
              $scope.Usuario.ModificaContrasena = 0;
              $scope.Usuario.IdUsuario = Usuario[0].IdUsuario;
              $scope.Usuario.IdEmpresa = Session.IdEmpresa;
              $scope.Usuario.TipoAccesoDistribuidor = Session.IdTipoAcceso;
              $scope.Usuario.collegeSelection = Usuario[0].IdTipoAcceso;
              $scope.Usuario.Lada = Usuario[0].Lada;
              $scope.Usuario.Telefono = Usuario[0].Telefono;
            } else {
              $scope.ShowToast(Usuario[0].Message, 'danger');
              $location.path('/Usuarios');
            }
          })
          .error(function (data, status, headers, config) {
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      }
    };

    $scope.init();

    $scope.UsuarioUpdate = function () {
      if ($scope.Usuario.ModificaContrasena == 1) {
        if (($scope.frm.$invalid)) {
          if ($scope.frm.Nombre.$invalid == true) {
            $scope.frm.Nombre.$pristine = false;
          }
          if ($scope.frm.CorreoElectronico.$invalid == true) {
            $scope.frm.CorreoElectronico.$pristine = false;
          }
          if ($scope.frm.Contrasena.$invalid == true) {
            $scope.frm.Contrasena.$pristine = false;
          }

          $scope.ShowToast('Datos inválidos, favor de verificar', 'danger');
        } else {
          UsuariosFactory.postUsuarioIniciarSession($scope.Usuario)
            .success(function (result) {
              if (result[0].Success == true) {
                if ($scope.Usuario.ContrasenaNueva != null && $scope.Usuario.ContrasenaNueva != undefined && $scope.Usuario.ContrasenaConfirmar != null && $scope.Usuario.ContrasenaConfirmar != undefined)
                  $scope.Usuario.Contrasena = $scope.Usuario.ContrasenaNueva;
                UsuariosFactory.putUsuario($scope.Usuario)
                  .success(function (result) {
                    if (result[0].Success == true) {
                      UsuariosFactory.postUsuarioIniciarSession($scope.Usuario)
                        .success(function (result) {
                          if (result[0].Success == true) {
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

                            $cookies.putObject('Session', Session, { 'expires': expireDate, secure: $rootScope.secureCookie });

                            $scope.detectarSitioActivoURL();
                            $scope.ActualizarDatosSession();
                            $scope.ActualizarMenu();

                            $scope.ShowToast('Datos actualizados correctamente', 'success');

                            $scope.CheckCookie();
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
                $scope.ShowToast('Autentificación no válida', 'danger');
              }
            })
            .error(function (data, status, headers, config) {
              $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
            });
        }
      } else {
        UsuariosXEmpresasFactory.putUsuariosXEmpresa($scope.Usuario)
          .success(function (result) {
            if (result[0].Success == true) {
              $location.path('/Usuarios');
            } else {
              $scope.ShowToast(result[0].Message, 'danger');
            }
          })
          .error(function (data, status, headers, config) {
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      }
    };

    $scope.UsuarioDelete = function () {
      $scope.Usuario.Activo = 0;
      UsuariosFactory.putUsuario($scope.Usuario)
        .success(function (result) {
          if (result[0].Success == true) {
            UsuariosXEmpresasFactory.putUsuariosXEmpresa($scope.Usuario)
              .success(function (result) {
                if (result[0].Success == true) {
                  $location.path('/Usuarios');
                  $scope.ShowToast('Usuario dado de baja', 'success');
                } else {
                  $scope.ShowToast(result[0].Message, 'danger');
                }
              })
              .error(function (data, status, headers, config) {
                $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
              });
          } else {
            $scope.ShowToast(result[0].Message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.UsuarioCancel = function () {
      if ($scope.Usuario.ModificaContrasena == 1) {
        $location.path('/');
      } else {
        $location.path('/Usuarios');
      }
    };

    $scope.ValidaContrasena = function () {
      if ($scope.Usuario.ContrasenaNueva !== $scope.Usuario.ContrasenaConfirmar) {
        $scope.ShowToast('Nueva Contraseña y Contraseña Confirmar no coinciden', 'danger');
        return false;
      }
      return true;
    };
  };

  UsuariosUpdateController.$inject = ['$scope', '$rootScope', '$log', '$location', '$cookies', '$routeParams', 'UsuariosFactory', 'jwtHelper', 'UsuariosXEmpresasFactory', 'TiposAccesosFactory'];
  angular.module('marketplace').controller('UsuariosUpdateController', UsuariosUpdateController);
}());
