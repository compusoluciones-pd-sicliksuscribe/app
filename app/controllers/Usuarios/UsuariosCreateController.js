(function () {
  var UsuariosCreateController = function ($scope, $log, $cookies, $location, UsuariosFactory, TiposAccesosFactory, EmpresasFactory) {
    var Session = {};
    Session = $cookies.getObject('Session');
    $scope.Session = Session;
    $scope.Usuario = {};
    $scope.empresa = 0;
    $scope.Usuario.Formulario = false;
    const COMPUSOLUCIONES_ADMINISTRATOR = 1;
    const DISTRIBUTOR_ADMINISTRATOR = 2;
    const SUPER_USER_PURCHASES = 10;

    $scope.init = function () {
      $scope.CheckCookie();
      if (Session.IdTipoAcceso !== 2 || Session.IdTipoAcceso !== 10) {
        TiposAccesosFactory.getTiposAccesos()
          .success(function (TiposAccesos) {
            $scope.selectTiposAccesos = TiposAccesos;
          })
          .error(function (data, status, headers, config) {
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      };

      if (Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 10) {
        UsuariosFactory.getAccessosParaDistribuidor()
          .success(function (TiposAccesos) {
            $scope.selectTiposAccesos = TiposAccesos.data;
          })
          .error(function (data, status, headers, config) {
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
        EmpresasFactory.getClientes()
          .success(function (Empresas) {
            $scope.selectEmpresas = Empresas.data;
          })
          .error(function (data, status, headers, config) {
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      }

      $scope.Usuario.Lada = 52;

      if (Session.IdTipoAcceso == 1) {
        EmpresasFactory.getEmpresas()
          .success(function (Empresas) {
            $scope.selectEmpresas = Empresas;
          })
          .error(function (data, status, headers, config) {
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      }
    };

    $scope.init();

    $scope.UsuarioCreate = function () {
      if ($scope.frm.$valid) {
        delete $scope.Usuario.Formulario;
        if (Session.IdTipoAcceso === COMPUSOLUCIONES_ADMINISTRATOR || Session.IdTipoAcceso === DISTRIBUTOR_ADMINISTRATOR || Session.IdTipoAcceso === SUPER_USER_PURCHASES) {
          const user = Object.assign({}, $scope.Usuario);
          user.IdTipoAcceso = $scope.Usuario.IdTipoAcceso.toString();
          user.Lada = $scope.Usuario.Lada.toString();
          UsuariosFactory.postUsuarioCliente(user)
            .success(function (result) {
              if (result.success === 1) {
                $location.path('/Usuarios');
                $scope.ShowToast(result.message, 'success');
              } else {
                $scope.ShowToast(result.message, 'danger');
                return;
              }
            })
            .error(function (data, status, headers, config) {
              $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
            });
        }
      } else $scope.ShowToast('Alguno de los campos es invalido', 'danger');
    };

    $scope.UsuarioCancel = function () {
      $location.path("/Usuarios");
    };
  };

  UsuariosCreateController.$inject = ['$scope', '$log', '$cookies', '$location', 'UsuariosFactory', 'TiposAccesosFactory', 'EmpresasFactory'];

  angular.module('marketplace').controller('UsuariosCreateController', UsuariosCreateController);
}());
