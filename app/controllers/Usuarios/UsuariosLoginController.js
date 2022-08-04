/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
(function () {
  var UsuariosLoginController = function ($scope, $rootScope, $log, $cookies, $location, UsuariosFactory, jwtHelper, $routeParams, EmpresasFactory) {
    $scope.Subdominio = $routeParams.Subdominio;
    $scope.validarSubdominio = function () {
      if ($scope.Subdominio) {
        EmpresasFactory.getSitio($scope.Subdominio)
          .then(sitio => {
            if (sitio.data.success) {
              if (sitio.data.data[0]) {
                var expireDate = new Date();
                expireDate.setTime(expireDate.getTime() + 600 * 60000);
                $cookies.putObject('currentDistribuidor', sitio.data.data[0], { 'expires': expireDate, secure: $rootScope.secureCookie });
                $scope.currentDistribuidor = $cookies.getObject('currentDistribuidor');
              }
            }
          })
          .catch(error => {
            $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
          });
      }
    };

    const getUserSiclickData = tokenSiclick => {
      let decodedTokenSiclick = '';
      try {
        decodedTokenSiclick = jwtHelper.decodeToken(tokenSiclick);
      } catch (error) {
        $scope.ShowToast('Error al iniciar sesión', 'danger');
        $location.path('/Login');
      }
      UsuariosFactory.getUserDataSiclick(decodedTokenSiclick, tokenSiclick)
        .then(result => {
          const user = {
            CorreoElectronico: result.data.email,
            IdERP: decodedTokenSiclick.customer.id
          };
          UsuariosFactory.postUsuarioIniciarSesionSiClick(user)
            .then(result => {
              if (result.data[0].Success) {
                return buildToken(result.data);
              } else {
                $scope.ShowToast('No cuentas con acceso para esta plataforma', 'danger');
                $location.path('/Login');
              }
            })
            .catch(error => {
              $scope.ShowToast('Error al iniciar sesión', 'danger');
              $log.log('data error: ' + error.data + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
            });
        })
        .catch(error => {
          location.href = $rootScope.SICLIK_FRONT + 'login/suscribe';
          $scope.ShowToast('Error al iniciar sesión', 'danger');
        });
    };

    $scope.init = function () {
      $scope.esNavegadorSoportado();
      $scope.navCollapsed = true;
      /* $scope.validarSubdominio();*/
      if ($routeParams.tokenSiclick) {
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
          // $cookies.putObject('currentDistribuidor', Session.distribuidores[0], { 'expires': expireDate, secure: $rootScope.secureCookie });
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
    };

    $scope.IniciarSesion = function () {
      $cookies.remove('Session');
      $cookies.remove('Pedido');
      $scope.Usuario.IdEmpresa = $scope.currentDistribuidor.IdEmpresa;
      $scope.SessionCookie = {};
      UsuariosFactory.postUsuarioIniciarSesion($scope.Usuario)
        .then(function OnSuccess (result) {
          console.log('Resultado: ' + result.data[0]);
          return buildToken(result.data);
        }).catch(function onError (error) {
          // console.log(`data error: ${response.error}, status: ${response.status}`);
          console.log('Error: ' + error);
        });
    };
  };

  UsuariosLoginController.$inject = ['$scope', '$rootScope', '$log', '$cookies', '$location', 'UsuariosFactory', 'jwtHelper', '$routeParams', 'EmpresasFactory'];

  angular.module('marketplace').controller('UsuariosLoginController', UsuariosLoginController);
}());
