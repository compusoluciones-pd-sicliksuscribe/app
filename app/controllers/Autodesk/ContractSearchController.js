(function () {
  var ContractSearchController = function ($scope, ContractSearchFactory) {
    const DANGER = 'danger';
    const SUCCESS = 'success';
    const ASSOCIATE_ERROR = 'No fue posible asociar el contrato.';
    const SEARCH_ERROR = 'No fue posible completar la busqueda, intentelo más tarde.';
    const ASSOCIATE_MESSAGE = 'Se ha asociado el contrato. Se puede encontrar en el monitor de contratos.';

    $scope.getContractsData = contractNumber => {
      return ContractSearchFactory.getContractsData(contractNumber)
          .then(result => {
            if (result.data.success === 0) $scope.ShowToast(SEARCH_ERROR, DANGER);
            else $scope.contracts = result.data.data;
          })
          .catch(() => $scope.ShowToast(SEARCH_ERROR, DANGER));
    };

    $scope.associate = contractNumber => {
      return ContractSearchFactory.associate(contractNumber)
          .then(result => {
            if (result.data.success === 0) $scope.ShowToast(ASSOCIATE_ERROR, DANGER);
            else $scope.ShowToast(ASSOCIATE_MESSAGE, SUCCESS);
          })
          .catch(() => $scope.ShowToast(ASSOCIATE_ERROR, DANGER));
    };
  };

  ContractSearchController.$inject =
    ['$scope', 'ContractSearchFactory'];

  angular.module('marketplace').controller('ContractSearchController', ContractSearchController);
}());
