(function () {
  var UsuariosLoginController = function ($scope, $rootScope, $log, $cookies, $location, UsuariosFactory, jwtHelper, $routeParams, EmpresasFactory) {
    $scope.Subdominio = $routeParams.Subdominio;
    $scope.validarSubdominio = function () {
      if ($scope.Subdominio) {
        EmpresasFactory.getSitio($scope.Subdominio)
          .success(function (sitio) {
            if (sitio.success) {
              if (sitio.data[0]) {
                var expireDate = new Date();
                expireDate.setTime(expireDate.getTime() + 600 * 60000);
                $cookies.putObject('currentDistribuidor', sitio.data[0], { 'expires': expireDate, secure: $rootScope.secureCookie });
                $scope.currentDistribuidor = $cookies.getObject('currentDistribuidor');
              }
            }
          })
          .error(function (data, status, headers, config) {
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      }
    };

    const getUserSiclickData = tokenSiclick => {
      let decodedTokenSiclick = '';
      try {
        decodedTokenSiclick = jwtHelper.decodeToken(tokenSiclick);
      } catch {
        $scope.ShowToast('Error al iniciar sesión', 'danger');
        $location.path('/Login');
      }
      UsuariosFactory.getUserDataSiclick(decodedTokenSiclick, tokenSiclick)
        .success(function (result) {
          const user = {
            CorreoElectronico: result.email,
            IdERP: decodedTokenSiclick.customer.id
          };
          UsuariosFactory.postUsuarioIniciarSesionSiClick(user)
            .success(function (result) {
              if (result[0].Success) {
                return buildToken(result);
              } else {
              $scope.ShowToast('No cuentas con acceso para esta plataforma', 'danger');
              $location.path('/Login');
              }
            })
            .error(function (data, status, headers, config) {
              $scope.ShowToast('Error al iniciar sesión', 'danger');
              $log.log('data error: ' + data + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
            });
        })
        .error(function (data, status, headers, config) {
          location.href = $rootScope.SICLIK_FRONT + "login/suscribe";
          $scope.ShowToast('Error al iniciar sesión', 'danger');
        });
    }

    $scope.init = function () {
      $scope.esNavegadorSoportado();
      $scope.navCollapsed = true;
      /* $scope.validarSubdominio();*/
      if($routeParams.tokenSiclick) {
        getUserSiclickData($routeParams.tokenSiclick);
      }
      $scope.ActualizarMenu();
    };

    $scope.init();

    const buildToken = result => {
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
          IdPlanTuClick: tokenPayload.IdPlanTuClick,
          mFacturacion: tokenPayload.mFacturacion,
          DominioMS: tokenPayload.DominioMS,
          Expira: expireDate.getTime()
        };
        $cookies.putObject('Session', Session, { 'expires': expireDate, secure: $rootScope.secureCookie });

        if (Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === '4' ||
          Session.IdTipoAcceso === 5 || Session.IdTipoAcceso === '5' ||
          Session.IdTipoAcceso === 6 || Session.IdTipoAcceso === '6') {
          //$cookies.putObject('currentDistribuidor', Session.distribuidores[0], { 'expires': expireDate, secure: $rootScope.secureCookie });
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
    }

    $scope.IniciarSesion = function () {
      $cookies.remove('Session');
      $cookies.remove('Pedido');
      $scope.Usuario.IdEmpresa = $scope.currentDistribuidor.IdEmpresa;
      $scope.SessionCookie = {};
      UsuariosFactory.postUsuarioIniciarSesion($scope.Usuario)
        .success(function (result) {
          return buildToken(result);
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('Error al iniciar sesión', 'danger');
          $log.log('data error: ' + data + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };
  };

  UsuariosLoginController.$inject = ['$scope', '$rootScope', '$log', '$cookies', '$location', 'UsuariosFactory', 'jwtHelper', '$routeParams', 'EmpresasFactory'];

  angular.module('marketplace').controller('UsuariosLoginController', UsuariosLoginController);
} ());
