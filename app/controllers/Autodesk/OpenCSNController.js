(function () {
  var OpenCSNController = function ($scope, OpenCSNFactory, ActualizarCSNFactory) {

    const WARNING = 'warning';
    const SUCCESS = 'success'
    const RESELLER_CSN_UPDATE_ERROR = 'No se pudo actualizar el CSN del distribuidor.';
    const ORDER_CONFIRMED = 'Orden confirmada.';
    const CONFIRM_ORDER_ERROR = 'No se pudo confirmar la orden.';
    const FIELD_REQUIRED_ERROR = 'Registra un CSN antes de confirmar la orden.';
    const INVALID_CSN = ' no es un CSN válido.';
    const VALID_CSN = 'CSN válido.';

    $scope.getOrders = () => {
      OpenCSNFactory.getOpenOrders()
      .then(result => {
        if (result.data.success) $scope.orders = result.data.data;
      });
    };

    $scope.updateResellerCSN = (resellerCSN, orderId, order) => {
      if (!resellerCSN) $scope.ShowToast(FIELD_REQUIRED_ERROR, WARNING);
      else {
        ActualizarCSNFactory.validateCSN(resellerCSN)
          .then(result => {
            if (result.data.success) {
              if (result.data.data.victimCsn) resellerCSN = result.data.data.csn;
              order.resellerName = result.data.data.name;
              $scope.ShowToast(VALID_CSN, SUCCESS);
            } else $scope.ShowToast(supplierCSN + INVALID_CSN, WARNING);
          }
        );
      }
    };

    $scope.confirmOrder = orderData => {
      if(!orderData.resellerCSN) $scope.ShowToast(FIELD_REQUIRED_ERROR, WARNING);
      else {
        ActualizarCSNFactory.validateCSN(orderData.resellerCSN)
          .then(result => {
            if (result.data.success) {
              if (result.data.data.error) $scope.ShowToast(orderData.resellerCSN + INVALID_CSN, WARNING);
              if (result.data.data.victimCsn) orderData.resellerCSN = result.data.data.csn;
              $scope.ShowToast(VALID_CSN, SUCCESS);
              OpenCSNFactory.confirmOrder(orderData.IdPedido)
                .then(async (result) => {
                  if(result.data.success) {
                    $scope.ShowToast(ORDER_CONFIRMED, SUCCESS);
                    await $scope.updateResellerCSN(orderData.resellerCSN, orderData.IdPedido);
                    $scope.init();
                  } 
                  else $scope.ShowToast(CONFIRM_ORDER_ERROR, WARNING);
                }
              );
            } else $scope.ShowToast(supplierCSN + INVALID_CSN, WARNING);
          }
        );
      }
    };

    $scope.init = async () => {
      await $scope.getOrders();
    };

    $scope.init();

  };

  OpenCSNController.$inject = ['$scope', 'OpenCSNFactory', 'ActualizarCSNFactory'];

  angular.module('marketplace').controller('OpenCSNController', OpenCSNController);
}());
