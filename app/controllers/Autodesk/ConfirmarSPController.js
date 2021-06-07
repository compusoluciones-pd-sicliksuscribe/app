(function () {
  var ConfirmarSPController = function ($scope, $log, $location, $cookies, $routeParams, SpecialPetitionFactory, $anchorScroll, lodash) {
    const getSPs = () => {
      SpecialPetitionFactory.getOrders()
        .then(result => {
          if (result) {
            $scope.ordenes = result.data.data;
            $scope.ordenes.forEach(orden => {
              orden.Detalles.forEach(detalle => {
                detalle.precioDescuento = calcularPrecioDescuento(orden.Moneda, orden.TipoCambio, detalle.Precio, detalle.Descuento, detalle.DescuentoSP);
                detalle.subtotal = calcularSubtotal(orden.Moneda, orden.TipoCambio, detalle.Precio, detalle.Descuento, detalle.DescuentoSP, detalle.Cantidad);
              });
            });
          }
        });
    };

    const calcularPrecioDescuento = (moneda, tipoCambio, precio, descuento, descuentoSp) => {
      const precioAux = (moneda === 'Pesos' ? (precio * tipoCambio) : precio);
      const resultado = precioAux * ((100 - descuento) / 100) * ((100 - descuentoSp) / 100);
      return resultado;
    };

    const calcularSubtotal = (moneda, tipoCambio, precio, descuento, descuentoSp, cantidad) => {
      const precioAux = (moneda === 'Pesos' ? (precio * tipoCambio) : precio);
      const resultado = precioAux * ((100 - descuento) / 100) * ((100 - descuentoSp) / 100);
      return resultado * cantidad;
    };

    $scope.init = () => {
      getSPs();
    };

    $scope.porcentajeDetalle = (moneda, tipoCambio, precio, descuento, descuentoSp, detalle, cantidad) => {
      if (descuentoSp > 100) {
        descuentoSp = 100;
        detalle.DescuentoSP = 100;
      }
      if (descuento > 100) {
        descuento = 100;
        detalle.Descuento = 100;
      }
      detalle.precioDescuento = calcularPrecioDescuento(moneda, tipoCambio, precio, descuento, descuentoSp);
      detalle.subtotal = calcularSubtotal(moneda, tipoCambio, precio, descuento, descuentoSp, cantidad);
      SpecialPetitionFactory.updateSubtotal(detalle.IdPedidoDetalle, detalle.Descuento, detalle.DescuentoSP, (moneda === 'Pesos' ? detalle.subtotal / tipoCambio : detalle.subtotal));
    };

    $scope.confirmarSP = (idPedido, codigo, csn) => {
      if (codigo && codigo !== '') {
        SpecialPetitionFactory.confirmarSP(idPedido, codigo, csn)
          .then(result => {
            result.data.success ? $scope.ShowToast(result.data.message, 'success') : $scope.ShowToast(result.data.message, 'warning');
            return result.data.success;
          })
          .then(success => { if (success) getSPs(); });
      } else $scope.ShowToast('Coloca un código de descuento.', 'warning');
    };

    $scope.init();
  };

  ConfirmarSPController.$inject =
        ['$scope', '$log', '$location', '$cookies', '$routeParams', 'SpecialPetitionFactory', '$anchorScroll'];

  angular.module('marketplace').controller('ConfirmarSPController', ConfirmarSPController);
}());
