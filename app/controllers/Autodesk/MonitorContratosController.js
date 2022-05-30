(function () {
  var MonitorContratosController = function ($scope, $log, $cookies, $location, EmpresasXEmpresasFactory, PedidoDetallesFactory, $uibModal, $filter, MonitorContratosFactory, FabricantesFactory, PedidosFactory, EmpresasFactory, UsuariosFactory, AmazonDataFactory, ActualizarCSNFactory) {
    $scope.vacio = 0;
    $scope.SessionCookie = $cookies.getObject('Session');

    $scope.init = function () {
      MonitorContratosFactory.getEndCustomer()
        .success(function (Empresas){
          $scope.selectEmpresas = Empresas;
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });

    };

    const getContractCustomer = function (customer) {
      MonitorContratosFactory.getContractCustomer(customer)
        .then(function (result) {
          if (result.status === 200) {
            $scope.Pedidos = result.data.data;
            $scope.Pedidos.forEach(pedido => {
              pedido.esquemaRenovacion = (pedido.contract_term === 'Annual') ? 'Anual' : 'Cada 3 años';
              pedido.etiquetaTermSwitch = (pedido.contract_term === '3-Year') ? 'Actualizar periodo a un año' : 'Actualizar periodo a tres años';
            });
          }
          if(result.data.data.length > 0){
            $scope.vacio = 1;
          }else{
            $scope.vacio = 0;
          }
        })
        .catch(function (result) {
          $scope.ShowToast(result.data.message, 'danger');
        });
    };

    

    $scope.init();

    $scope.ActualizarMonitor = function () {
      let endCustomerCSN = $scope.EmpresaSelect;
        getContractCustomer(endCustomerCSN);
    };
  };

  MonitorContratosController.$inject = ['$scope', '$log', '$cookies', '$location', 'EmpresasXEmpresasFactory', 'PedidoDetallesFactory', '$uibModal', '$filter', 'MonitorContratosFactory', 'FabricantesFactory', 'PedidosFactory', 'EmpresasFactory', 'UsuariosFactory','AmazonDataFactory', 'ActualizarCSNFactory'];

  angular.module('marketplace').controller('MonitorContratosController', MonitorContratosController);

}());
