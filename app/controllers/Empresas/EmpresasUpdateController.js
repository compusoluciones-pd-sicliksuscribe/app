(function () {
  var EmpresasUpdateController = function ($scope, $rootScope, $log, $location, $cookies, $routeParams, EmpresasFactory, EmpresasXEmpresasFactory, EstadosFactory, UsuariosFactory) {
    var IdEmpresa = $routeParams.IdEmpresa;
    var Session = {};
    Session = $cookies.getObject('Session');
    $scope.Empresa = {};
    $scope.Combo = {};

    $scope.init = function () {
      Session = $cookies.getObject('Session');
      $scope.CheckCookie();

      EmpresasFactory.getEmpresas()
        .success(function (Empresa) {
          $scope.Empresa = Empresa[0];
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });

      EstadosFactory.getEstados()
        .success(function (result) {
          $scope.Combo.EstadoOptions = result;
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.init();

    $scope.EmpresaUpdate = function () {
      $scope.Empresa.CorreoElectronico = $scope.Empresa.CorreoContacto;
      UsuariosFactory.getUsuario($scope.Empresa.CorreoElectronico)
        .success(function (Usuario) {
          if (Usuario[0].Success == false) {
            $scope.Empresa.Nombre = $scope.Empresa.NombreContacto;
            $scope.Empresa.CorreoElectronico = $scope.Empresa.CorreoContacto;
            $scope.Empresa.IdTipoAcceso = 4;
            InsertarUsuario();
          } else {
            ActualizarEmpresa();
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.EmpresaDelete = function () {
      $scope.Empresa.Activo = 0;
      EmpresasXEmpresasFactory.putEmpresasXEmpresa($scope.Empresa)
        .success(function (result) {
          if (result[0].Success == true) {
            $location.path("/Empresas");
          } else {
            $scope.ShowToast(result[0].Message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.EmpresaCancel = function () {
      $location.path("/index");
    };

    function ActualizarEmpresa() {
      EmpresasFactory.putEmpresa($scope.Empresa)
        .success(function (result) {
          if (result[0].Success == true) {
            Session.NombreEmpresa = $scope.Empresa.NombreEmpresa;
            $cookies.putObject('Session', Session, { secure: $rootScope.secureCookie });
            $scope.ActualizarDatosSession();
            $location.path("/index");
            $scope.ShowToast("Empresa Actualizada", 'success');
          } else {
            $scope.ShowToast(result[0].Message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    }

    function InsertarUsuario() {
      UsuariosFactory.postUsuario($scope.Empresa)
        .success(function (Usuario) {
          if (Usuario[0].Success == true) {
            ActualizarEmpresa();
          } else {
            $scope.ShowToast(Usuario[0].Message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    }
  };

  EmpresasUpdateController.$inject = ['$scope', '$rootScope', '$log', '$location', '$cookies', '$routeParams', 'EmpresasFactory', 'EmpresasXEmpresasFactory', 'EstadosFactory', 'UsuariosFactory'];

  angular.module('marketplace').controller('EmpresasUpdateController', EmpresasUpdateController);
}());
