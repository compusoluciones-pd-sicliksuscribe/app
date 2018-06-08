(function () {
  var MonitorPagosUF = function ($scope, $log, $rootScope, $cookies, $location, $uibModal, $filter, PedidoDetallesFactory, EmpresasFactory, PedidosFactory) {
    $scope.PedidoSeleccionado = 0;
    $scope.PedidosSeleccionadosParaPagar = [];
    $scope.PedidosObj = {};
    $scope.ServicioElectronico = 0;
    $scope.Subtotal = 0;
    $scope.Iva = 0;
    $scope.Total = 0;
    $scope.DeshabilitarPagar = false;
    $scope.todos = 0;
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
              $location.path('/MonitorPagos/uf');
            }
            if (response.data.state === 'failed') {
              $scope.ShowToast('Ocurrio un error al intentar confirmar la compra con Paypal. Intentalo mas tarde.', 'danger');
              $location.path('/MonitorPagos/uf');
            }
          })
          .catch(function (response) {
            $scope.ShowToast('Ocurrio un error de tipo: "' + response.data.message + '". Contacte con soporte de Compusoluciones.', 'danger');
            $location.path('/MonitorPagos/uf');
          });
      }
    };

    $scope.init = function () {
      if ($scope.currentPath === '/MonitorPagos/uf') {
        $scope.CheckCookie();
        confirmPayPal();
      }
      $location.path('/MonitorPagos/uf');
      PedidoDetallesFactory.getPendingOrdersToPayTuClick($scope.currentDistribuidor.IdEmpresa)
        .success(function (ordersToPay) {
          $scope.Pedidos = ordersToPay.data;
          if (!ordersToPay.data || ordersToPay.data.length === 0) {
            $scope.DeshabilitarPagar = true;
            return $scope.DeshabilitarPagar;
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

      if ($cookies.getObject('Session').IdTipoAcceso == 2 || $cookies.getObject('Session').IdTipoAcceso == 3 || $cookies.getObject('Session').IdTipoAcceso == 4) {
        EmpresasFactory.getEmpresa($scope.currentDistribuidor.IdEmpresa)
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

    // $scope.ActualizarPagoAutomatico = function () {
    //   EmpresasFactory.updateAutomaticPayment($scope.infoEmpresa.RealizarCargoAutomatico)
    //     .success(function (result) {
    //       if (result.success === 1) {
    //         $scope.ShowToast(result.message, 'success');
    //       }
    //     })
    //     .error(function (data, status, headers, config) {
    //       $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';

    //       $scope.ShowToast('No pudimos cargar la información, por favor intenta de nuevo más tarde.', 'danger');

    //       $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
    //     });
    // };

    $scope.obtenerSubTotal = function (key) {
      var subtotal = 0;
      for (var x = 0; x < $scope.Pedidos.length; x++) {
        if ($scope.Pedidos[x].IdPedido == key) {
          subtotal += $scope.Pedidos[x].PrecioRenovacion * $scope.Pedidos[x].CantidadProxima;
        }
      }
      return subtotal * $scope.TipoCambio;
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
              }
            }
            $scope.Pedidos[y].Seleccionado = 0;
          } else {
            $scope.PedidosSeleccionadosParaPagar.push(key);
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
      if ($scope.PedidosSeleccionadosParaPagar.length !== 0 && document.getElementById('PayPal').checked) {
        PedidoDetallesFactory.monitorCalculationsPayPal({ Pedidos: $scope.PedidosSeleccionadosParaPagar })
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
      if ($scope.PedidosSeleccionadosParaPagar.length !== 0 && document.getElementById('Tarjeta').checked) {
        PedidoDetallesFactory.monitorCalculationsTuClick({ Pedidos: $scope.PedidosSeleccionadosParaPagar }, $scope.currentDistribuidor.IdEmpresa)
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
      }
      else if (document.getElementById('PayPal').checked) {
        $scope.preparePayPal();
      }
    };

    $scope.pagar = function () {
      if ($scope.PedidosSeleccionadosParaPagar.length > 0) {
        PedidoDetallesFactory.payWidthCardTuClick({ Pedidos: $scope.PedidosSeleccionadosParaPagar }, $scope.currentDistribuidor.IdEmpresa)
          .success(function (Datos) {
            var expireDate = new Date();
            expireDate.setTime(expireDate.getTime() + 600 * 2000);
            Datos.data["0"].pedidosAgrupados[0].TipoCambio = $scope.TipoCambio;
            $cookies.putObject('pedidosAgrupados', Datos.data["0"].pedidosAgrupados, { 'expires': expireDate, secure: $rootScope.secureCookie });
            if (Datos.success) {
              if ($cookies.getObject('pedidosAgrupados')) {
                PedidoDetallesFactory.getOwnCreditCardData($scope.currentDistribuidor.IdEmpresa)
                .success(function (result) {
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
                        name: result.NombreEmpresa || 'CompuSoluciones',
                        address:
                        {
                          line1: result.RazonSocial || 'CompuSoluciones y Asociados, S.A. de C.V.',
                          line2: result.Direccion || 'Av. Mariano Oterno No. 1105',
                          line3: `${result.Colonia} C.P. ${result.CodigoPostal}` || 'Col. Rinconada del Bosque C.P. 44530',
                          line4: `${result.Ciudad}, ${result.Estado}. México` || 'Guadalajara, Jalisco. México'
                        },

                        email: result.Email || 'order@yourMerchantEmailAddress.com',
                        phone: result.TelefonoContacto || '+1 123 456 789 012'
                      },
                      displayControl: { billingAddress: 'HIDE', orderSummary: 'SHOW' },
                      locale: 'es_MX',
                      theme: 'default'
                    }
                  });

                  Checkout.showLightbox();
              });
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

    $scope.preparePayPal = function () {
      if ($scope.PedidosSeleccionadosParaPagar.length > 0) {
        PedidoDetallesFactory.payWithPaypal({ Pedidos: $scope.PedidosSeleccionadosParaPagar })
        .success(function (response) {
          var expireDate = new Date();
          expireDate.setTime(expireDate.getTime() + 600 * 2000);
          const paypalNextPayment = {
            electronicServiceByOrder: response.data.electronicServiceByOrder,
            TipoCambio: $scope.TipoCambio
          };
          $cookies.putObject('paypalNextPayment', paypalNextPayment, { expires: expireDate, secure: $rootScope.secureCookie });
          $cookies.putObject('orderIds', $scope.PedidosSeleccionadosParaPagar, { expires: expireDate, secure: $rootScope.secureCookie });
          PedidoDetallesFactory.preparePayPal({ orderIds: $scope.PedidosSeleccionadosParaPagar, url: 'MonitorPagos/uf' })
            .then(function (response) {
              if (response.data.state === 'created') {
                const paypal = response.data.links.filter(function (item) {
                  if (item.method === 'REDIRECT') return item.href;
                })[0];
                location.href = paypal.href;
              } else {
                $scope.ShowToast('Ocurrio un error al procesar el pago.', 'danger');
              }
            });
        })
        .catch(function (response) {
          $scope.ShowToast('Ocurrio un error al procesar el pago. de tipo: ' + response.data.message, 'danger');
        });
      } else {
        $scope.ShowToast('Selecciona al menos un pedido para pagar.', 'danger');
      }
    };

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
              // $location.path('/MonitorPagos/refrescar');
              $scope.init();
            }
          })
          .error(function (data, status, headers, config) {
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      } else {
        $scope.ShowToast('Algo salió mal con tu pedido, por favor ponte en contacto con tu equipo de soporte CompuSoluciones para más información.', 'danger');
        $location.path('/MonitorPagos/uf/e');
      }
    };
  };
  MonitorPagosUF.$inject = ['$scope', '$log', '$rootScope', '$cookies', '$location', '$uibModal', '$filter', 'PedidoDetallesFactory', 'EmpresasFactory', 'PedidosFactory'];

  angular.module('marketplace').controller('MonitorPagosUF', MonitorPagosUF);
}());
