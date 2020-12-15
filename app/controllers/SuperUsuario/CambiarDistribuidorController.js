(function () {
  var CambiarDistribuidorController = ($scope, $log, $rootScope, $cookies, jwtHelper, CambiarDistribuidorFactory, EmpresasFactory, $location) => {
    $scope.reverse = false;
    $scope.TablaVisible = false;

    $scope.init = () => {
      $scope.CheckCookie();
      $scope.Empresas = null;
      $scope.TablaVisible = false;
    };

    $scope.init();

    $scope.OrdenarPor = Atributo => {
      $scope.sortBy = Atributo;
      $scope.reverse = !$scope.reverse;
    };

    $scope.BuscarEmpresas = () => {
      EmpresasFactory.getEmpresaII($scope.Empresa.Busqueda)
        .success(Empresas => {
          if (Empresas) {
            try {
              if (Empresas[0].Success === false || !Empresas.length) {
                $scope.Empresas = null;
                $scope.TablaVisible = false;
              } else {
                $scope.Empresas = Empresas;
                if ($scope.Empresas.length > 0) {
                  $scope.TablaVisible = true;
                } else {
                  $scope.Empresas = null;

                  $scope.TablaVisible = false;
                }
              }
            } catch (error) {
              $scope.Empresas = null;
              $scope.TablaVisible = false;
            }
          } else {
            $scope.Empresas = null;

            $scope.TablaVisible = false;
          }
        })
          .error((data, status, headers, config) => {
            $scope.TablaVisible = false;
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
    };

    $scope.SeleccionarDistribuidor = (idEmpresa, nombreEmpresa) => {
      $scope.IdEmpresaSeleccionada = idEmpresa;
      $scope.NombreEmpresaSeleccionada = nombreEmpresa;
    };

    const buildToken = result => {
      if (result.success) {
        var Session = {};
        var tokenPayload = jwtHelper.decodeToken(result.data.Token);
        var expireDate = new Date();

        expireDate.setTime(expireDate.getTime() + 600 * 60000);

        Session = {
          Token: result.data.Token,
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

        $scope.ActualizarMenu();
        $location.path('/');
      }
    };

    $scope.AccederADistribuidor = (idEmpresa, contrasena) => {
      CambiarDistribuidorFactory.actualizarToken(idEmpresa, contrasena)
        .success(result => {
          if (result.success) {
            $scope.ShowToast('Cambiando de sesión...', 'success');
            $cookies.remove('Session');
            $cookies.remove('Pedido');
            $scope.SessionCookie = {};
            return buildToken(result);
          } else {
            $scope.ShowToast(result.message, 'danger');
          }
        })
        .error((data, status, headers, config) => {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };
  };

  CambiarDistribuidorController.$inject =
      ['$scope', '$log', '$rootScope', '$cookies', 'jwtHelper', 'CambiarDistribuidorFactory', 'EmpresasFactory', '$location'];

  angular.module('marketplace').controller('CambiarDistribuidorController', CambiarDistribuidorController);
}());
