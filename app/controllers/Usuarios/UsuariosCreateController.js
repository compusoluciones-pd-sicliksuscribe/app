/* eslint-disable eqeqeq */
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
          .then(TiposAccesos => {
            $scope.selectTiposAccesos = TiposAccesos.data;
          })
          .catch(error => {
            $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
          });
      };

      if (Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 10) {
        UsuariosFactory.getAccessosParaDistribuidor()
          .then(TiposAccesos => {
            $scope.selectTiposAccesos = TiposAccesos.data.data;
          })
          .catch(error => {
            $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
          });
        EmpresasFactory.getClientes()
          .then(Empresas => {
            $scope.selectEmpresas = Empresas.data.data;
          })
          .catch(error => {
            $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
          });
      }

      $scope.Usuario.Lada = 52;

      if (Session.IdTipoAcceso == 1) {
        EmpresasFactory.getEmpresas()
          .then(Empresas => {
            $scope.selectEmpresas = Empresas.data;
          })
          .catch(error => {
            $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
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
            .then(result => {
              if (result.data.success === 1) {
                $location.path('/Usuarios');
                $scope.ShowToast(result.data.message, 'success');
              } else {
                $scope.ShowToast(result.data.message, 'danger');
                return;
              }
            })
            .catch(error => {
              $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
            });
        }
      } else $scope.ShowToast('Alguno de los campos es invalido', 'danger');
    };

    $scope.UsuarioCancel = function () {
      $location.path('/Usuarios');
    };
  };

  UsuariosCreateController.$inject = ['$scope', '$log', '$cookies', '$location', 'UsuariosFactory', 'TiposAccesosFactory', 'EmpresasFactory'];

  angular.module('marketplace').controller('UsuariosCreateController', UsuariosCreateController);
}());
