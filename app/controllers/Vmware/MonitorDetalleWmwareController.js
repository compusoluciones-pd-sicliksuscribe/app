

(function () {

    var MonitorDetalleVmwareController = function ($scope, $sce, $cookies, $location, EmpresasXEmpresasFactory, PedidoDetallesFactory, $uibModal, $filter, FabricantesFactory, PedidosFactory, EmpresasFactory, UsuariosFactory) {
      $scope.SessionCookie = $cookies.getObject('Session');
      $scope.url = '';
      $scope.selectVmware = {};


      

      $scope.OpenUrl = function () {
        window.open($scope.url,'_blank');
      };

      $scope.GetMonthlyUsage = function () {
        console.log($scope.ClientesVmware);
      }

      const checkUser = function () {
        if($scope.SessionCookie.IdTipoAcceso === 2 || $scope.SessionCookie.IdTipoAcceso === 3) {
            FabricantesFactory.getUriVmwareDistributor()
            .success(function (Uri) {
                if (Uri) {
                    $scope.url = $sce.trustAsResourceUrl(Uri);
                }
            })
            .error(function () {
                $scope.url = '';
                $scope.ShowToast('El distribuidor no cuenta con datos en Vmware', 'danger');
            });
        }
        else if ($scope.SessionCookie.IdTipoAcceso === 1 || $scope.SessionCookie.IdTipoAcceso === 8) {
          FabricantesFactory.getUsersListVmware()
            .success(function (data) {
                console.log(data);
                $scope.selectVmware = data;
            })
            .error(function () {
                $scope.url = '';
                $scope.ShowToast('El distribuidor no cuenta con datos en Vmware', 'danger');
            });
        }

        $scope.validate = function () {

            if ($scope.firstDate && $scope.secondDate && $scope.ClientesVmware) {
                 const datosFinal = {                
                    ContractNumber: $scope.ClientesVmware,
                    CollectionStartMonth: $scope.firstDate,
                    CollectionEndMonth: $scope.secondDate
                }

                console.log(datosFinal);
            } else {
                $scope.ShowToast('Es necesrio completar los datos', 'danger');
            }
            
                //Aqui va la consulta :)
 
            
          };
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

  