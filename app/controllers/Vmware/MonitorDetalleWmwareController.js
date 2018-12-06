(function () {
    var MonitorDetalleVmwareController = function ($scope, $sce, $cookies, $location, EmpresasXEmpresasFactory, PedidoDetallesFactory, $uibModal, $filter, FabricantesFactory, PedidosFactory, EmpresasFactory, UsuariosFactory) {
      $scope.SessionCookie = $cookies.getObject('Session');
      

      const checkUser = function () {
        if($scope.SessionCookie.IdTipoAcceso !== 1 || $scope.SessionCookie.IdTipoAcceso !== 8) {
            FabricantesFactory.getUriVmwareDistributor()
            .success(function (Uri) {
                if (Uri) {
                    $scope.url = $sce.trustAsResourceUrl(Uri);
                }
            })
            .error(function (data, status, headers, config) {
                $scope.ShowToast('El distribuidor no cuenta con datos en Vmware', 'danger');
            });
        }
      }
  
      $scope.init = function () {
        $scope.CheckCookie();
        checkUser();
      };
  
      $scope.init();
    }
  
    MonitorDetalleVmwareController.$inject = ['$scope', '$sce', '$cookies', '$location', 'EmpresasXEmpresasFactory', 'PedidoDetallesFactory', '$uibModal', '$filter', 'FabricantesFactory', 'PedidosFactory', 'EmpresasFactory', 'UsuariosFactory'];
  
    angular.module('marketplace').controller('MonitorDetalleVmwareController', MonitorDetalleVmwareController);
  }());