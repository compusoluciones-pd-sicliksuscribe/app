(function () {
  var ComprarController = function ($scope, $log, $location, $cookieStore, PedidoDetallesFactory, TipoCambioFactory, PedidosFactory, EmpresasFactory, $route) {
    $scope.currentPath = $location.path();
    $scope.PedidoDetalles = {};
    $scope.Distribuidor = {};
    $scope.error = false;

    const error = function (message) {
      $scope.ShowToast(!message ? 'Ha ocurrido un error, intentelo mas tarde.' : message, 'danger');
      $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';
    };

    const getOrderDetails = function () {
      return PedidoDetallesFactory.getPedidoDetalles()
        .then(function (result) {
          if (result.data.success) $scope.PedidoDetalles = result.data.data;
          $scope.PedidoDetalles.forEach(function (elem) {
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

    $scope.prepararPedidos = function () {
      PedidoDetallesFactory.getPrepararCompra(1)
        .then(function (result) {
          if (result.data.success) $scope.ShowToast(result.data.message, 'success');
          else {
            $scope.ShowToast(result.data.message, 'danger');
            $location.path('/Carrito/e');
          }
        })
        .then(getOrderDetails)
        .then(getEnterprises)
        .catch(function (result) { error(result.data.message); });
    };

    $scope.init = function () {
      if ($scope.currentPath === '/Comprar') {
        $scope.CheckCookie();
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

    $scope.back = function () {
      $location.path('/Carrito');
    };

    $scope.PagarTarjeta = function () {
      if ($scope.Distribuidor.IdFormaPagoPredilecta === 1) {
        PedidoDetallesFactory.getPrepararTarjetaCredito()
          .success(function (Datos) {
            var expireDate = new Date();
            expireDate.setTime(expireDate.getTime() + 600 * 2000); /* 20 minutos */
            $cookieStore.put('pedidosAgrupados', Datos.data['0'].pedidosAgrupados, { 'expires': expireDate });

            if (Datos.data['0'].total > 0) {
              if (Datos.success) {
                if ($cookieStore.get('pedidosAgrupados')) {
                  Checkout.configure({
                    merchant: Datos.data['0'].merchant,
                    session: { id: Datos.data['0'].session_id },
                    order:
                    {
                      amount: function () {
                        Datos.data['0'].total;
                      },
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
                        phone: '+1 123 456 789 012',
                      },
                      displayControl: { billingAddress: 'HIDE', orderSummary: 'READ_ONLY' },
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
              $scope.ComprarConTarjeta('Grátis', 'Grátis');
            }
          })
          .error(function (data, status, headers, config) {
            $scope.ShowToast('Error al obtener el tipo de cambio API Intelisis.', 'danger');
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      }
    };

    $scope.Comprar = function () {
      if ($scope.Distribuidor.IdFormaPagoPredilecta === 1) {
        $scope.PagarTarjeta();
      } else {
        PedidoDetallesFactory.getComprar()
          .success(function (compra) {
            if (compra.success === 1) {
              $scope.ShowToast(compra.message, 'success');

              $scope.ActualizarMenu();
              $location.path('/');
            }
            else {
              $location.path('/Carrito');
              $scope.ShowToast(compra.message, 'danger');
            }
          })
          .error(function (data, status, headers, config) {
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      }
    };

    $scope.ComprarConTarjeta = function (resultIndicator, sessionVersion) {
      var datosTarjeta = { 'TarjetaResultIndicator': resultIndicator, 'TarjetaSessionVersion': sessionVersion, 'PedidosAgrupados': $cookieStore.get('pedidosAgrupados') };

      if (datosTarjeta.PedidosAgrupados) {
        if (datosTarjeta.PedidosAgrupados[0].Renovacion) {
          PedidosFactory.patchPaymentInformation(datosTarjeta)
            .success(function (compra) {
              $cookieStore.remove('pedidosAgrupados');
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
              $cookieStore.remove('pedidosAgrupados');
              if (putPedidoResult.success) {
                PedidoDetallesFactory.getComprar()
                  .success(function (compra) {
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
              $cookieStore.remove('pedidosAgrupados');
              $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
            });
        }
      } else {
        $scope.ShowToast('Algo salió mal con tu pedido, por favor ponte en contacto con tu equipo de soporte CompuSoluciones para más información.', 'danger');
        $location.path('/Carrito/e');
      }
    };
  };

  ComprarController.$inject = ['$scope', '$log', '$location', '$cookieStore', 'PedidoDetallesFactory', 'TipoCambioFactory', 'PedidosFactory', 'EmpresasFactory', '$route'];

  angular.module('marketplace').controller('ComprarController', ComprarController);
}());
