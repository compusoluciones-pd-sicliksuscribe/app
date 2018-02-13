(function () {
  var MonitorPagos = function ($scope, $log, $rootScope, $cookies, $location, $uibModal, $filter, PedidoDetallesFactory, EmpresasFactory) {
    $scope.PedidoSeleccionado = 0;
    $scope.PedidosSeleccionadosParaPagar = [];
    $scope.PedidosObj = {};
    $scope.Distribuidor = {};
    $scope.ServicioElectronico = 0;
    $scope.Subtotal = 0;
    $scope.Iva = 0;
    $scope.Total = 0;
    $scope.DeshabilitarPagar = false;
    $scope.tarjetaCheckBox = false;
    $scope.paypalCheckBox = false;
    function groupBy (array, f) {
      var groups = {};
      array.forEach(function (o) {
        var group = JSON.stringify(f(o));
        groups[group] = groups[group] || [];
        groups[group].push(o);
      });
      return Object.keys(groups).map(function (group) { return groups[group]; });
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
            if (response.data.state === 'approved') $location.path('/MonitorPagos');
            if (response.data.state === 'failed') $scope.ShowToast('Ocurrio un error al intentar confirmar la compra con Paypal. Intentalo mas tarde.', 'danger');
          })
          .catch(function (response) {
            $scope.ShowToast('Ocurrio un error de tipo: "' + response.data.message + '". Contacte con soporte de Compusoluciones.', 'danger');
          });
      }
    };

    $scope.init = function () {
      if ($scope.currentPath === '/MonitorPagos') {
        $scope.CheckCookie();
        confirmarPaypal();
      }
      $location.path('/MonitorPagos');
      PedidoDetallesFactory.getPendingOrdersToPay()
        .success(function (ordersToPay) {
          $scope.Pedidos = ordersToPay.data;
          console.log(ordersToPay.data);
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

    $scope.ActualizarPagoAutomatico = function () {
      console.log($scope.infoEmpresa.RealizarCargoAutomatico);
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
          subtotal += $scope.Pedidos[x].PrecioRenovacion * $scope.Pedidos[x].CantidadProxima;
        }
      }
      return subtotal * $scope.TipoCambio;
    };

    const selectByPaymentMethod = function (paymentId, checkBoxName) {
      for (var x = 0; x < $scope.PedidosAgrupados.length; x++) {
        const order = $scope.PedidosObj[$scope.PedidosAgrupados[x][0].IdPedido];
        if (order.Check !== $scope[checkBoxName] && order.IdFormaPagoProxima === paymentId) {
          order.Check = $scope[checkBoxName];
          $scope.pedidosPorPagar($scope.PedidosAgrupados[x][0].IdPedido);
        }
      }
    };

    $scope.seleccionarPaypal = function () {
      selectByPaymentMethod(3, 'paypalCheckBox');
    };

    $scope.seleccionarTarjeta = function () {
      selectByPaymentMethod(1, 'tarjetaCheckBox');
    };

    $scope.filtrarSeleccionados = function () {
      function filtrarPedidosSeleccionados (pedido) {
        return pedido.Check === 1;
      }
      return $scope.Pedidos && $scope.Pedidos.filter(filtrarPedidosSeleccionados).length === 0;
    };

    $scope.validarMetodosDePago = function () {
      if ($scope.tarjetaCheckBox && $scope.paypalCheckBox) {
        $scope.ShowToast('No se pueden seleccionar ambos pagos, intenta de nuevo seleccionando sólo un método de pago.', 'danger');
        return false;
      }
      return true;
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
      } else {
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
    };

    $scope.mostrarDetalles = function (key) {
      if ($scope.PedidosObj[key].Mostrar) {
        $scope.PedidosObj[key].Mostrar = 0;
      } else {
        $scope.PedidosObj[key].Mostrar = 1;
      }
    };

    function getPaymenthMethod () {
      const ordersToPay = $scope.PedidosObj;
      const selectedOrdersToPay = $scope.PedidosSeleccionadosParaPagar;
      const firstSelectedOrderToPay = ordersToPay[selectedOrdersToPay[0]];
      var firstOrderPaymentMethod = firstSelectedOrderToPay.IdFormaPagoProxima;
      for (var index = 1; index < selectedOrdersToPay.length; index++) {
        const order = selectedOrdersToPay[index];
        if (order.IdFormaPagoProxima !== firstSelectedOrderToPay) {
          $scope.ShowToast('No se pueden seleccionar ambos pagos, intenta de nuevo seleccionando sólo un método de pago.', 'danger');
          firstOrderPaymentMethod = 0;
          return;
        }
      }
      return firstOrderPaymentMethod;
    }

    $scope.Comprar = function () {
      const paymentMethod = getPaymenthMethod();
      if (paymentMethod === 1) $scope.pagar();
      if (paymentMethod === 3) $scope.prepararPaypal();
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

    $scope.prepararPaypal = function () {
      const orderIds = $scope.PedidosSeleccionadosParaPagar.map(function (result) {
        return result.IdPedido;
      });
      const expireDate = new Date();
      expireDate.setTime(expireDate.getTime() + 600 * 2000);
      $cookies.putObject('orderIds', orderIds, { expires: expireDate, secure: $rootScope.secureCookie });
      PedidoDetallesFactory.prepararPaypal({ orderIds })
        .then(function (response) {
          if (response.data.state === 'created') {
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
  };
  MonitorPagos.$inject = ['$scope', '$log', '$rootScope', '$cookies', '$location', '$uibModal', '$filter', 'PedidoDetallesFactory', 'EmpresasFactory'];

  angular.module('marketplace').controller('MonitorPagos', MonitorPagos);
}());
