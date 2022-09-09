(function () {
  var OpenCSNController = function ($scope, OpenCSNFactory) {

    const WARNING = 'warning';
    const SUCCESS = 'success'
    const RESELLER_CSN_UPDATE_ERROR = 'No se pudo actualizar el CSN del distribuidor.';

    $scope.getOrders = () => {
      OpenCSNFactory.getOpenOrders()
      .then(result => {
        if (result.data.success) $scope.orders = result.data.data;
      });
    };

    $scope.updateResellerCSN = (supplierCSN, supplierId) => {
      OpenCSNFactory.updateResellerCSN(supplierCSN, supplierId)
        .then(result => {
          if(result.data.success){
            $scope.ShowToast(result.data.message, SUCCESS);
            $scope.init();
          } 
          else $scope.ShowToast(RESELLER_CSN_UPDATE_ERROR, WARNING);
        });
    };

    $scope.init = async () => {
      await $scope.getOrders();
    };

    $scope.init();

  };

  OpenCSNController.$inject = ['$scope', 'OpenCSNFactory'];

  angular.module('marketplace').controller('OpenCSNController', OpenCSNController);
}());
