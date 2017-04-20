(function () {
  var EmpresasRPController = function ($scope, $log, $cookieStore, $location, $uibModal, $filter, EmpresasXEmpresasFactory, $routeParams) {
    $scope.MostrarMensajeError = false;
    $scope.init = function () {
      EmpresasXEmpresasFactory.getExchangeRateByIdEmpresa($routeParams.IdEmpresa)
        .success(function (Empresas) {
          if (Empresas.data) {
            $scope.Empresas = Empresas.data;
          }

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
      
      EmpresasXEmpresasFactory.postExchangeRate({ Empresas: $scope.Empresas })
        .success(function (result) {
          $scope.ShowToast('Actualizado correctamente.', 'success');
          $scope.Empresas = result;
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.ActualizarRP = function (Empresa) {
      if (!(Empresa.TipoCambioRP > 0)) {
        return $scope.Empresas.map(function (item) {
          if (item.IdEmpresaUsuarioFinal === Empresa.IdEmpresaUsuarioFinal) {
            item.MostrarMensajeError = true;
          }
          return item;
        });
      }
      $scope.Empresas.map(function (item) {
        if (item.IdEmpresaUsuarioFinal === Empresa.IdEmpresaUsuarioFinal) {
          item.MostrarMensajeError = false;
        }
        return item;
      });
      EmpresasXEmpresasFactory.postExchangeRate({ Empresas: [Empresa] })
        .success(function (result) {
          $scope.ShowToast('Actualizado correctamente.', 'success');
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('Error al actualizar.', 'danger');
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

  };
  EmpresasRPController.$inject = ['$scope', '$log', '$cookieStore', '$location', '$uibModal', '$filter', 'EmpresasXEmpresasFactory', '$routeParams'];

  angular.module('marketplace').controller('EmpresasRPController', EmpresasRPController);
}());
