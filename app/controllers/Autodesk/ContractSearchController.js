(function () {
  var ContractSearchController = function ($scope, $cookies, ContractSearchFactory) {
    const DANGER = 'danger';
    const SUCCESS = 'success';
    const ASSOCIATE_ERROR = 'No fue posible asociar el contrato.';
    const SEARCH_ERROR = 'No fue posible completar la busqueda, intentelo más tarde.';
    const ASSOCIATE_MESSAGE = 'Información importada con éxito.';

    $scope.init = () => {
      $scope.contracts = [];
      ContractSearchFactory.getResellerCSN()
        .then(result => {
          $scope.resellerCSN = result.data.data.resellerCSN;
        });
    };

    $scope.SessionCookie = $cookies.getObject('Session');

    $scope.init();

    $scope.getContractsData = contractNumber => {
      $scope.contracts = [];
      return ContractSearchFactory.getContractsData(contractNumber)
          .then(result => {
            if (result.data.success === 1 && result.data.data) {
              $scope.contracts = result.data.data;
              $scope.isAssociated = ($scope.resellerCSN === $scope.contracts[0].resellerCSN && $scope.contracts[0].activeRelation) || ($scope.contracts[0].relation_id);
              $scope.isUFOrContactRegistered = ($scope.contracts[0].uf_id != null && $scope.contracts[0].contact_id != null);
            }
          })
          .catch(() => $scope.ShowToast(SEARCH_ERROR, DANGER));
    };

    $scope.associate = contractNumber => {
      return ContractSearchFactory.associate(contractNumber)
          .then(result => {
            if (result.data.success === 0) $scope.ShowToast(ASSOCIATE_ERROR, DANGER);
            else {
              $scope.ShowToast(ASSOCIATE_MESSAGE, SUCCESS);
              $scope.isAssociated = true;
              $scope.isUFOrContactRegistered = true;
            }
          })
          .catch(() => $scope.ShowToast(ASSOCIATE_ERROR, DANGER));
    };
  };

  ContractSearchController.$inject =
    ['$scope', '$cookies', 'ContractSearchFactory'];

  angular.module('marketplace').controller('ContractSearchController', ContractSearchController);
}());
