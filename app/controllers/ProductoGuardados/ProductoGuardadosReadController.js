/* eslint-disable eqeqeq */
/* eslint-disable standard/object-curly-even-spacing */
(function () {
  var ProductoGuardadosReadController = function ($scope, $log, $location, $cookies, ProductoGuardadosFactory, PedidoDetallesFactory) {
    $scope.sortBy = 'Nombre';
    $scope.reverse = false;

    $scope.init = function () {
      $scope.CheckCookie();

      ProductoGuardadosFactory.getProductoGuardados()
        .then(ProductoGuardados => {
          $scope.ProductoGuardados = ProductoGuardados.data;
        })
        .catch(error => {
          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
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
        .then(PedidoDetalleResult => {
          if (PedidoDetalleResult.data[0].Success == true) {
            $scope.ShowToast(PedidoDetalleResult.data[0].Message + ' podrás cambiar la cantidad desde ahí', 'success');
            $scope.ActualizarMenu();
          } else {
            $scope.ShowToast(PedidoDetalleResult.data[0].Message, 'danger');
          }
        })
        .catch(error => {
          $scope.ShowToast('No pudimos agregar este producto a tu carrito de compras, por favor intenta de nuevo más tarde.', 'danger');

          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
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
        .then(PedidoGuardadoResult => {
          if (PedidoGuardadoResult.data[0].Success == false) {
            $scope.init();
            $scope.ShowToast(PedidoGuardadoResult.data[0].Message, 'danger');
          } else {
            $scope.ShowToast(PedidoGuardadoResult.data[0].Message, 'success');
          }
        })
        .catch(error => {
          $scope.ShowToast('No pudimos quitar el producto seleccionado. Intenta de nuevo más tarde.', 'danger');

          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        });
    };
  };

  ProductoGuardadosReadController.$inject = ['$scope', '$log', '$location', '$cookies', 'ProductoGuardadosFactory', 'PedidoDetallesFactory'];

  angular.module('marketplace').controller('ProductoGuardadosReadController', ProductoGuardadosReadController);
}());
