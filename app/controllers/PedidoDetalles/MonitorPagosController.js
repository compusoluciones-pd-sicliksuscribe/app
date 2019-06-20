(function () {
  var MonitorPagos = function ($scope, $log, $rootScope, $cookies, $location, $uibModal, $filter, PedidoDetallesFactory, EmpresasFactory, PedidosFactory) {
    $scope.PedidoSeleccionado = 0;
    $scope.PedidosSeleccionadosParaPagar = [];
    $scope.PedidosSeleccionadosParaPagarPrepaid = [];
    $scope.PedidosObj = {};
    $scope.ServicioElectronico = 0;
    $scope.Subtotal = 0;
    $scope.Iva = 0;
    $scope.Total = 0;
    $scope.DeshabilitarPagar = false;
    $scope.todos = 0;
    $scope.MonedaPago = 'Pesos';
    $scope.paymethod = 1;
    const paymentMethods = {
      CREDIT_CARD: 1,
      CS_CREDIT: 2,
      PAYPAL: 3,
      PREPAY: 4
    };
  
    function groupBy (array, f) {
      var groups = {};
      array.forEach(function (o) {
        var group = JSON.stringify(f(o));
        groups[group] = groups[group] || [];
        groups[group].push(o);
      });
      return Object.keys(groups).map(function (group) { return groups[group]; });
    };

    const confirmPayPal = function () {
      const paymentId = $location.search().paymentId;
      const token = $location.search().token;
      const PayerID = $location.search().PayerID;
      const orderIds = $cookies.getObject('orderIds');
      $cookies.remove('orderIds');
      $location.url($location.path());
      if (paymentId && token && PayerID && orderIds) {
        PedidoDetallesFactory.confirmPayPal({ paymentId, PayerID, orderIds })
          .then(function (response) {
            if (response.data.state === 'approved') {
              $scope.ComprarConPayPal({ paymentId, PayerID, orderIds });
              $location.path('/MonitorPagos');
            }
            if (response.data.state === 'failed') {
              $scope.ShowToast('Ocurrio un error al intentar confirmar la compra con Paypal. Intentalo mas tarde.', 'danger');
              $location.path('/MonitorPagos');
            }
          })
          .catch(function (response) {
            $scope.ShowToast('Ocurrio un error de tipo: "' + response.data.message + '". Contacte con soporte de Compusoluciones.', 'danger');
            $location.path('/MonitorPagos');
          });
      }
    };

    $scope.init = function () {
      if ($scope.currentPath === '/MonitorPagos') {
        $scope.CheckCookie();
        confirmPayPal();
      }
      $location.path('/MonitorPagos');
      PedidoDetallesFactory.getPendingOrdersToPay()
        .success(function (ordersToPay) {
          $scope.Pedidos = ordersToPay.data;
          if (!ordersToPay.data || ordersToPay.data.length === 0) {
            return $scope.DeshabilitarPagar = true;
          }
          $scope.PedidosAgrupados = groupBy(ordersToPay.data, function (item) { return [item.IdPedido]; });
          for (let x = 0; x < $scope.PedidosAgrupados.length; x++) {
            $scope.PedidosObj[$scope.PedidosAgrupados[x][0].IdPedido] = $scope.PedidosAgrupados[x][0];
          }
          $scope.TipoCambio = ordersToPay.data[0].TipoCambio;
        })
        .error(function (data, status, headers, config) {
          $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';

          $scope.ShowToast('No pudimos cargar los pedidos por pagar, por favor intenta de nuevo más tarde.', 'danger');

          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });

      if ($cookies.getObject('Session').IdTipoAcceso == 2 || $cookies.getObject('Session').IdTipoAcceso == 3) {
        EmpresasFactory.getEmpresa($cookies.getObject('Session').IdEmpresa)
          .success(function (empresa) {
            $scope.infoEmpresa = empresa[0];
          })
          .error(function (data, status, headers, config) {
            $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';

            $scope.ShowToast('No pudimos cargar la información, por favor intenta de nuevo más tarde.', 'danger');

            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      }
    };
    $scope.init();

    $scope.isPayingWithCreditCard = function () {
      const IdFormaPago = $scope.paymethod;
      return IdFormaPago === paymentMethods.CREDIT_CARD;
    };

    $scope.isPayingWithPaypal = function () {
      const IdFormaPago = $scope.paymethod;
      return IdFormaPago === paymentMethods.PAYPAL;
    };

    $scope.isPayingWithPrepaid = function () {
      const IdFormaPago = $scope.paymethod;
      return IdFormaPago === paymentMethods.PREPAY;
    };

    $scope.ActualizarFormaPago = function (moneda) {
      $scope.paymethod = moneda;
      if ($scope.isPayingWithCreditCard() || $scope.isPayingWithPaypal()) {
        $scope.MonedaPago = 'Pesos';
      }
      CambiarMoneda();
    };

    const CambiarMoneda = function () {
      EmpresasFactory.putCambiaMonedaMonitorPXP($scope.PedidosSeleccionadosParaPagar, $scope.MonedaPago)
      .then(function (result) {
      })
      .catch(function (result) { error(result.data); });
    };

    $scope.CambiarMoneda = function (moneda = "Pesos", key = "") {
      $scope.MonedaPago = moneda;
      if (key != "") {
        $scope.pedidosPorPagar(key);
      };
      CambiarMoneda();
    };

    $scope.ActualizarPagoAutomatico = function () {
      EmpresasFactory.updateAutomaticPayment($scope.infoEmpresa.RealizarCargoAutomatico)
        .success(function (result) {
          if (result.success === 1) {
            $scope.ShowToast(result.message, 'success');
          }
        })
        .error(function (data, status, headers, config) {
          $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';

          $scope.ShowToast('No pudimos cargar la información, por favor intenta de nuevo más tarde.', 'danger');

          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.obtenerSubTotal = function (key) {
      var subtotal = 0;
      for (var x = 0; x < $scope.Pedidos.length; x++) {
        if ($scope.Pedidos[x].IdPedido == key) {
          subtotal += $scope.Pedidos[x].PrecioRenovacion * $scope.Pedidos[x].CantidadProxima  * $scope.Pedidos[x].TipoCambio;
        }
      }
      return subtotal;
    };

    $scope.seleccionarTodos = function () {
      for (var x = 0; x < $scope.PedidosAgrupados.length; x++) {
        if ($scope.PedidosObj[$scope.PedidosAgrupados[x][0].IdPedido].Check !== $scope.todos) {
          $scope.PedidosObj[$scope.PedidosAgrupados[x][0].IdPedido].Check = $scope.todos;
          $scope.pedidosPorPagar($scope.PedidosAgrupados[x][0].IdPedido);
        }
      }
    };

    $scope.pedidosPorPagar = function (key) {
      for (var y = 0; y < $scope.Pedidos.length; y++) {
        if ($scope.Pedidos[y].IdPedido == key) {
          if (!$scope.PedidosObj[key].Check) {
            if ($scope.todos) {
              $scope.todos = 0;
            }
            for (var x = 0; x < $scope.PedidosSeleccionadosParaPagar.length; x++) {
              if (key == $scope.PedidosSeleccionadosParaPagar[x]) {
                $scope.PedidosSeleccionadosParaPagar.splice(x, 1);
                $scope.PedidosSeleccionadosParaPagarPrepaid.splice(x, 1);
              }
            }
            $scope.Pedidos[y].Seleccionado = 0;
          } else {
            const pedido = {
              IdPedido: key,
              TipoCambio: $scope.Pedidos[y].TipoCambio,
            };
            $scope.PedidosSeleccionadosParaPagar.push(key);
            $scope.PedidosSeleccionadosParaPagarPrepaid.push(pedido);
            $scope.Pedidos[y].Seleccionado = 1;
          }
          break;
        }
      }
      if ($scope.PedidosSeleccionadosParaPagar.length === 0) {
        $scope.ServicioElectronico = 0;
        $scope.Subtotal = 0;
        $scope.Iva = 0;
        $scope.Total = 0;
      }
      if ($scope.PedidosSeleccionadosParaPagar.length !== 0 && document.getElementById('Prepago').checked) {
        PedidoDetallesFactory.monitorCalculationsPrepaid({ Pedidos: $scope.PedidosSeleccionadosParaPagar }, $scope.MonedaPago)
          .success(function (calculations) {
            if (calculations.total) {
              $scope.Subtotal = calculations.subtotal;
              $scope.Iva = calculations.iva;
              $scope.Total = calculations.total;
            } else {
              $scope.Subtotal = 0;
              $scope.Iva = 0;
              $scope.Total = 0;
            }
            $scope.ServicioElectronico = 0;
          })
          .error(function (data, status, headers, config) {
            $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';
            $scope.ShowToast('No pudimos realizar los cálculos, por favor intenta de nuevo más tarde.', 'danger');
          });
      }
      // if ($scope.PedidosSeleccionadosParaPagar.length !== 0 && document.getElementById('PayPal').checked) {
      //   PedidoDetallesFactory.monitorCalculationsPayPal({ Pedidos: $scope.PedidosSeleccionadosParaPagar })
      //     .success(function (calculations) {
      //       if (calculations.total) {
      //         $scope.ServicioElectronico = calculations.electronicService;
      //         $scope.Subtotal = calculations.subtotal;
      //         $scope.Iva = calculations.iva;
      //         $scope.Total = calculations.total;
      //       } else {
      //         $scope.ServicioElectronico = 0;
      //         $scope.Subtotal = 0;
      //         $scope.Iva = 0;
      //         $scope.Total = 0;
      //       }
      //     })
      //     .error(function (data, status, headers, config) {
      //       $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';
      //       $scope.ShowToast('No pudimos realizar los cálculos, por favor intenta de nuevo más tarde.', 'danger');
      //     });
      // }
      if ($scope.PedidosSeleccionadosParaPagar.length !== 0 && document.getElementById('Tarjeta').checked) {
        PedidoDetallesFactory.monitorCalculations({ Pedidos: $scope.PedidosSeleccionadosParaPagar })
          .success(function (calculations) {
            if (calculations.total) {
              $scope.ServicioElectronico = calculations.electronicService;
              $scope.Subtotal = calculations.subtotal;
              $scope.Iva = calculations.iva;
              $scope.Total = calculations.total;
            } else {
              $scope.ServicioElectronico = 0;
              $scope.Subtotal = 0;
              $scope.Iva = 0;
              $scope.Total = 0;
            }
          })
          .error(function (data, status, headers, config) {
            $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';

            $scope.ShowToast('No pudimos realizar los cálculos, por favor intenta de nuevo más tarde.', 'danger');

            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      }
      CambiarMoneda();
    };

    $scope.mostrarDetalles = function (key) {
      if ($scope.PedidosObj[key].Mostrar) {
        $scope.PedidosObj[key].Mostrar = 0;
      } else {
        $scope.PedidosObj[key].Mostrar = 1;
      }
    };

    $scope.checkPayment = function () {
      if (document.getElementById('Tarjeta').checked) {
        $scope.pagar();
      // } else if (document.getElementById('PayPal').checked) {
      //   $scope.preparePayPal();
      } else if (document.getElementById('Prepago').checked) {
        $scope.preparePrePaid();
      }
    };

    $scope.pagar = function () {
      if ($scope.PedidosSeleccionadosParaPagar.length > 0) {
        PedidoDetallesFactory.payWidthCard({ Pedidos: $scope.PedidosSeleccionadosParaPagar })
          .success(function (Datos) {
            var expireDate = new Date();
            expireDate.setTime(expireDate.getTime() + 600 * 2000);
            Datos.data["0"].pedidosAgrupados[0].TipoCambio = $scope.TipoCambio;
            $cookies.putObject('pedidosAgrupados', Datos.data["0"].pedidosAgrupados, { 'expires': expireDate, secure: $rootScope.secureCookie });
            if (Datos.success) {
              if ($cookies.getObject('pedidosAgrupados')) {

                Checkout.configure({
                  merchant: Datos.data["0"].merchant,
                  session: { id: Datos.data["0"].session_id },
                  order:
                  {
                    amount: Datos.data['0'].total,
                    currency: Datos.data["0"].moneda,
                    description: 'Pago tarjeta bancaria',
                    id: Datos.data["0"].pedidos,
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
                      phone: '+1 123 456 789 012',
                    },
                    displayControl: { billingAddress: 'HIDE', orderSummary: 'SHOW' },
                    locale: 'es_MX',
                    theme: 'default'
                  }
                });
                Checkout.showLightbox();
              }
            }
          })
          .error(function (data, status, headers, config) {
            $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';

            $scope.ShowToast('No pudimos conectarnos con el banco, por favor intenta de nuevo más tarde.', 'danger');

            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      } else {
        $scope.ShowToast('Selecciona al menos un pedido para pagar.', 'danger');
      }
    };

    const getActualSubdomain = function () {
      let subdomain = window.location.href;
      subdomain = subdomain.replace('/#/MonitorPagos', '');
      return subdomain;
    };

    // $scope.preparePayPal = function () {
    //   if ($scope.PedidosSeleccionadosParaPagar.length > 0) {
    //     const actualSubdomain = getActualSubdomain();
    //     PedidoDetallesFactory.payWithPaypal({ Pedidos: $scope.PedidosSeleccionadosParaPagar })
    //     .success(function (response) {
    //       var expireDate = new Date();
    //       expireDate.setTime(expireDate.getTime() + 600 * 2000);
    //       const paypalNextPayment = {
    //         electronicServiceByOrder: response.data.electronicServiceByOrder,
    //         TipoCambio: $scope.TipoCambio
    //       };
    //       $cookies.putObject('paypalNextPayment', paypalNextPayment, { expires: expireDate, secure: $rootScope.secureCookie });
    //       $cookies.putObject('orderIds', $scope.PedidosSeleccionadosParaPagar, { expires: expireDate, secure: $rootScope.secureCookie });
    //       PedidoDetallesFactory.preparePayPal({ orderIds: $scope.PedidosSeleccionadosParaPagar, url: 'MonitorPagos', actualSubdomain })
    //         .then(function (response) {
    //           if (response.data.state === 'created') {
    //             const paypal = response.data.links.filter(function (item) {
    //               if (item.method === 'REDIRECT') return item.href;
    //             })[0];
    //             location.href = paypal.href;
    //           } else {
    //             $scope.ShowToast('Ocurrio un error al procesar el pago.', 'danger');
    //           }
    //         });
    //     })
    //     .catch(function (response) {
    //       $scope.ShowToast('Ocurrio un error al procesar el pago. de tipo: ' + response.data.message, 'danger');
    //     });
    //   } else {
    //     $scope.ShowToast('Selecciona al menos un pedido para pagar.', 'danger');
    //   }
    // };

    $scope.ComprarConPayPal = function (resultPaypal) {
      const paypalNextPayment = $cookies.getObject('paypalNextPayment');
      const TipoCambio = paypalNextPayment.TipoCambio;
      const electronicServiceByOrder = paypalNextPayment.electronicServiceByOrder;
      const PedidosAgrupados = electronicServiceByOrder.map(function (order) {
        return Object.assign({}, order, { TipoCambio });
      });
      const datosPayPal = {
        TarjetaResultIndicator: resultPaypal.paymentId,
        TarjetaSessionVersion: resultPaypal.PayerID,
        PedidosAgrupados
      };
      if (datosPayPal.PedidosAgrupados) {
        PedidosFactory.patchPaymentInformation(datosPayPal)
          .success(function (compra) {
            $cookies.remove('pedidosAgrupados');
            $cookies.remove('TipoCambio');
            $cookies.remove('electronicServiceByOrder');
            if (compra.success === 1) {
              $scope.ShowToast(compra.message, 'success');
              $location.path('/MonitorPagos/refrescar');
            }
          })
          .error(function (data, status, headers, config) {
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      } else {
        $scope.ShowToast('Algo salió mal con tu pedido, por favor ponte en contacto con tu equipo de soporte CompuSoluciones para más información.', 'danger');
        $location.path('/MonitorPagos/e');
      }
    };

    $scope.preparePrePaid = function () {
      if ($scope.PedidosSeleccionadosParaPagar.length > 0) {
        PedidoDetallesFactory.payWithPrePaid({ Pedidos: $scope.PedidosSeleccionadosParaPagarPrepaid }, $scope.MonedaPago)
        .success(function (response) {
          if (response.statusCode === 400) {
            $scope.ShowToast(response.message.message, 'danger');
          } else {
            $scope.ShowToast('Pago realizado correctamente.', 'success');
            $location.path('/MonitorPagos/refrescar');
          }
        })
        .catch(function (response) {
          $scope.ShowToast('Algo salió mal con tu pedido, por favor ponte en contacto con tu equipo de soporte CompuSoluciones para más información.', 'danger');
        });
      } else {
        $scope.ShowToast('Selecciona al menos un pedido para pagar.', 'danger');
      }
    };
  };
  MonitorPagos.$inject = ['$scope', '$log', '$rootScope', '$cookies', '$location', '$uibModal', '$filter', 'PedidoDetallesFactory', 'EmpresasFactory', 'PedidosFactory'];

  angular.module('marketplace').controller('MonitorPagos', MonitorPagos);
}());
