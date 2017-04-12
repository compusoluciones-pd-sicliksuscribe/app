(function () {
  var EmpresasRPController = function ($scope, $log, $cookieStore, $location, $uibModal, $filter, EmpresasXEmpresasFactory, $routeParams) {
    $scope.MostrarMensajeError = false;
    $scope.init = function () {
      EmpresasXEmpresasFactory.getEmpresasXEmpresasByIdEmpresa($routeParams.IdEmpresa)
        .success(function (Empresas) {
          $scope.Empresas = Empresas;
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };
    $scope.init();

    $scope.ActualizarTodos = function () {
      console.log($scope.RPTodos > 0);
      if (!($scope.RPTodos > 0)) {
        return $scope.MostrarMensajeError = true;
      }
      $scope.MostrarMensajeError = false;
      $scope.Empresas = $scope.Empresas.map(function (Empresa) {
        Empresa.TipoCambioRP = $scope.RPTodos;
        return Empresa;
      });
    }

    $scope.ActualizarRP = function (Empresa) {
      console.log(Empresa);
    }

  };
  EmpresasRPController.$inject = ['$scope', '$log', '$cookieStore', '$location', '$uibModal', '$filter', 'EmpresasXEmpresasFactory', '$routeParams'];

  angular.module('marketplace').controller('EmpresasRPController', EmpresasRPController);
}());
