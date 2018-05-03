(function () {
  var ComprarUFController = function ($scope, $log, $rootScope, $location, $cookies, PedidoDetallesFactory, TipoCambioFactory, PedidosFactory, EmpresasFactory, $route) {
    $scope.currentPath = $location.path();
    $scope.PedidoDetalles = {};
    $scope.Distribuidor = {};
    $scope.error = false;
    $scope.currentDistribuidor = $cookies.getObject('currentDistribuidor');

    const error = function (message) {
      $scope.ShowToast(!message ? 'Ha ocurrido un error, intentelo mas tarde.' : message, 'danger');
      $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';
    };

    const getOrderDetails = function () {
      return PedidoDetallesFactory.getPedidoDetallesUf($scope.currentDistribuidor.IdEmpresa)
        .then(function (result) {
          if (result.data.success) $scope.PedidoDetalles = result.data.data;
          // console.log(' result.data.data' + JSON.stringify(result.data.data));
          $scope.PedidoDetalles.forEach(function (elem) {
            elem.Productos.forEach(function (item) {
              if (item.PrecioUnitario == null) $scope.error = true;
            });
          });
          if ($scope.error) $location.path('uf/Productos');
        })
        .catch(function (result) {
          $location.path('uf/Carrito/e');
          error('No pudimos cargar tu información, por favor intenta de nuevo más tarde.');
        });
    };

    const getEnterprises = function () {
      return EmpresasFactory.getEmpresas()
        .then(function (result) {
          // console.log(' result.data.data' + JSON.stringify(result.data[0]));
          $scope.Distribuidor = result.data[0];
        })
        .catch(function (result) {
          error('No pudimos cargar los datos de tu empresa, por favor intenta de nuevo más tarde');
          $location.path('uf/Carrito/e');
        });
    };

    const comprarProductos = function () {
      PedidoDetallesFactory.getComprarFinalUser($scope.currentDistribuidor.IdEmpresa)
        .then(function (response) {
          if (response.data.success) {
            $scope.ShowToast(response.data.message, 'success');
            $scope.ActualizarMenu();
            $location.path('uf/Productos');
          } else {
            $location.path('uf/Carrito');
            $scope.ShowToast(response.data.message, 'danger');
          }
        });
    };

    $scope.prepararPedidos = function () {
      PedidoDetallesFactory.getPrepararCompraFinalUser(1, $scope.currentDistribuidor.IdEmpresa)
        .then(function (result) {
          if (result.data.success) $scope.ShowToast(result.data.message, 'success');
          else {
            $scope.ShowToast(result.data.message, 'danger');
            $location.path('uf/Carrito');
          }
        })
        .then(getOrderDetails)
        .then(getEnterprises)
        .catch(function (result) { error(result.data.message); });
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
      if ($scope.currentPath === '/uf/Comprar') {
        $scope.CheckCookie();
        confirmarPaypal();
        $scope.prepararPedidos();
      }
      // console.log('$scope.currentDistribuidor' + JSON.stringify($scope.currentDistribuidor.IdEmpresa));
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
          if (order.IdPedido === IdPedido) {
            if (order.MonedaPago === 'Pesos' && product.MonedaPrecioUF === 'Dólares') {
              total = total + (product.PrecioNormalUF * product.Cantidad) * order.TipoCambio;
            } else if (order.MonedaPago === 'Dólares' && product.MonedaPrecioUF === 'Pesos') {
              total = total + (product.PrecioNormalUF * product.Cantidad) / order.TipoCambio;
            } else {
              total = total + (product.PrecioNormalUF * product.Cantidad);
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

    $scope.precioReal = function (precio, monedaPrecio, monedaPago, tipoCambio) {
      let precioUnitario = 0;
      if (monedaPrecio === monedaPago) {
        precioUnitario = precio;
      } else if (monedaPrecio === 'Dólares' && monedaPago === 'Pesos') {
        precioUnitario = precio * tipoCambio;
      } else if (monedaPrecio === 'Pesos' && monedaPago === 'Dólares') {
        precioUnitario = precio / tipoCambio;
      }
      return precioUnitario;
    };

    $scope.back = function () {
      $location.path('uf/Carrito');
    };

    $scope.PagarTarjeta = function () {
      PedidoDetallesFactory.getPrepararTarjetaCreditoFinalUser($scope.currentDistribuidor.IdEmpresa)
        .success(function (Datos) {
          var expireDate = new Date();
          expireDate.setTime(expireDate.getTime() + 600 * 2000);
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
              $scope.ShowToast('Algo salio mal con el pago con tarjeta bancaria, favor de intentarlo una vez más.', 'danger');
            }
          } else {
            $scope.pedidosAgrupados = Datos.data['0'].pedidosAgrupados;
            $scope.ComprarConTarjetaTuClick('Grátis', 'Grátis');
          }
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('Error al obtener el tipo de cambio API Intelisis.', 'danger');
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    const getActualSubdomain = function () {
      let subdomain = window.location.href;
      subdomain = subdomain.replace('/#/uf/Comprar', '');
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
      PedidoDetallesFactory.prepararPaypalFinalUser({ orderIds, url: 'uf/Comprar', actualSubdomain })
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
      if (Number($scope.currentDistribuidor.IdEmpresa) === Number($scope.Distribuidor.IdEmpresa)) {
        $scope.ShowToast('No puedes comprarte productos a ti mismo.', 'danger');
      } else {
        if ($scope.Distribuidor.IdFormaPagoPredilecta === 1) $scope.PagarTarjeta();
        if ($scope.Distribuidor.IdFormaPagoPredilecta === 2) comprarProductos();
        if ($scope.Distribuidor.IdFormaPagoPredilecta === 3) $scope.prepararPaypal();
      }
    };

    $scope.ComprarConTarjetaTuClick = function (resultIndicator, sessionVersion) {
      var datosTarjeta = { 'TarjetaResultIndicator': resultIndicator, 'TarjetaSessionVersion': sessionVersion, 'PedidosAgrupados': $cookies.getObject('pedidosAgrupados') };
      if (datosTarjeta.PedidosAgrupados) {
        if (datosTarjeta.PedidosAgrupados[0].Renovacion) {
          PedidosFactory.patchPaymentInformation(datosTarjeta)
            .success(function (compra) {
              $cookies.remove('pedidosAgrupados');
              if (compra.success === 1) {
                $scope.ShowToast(compra.message, 'success');
                $location.path('/MonitorPagos/uf/refrescar');
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
                PedidoDetallesFactory.getComprarFinalUser($scope.currentDistribuidor.IdEmpresa)
                  .success(function (compra) {
                    if (compra.success === 1) {
                      $scope.ShowToast(compra.message, 'success');
                      $scope.ActualizarMenu();
                      $location.path('/');
                    } else {
                      $location.path('uf/Carrito');
                      $scope.ShowToast(compra.message, 'danger');
                    }
                  })
                  .error(function (data, status, headers, config) {
                    $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
                  });
              } else {
                $scope.ShowToast('Algo salió mal con tu pedido, por favor ponte en contacto con tu equipo de soporte CompuSoluciones para más información.', 'danger');
                $scope.ActualizarMenu();
                $location.path('uf/Carrito');
              }
            })
            .error(function (data, status, headers, config) {
              $cookies.remove('pedidosAgrupados');
              $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
            });
        }
      } else {
        $scope.ShowToast('Algo salió mal con tu pedido, por favor ponte en contacto con tu equipo de soporte CompuSoluciones para más información.', 'danger');
        $location.path('uf/Carrito');
      }
    };
  };

  ComprarUFController.$inject = ['$scope', '$log', '$rootScope', '$location', '$cookies', 'PedidoDetallesFactory', 'TipoCambioFactory', 'PedidosFactory', 'EmpresasFactory', '$route'];

  angular.module('marketplace').controller('ComprarUFController', ComprarUFController);
}());
