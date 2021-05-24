(function () {
  var ConfirmarSPController = function ($scope, $log, $location, $cookies, $routeParams, SpecialPetitionFactory, $anchorScroll, lodash) {
    const getSPs = () => {
      SpecialPetitionFactory.getOrders()
        .then(result => {
          if (result) {
            $scope.ordenes = result.data.data;
            $scope.ordenes.forEach(orden => {
              orden.Detalles.forEach(detalle => {
                detalle.subtotal = calcularSubtotal(orden.Moneda, orden.TipoCambio, detalle.Precio, detalle.Descuento, detalle.DescuentoSP);
              });
            });
          }
        });
    };

    const calcularSubtotal = (moneda, tipoCambio, precio, descuento, descuentoSp) => {
      const precioAux = (moneda = 'Pesos' ? (precio * tipoCambio) : precio);
      const resultado = precioAux * ((100 - descuento) / 100) * ((100 - descuentoSp) / 100);
      return resultado;
    };

    $scope.init = () => {
      getSPs();
    };

    $scope.porcentajeDetalle = (moneda, tipoCambio, precio, descuento, descuentoSp, detalle) => {
      if (!descuentoSp) {
        descuentoSp = 0;
        detalle.DescuentoSP = 0;
      }
      detalle.subtotal = calcularSubtotal(moneda, tipoCambio, precio, descuento, descuentoSp);
      SpecialPetitionFactory.updateSubtotal(detalle.IdPedidoDetalle, detalle.Descuento, detalle.DescuentoSP, (moneda === 'Pesos' ? detalle.subtotal / tipoCambio : detalle.subtotal));
    };

    $scope.confirmarSP = (idPedido, codigo) => {
      if (codigo && codigo !== '') {
        SpecialPetitionFactory.confirmarSP(idPedido, codigo)
          .then(getSPs);
      } else $scope.ShowToast('Coloca un código de descuento.', 'warning');
    };

    $scope.init();
  };

  ConfirmarSPController.$inject =
        ['$scope', '$log', '$location', '$cookies', '$routeParams', 'SpecialPetitionFactory', '$anchorScroll'];

  angular.module('marketplace').controller('ConfirmarSPController', ConfirmarSPController);
}());
