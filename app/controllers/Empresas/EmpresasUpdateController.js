/* eslint-disable eqeqeq */
(function () {
  var EmpresasUpdateController = function ($scope, $rootScope, $log, $location, $cookies, $routeParams, EmpresasFactory, EmpresasXEmpresasFactory, EstadosFactory, UsuariosFactory) {
    // eslint-disable-next-line no-unused-vars
    var IdEmpresa = $routeParams.IdEmpresa;
    var Session = {};
    Session = $cookies.getObject('Session');
    $scope.Empresa = {};
    $scope.Combo = {};

    $scope.init = function () {
      Session = $cookies.getObject('Session');
      $scope.CheckCookie();

      EmpresasFactory.getEmpresas()
        .then(Empresa => {
          $scope.Empresa = Empresa.data[0];
        })
        .catch(error => {
          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        });

      EstadosFactory.getEstados()
        .then(result => {
          $scope.Combo.EstadoOptions = result.data;
        })
        .catch(error => {
          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        });
    };

    $scope.init();

    $scope.EmpresaUpdate = function () {
      $scope.Empresa.CorreoElectronico = $scope.Empresa.CorreoContacto;
      UsuariosFactory.getUsuario($scope.Empresa.CorreoElectronico)
        .then(Usuario => {
          if (Usuario.data[0].Success == false) {
            $scope.Empresa.Nombre = $scope.Empresa.NombreContacto;
            $scope.Empresa.CorreoElectronico = $scope.Empresa.CorreoContacto;
            $scope.Empresa.IdTipoAcceso = 4;
            InsertarUsuario();
          } else {
            ActualizarEmpresa();
          }
        })
        .catch(error => {
          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        });
    };

    $scope.EmpresaDelete = function () {
      $scope.Empresa.Activo = 0;
      EmpresasXEmpresasFactory.putEmpresasXEmpresa($scope.Empresa)
        .then(result => {
          if (result.data[0].Success == true) {
            $location.path('/Empresas');
          } else {
            $scope.ShowToast(result.data[0].Message, 'danger');
          }
        })
        .catch(error => {
          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        });
    };

    $scope.EmpresaCancel = function () {
      $location.path('/index');
    };

    function ActualizarEmpresa () {
      EmpresasFactory.putEmpresa($scope.Empresa)
        .then(result => {
          if (result.data[0].Success == true) {
            Session.NombreEmpresa = $scope.Empresa.NombreEmpresa;
            $cookies.putObject('Session', Session, { secure: $rootScope.secureCookie });
            $scope.ActualizarDatosSession();
            $location.path('/index');
            $scope.ShowToast('Empresa Actualizada', 'success');
          } else {
            $scope.ShowToast(result.data[0].Message, 'danger');
          }
        })
        .error(error => {
          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        });
    }

    function InsertarUsuario () {
      UsuariosFactory.postUsuario($scope.Empresa)
        .then(Usuario => {
          if (Usuario.data[0].Success == true) {
            ActualizarEmpresa();
          } else {
            $scope.ShowToast(Usuario.data[0].Message, 'danger');
          }
        })
        .catch(error => {
          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        });
    }
  };

  EmpresasUpdateController.$inject = ['$scope', '$rootScope', '$log', '$location', '$cookies', '$routeParams', 'EmpresasFactory', 'EmpresasXEmpresasFactory', 'EstadosFactory', 'UsuariosFactory'];

  angular.module('marketplace').controller('EmpresasUpdateController', EmpresasUpdateController);
}());
