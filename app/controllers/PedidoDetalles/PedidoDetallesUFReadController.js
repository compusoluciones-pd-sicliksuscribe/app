(function () {
  var PedidoDetallesUFReadController = function ($scope, $log, $location, $cookieStore, ComprasUFFactory, EmpresasFactory, $routeParams) {
    $scope.currentDistribuidor = $cookieStore.get('currentDistribuidor');
    $scope.TotalEnPesos = 0;
    $scope.SubtotalEnPesos = 0;
    $scope.IVA = 0;
    $scope.CarritoValido = false;

    $scope.validarCarrito = function () {
      EmpresasFactory.getValidarCreditoUF($scope.currentDistribuidor.IdEmpresa)
        .success(function (validacion) {
          $scope.TotalEnPesos = validacion.data.TotalActualEnSuCarrito;
          $scope.SubtotalEnPesos = validacion.data.SubtotalActualEnSuCarrito;
          $scope.IVA = validacion.data.IVA;
          if (!validacion.success) {
            $scope.CarritoValido = false;
            $scope.ShowToast('Haz llegado a tu tope de compras, por favor elimina productos de tu carrito o ponte en contacto con tu distribuidor.', 'danger');
          } else {
            $scope.CarritoValido = true;
          }
        })
        .error(function (data, status, headers, config) {
          $scope.CarritoValido = false;
          $scope.ShowToast('No pudimos validar tu carrito de compras, por favor intenta de nuevo refrescando tu página.', 'danger');
          $location.path('/uf/Productos');
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.init = function () {
      $scope.CheckCookie();
      $scope.validarCarrito();
      ComprasUFFactory.getComprasUF($scope.currentDistribuidor.IdEmpresa, 0)
        .success(function (carritoDeCompras) {
          if (carritoDeCompras.success) {
            $scope.PedidoDetalles = carritoDeCompras.data[0];
            if (!$scope.PedidoDetalles.length) { $scope.CarritoValido = false; }
            $scope.ActualizarMenu();
          } else {
            $scope.CarritoValido = false;
            $scope.ShowToast(carritoDeCompras.message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos preparar tu información, por favor intenta de nuevo más tarde.', 'danger');
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.init();

    $scope.QuitarProducto = function (PedidoDetalle) {
      $scope.PedidoDetalles.forEach(function (Elemento, Index) {
        if (Elemento.IdCompraUF === PedidoDetalle.IdCompraUF) {
          $scope.PedidoDetalles.splice(Index, 1);
          return false;
        }
      });

      ComprasUFFactory.deleteComprasUF(PedidoDetalle.IdCompraUF)
        .success(function (PedidoDetalleResult) {
          if (PedidoDetalleResult.success) {
            $scope.ActualizarMenu();
            $scope.validarCarrito();
            $scope.ShowToast('Producto eliminado de tu carrito de compras.', 'success');
          } else {
            $scope.ShowToast(PedidoDetalleResult.message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos quitar el producto seleccionado. Intenta de nuevo más tarde.', 'danger');
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.Siguiente = function () {
      if ($scope.CarritoValido) {
        $location.path('/uf/Comprar');
      } else {
        $scope.ShowToast('Revisa que tengas al menos un producto y que tenga un cliente seleccionado con crédito válido.', 'warning');
      }
    };
  };

  PedidoDetallesUFReadController.$inject = ['$scope', '$log', '$location', '$cookieStore', 'ComprasUFFactory', 'EmpresasFactory', '$routeParams'];

  angular.module('marketplace').controller('PedidoDetallesUFReadController', PedidoDetallesUFReadController);
}());
