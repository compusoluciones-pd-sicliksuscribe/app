(function () {
  var MonitorPagos = function ($scope, $log, $cookieStore, $location, $uibModal, $filter, PedidoDetallesFactory) {
    $scope.PedidoSeleccionado = 0;
    $scope.PedidosSeleccionadosParaPagar = [];
    $scope.PedidosObj = {};
    $scope.ServicioElectronico = 0;
    $scope.Subtotal = 0;
    $scope.Iva = 0;
    $scope.Total = 0;
    $scope.DeshabilitarPagar = false;
    $scope.todos = 0;
    function groupBy(array, f) {
      var groups = {};
      array.forEach(function (o) {
        var group = JSON.stringify(f(o));
        groups[group] = groups[group] || [];
        groups[group].push(o);
      });
      return Object.keys(groups).map(function (group) { return groups[group]; });
    }

    $scope.init = function () {
      $location.path('/MonitorPagos');
      PedidoDetallesFactory.getPendingOrdersToPay()
        .success(function (ordersToPay) {
          $scope.Pedidos = ordersToPay.data;
          if (!ordersToPay.data || ordersToPay.data.length === 0) {
            return $scope.DeshabilitarPagar = true;
          }
          console.log(ordersToPay.data);
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

    };
    $scope.init();

    $scope.obtenerSubTotal = function (key) {
      let subtotal = 0;
      for (let x = 0; x < $scope.Pedidos.length; x++) {
        if ($scope.Pedidos[x].IdPedido == key) {
          subtotal += $scope.Pedidos[x].PrecioRenovacion * $scope.Pedidos[x].CantidadProxima;
        }
      }
      return subtotal * $scope.TipoCambio;
    };

    $scope.seleccionarTodos = function () {
      for (let x = 0; x < $scope.PedidosAgrupados.length; x++) {
        if ($scope.PedidosObj[$scope.PedidosAgrupados[x][0].IdPedido].Check !== $scope.todos) {
          $scope.PedidosObj[$scope.PedidosAgrupados[x][0].IdPedido].Check = $scope.todos;
          $scope.pedidosPorPagar($scope.PedidosAgrupados[x][0].IdPedido);
        }
      }
    };

    $scope.pedidosPorPagar = function (key) {
      for (let y = 0; y < $scope.Pedidos.length; y++) {
        if ($scope.Pedidos[y].IdPedido == key) {
          if (!$scope.PedidosObj[key].Check) {
            if ($scope.todos) {
              $scope.todos = 0;
            }
            for (let x = 0; x < $scope.PedidosSeleccionadosParaPagar.length; x++) {
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

    $scope.pagar = function () {
      if ($scope.PedidosSeleccionadosParaPagar.length > 0) {
        PedidoDetallesFactory.payWidthCard({ Pedidos: $scope.PedidosSeleccionadosParaPagar })
          .success(function (Datos) {
            var expireDate = new Date();
            expireDate.setTime(expireDate.getTime() + 600 * 2000); /*20 minutos*/
            Datos.data["0"].pedidosAgrupados[0].TipoCambio = $scope.TipoCambio;
            $cookieStore.put('pedidosAgrupados', Datos.data["0"].pedidosAgrupados, { 'expires': expireDate });
            if (Datos.success) {
              if ($cookieStore.get('pedidosAgrupados')) {

                Checkout.configure({
                  merchant: Datos.data["0"].merchant,
                  session: { id: Datos.data["0"].session_id },
                  order:
                  {
                    amount: function () {
                      Datos.data["0"].total;
                    },
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
                    displayControl: { billingAddress: 'HIDE', orderSummary: 'READ_ONLY' },
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
  };
  MonitorPagos.$inject = ['$scope', '$log', '$cookieStore', '$location', '$uibModal', '$filter', 'PedidoDetallesFactory'];

  angular.module('marketplace').controller('MonitorPagos', MonitorPagos);
}());
