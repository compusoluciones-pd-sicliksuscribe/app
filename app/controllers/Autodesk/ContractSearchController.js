(function () {
  var ContractSearchController = function ($scope, ContractSearchFactory) {
    $scope.getContractsData = contractNumber => {
      return ContractSearchFactory.getContractsData(contractNumber)
          .then(result => {
            if (result.data.success === 0) $scope.ShowToast(`Hubo un problema al obtener los datos: ${result.data.message}.`, 'danger');
            else {
              $scope.contracts = result.data.data;
              $scope.contractsAux = result.data.data;
            }
          })
          .catch(() => $scope.ShowToast('No fue posible obtener los datos de los pedidos, por favor intenta de nuevo más tarde.', 'danger'));
    };
  };

  ContractSearchController.$inject =
    ['$scope', 'ContractSearchFactory'];

  angular.module('marketplace').controller('ContractSearchController', ContractSearchController);
}());
