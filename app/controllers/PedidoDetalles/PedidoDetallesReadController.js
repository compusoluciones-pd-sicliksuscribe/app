(function () {
  var PedidoDetallesReadController = function ($scope, $log, $location, $cookies, PedidoDetallesFactory, TipoCambioFactory, EmpresasXEmpresasFactory, EmpresasFactory, PedidosFactory , DescuentosFactory , $routeParams) {
    $scope.CreditoValido = 1;
    $scope.error = false;
    $scope.Distribuidor = {};
    const ON_DEMAND = 3;
    const ELECTRONIC_SERVICE = 74;
    const paymentMethods = {
      CREDIT_CARD: 1,
      CS_CREDIT: 2,
      PAYPAL: 3,
      PREPAY: 4
    };
    const makers = {
      MICROSOFT: 1,
      AUTODESK: 2,
      COMPUSOLUCIONES: 3,
      HP: 4,
      APERIO: 5,
      COMPUCAMPO: 8
    };

    const error = function (error) {
      $scope.ShowToast(!error ? 'Ha ocurrido un error, intentelo mas tarde.' : error.message, 'danger');
      $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';
    };

    const getEnterprises = function () {
      return EmpresasFactory.getEmpresas()
        .then(function (result) {
          $scope.Distribuidor = result.data[0];
          $scope.Distribuidor.MonedaPago = 'Pesos';
        })
        .catch(function (result) {
          error(result.data);
          $location.path('/Productos');
        });
    };

    const getPaymentMethods = function (id) {
      let paymentMethod = '';
      switch (id) {
        case paymentMethods.CREDIT_CARD:
          paymentMethod = 'Tarjeta';
          break;
        case paymentMethods.CS_CREDIT:
          paymentMethod = 'Crédito';
          break;
        case paymentMethods.PAYPAL:
          paymentMethod = 'Paypal';
          break;
        case paymentMethods.PREPAY:
          paymentMethod = 'Transferencia';
          break;
        default:
          paymentMethod = 'Metodo de pago incorrecto.';
      }
      return paymentMethod;
    };

    const getMakers = function (id) {
      let maker = '';
      switch (id) {
        case makers.MICROSOFT:
          maker = 'Microsoft';
          break;
        case makers.AUTODESK:
          maker = 'Autodesk';
          break;
        case makers.COMPUSOLUCIONES:
          maker = 'Compusoluciones';
          break;
        case makers.APERIO:
          maker = 'Aperio';
          break;
        case makers.HP:
          maker = 'HP';
          break;
        case makers.COMPUCAMPO:
          maker = 'Compucampo';
          break;
        default:
          maker = null;
      }
      return maker;
    };

    const getOrderDetails = function (validate) {
      return PedidoDetallesFactory.getPedidoDetalles()
        .then(function (result) {
          $scope.PedidoDetalles = result.data.data;
          $scope.PedidoDetalles.forEach(function (elem) {
            $scope.CreditoValido = 1;
            elem.hasCredit = 1;
            elem.Forma = getPaymentMethods(elem.IdFormaPago);
            elem.NombreFabricante = getMakers(elem.IdFabricante);
            elem.Productos.forEach(function (item) {
              if (item.PrecioUnitario == null) $scope.error = true;
            });
          });
          if ($scope.error) {
            $scope.ShowToast('Ocurrio un error al procesar sus productos del carrito. Favor de contactar a soporte de CompuSoluciones.', 'danger');
          }
          if (!validate) {
            $scope.ValidarFormaPago();
          }
        })
        .then(function () {
          if ($scope.isPayingWithCSCredit()) validarCarrito();
        })
        .catch(function (result) {
          error(result.data);
          $location.path('/Productos');
        });
    };

    const validarCarrito = function () {
      if ($scope.Distribuidor.IdFormaPagoPredilecta === 2) {
        return PedidoDetallesFactory.getValidarCarrito()
        .then(function (result) {
          $scope.PedidoDetalles.forEach(function (item) {
            result.data.data.forEach(function (user) {
              if (item.IdEmpresaUsuarioFinal === user.IdEmpresaUsuarioFinal && !user.hasCredit) {
                $scope.CreditoValido = 0;
                item.hasCredit = 0;
              }
            });
            if ($scope.Distribuidor.IdFormaPagoPredilecta === 1 || $scope.Distribuidor.IdFormaPagoPredilecta === 4 && item.MonedaPago !== 'Pesos') {
              $scope.ShowToast('Para pagar con tarjeta bancaria o con Transferencia, es necesario que los pedidos estén en pesos MXN. Actualiza tu forma de pago o cambia de moneda en los pedidos agregándolos una vez más.', 'danger');
            }
          });
        })
        .catch(function (result) {
          error(result.data);
          $location.path('/Productos');
        });
      }
    };
    const getAnualdiscount = function () {
      return DescuentosFactory.getDescuentoAnual()
        .then(function (result) {
          console.log(result);
          $scope.descuentoAnual = result.data.data;
          if ($scope.error) {
            $scope.ShowToast('Ocurrio un error al procesar sus productos del carrito. Favor de contactar a soporte de CompuSoluciones.', 'danger');
          }
        });
    };

    var ActualizarFormaPago = function (IdFormaPago) {
      var empresa = { IdFormaPagoPredilecta: IdFormaPago || $scope.Distribuidor.IdFormaPagoPredilecta };
      EmpresasFactory.putEmpresaFormaPago(empresa)
        .then(function (result) {
          if (result.data.success) {
            $scope.ShowToast(result.data.message, 'success');
            CambiarMoneda();
            getOrderDetails(true);
          } else $scope.ShowToast(result.data.message, 'danger');
        })
        .catch(function (result) { error(result.data); });
    };
    var CambiarMoneda = function (tipoMoneda) {
      $scope.Distribuidor.MonedaPago = tipoMoneda || 'Pesos';
      const MonedaPago = $scope.Distribuidor.MonedaPago;
      EmpresasFactory.putEmpresaCambiaMoneda({ MonedaPago })
      .then(function (result) {
        if (result.data.success) {
          $scope.ShowToast(result.data.message, 'success');
          getOrderDetails(true);
        } else $scope.ShowToast(result.data.message, 'danger');
      })
      .catch(function (result) { error(result.data); });
    };

    $scope.init = function () {
      $scope.CheckCookie();
      PedidoDetallesFactory.getPrepararCompra(0)
        .catch(function (result) { error(result.data); });
      getEnterprises()
        .then(getOrderDetails)
        .then(ActualizarFormaPago)
        .catch(function (result) { error(result.data); });
        
        
      DescuentosFactory.getDescuentoAnual()
      .success(function (result) {
      $scope.descuentoAnual = result.data;
          console.log(result);
          console.log( $scope.descuentoAnual);
          console.log(result);
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });

      getAnualdiscount()
      .catch(function (result) { error(result.data); });
    };

    $scope.init();

    $scope.QuitarProducto = function (PedidoDetalle) {
      $scope.PedidoDetalles.forEach(function (order, indexOrder) {
        order.Productos.forEach(function (product, indexProduct) {
          if (product.IdPedidoDetalle === PedidoDetalle.IdPedidoDetalle) {
            $scope.PedidoDetalles[indexOrder].Productos.splice(indexProduct, 1);
          }
          if ($scope.PedidoDetalles[indexOrder].Productos.length === 0) $scope.PedidoDetalles.splice(indexOrder, 1);
        });
      });
      return PedidoDetallesFactory.deletePedidoDetalles(PedidoDetalle.IdPedidoDetalle)
        .success(function (PedidoDetalleResult) {
          if (!PedidoDetalleResult.success) {
            $scope.ShowToast(PedidoDetalleResult.message, 'danger');
          } else {
            $scope.ActualizarMenu();
            $scope.ShowToast(PedidoDetalleResult.message, 'success');
          }
          return getOrderDetails(true);
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
          order.Productos.forEach(function (product) {
            if (product.IdTipoProducto === 3) {
              disabled = true;
              $scope.Distribuidor.IdFormaPago = 2;
              $scope.Distribuidor.IdFormaPago = 3;
              $scope.Distribuidor.IdFormaPagoPredilecta = 2;
              $scope.Distribuidor.IdFormaPagoPredilecta = 3;
            }
          });
        });
      }
      return disabled;
    };

    const hasProtectedExchangeRate = function (orderDetails) {
      return orderDetails.some(function (detail) {
        return detail.TipoCambioProtegido > 0;
      });
    };

    const isOnDemandProduct = function (product) {
      return product.IdTipoProducto === ON_DEMAND;
    };

    const detailHasOnDemandProduct = function (orderDetail) {
      const products = orderDetail.Productos;
      return products.some(isOnDemandProduct);
    };

    const containsOnDemandProduct = function (orderDetails) {
      return orderDetails.reduce(function (accumulator, currentDetail) {
        const hasOndemandProduct = detailHasOnDemandProduct(currentDetail);
        return accumulator || hasOndemandProduct;
      }, false);
    };

    const setPaymentMethod = function (paymentMethod) {
      $scope.Distribuidor.IdFormaPago = paymentMethod;
      $scope.Distribuidor.IdFormaPagoPredilecta = paymentMethod;
    };

    $scope.validateUSD = function () {
      const orderDetails = $scope.PedidoDetalles;
      if (!orderDetails) return false;
      if (hasProtectedExchangeRate(orderDetails)) return false;
      if (containsOnDemandProduct(orderDetails)) {
        setPaymentMethod(paymentMethods.CS_CREDIT);
        return false;
      }
      return true;
    };

    $scope.isPayingWithPaypal = function () {
      return Number($scope.Distribuidor.IdFormaPagoPredilecta) === paymentMethods.PAYPAL;
    };

    $scope.isPayingWithCSCredit = function () {
      const IdFormaPago = Number($scope.Distribuidor.IdFormaPagoPredilecta);
      return IdFormaPago === paymentMethods.CS_CREDIT;
    };

    $scope.isPayingWithCreditCard = function () {
      const IdFormaPago = Number($scope.Distribuidor.IdFormaPagoPredilecta);
      return IdFormaPago === paymentMethods.CREDIT_CARD;
    };

    $scope.isPayWithPrepaid = function () {
      const IdFormaPago = Number($scope.Distribuidor.IdFormaPagoPredilecta);
      return IdFormaPago === paymentMethods.PREPAY;
    };

    $scope.hasProtectedExchangeRate = function () {
      const orderDetails = $scope.PedidoDetalles;
      if (orderDetails) return hasProtectedExchangeRate(orderDetails);
    };

    $scope.ActualizarFormaPago = ActualizarFormaPago;
    $scope.CambiarMoneda = CambiarMoneda;

    $scope.modificarContratoBase = function (IdProducto, IdPedidoDetalle) {
      $location.path('/autodesk/productos/' + IdProducto + '/detalle/' + IdPedidoDetalle);
    };

    $scope.removeRenew = function (pedido) {
      const params = {
        IdPedido: pedido.IdPedido,
        IdEmpresaUsuarioFinal: pedido.IdEmpresaUsuarioFinal
      };
      PedidoDetallesFactory.removeRenew(params)
        .then(function (result) {
          $scope.PedidoDetalles.forEach(function (order, indexOrder) {
            if (pedido.IdPedido === order.IdPedido) {
              $scope.PedidoDetalles.splice(indexOrder, 1);
              if ($scope.isPayingWithCSCredit()) validarCarrito();
            }
          });
          $scope.ActualizarMenu();
          // validarCarrito();
          $scope.ShowToast(result.data.message, 'success');
        })
        .catch(function (result) {
          $scope.ShowToast(result.data.message, 'danger');
        });
    };

    const isTiredProduct = function (product) {
      return product.tieredPrice > 0;
    };

    $scope.calcularSubTotal = function (IdPedido) {
      let total = 0;
      $scope.PedidoDetalles.forEach(function (order) {
        order.Productos.forEach(function (product) {
          if (order.IdPedido === IdPedido && !product.PrimeraCompraMicrosoft) {
            const productPrice = $scope.calculatePriceWithExchangeRate(order, product, 'PrecioUnitario');
            if (isTiredProduct(product)) {
              total = total + productPrice;
            } else {
              total = total + (productPrice * product.Cantidad);
            }

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

    $scope.calculatePriceWithExchangeRate = function (order, details, value) {
      let total = 0;
      if (order.MonedaPago === 'Pesos' && details.MonedaPrecio === 'Dólares') {
        total = details[value] * order.TipoCambio;
      } else if (order.MonedaPago === 'Dólares' && details.MonedaPrecio === 'Pesos' && details.IdProducto !== ELECTRONIC_SERVICE) {
        total = details[value] / order.TipoCambio;
      } else {
        total = details[value];
      }
      if (order.IdEsquemaRenovacion === 2 && value === 'PrecioRenovacion') {
        total *= 12;
      }
      return total;
    };

    $scope.calcularProductTotal = function (order, product, value) {
      const priceWithExchangeRate = $scope.calculatePriceWithExchangeRate(order, product, value);
      if (isTiredProduct(product)) return priceWithExchangeRate;
      return priceWithExchangeRate * product.Cantidad;
    };

    $scope.next = function () {
      if ($scope.isPayingWithCSCredit()) validarCarrito();
      let next = true;
      if (!$scope.PedidoDetalles || $scope.PedidoDetalles.length === 0) next = false;
      else {
        $scope.PedidoDetalles.forEach(function (order) {
          PedidoDetallesFactory.idOrderComparePaymentCurrency(order)
          .then(function (result) {
            result.data.data.forEach(function (compararPedidosAnteriores) {
              if (order.MonedaPago === compararPedidosAnteriores.MonedaPago) {
              } else {
                $cookies.putObject('compararPedidosAnteriores', compararPedidosAnteriores);
                document.getElementById('modalTipoMoneda').style.display = 'block';
              }
            });
          })
          .catch(function (result) {
            $scope.ShowToast(result.data.message, 'danger');
          });
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

  PedidoDetallesReadController.$inject = ['$scope', '$log', '$location', '$cookies', 'PedidoDetallesFactory', 'TipoCambioFactory', 'EmpresasXEmpresasFactory', 'EmpresasFactory', 'PedidosFactory', '$routeParams'];

  angular.module('marketplace').controller('PedidoDetallesReadController', PedidoDetallesReadController);
}());
