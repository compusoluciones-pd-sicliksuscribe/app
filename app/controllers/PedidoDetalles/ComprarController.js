(function () {
  var ComprarController = function ($scope, $log, $rootScope, $location, $cookies, PedidoDetallesFactory, TipoCambioFactory, PedidosFactory, EmpresasFactory, $route) {
    $scope.currentPath = $location.path();
    $scope.PedidoDetalles = {};
    $scope.Distribuidor = {};
    const ELECTRONIC_SERVICE = 74;
    $scope.error = false;
    const paymentMethods = {
      CREDIT_CARD: 1,
      CS_CREDIT: 2,
      PAYPAL: 3,
      CASH: 4
    };
    const makers = {
      MICROSOFT: 1,
      AUTODESK: 2,
      COMPUSOLUCIONES: 3,
      HP: 4,
      APERIO: 5
    };

    const error = function (message) {
      $scope.ShowToast(!message ? 'Ha ocurrido un error, intentelo mas tarde.' : message, 'danger');
      $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';
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
        case paymentMethods.CASH:
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
        default:
          maker = null;
      }
      return maker;
    };

    const getOrderDetails = function () {
      return PedidoDetallesFactory.getPedidoDetalles()
        .then(function (result) {
          if (result.data.success) $scope.PedidoDetalles = result.data.data;
          $scope.PedidoDetalles.forEach(function (elem) {
            elem.Forma = getPaymentMethods(elem.IdFormaPago);
            elem.NombreFabricante = getMakers(elem.IdFabricante);
            elem.Productos.forEach(function (item) {
              if (item.PrecioUnitario == null) $scope.error = true;
            });
          });
          if ($scope.error) $location.path('/Productos');
        })
        .catch(function (result) {
          $location.path('/Carrito/e');
          error('No pudimos cargar tu información, por favor intenta de nuevo más tarde.');
        });
    };

    const getEnterprises = function () {
      return EmpresasFactory.getEmpresas()
        .then(function (result) {
          $scope.Distribuidor = result.data[0];
        })
        .catch(function (result) {
          error('No pudimos cargar los datos de tu empresa, por favor intenta de nuevo más tarde');
          $location.path('/Carrito/e');
        });
    };

    const comprarProductos = function () {
      PedidoDetallesFactory.getComprar()
        .then(function (orderIdsCookie) {
          console.log('respuesta', orderIdsCookie);
          if (orderIdsCookie) {
            // $scope.ShowToast(orderIdsCookie.data.message, 'success');
            $scope.ActualizarMenu();
            $cookies.putObject('orderIdsCookie', orderIdsCookie, { secure: $rootScope.secureCookie });
            $location.path('/SuccessOrder');
          } else {
            $location.path('/Carrito');
            // $scope.ShowToast(orderIdsCookie.data.message, 'danger');
          }
        });
    };

    const comprarPrePago = function () {
      PedidoDetallesFactory.getComprar()
        .then(function (response) {
          if (response.data.success) {
            $scope.ShowToast(response.data.message, 'success');
            $scope.ActualizarMenu();
            $location.path('/');
          } else {
            $location.path('/Carrito');
            $scope.ShowToast(response.data.message, 'danger');
          }
        });
    };

    $scope.prepararPedidos = function () {
      PedidoDetallesFactory.getPrepararCompra(1)
        .then(function (result) {
          if (result.data.success) $scope.ShowToast(result.data.message, 'success');
        })
        .then(getOrderDetails)
        .then(getEnterprises)
        .catch(function (result) {
          error(result.data.message);
          $location.path('/Carrito/e');
        });
    };

    const confirmarPaypal = function () {
      const paymentId = $location.search().paymentId;
      const token = $location.search().token;
      const PayerID = $location.search().PayerID;
      const orderIds = $cookies.getObject('orderIds');
      $cookies.remove('orderIds');
      $location.url($location.path());
      if (paymentId && token && PayerID && orderIds) {
        PedidoDetallesFactory.confirmarPaypal({ paymentId, PayerID, orderIds })
          .then(function (response) {
            if (response.data.state === 'approved') {
              const PedidosAgrupados = orderIds.map(function (id) { return ({ id }); });
              const datosPaypal = { TarjetaResultIndicator: paymentId, TarjetaSessionVersion: PayerID, PedidosAgrupados };
              PedidosFactory.putPedido(datosPaypal)
                .then(comprarProductos);
            }
            if (response.data.state === 'failed') $scope.ShowToast('Ocurrio un error al intentar confirmar la compra con Paypal. Intentalo mas tarde.', 'danger');
          })
          .catch(function (response) {
            $scope.ShowToast('Ocurrio un error de tipo: "' + response.data.message + '". Contacte con soporte de Compusoluciones.', 'danger');
          });
      }
    };

    $scope.init = function () {
      if ($scope.currentPath === '/Comprar') {
        $scope.CheckCookie();
        confirmarPaypal();
        $scope.prepararPedidos();
      }
    };

    $scope.init();

    $scope.ActualizarFormaPago = function (IdFormaPago) {
      var empresa = { IdFormaPagoPredilecta: IdFormaPago };
      EmpresasFactory.putEmpresaFormaPago(empresa)
        .then(function (result) {
          if (result.data.success) {
            $scope.ShowToast(result.data.message, 'success');
            $scope.init();
          } else $scope.ShowToast(result.data.message, 'danger');
        })
        .catch(function (result) { error(result.data); });
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
      return total;
    };

    const isTiredProduct = function (product) {
      return product.tieredPrice > 0;
    };

    $scope.calcularProductTotal = function (order, product, value) {
      const priceWithExchangeRate = $scope.calculatePriceWithExchangeRate(order, product, value);
      if (isTiredProduct(product)) return priceWithExchangeRate;
      return priceWithExchangeRate * product.Cantidad;
    };

    $scope.back = function () {
      $location.path('/Carrito');
    };

    $scope.PagarTarjeta = function () {
      if ($scope.Distribuidor.IdFormaPagoPredilecta === 1) {
        PedidoDetallesFactory.getPrepararTarjetaCredito()
          .success(function (Datos) {
            var expireDate = new Date();
            expireDate.setTime(expireDate.getTime() + 600 * 2000); /* 20 minutos */
            $cookies.putObject('pedidosAgrupados', Datos.data['0'].pedidosAgrupados, { 'expires': expireDate, secure: $rootScope.secureCookie });
            if (Datos.data['0'].total > 0) {
              if (Datos.success) {
                if ($cookies.getObject('pedidosAgrupados')) {
                  Checkout.configure({
                    merchant: Datos.data['0'].merchant,
                    session: { id: Datos.data['0'].session_id },
                    order:
                    {
                      amount: Datos.data['0'].total,
                      currency: Datos.data['0'].moneda,
                      description: 'Pago tarjeta bancaria',
                      id: Datos.data['0'].pedidos
                    },
                    interaction:
                    {
                      merchant:
                      {
                        name: 'CompuSoluciones',
                        address:
                        {
                          line1: 'CompuSoluciones y Asociados, S.A. de C.V.',
                          line2: 'Av. Mariano Oterno No. 1105',
                          line3: 'Col. Rinconada del Bosque C.P. 44530',
                          line4: 'Guadalajara, Jalisco. México'
                        },

                        email: 'order@yourMerchantEmailAddress.com',
                        phone: '+1 123 456 789 012'
                      },
                      displayControl: { billingAddress: 'HIDE', orderSummary: 'SHOW' },
                      locale: 'es_MX',
                      theme: 'default'
                    }
                  });
                  Checkout.showLightbox();
                } else {
                  $scope.ShowToast('No pudimos comenzar con tu proceso de pago, favor de intentarlo una vez más.', 'danger');
                }
              } else {
                $scope.ShowToast('No pudimos comenzar con tu proceso de pago, favor de intentarlo una vez más.', 'danger');
              }
            } else {
              $scope.ShowToast('Algo salio mal con el pago con tarjeta bancaria, favor de intentarlo una vez más.', 'danger');
            }
          })
          .error(function (data, status, headers, config) {
            const error = !data.message ? 'Ocurrio un error al procesar la solicitud. Intentalo de nuevo.' : data.message;
            $scope.ShowToast(error, 'danger');
          });
      }
    };

    const getActualSubdomain = function () {
      let subdomain = window.location.href;
      subdomain = subdomain.replace('/#/Comprar', '');
      return subdomain;
    };

    $scope.prepararPaypal = function () {
      const orderIds = $scope.PedidoDetalles.map(function (result) {
        return result.IdPedido;
      });
      const actualSubdomain = getActualSubdomain();
      const expireDate = new Date();
      expireDate.setTime(expireDate.getTime() + 600 * 2000);
      $cookies.putObject('orderIds', orderIds, { expires: expireDate, secure: $rootScope.secureCookie });
      PedidoDetallesFactory.prepararPaypal({ orderIds, url: 'Comprar', actualSubdomain })
        .then(function (response) {
          if (response.data.message === 'free') comprarProductos();
          else if (response.data.state === 'created') {
            const paypal = response.data.links.filter(function (item) {
              if (item.method === 'REDIRECT') return item.href;
            })[0];
            location.href = paypal.href;
          } else {
            $scope.ShowToast('Ocurrio un error al procesar el pago.', 'danger');
          }
        })
        .catch(function (response) {
          $scope.ShowToast('Ocurrio un error al procesar el pago. de tipo: ' + response.data.message, 'danger');
        });
    };

    $scope.Comprar = function () {
      if ($scope.Distribuidor.IdFormaPagoPredilecta === paymentMethods.CREDIT_CARD) $scope.PagarTarjeta();
      if ($scope.Distribuidor.IdFormaPagoPredilecta === paymentMethods.CS_CREDIT) comprarProductos();
      if ($scope.Distribuidor.IdFormaPagoPredilecta === paymentMethods.CASH) comprarPrePago();
      if ($scope.Distribuidor.IdFormaPagoPredilecta === paymentMethods.PAYPAL) $scope.prepararPaypal();
    };

    $scope.CreditCardPayment = function (resultIndicator, sessionVersion) {
      $scope.currentDistribuidor = $cookies.getObject('currentDistribuidor');
      if ($scope.currentDistribuidor) {
        angular.element(document.getElementById('divComprarTuClick')).scope().ComprarConTarjetaTuClick(resultIndicator, sessionVersion);
      } else {
        $scope.ComprarConTarjeta(resultIndicator, sessionVersion);
      };
    };

    $scope.ComprarConTarjeta = function (resultIndicator, sessionVersion) {
      var datosTarjeta = { 'TarjetaResultIndicator': resultIndicator, 'TarjetaSessionVersion': sessionVersion, 'PedidosAgrupados': $cookies.getObject('pedidosAgrupados') };
      if (datosTarjeta.PedidosAgrupados) {
        if (datosTarjeta.PedidosAgrupados[0].Renovacion) {
          PedidosFactory.patchPaymentInformation(datosTarjeta)
            .success(function (compra) {
              $cookies.remove('pedidosAgrupados');
              if (compra.success === 1) {
                $scope.ShowToast(compra.message, 'success');
                $location.path('/MonitorPagos/refrescar');
              }
            })
            .error(function (data, status, headers, config) {
              $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
            });
        } else {
          PedidosFactory.putPedido(datosTarjeta)
            .success(function (putPedidoResult) {
              $cookies.remove('pedidosAgrupados');
              if (putPedidoResult.success) {
                PedidoDetallesFactory.getComprar()
                  .success(function (compra) {
                    console.log("click despues de siguiente");
                    if (compra.success === 1) {
                      $scope.ShowToast(compra.message, 'success');
                      $scope.ActualizarMenu();
                      $location.path('/');
                    } else {
                      $location.path('/Carrito');
                      $scope.ShowToast(compra.message, 'danger');
                    }
                  })
                  .error(function (data, status, headers, config) {
                    $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
                  });
              } else {
                $scope.ShowToast('Algo salió mal con tu pedido, por favor ponte en contacto con tu equipo de soporte CompuSoluciones para más información.', 'danger');
                $scope.ActualizarMenu();
                $location.path('/Carrito/e');
              }
            })
            .error(function (data, status, headers, config) {
              $cookies.remove('pedidosAgrupados');
              $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
            });
        }
      } else {
        $scope.ShowToast('Algo salió mal con tu pedido, por favor ponte en contacto con tu equipo de soporte CompuSoluciones para más información.', 'danger');
        $location.path('/Carrito/e');
      }
    };
  };

  ComprarController.$inject = ['$scope', '$log', '$rootScope', '$location', '$cookies', 'PedidoDetallesFactory', 'TipoCambioFactory', 'PedidosFactory', 'EmpresasFactory', '$route'];

  angular.module('marketplace').controller('ComprarController', ComprarController);
}());
