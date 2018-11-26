(function () {
  var ProductoGuardadosReadController = function ($scope, $log, $location, $cookies, ProductoGuardadosFactory, PedidoDetallesFactory) {

    $scope.sortBy = 'Nombre';
    $scope.reverse = false;

    $scope.init = function () {
      $scope.CheckCookie();

      ProductoGuardadosFactory.getProductoGuardados()
        .success(function (ProductoGuardados) {
          $scope.ProductoGuardados = ProductoGuardados;
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.init();

    $scope.OrdenarPor = function (Atributo) {
      $scope.sortBy = Atributo;
      $scope.reverse = !$scope.reverse;
    };

    $scope.AgregarCarrito = function (Producto) {
      var ProductoGuardado = { IdPedido: $cookies.getObject('Pedido').IdPedidoActual, IdProducto: Producto.IdProducto, Cantidad: 1};

      PedidoDetallesFactory.postPedidoDetalle(ProductoGuardado)
        .success(function (PedidoDetalleResult) {
          if (PedidoDetalleResult[0].Success == true) {
            $scope.ShowToast(PedidoDetalleResult[0].Message + " podrás cambiar la cantidad desde ahí", 'success');
            $scope.ActualizarMenu();
          }
          else {
            $scope.ShowToast(PedidoDetalleResult[0].Message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos agregar este producto a tu carrito de compras, por favor intenta de nuevo más tarde.', 'danger');

          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.QuitarProducto = function (ProductoQuitar) {
      $scope.ProductoGuardados.forEach(function (Elemento, Index) {

        if (Elemento.IdProductoGuardado == ProductoQuitar.IdProductoGuardado) {
          $scope.ProductoGuardados.splice(Index, 1);
          return false;
        }
      });

      ProductoGuardadosFactory.putProductoGuardado(ProductoQuitar)
        .success(function (PedidoGuardadoResult) {
          if (PedidoGuardadoResult[0].Success == false) {
            $scope.init();
            $scope.ShowToast(PedidoGuardadoResult[0].Message, 'danger');
          }
          else {
            $scope.ShowToast(PedidoGuardadoResult[0].Message, 'success');
          }
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos quitar el producto seleccionado. Intenta de nuevo más tarde.', 'danger');

          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };
  };

  ProductoGuardadosReadController.$inject = ['$scope', '$log', '$location', '$cookies', 'ProductoGuardadosFactory', 'PedidoDetallesFactory'];

  angular.module('marketplace').controller('ProductoGuardadosReadController', ProductoGuardadosReadController);
}());
