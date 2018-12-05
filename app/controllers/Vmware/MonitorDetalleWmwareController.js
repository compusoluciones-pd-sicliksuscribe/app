(function () {
    var MonitorDetalleVmwareController = function ($scope, $log, $cookies, $location, EmpresasXEmpresasFactory, PedidoDetallesFactory, $uibModal, $filter, FabricantesFactory, PedidosFactory, EmpresasFactory, UsuariosFactory) {
      $scope.SessionCookie = $cookies.getObject('Session');

      const checkUser = function () {
        if($scope.SessionCookie.IdTipoAcceso !== 1 || $scope.SessionCookie.IdTipoAcceso !== 8) {
            FabricantesFactory.getUriVmwareDistributor()
            .success(function (Uri) {
                if (Uri.success === 1) {
                }
            })
            .error(function (data, status, headers, config) {
                $scope.ShowToast('Monitor simulado.', 'danger');
            });
        }
      }
  
      $scope.init = function () {
        $scope.CheckCookie();
        checkUser();
      };
  
      $scope.init();
    }
  
    MonitorDetalleVmwareController.$inject = ['$scope', '$log', '$cookies', '$location', 'EmpresasXEmpresasFactory', 'PedidoDetallesFactory', '$uibModal', '$filter', 'FabricantesFactory', 'PedidosFactory', 'EmpresasFactory', 'UsuariosFactory'];
  
    angular.module('marketplace').controller('MonitorDetalleVmwareController', MonitorDetalleVmwareController);
  }());