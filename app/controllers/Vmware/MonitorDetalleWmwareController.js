(function () {
  var MonitorDetalleVmwareController = function ($scope, $sce, $cookies, $location, EmpresasXEmpresasFactory, PedidoDetallesFactory, $uibModal, $filter, FabricantesFactory, PedidosFactory, EmpresasFactory, UsuariosFactory) {
    $scope.SessionCookie = $cookies.getObject('Session');
    $scope.url = '';
    $scope.selectVmware = {};
    $scope.contractUsageStatus = [{
      1: 'Not opened',
      2: 'Pending SP',
      3: 'Pending Agg',
      4: 'Pending Vendor',
      5: 'Closed',
      7: 'Pending Site'
    }];

    $scope.generateAggPo = {};
    $scope.collectionDate = {};

    $scope.OpenUrl = function () {
      window.open($scope.url, '_blank');
    };

    const checkUser = function () {
      if ($scope.SessionCookie.IdTipoAcceso === 2 || $scope.SessionCookie.IdTipoAcceso === 3) {
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
      } else if ($scope.SessionCookie.IdTipoAcceso === 1 || $scope.SessionCookie.IdTipoAcceso === 8) {
        FabricantesFactory.getUsersListVmware()
          .success(function (data) {
            $scope.selectVmware = data;
          })
          .error(function () {
            $scope.url = '';
            $scope.ShowToast('No se encontraron datos en el mes seleccionado', 'danger');
          });
      }
      let contador = 0;
      $scope.resultApi = {};

      $scope.dateSearch = function () {
        let date = new Date();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        if (month === 1) {
          month = 12;
          year = year - 1;
        } else {
          month -= 1;
        }
        month = (month < 10 ? '0' : '') + month;
        date = `${year}-${month}`;
        $scope.afterDate = date;
        $scope.searchApi(date);
      };

      $scope.searchApi = function (date) {
        if ($scope.firstDate) {
          let month;
          date = new Date($scope.firstDate);
          month = date.getMonth() + 1;
          month = (month < 10 ? '0' : '') + month;
          date = `${date.getFullYear()}-${month}`;
        }
        const datosFinal = {
          CollectionStartMonth: date,
          CollectionEndMonth: date
        };
        $scope.collectionDate = datosFinal;
        FabricantesFactory.getMonthlyUsageVmware(datosFinal)
          .success(function (data) {
            $scope.resultApi = data;
            $scope.validate(0);
          }).error(function () {
            $scope.url = '';
            $scope.ShowToast('No se encontraron datos en la fecha seleccionada', 'danger');
          });
      };

      $scope.generarPONumber = function () {
        const MonedaPago = document.getElementById('moneda').value;
        if (!MonedaPago) return $scope.ShowToast('Selecciona la moneda', 'danger');
        $scope.generateAggPo = Object.assign({}, $scope.generateAggPo, { MonedaPago });
        FabricantesFactory.putVmwarePoNumber($scope.generateAggPo)
          .success(function (data) {
            if (data.statusCode === 200) {
              $scope.ShowToast('PO number asignado', 'success');
              $('.close').click();
              $scope.searchApi($scope.generateAggPo.CollectionStartMonth);
            }
            else {
              $scope.ShowToast(data.message, 'danger');
            }
          }).error(function (data) {
            $scope.url = '';
            $scope.ShowToast(data.message, 'danger');
          });
      };

      $scope.generarObjPONumber = function (contract) {
        $scope.generateAggPo = Object.assign({}, $scope.collectionDate, { ContractNumber: contract});
      };

      $scope.validate = function (valor) {
        let data = $scope.resultApi;
        if (contador + valor >= 0 && contador + valor < Object.keys(data).length) {
          contador += valor;
          data = data[contador];
          $scope.header = data.header;
          $scope.enterprise = data.header.serviceProvider;
          $scope.Periodos = data.body;
          $scope.contractVmware = data;
        } else {
          $scope.ShowToast('No hay datos para mostrar', 'danger');
        }
      };
    };
    $scope.init = function () {
      $scope.CheckCookie();
      checkUser();
      if ($scope.SessionCookie.IdTipoAcceso === 1 || $scope.SessionCookie.IdTipoAcceso === 8) {
        $scope.dateSearch();
      }
    };
    $scope.init();
  };

  MonitorDetalleVmwareController.$inject = ['$scope', '$sce', '$cookies', '$location', 'EmpresasXEmpresasFactory', 'PedidoDetallesFactory', '$uibModal', '$filter', 'FabricantesFactory', 'PedidosFactory', 'EmpresasFactory', 'UsuariosFactory'];

  angular.module('marketplace').controller('MonitorDetalleVmwareController', MonitorDetalleVmwareController);
}());
