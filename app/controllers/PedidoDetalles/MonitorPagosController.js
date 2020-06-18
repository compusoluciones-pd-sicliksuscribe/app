(function () {
  var MonitorPagos = function ($scope, $sce, $log, $rootScope, $cookies, $location, $uibModal, $filter, PedidoDetallesFactory, EmpresasFactory, UsuariosFactory, PedidosFactory) {
    $scope.PedidoSeleccionado = 0;
    $scope.PedidosSeleccionadosParaPagar = [];
    $scope.PedidosSeleccionadosParaPagarPrepaid = [];
    $scope.PedidosObj = {};
    $scope.ServicioElectronico = 0;
    $scope.Distribuidor = {};
    $scope.Subtotal = 0;
    $scope.Iva = 0;
    $scope.Total = 0;
    $scope.DeshabilitarPagar = false;
    $scope.todos = 0;
    $scope.paymethod = 1;
    $scope.name = '';
    $scope.card = '';    
    $scope.errorDate = '';
    $scope.year = '';
    $scope.month = '';
    const paymentMethods = {
      CREDIT_CARD: 1,
      CS_CREDIT: 2,
      PAYPAL: 3,
      PREPAY: 4
    };
  
    $scope.session = $cookies.getObject('Session');
    
    const CLICKSUSCRIBE = 2;
  
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
        $scope.Distribuidor.MonedaPago = 'Pesos';
      }
      $location.path('/MonitorPagos');
      PedidoDetallesFactory.getPendingOrdersToPay()
        .success(function (ordersToPay) {
          console.log("orders to pay ",ordersToPay);
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

    $scope.CREDIT_CARD = 1;

    $scope.ActualizarFormaPago = function (metodoPago) {
      $scope.paymethod = metodoPago;
      $scope.Distribuidor.MonedaPago ='Pesos';
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
        PedidoDetallesFactory.monitorCalculationsPrepaid({ Pedidos: $scope.PedidosSeleccionadosParaPagar }, $scope.Distribuidor.MonedaPago)
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
      } else if (document.getElementById('Prepago').checked) {
        $scope.preparePrePaid();
      }
    };
    
    $scope.getSiclikToken = async () => {
      return UsuariosFactory.getTokenSiclik()
        .then(function (tokenRefResult) {
          return tokenRefResult.data.accessToken;
          })
          .catch(function (error) {
            $scope.ShowToast('Surgió un error, contactar a soporte o intentar más tarde.', 'danger');
        });
    };
    
    $scope.getOpenPayCustomerId = siclikToken => {
      const userData = {
        name: $scope.session.Nombre,
        lastName: $scope.session.ApellidoPaterno,
        email: $scope.session.CorreoElectronico,
        phoneNumber: "",
        externalId: String($scope.session.IdUsuario),
        platform: CLICKSUSCRIBE
      };
      return UsuariosFactory.createOpenPayUser(siclikToken, userData)
      .then(function (resultCreate) {
        return resultCreate.data.openpayCustomerId;
      });
    }

    
    const getOpenPayCustomer = async siclikToken => {
      return $scope.getOpenPayCustomerId(siclikToken)
        .catch(() => {
          const user = String($scope.session.IdUsuario);
          return UsuariosFactory.getOpenPayUser(siclikToken, user)
          .then(function (resultGetCustomer) {
            return resultGetCustomer.data.openpayCustomerId;
          })
          .catch(function (error) { 
            $scope.ShowToast('Surgió un error, contactar a soporte o intentar más tarde.', 'danger');
          });
      });
    }
  
    $("#card").keyup(function(){              
      var ta      =   $("#card");
      letras      =   ta.val().replace(/ /g, "");
      ta.val(letras)
    }); 

    $('#pay-button').on('click', function(event) {
      $scope.errorName = 0;
      $scope.errorCard = 0;
      $scope.errorDate = 0;
      $scope.dateError = '';
      $scope.errorCardMessage = '';
      if ($scope.name.length <= 0) {
        $scope.errorName = 1;
      }
      if ($scope.card.length <= 0) {
        $scope.errorCard = 1;
        $scope.errorCardMessage = '*Requerido';
      }
      if ($scope.month.length <= 0) {
        $scope.errorDate = 1;
        $scope.dateError = '*Mes requerido';
      }
      if ($scope.year.length <= 0) {
        $scope.errorDate = 1;
        $scope.dateError = '*Año requerido';
      }
      event.preventDefault();
      $("#pay-button").prop( "disabled", true);
      OpenPay.token.extractFormAndCreate('payment-form', success_callbak, error_callbak);              
    });

    async function success_callbak (response) {
      const siclikToken = await $scope.getSiclikToken();
      const openpayCustomerId = await getOpenPayCustomer(siclikToken);
        const bodyRequest = {
          deviceSessionId: $scope.deviceSessionId,
          sourceId: response.data.id,
          openpayCustomerId,
          Pedidos: $scope.PedidosSeleccionadosParaPagar,
        };
        PedidosFactory.payWithCardMonitorOpenpay(bodyRequest)
        .then(function (resultPayment) {
          if (resultPayment.data.success) {
            $('#modalPagoTC').modal('hide');
            $scope.ShowToast(resultPayment.data.message, 'success');
            $scope.init();
          } else {
            if (resultPayment.data.statusCode) {
              const cardError = getCardPaymentError(resultPayment.data.error.code);
              $scope.ShowToast(cardError, 'danger');
            } else {
              $scope.ShowToast('Surgió un error, contactar a soporte o intentar más tarde.', 'danger');
            }
          }
        })
        .catch(function (error) { 
          $scope.ShowToast('Surgió un error, contactar a soporte o intentar más tarde.', 'danger');
        });
    }
    $scope.checkErrors = errors => {
      errors.forEach(er => {
        if (er === 'holder_name is required') {
          $scope.ShowToast('El nombre es requerido', 'danger');
        }
        if (er === 'card_number is required') {
          $scope.ShowToast('El número de tarjeta es requerido', 'danger');
        }
        if (er === 'expiration_year expiration_month is required') {
          $scope.ShowToast('La fecha de expiración es requerida', 'danger');
        }
        if (er === 'card_number length is invalid') {
          $scope.ShowToast('El número de su tarjeta es inválido', 'danger');
        }
        if (er === 'The card number verification digit is invalid') {
          $scope.ShowToast('El número de verificacion de su tarjeta es inválido', 'danger');
        }
        if (er === 'The CVV2 security code is required') {
          $scope.ShowToast('El código de seguridad CVV2 es requerido', 'danger');
        }
        if (er === 'valid expirations months are 01 to 12') {
          $scope.ShowToast('Los meses de expiración válidos son de 01 a 12', 'danger');
        }
      })
    }

    async function error_callbak (error) {
      const test = error.data.description;
      var arr = await test.split(",").map(function(item) {
        return item.trim();
      });
      return $scope.checkErrors(arr);
    }
    
    const keyAntifraude = () => {
      OpenPay.setId('mgp4crl0qu5nxy0ed2af');
      OpenPay.setApiKey('pk_9f2f5b3c557045298d7df2c67fe378fe');
      if ($rootScope.sandbox) OpenPay.setSandboxMode(true);
      $scope.deviceSessionId = OpenPay.deviceData.setup("payment-form", "device_session_id");
    }

    $scope.pagar = function () {
      if ($scope.PedidosSeleccionadosParaPagar.length > 0) {
        keyAntifraude();
        PedidoDetallesFactory.payWidthCard({ Pedidos: $scope.PedidosSeleccionadosParaPagar })
          .success(function (Datos) {
            var expireDate = new Date();
            expireDate.setTime(expireDate.getTime() + 600 * 2000);
            if (Datos.success) {
              $scope.amount = Datos.data[0].amount;
              $scope.currency = Datos.data[0].currency;
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

    $scope.cerrarModal = () => {
      $('#modalPagoPDF').modal('hide');
      $scope.init();
    }

    $scope.preparePrePaid = async function () {
      if ($scope.PedidosSeleccionadosParaPagar.length > 0) {
        keyAntifraude();
        const siclikToken = await $scope.getSiclikToken();
        const openpayCustomerId = await getOpenPayCustomer(siclikToken);
        const body = {
          openpayCustomerId,
          deviceSessionId: $scope.deviceSessionId,
          Pedidos: $scope.PedidosSeleccionadosParaPagar,
          Moneda: $scope.Distribuidor.MonedaPago,
        }
        PedidosFactory.payWithSpeiOpenpayMonitor(body)
          .then(function (speiResult) {
            if (speiResult.data.success) {
              $('#modalPagoPDF').modal('show');
              $scope.url = $sce.trustAsResourceUrl(speiResult.data.data.urlFile);
              $scope.ShowToast(speiResult.data.message, 'success');
            } else {
              $scope.ShowToast('Ocurrio un error intente más tarde.', 'danger');
            }
          })
          .catch(function (result) {
            $scope.ShowToast('Ocurrio un error intente más tarde.', 'danger');
          });
      } else {
        $scope.ShowToast('Selecciona al menos un pedido para pagar.', 'danger');
      }
    };
  
  };
  MonitorPagos.$inject = ['$scope', '$sce', '$log', '$rootScope', '$cookies', '$location', '$uibModal', '$filter', 'PedidoDetallesFactory', 'EmpresasFactory', 'UsuariosFactory', 'PedidosFactory'];

  angular.module('marketplace').controller('MonitorPagos', MonitorPagos);
}());
