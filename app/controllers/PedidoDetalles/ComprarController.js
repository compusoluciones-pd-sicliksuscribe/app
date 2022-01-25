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
      APERIO: 5,
      AMAZONWEBSERVICES:10,
      IBM: 11
    };
    $scope.tipoMonedaCambio = $cookies.getObject('compararPedidosAnteriores');
    let modalTC = document.getElementById('modalPagoTC');
    const error = function (message) {
      $scope.ShowToast(!message ? 'Ha ocurrido un error, inténtelo más tarde.' : message, 'danger');
      $scope.Mensaje = 'No pudimos conectarnos a la base de datos, por favor intenta de nuevo más tarde.';
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

    let deviceSessionId = '';

    let tokenId = '';
    $scope.meses = [{ nombre: 'Enero', valor: '01' }, { nombre: 'Febrero', valor: '02' }, { nombre: 'Marzo', valor: '03' }, { nombre: 'Abril', valor: '04' }, { nombre: 'Mayo', valor: '05' }, { nombre: 'Junio', valor: '06' }, { nombre: 'Julio', valor: '07' }, { nombre: 'Agosto', valor: '08' }, { nombre: 'Septiembre', valor: '09' }, { nombre: 'Octubre', valor: '10' }, { nombre: 'Noviembre', valor: '11' }, { nombre: 'Diciembre', valor: '12' }];

    const getCardError = (errorCode) => {
      switch (errorCode) {
        case 2004:
          return 'El número de tarjeta es invalido.';
        case 2005:
          return 'La fecha de expiración de la tarjeta es anterior a la fecha actual.';
        case 2006:
          return 'El código de seguridad de la tarjeta (CVV2) no fue proporcionado.';
        case 2007:
          return 'El número de tarjeta es de prueba, solamente puede usarse en Sandbox.';
        case 2008:
          return 'La tarjeta no es valida para pago con puntos.';
        case 2009:
          return 'El código de seguridad de la tarjeta (CVV2) es inválido.';
        case 2010:
          return 'Autenticación 3D Secure fallida.';
        case 2011:
          return 'Tipo de tarjeta no soportada.';
        case 3001:
          return 'La tarjeta fue declinada por el banco.';
        case 3002:
          return 'La tarjeta ha expirado.';
        case 3003:
          return 'La tarjeta no tiene fondos suficientes.';
        case 3004:
          return 'La tarjeta ha sido identificada como una tarjeta robada.';
        case 3005:
          return 'La tarjeta ha sido rechazada por el sistema antifraude.';
        case 3006:
          return 'La operación no esta permitida para este cliente o esta transacción.';
        case 3009:
          return 'La tarjeta fue reportada como perdida.';
        case 3010:
          return 'El banco ha restringido la tarjeta.';
        case 3011:
          return 'El banco ha solicitado que la tarjeta sea retenida. Contacte al banco.';
        case 3012:
          return 'Se requiere solicitar al banco autorización para realizar este pago.';
        case 3201:
          return 'Comercio no autorizado para procesar pago a meses sin intereses.';
        case 3203:
          return 'Promoción no valida para este tipo de tarjetas.';
        case 3204:
          return 'El monto de la transacción es menor al mínimo permitido para la promoción.';
        case 3205:
          return 'Promoción no permitida.';
        default:
          return 'Ocurrió un error, contactar a soporte.';
      }
    };

    const setCCDates = () => {
      const dateCC = new Date();
      let yearNow = parseInt(dateCC.getFullYear().toString().substr(-2));
      let yearMax = yearNow + 6;
      $scope.anios = [];
      for (yearNow; yearNow <= yearMax; yearNow++) {
        $scope.anios.push(yearNow);
      }
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
          maker = 'HRWARE';
          break;
        case makers.HP:
          maker = 'HP';
          break;
        case makers.COMPUCAMPO:
          maker = 'Compucampo';
          break;
        case makers.AMAZONWEBSERVICES:
          maker = 'Amazon Web Services';
          break;
        case makers.IBM:
          maker = 'IBM';
          break;
        default:
          maker = null;
      }
      return maker;
    };

    $scope.calcularTotalconDescuentoAWS = function (total, descuento) {
      return total - total * descuento / 100;
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

    const orderCookie = orderIdsCookie => {
      const cookie = $cookies.putObject('orderIdsCookie', orderIdsCookie, { secure: $rootScope.secureCookie });
      const location = $location.path('/SuccessOrder');
      const resultOrderidCookie = [{cookie, location}];
      return resultOrderidCookie;
    };

    const comprarProductos = function () { // credito compusoluciones
      PedidoDetallesFactory.getComprar()
        .then(function (orderIdsCookie) {
          if (orderIdsCookie) {
            $scope.ActualizarMenu();
            orderCookie(orderIdsCookie);
          } else {
            $location.path('/Carrito');
          }
        });
    };

    const comprarPrePago = function () { // transferencia
      PedidoDetallesFactory.getComprar()
        .then(function (orderIdsCookie) {
          if (orderIdsCookie) {
            $scope.ActualizarMenu();
            orderCookie(orderIdsCookie);
          } else {
            $location.path('/Carrito');
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
            if (response.data.state === 'failed') $scope.ShowToast('Ocurrió un error al intentar confirmar la compra con Paypal. Intentalo más tarde.', 'danger');
          })
          .catch(function (response) {
            $scope.ShowToast('Ocurrió un error de tipo: "' + response.data.message + '". Contacte con soporte de Compusoluciones.', 'danger');
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
      if (order.IdEsquemaRenovacion === 2 && value === 'PrecioRenovacion') {
        total *= 12;
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

    $scope.PagarTarjeta = function () { // tarjeta de credito
      if ($scope.Distribuidor.IdFormaPagoPredilecta === 1) {


        PedidoDetallesFactory.getPrepararTarjetaCredito()
        .success(function (Datos) {
          var expireDate = new Date();
          expireDate.setTime(expireDate.getTime() + 600 * 2000); /* 20 minutos */
          $cookies.putObject('pedidosAgrupados', Datos.data['0'].pedidosAgrupados, { 'expires': expireDate, secure: $rootScope.secureCookie });
          if (Datos.data['0'].total > 0) {
            if (Datos.success) {
              if ($cookies.getObject('pedidosAgrupados')) {
                setCCDates();
                $scope.pedidos = Datos.data[0].pedidos;
                $scope.amount = Datos.data[0].total;
                $scope.currency = Datos.data[0].moneda;
                OpenPay.setId(Datos.data['0'].opId);
                OpenPay.setApiKey(Datos.data['0'].opPublic);
                OpenPay.setSandboxMode(true); //  descomentar esta linea cuando haya pruebas
                deviceSessionId = OpenPay.deviceData.setup('payment-form', 'deviceIdHiddenFieldName');
                $('#device_session_id').val(deviceSessionId);
                modalTC.style.display = 'block';
              } else {
                $scope.ShowToast('No pudimos comenzar con tu proceso de pago, favor de intentarlo una vez más.', 'danger');
              }
            } else {
              $scope.ShowToast('No pudimos comenzar con tu proceso de pago, favor de intentarlo una vez más.', 'danger');
            }
          } else {
            $scope.ShowToast('Algo salió mal con el pago con tarjeta bancaria, favor de intentarlo una vez más.', 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          const error = !data.message ? 'Ocurrió un error al procesar la solicitud. Intentalo de nuevo.' : data.message;
          $scope.ShowToast(error, 'danger');
        });
      }
    };

    $('#pay-button').on('click', function (event) {
      event.preventDefault();
      $('#pay-button').prop('disabled', true);
      OpenPay.token.extractFormAndCreate('payment-form', successCallbak, errorCallbak);
    });

    const successCallbak = function (response) {
      $('#responseDiv').html('').addClass('ocultar').removeClass('alert alert-danger');
      tokenId = response.data.id;
      console.log('token id: ', response.data.id);
      console.log('deviceSessionId: ', deviceSessionId);
      $('#token_id').val(tokenId);

      const verifyCreditCard = document.getElementById('cc-number-input').value;
      verifyCreditCard.replace(' ', '');
      console.log('Credit card: ', verifyCreditCard);
      const cardType = OpenPay.card.cardType(verifyCreditCard); // check if cc is correct
      console.log(cardType);


  //     OpenPay.token.create({
  //       "card_number":"4111111111111111",
  //       "holder_name":"Juan Perez Ramirez",
  //       "expiration_year":"20",
  //       "expiration_month":"12",
  //       "cvv2":"110",
  //       "address":{
  //          "city":"Querétaro",
  //          "line3":"Queretaro",
  //          "postal_code":"76900",
  //          "line1":"Av 5 de Febrero",
  //          "line2":"Roble 207",
  //          "state":"Queretaro",
  //          "country_code":"MX"
  //       }
  // }, onSuccess, onError);


      const charges = {
        source_id: tokenId,
        method: 'card',
        amount: $scope.amount,
        currency: $scope.currency,
        description: $scope.pedidos,
        device_session_id: deviceSessionId
      };

      PedidoDetallesFactory.pagarTarjetaOpenpay(charges)
      .then(function (response) {
        if (response.data.statusCode === 200) {
          angular.element(document.getElementById('divComprar')).scope().CreditCardPayment(response.data.content.statusCharge, response.data.content.paymentId);
        } else {
          printError(getCardError(response.data.content));
        }
      })
        .catch(function (response) {
          $scope.ShowToast('Ocurrió un error al procesar el pago. de tipo: ' + response.data.message, 'danger');
        });

    };

    const printError = (messageError) => {
      $('#responseDiv').html(messageError).removeClass('ocultar').removeClass().addClass('alert alert-danger');
    };

    const errorCallbak = function (response) {
      let desc = response.data.description != undefined ? response.data.description : response.message;
      console.log(desc);
      printError(getCardError(response.data.error_code));
      $('#pay-button').prop('disabled', false);
    };

    $scope.cerrarModal = modal => {
      document.getElementById(modal).style.display = 'none';
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
            $scope.ShowToast('Ocurrió un error al procesar el pago.', 'danger');
          }
        })
        .catch(function (response) {
          $scope.ShowToast('Ocurrió un error al procesar el pago. de tipo: ' + response.data.message, 'danger');
        });
    };

    $scope.Comprar = function () {
      angular.element(document.getElementById('auxScope')).scope().gaComprar($scope.PedidoDetalles, $scope.Distribuidor);
      if ($scope.Distribuidor.IdFormaPagoPredilecta === paymentMethods.CREDIT_CARD) $scope.PagarTarjeta();
      if ($scope.Distribuidor.IdFormaPagoPredilecta === paymentMethods.CS_CREDIT) comprarProductos();
      if ($scope.Distribuidor.IdFormaPagoPredilecta === paymentMethods.CASH) comprarPrePago();
      if ($scope.Distribuidor.IdFormaPagoPredilecta === paymentMethods.PAYPAL) $scope.prepararPaypal();
    };

    // $scope.CreditCardPayment = function (resultIndicator, sessionVersion) {
    $scope.CreditCardPayment = function (status, paymentId) {
      $scope.currentDistribuidor = $cookies.getObject('currentDistribuidor');
      if ($scope.currentDistribuidor) {
        console.log('11  $scope.CreditCardPayment   IF', $scope.currentDistribuidor);
        angular.element(document.getElementById('divComprarTuClick')).scope().ComprarConTarjetaTuClick(status, paymentId);
      } else {
        console.log('22  $scope.CreditCardPayment   ELSE', status, paymentId);
        $scope.ComprarConTarjeta(status, paymentId);
      };
    };

    $scope.ComprarConTarjeta = function (status, paymentId) {
      var datosTarjeta = { 'TarjetaResultIndicator': status, 'TarjetaSessionVersion': paymentId, 'PedidosAgrupados': $cookies.getObject('pedidosAgrupados') };
      if (datosTarjeta.PedidosAgrupados) {
        if (datosTarjeta.PedidosAgrupados[0].Renovacion) {
          console.log('333 $scope.ComprarConTarjeta', datosTarjeta.PedidosAgrupados, datosTarjeta.PedidosAgrupados[0].Renovacion);
          console.log('333 datosTarjeta ', datosTarjeta);
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
          console.log('444 datosTarjeta', datosTarjeta);
          // 5424180279791732
          PedidosFactory.putPedido(datosTarjeta)
            .success(function (putPedidoResult) {
              console.log('5555 PedidosFactory.putPedido   , result= ', putPedidoResult);
              $cookies.remove('pedidosAgrupados');
              if (putPedidoResult.success) {
                PedidoDetallesFactory.getComprar()
                  .success(function (compra) {
                    console.log('6666 PedidosFactory.putPedido   , result= ', compra);

                    if (compra) {
                      $scope.ActualizarMenu();
                      orderCookie(compra);
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

    var modal = document.getElementById('modalTipoMoneda');

    $scope.modalNotificacionComprar = function () {
      modal.style.display = 'none';
      $location.path('/Carrito');
    };
    $scope.modalNotificacionCarrito = function () {
      modal.style.display = 'none';
    };

    window.onclick = function (event) { // When the user clicks anywhere outside of the modal, close it
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    };
  };

  ComprarController.$inject = ['$scope', '$log', '$rootScope', '$location', '$cookies', 'PedidoDetallesFactory', 'TipoCambioFactory', 'PedidosFactory', 'EmpresasFactory', '$route'];

  angular.module('marketplace').controller('ComprarController', ComprarController);
}());
