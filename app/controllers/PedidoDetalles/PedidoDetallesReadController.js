(function () {
  var PedidoDetallesReadController = function ($scope, $log, $location, $cookieStore, PedidoDetallesFactory, TipoCambioFactory, EmpresasXEmpresasFactory, EmpresasFactory, PedidosFactory, $routeParams) {
    $scope.CreditoValido = 1;
    $scope.Distribuidor = {};

    const error = function (error) {
      $scope.ShowToast(!error ? 'Ha ocurrido un error, intentelo mas tarde.' : error.message, 'danger');
      $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';
    };

    const getEnterprises = function () {
      return EmpresasFactory.getEmpresas()
        .then(function (result) {
          $scope.Distribuidor = result.data[0];
        })
        .catch(function (result) {
          error(result.data);
          $location.path('/Productos');
        });
    };

    const getOrderDetails = function (validate) {
      return PedidoDetallesFactory.getPedidoDetalles()
        .then(function (result) {
          if (result.data.success) {
            $scope.PedidoDetalles = result.data.data;
            if (!validate) $scope.ValidarFormaPago();
          } else {
            $scope.ShowToast(result.data.message, 'danger');
            $location.path('/Productos');
          }
        })
        .then(validarCarrito)
        .catch(function (result) { error(result.data); });
    };

    const validarCarrito = function () {
      return PedidoDetallesFactory.getValidarCarrito()
        .then(function (result) {
          if (result.data.success) {
            $scope.PedidoDetalles.forEach(function (item) {
              if ($scope.Distribuidor.IdFormaPagoPredilecta === 1 && item.MonedaPago !== 'Pesos') {
                $scope.ShowToast('Para pagar con tarjeta bancaria es necesario que los pedidos estén en pesos MXN. Actualiza tu forma de pago o cambia de moneda en los pedidos agregándolos una vez más.', 'danger');
              }
              $scope.CreditoValido = 1;
              item.hasCredit = 1;
              result.data.data.forEach(function (user) {
                if (item.IdEmpresaUsuarioFinal === user.IdEmpresaUsuarioFinal && !user.hasCredit) {
                  $scope.CreditoValido = 0;
                  item.hasCredit = 0;
                }
              });
            });
          } else {
            $scope.ShowToast('No pudimos validar tu carrito de compras, por favor intenta de nuevo.', 'danger');
            $location.path('/Productos');
          }
        })
        .catch(function (result) {
          error(result.data);
          $location.path('/Productos');
        });
    };

    $scope.init = function () {
      $scope.CheckCookie();
      PedidoDetallesFactory.getPrepararCompra(0)
        .then(getEnterprises)
        .then(getOrderDetails)
        .catch(function (result) { error(result.data); });
    };

    $scope.init();

    $scope.QuitarProducto = function (PedidoDetalle) {
      $scope.PedidoDetalles.forEach(function (order, indexOrder) {
        order.Productos.forEach(function (product, indexProduct) {
          if (product.IdPedidoDetalle === PedidoDetalle.IdPedidoDetalle) {
            $scope.PedidoDetalles[indexOrder].Productos.splice(indexProduct, 1);
            validarCarrito();
          }
          if ($scope.PedidoDetalles[indexOrder].Productos.length === 0) $scope.PedidoDetalles.splice(indexOrder, 1);
        });
      });

      PedidoDetallesFactory.deletePedidoDetalles(PedidoDetalle.IdPedidoDetalle)
        .success(function (PedidoDetalleResult) {
          if (!PedidoDetalleResult.success) {
            $scope.ShowToast(PedidoDetalleResult.message, 'danger');
            getOrderDetails(true);
          } else {
            $scope.ActualizarMenu();
            validarCarrito();
            $scope.ShowToast(PedidoDetalleResult.message, 'success');
          }
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos quitar el producto seleccionado. Intenta de nuevo más tarde.', 'danger');
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.ActualizarCodigo = function (value) {
      const order = {
        CodigoPromocion: value.CodigoPromocion,
        IdPedido: value.IdPedido
      };
      PedidosFactory.putCodigoPromocion(order)
        .then(function (result) {
          $scope.init();
          $scope.ShowToast(result.data.message, 'success');
        })
        .catch(function (result) { error(result.data); });
    };

    $scope.ValidarFormaPago = function () {
      var disabled = false;
      if ($scope.PedidoDetalles) {
        $scope.PedidoDetalles.forEach(function (order) {
          order.Productos.forEach(function (product) {
            if (product.IdTipoProducto === 3) {
              disabled = true;
              $scope.Distribuidor.IdFormaPago = 2;
            }
          });
        });
      }
      return disabled;
    };

    $scope.ActualizarFormaPago = function (IdFormaPago) {
      var empresa = { IdFormaPagoPredilecta: IdFormaPago };
      EmpresasFactory.putEmpresaFormaPago(empresa)
        .then(function (result) {
          if (result.data.success) {
            $scope.ShowToast(result.data.message, 'success');
            getOrderDetails();
          } else $scope.ShowToast(result.data.message, 'danger');
        })
        .catch(function (result) { error(result.data); });
    };

    $scope.modificarContratoBase = function (IdProducto, IdPedidoDetalle) {
      $location.path('/autodesk/productos/' + IdProducto + '/detalle/' + IdPedidoDetalle);
    };

    $scope.calcularSubTotal = function (IdPedido) {
      let total = 0;
      $scope.PedidoDetalles.forEach(function (order) {
        order.Productos.forEach(function (product) {
          if (order.IdPedido === IdPedido && product.PrimeraCompraMicrosoft === 0) {
            total = total + (product.PrecioUnitario * product.Cantidad);
          }
        });
      });
      return total;
    };

    $scope.calcularIVA = function (IdPedido) {
      let total = $scope.calcularSubTotal(IdPedido);
      if ($scope.Distribuidor.ZonaImpuesto === 'Normal') total = 0.16 * total;
      if ($scope.Distribuidor.ZonaImpuesto === 'Nacional') total = 0.16 * total;
      if ($scope.Distribuidor.ZonaImpuesto === 'Frontera') total = 0.11 * total;
      return total;
    };

    $scope.calcularTotal = function (IdPedido) {
      let total = $scope.calcularSubTotal(IdPedido);
      let iva = 0;
      if ($scope.Distribuidor.ZonaImpuesto === 'Normal') iva = 0.16 * total;
      if ($scope.Distribuidor.ZonaImpuesto === 'Nacional') iva = 0.16 * total;
      if ($scope.Distribuidor.ZonaImpuesto === 'Frontera') iva = 0.11 * total;
      total = total + iva;
      return total;
    };

    $scope.next = function () {
      validarCarrito();
      let next = true;
      if (!$scope.PedidoDetalles || $scope.PedidoDetalles.length === 0) next = false;
      else {
        $scope.PedidoDetalles.forEach(function (order) {
          if (!order.IdEmpresaUsuarioFinal) next = false;
          order.Productos.forEach(function (product) {
            if (product.Cantidad <= 0) next = false;
          });
        });
      }
      if (!next) {
        $scope.ShowToast('Revisa que tengas al menos un producto y que tenga un cliente seleccionado con crédito válido.', 'warning');
      } else $location.path('/Comprar');
    };

    $scope.IniciarTourCarrito = function () {
      $scope.Tour = new Tour({

        steps: [{
          element: '.formaPago',
          placement: 'rigth',
          title: 'Forma de pago del distribuidor',
          content: 'Selecciona la forma de pago predilecta para tu empresa, esta es una configuración única para toda la compañia. Si seleccionas pago con tarjeta bancaria tendrás que tener tus pedidos en pesos MXN, si requieres pagar en dolares USD podrás utilizar crédito CompuSoluciones.',
          template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Atrás</button><button class='btn btn-default' data-role='next'>Sig »</button><button class='btn btn-default' data-role='end'>Finalizar</button></nav></div></div>"
        }],

        backdrop: true,
        storage: false
      });

      $scope.Tour.init();
      $scope.Tour.start();
    };
  };

  PedidoDetallesReadController.$inject = ['$scope', '$log', '$location', '$cookieStore', 'PedidoDetallesFactory', 'TipoCambioFactory', 'EmpresasXEmpresasFactory', 'EmpresasFactory', 'PedidosFactory', '$routeParams'];

  angular.module('marketplace').controller('PedidoDetallesReadController', PedidoDetallesReadController);
}());
