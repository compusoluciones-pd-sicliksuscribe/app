(function () {
  // const ON_DEMAND = 3;
  // const CREDIT_CARD = 1;
  const CS_CREDIT = 2;
  var PedidoDetallesUFReadController = function ($scope, $log, $location, $cookies, ComprasUFFactory, EmpresasFactory, PedidoDetallesFactory, $routeParams) {
    $scope.currentDistribuidor = $cookies.getObject('currentDistribuidor');
    $scope.TotalEnPesos = 0;
    $scope.SubtotalEnPesos = 0;
    $scope.IVA = 0;
    $scope.CarritoValido = false;
    $scope.DetailsUf = {};
    $scope.error = false;

    const error = function (error) {
      $scope.ShowToast(!error ? 'Ha ocurrido un error, intentelo mas tarde.' : error.message, 'danger');
      $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';
    };

    const getDetails = function () {
      return EmpresasFactory.getDetailsUF()
        .then(function (result) {
          $scope.DetailsUf = result.data.data[0];
        })
        .catch(function (result) {
          error(result.data);
          $location.path('/Productos');
        });
    };

    $scope.validateUSD = function () {
      const orderDetails = $scope.PedidoDetalles;
      if (!orderDetails) return false;
      if (hasProtectedExchangeRate(orderDetails)) return false;
      // if (containsOnDemandProduct(orderDetails)) {
      //   setPaymentMethod(CS_CREDIT);
      //  return false;
      // }
      return true;
    };

    const hasProtectedExchangeRate = function (orderDetails) {
      return orderDetails.some(function (detail) {
        return detail.TipoCambioProtegido > 0;
      });
    };

    $scope.validarCarrito = function (val) {
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

    const getOrderDetails = function (validate) {
      return PedidoDetallesFactory.getPedidoDetallesUf()
        .then(function (result) {
          if (result.data.success) {
            $scope.PedidoDetallesUf = result.data.data;
            $scope.PedidoDetallesUf.forEach(function (elem) {
              elem.Productos.forEach(function (item) {
                if (item.PrecioUnitario == null) $scope.error = true;
                delete item.PrecioNormal;
                delete item.PrecioRenovacion;
                delete item.PrecioUnitario;
              });
            });
            if ($scope.error) {
              $scope.ShowToast('Ocurrio un error al procesar sus productos del carrito. Favor de contactar a soporte de CompuSoluciones.', 'danger');
            }
            if (!validate) {
              $scope.ValidarFormaPago();
            }
          } else {
            $scope.ShowToast(result.data.message, 'danger');
            $location.path('/Productos');
          }
        })
        .then($scope.validarCarrito)
        .catch(function (result) { error(result.data); });
    };

    $scope.init = function () {
      $scope.CheckCookie();
      getOrderDetails(true)
      .then(datos => ComprasUFFactory.getComprasUF($scope.currentDistribuidor.IdEmpresa, 0)
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
        })
      )
      .then(merge => prepararObjeto(merge));
      getDetails().catch(function (result) { error(result.data); });

      // $scope.PedidoDetalleUf = Object.assign({}, $scope.PedidoDetalles, $scope.PedidoDetallesUf);
      // console.log('prueba' + JSON.stringify($scope.PedidoDetalles));
    };

    $scope.init();

    const prepararObjeto = function (merge) {
      const detallesUf = {
        data: merge.data.data[0]
      };
      $scope.PedidoDetalleUf = Object.assign({}, $scope.PedidoDetallesUf, detallesUf);
      // console.log('prueba' + JSON.stringify($scope.PedidoDetallesUf));
    };

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

    $scope.ValidarFormaPago = function () {
      var disabled = false;
      if ($scope.PedidoDetalles) {
        $scope.PedidoDetalles.forEach(function (order) {
          // order.Productos.forEach(function (product) {
          //   if (product.IdTipoProducto === 3) {
          //     disabled = true;
          //     $scope.Distribuidor.IdFormaPago = 2;
          //     $scope.Distribuidor.IdFormaPagoPredilecta = 2;
          //   }
          // });
        });
      }
      return disabled;
    };

    $scope.isPayingWithCSCredit = function () {
      return $scope.DetailsUf.IdFormaPagoPredilecta === CS_CREDIT;
    };

    $scope.Siguiente = function () {
      if ($scope.CarritoValido) {
        $location.path('/uf/Comprar');
      } else {
        $scope.ShowToast('Revisa que tengas al menos un producto y que tenga un cliente seleccionado con crédito válido.', 'warning');
      }
    };
  };

  PedidoDetallesUFReadController.$inject = ['$scope', '$log', '$location', '$cookies', 'ComprasUFFactory', 'EmpresasFactory', 'PedidoDetallesFactory', '$routeParams'];

  angular.module('marketplace').controller('PedidoDetallesUFReadController', PedidoDetallesUFReadController);
}());
