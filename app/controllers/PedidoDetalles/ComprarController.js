(function () {
  var ComprarController = function ($scope, $log, $rootScope, $location, $cookies, PedidoDetallesFactory, TipoCambioFactory, PedidosFactory, EmpresasFactory, $route) {
    $scope.Session = $cookies.getObject('Session');
    $scope.currentPath = $location.path();
    $scope.PedidoDetalles = {};
    $scope.Distribuidor = {};
    $scope.creditCardType = 0;
    $scope.error = false;
    let creditCardName = '';
    const ccVisaMcLength = 16;
    const ccAmexLength = 15;
    const ELECTRONIC_SERVICE = 74;
    const ccLengthNameMin = 5;
    const ccLengthNameMax = 80;
    const paymentMethods = {
      CREDIT_CARD: 1,
      CS_CREDIT: 2,
      PAYPAL: 3,
      CASH: 4,
      SPEI: 5
    };
    const creditCardNames = {
      VISA: 'Visa',
      MASTERCARD: 'Mastercard',
      AMEX: 'American Express'
    };
    const creditCardTypes = {
      VISA: 1,
      MASTERCARD: 1,
      AMEX: 2,
      OTRO: 3
    };
    $scope.CarritoSpei = 'Carrito';
    const makers = {
      MICROSOFT: 1,
      AUTODESK: 2,
      COMPUSOLUCIONES: 3,
      HP: 4,
      APERIO: 5,
      AMAZONWEBSERVICES: 10,
      IBM: 11
    };
    $scope.tipoMonedaCambio = $cookies.getObject('compararPedidosAnteriores');
    let modalTC = document.getElementById('modalPagoTC');
    const error = function (message) {
      $scope.ShowToast(!message ? 'Ha ocurrido un error, inténtelo más tarde.' : message, 'danger');
      $scope.Mensaje = 'No pudimos conectarnos a la base de datos, por favor intenta de nuevo más tarde.';
    };

    const stars = [
      document.querySelector('#str1'),
      document.querySelector('#str2'),
      document.querySelector('#str3'),
      document.querySelector('#str4'),
      document.querySelector('#str5'),
    ];
    
    let calificacion = null;
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth() + 1;
    const añoActual = fechaActual.getFullYear();
    const finDeAño = mesActual === 12;

    $scope.ratingClick = event => {
      const starIndex = stars.indexOf(event.target);
      calificacion = starIndex + 1;
      stars.forEach(() => { 
        for (let i = 0; i <= starIndex; i++) {
          stars[i].classList.add('checked');
        }
        for (let i = starIndex + 1; i < stars.length; i++) {
          stars[i].classList.remove('checked');
        }
      })
    }

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
        case paymentMethods.SPEI:
          paymentMethod = 'SPEI';
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
        case 1001:
          return 'El número de tarjeta debería de tener 3 dígitos (4 si es American Express).';
        case 2004:
          return 'El número de tarjeta es inválido.';
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
          return 'La tarjeta ha sido rechazada.';
        case 3005:
          return 'La tarjeta fue declinada por el banco.';
        case 3006:
          return 'La operación no esta permitida para este cliente o esta transacción.';
        case 3009:
          return 'La tarjeta fue reportada como perdida.';
        case 3010:
          return 'La tarjeta fue declinada por el banco.';
        case 3011:
          return 'La tarjeta fue declinada por el banco. Contacte al banco.';
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
        case 4013:
          return 'El monto de transacción está fuera de los límites permitidos.';
        default:
          return 'Ocurrió un error, contactar a soporte.';
      }
    };

    const setCCDates = () => {
      const dateCC = new Date();
      let yearNow = parseInt(dateCC.getFullYear().toString().substr(-2));
      let yearMax = yearNow + 10;
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
      const resultOrderidCookie = [{ cookie, location }];
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

    $scope.PagarTarjeta = function () {
      if ($scope.Distribuidor.IdFormaPagoPredilecta === 1) {
        if (!$cookies.getObject('tipoTarjetaCredito')) {
          $scope.ShowToast('No pudimos verificar tu método de pago, favor de intentarlo una vez más.', 'danger');
          $scope.back();
        }
        $cookies.getObject('tipoTarjetaCredito') === 1 ? creditCardName = 'Visa/Mastercard' : creditCardName = 'American Express';
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
                  $scope.FormatedAmount = String(Datos.data[0].total).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1,');
                  $scope.currency = Datos.data[0].moneda;
                  OpenPay.setId(Datos.data['0'].opId);
                  OpenPay.setApiKey(Datos.data['0'].opPublic);
                  OpenPay.setSandboxMode(false);
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
      const creditCardNumber = document.getElementById('cc-number-input').value;
      const creditCardFormated = creditCardNumber.split(' ').join('');
      const holderName = document.getElementById('cc-name-input').value;
      let holderNameFormated = holderName.replace(/  +/g, ' ');
      if (holderNameFormated[0] == ' ') holderNameFormated = holderNameFormated.substring(1);
      const ccexpmonth = document.getElementById('ccexpmonth').value;
      const ccexpyear = document.getElementById('ccexpyear').value;
      const cvv = document.getElementById('cvv').value;
      const cardType = OpenPay.card.cardType(creditCardFormated);
      document.getElementById('cc-name-input').value = holderNameFormated;
      switch (cardType) {
        case creditCardNames.VISA:
          $scope.creditCardType = creditCardTypes.VISA;
          break;
        case creditCardNames.MASTERCARD:
          $scope.creditCardType = creditCardTypes.MASTERCARD;
          break;
        case creditCardNames.AMEX:
          $scope.creditCardType = creditCardTypes.AMEX;
          break;
        default:
          $scope.creditCardType = creditCardTypes.OTRO;
      }

      const validateCreditCard = () => {
        event.preventDefault();
        $('#pay-button').prop('disabled', true);
        OpenPay.token.create({
          'card_number': creditCardFormated,
          'holder_name': holderName,
          'expiration_year': ccexpyear,
          'expiration_month': ccexpmonth,
          'cvv2': cvv
        }, successCallbak, errorCallbak);
      };

      if (holderName.replace(/ /g, '').length < ccLengthNameMin) {
        printError('El nombre del titular debe contar con 5 o más caracteres.');
      } else {
        if (holderName.replace(/ /g, '').length > ccLengthNameMax) {
          printError('El nombre del titular es demasiado largo (máximo 80 caracteres).');
        } else {
          if (creditCardFormated.replace(/ /g, '').length !== ccVisaMcLength && creditCardFormated.trim().length !== ccAmexLength) {
            printError(`Los dígitos de tu tarjeta <b>${creditCardName}</b> están incompletos, verificalos.`);
          } else {
            if ($scope.creditCardType !== $cookies.getObject('tipoTarjetaCredito')) {
              printError(`El tipo de tarjeta no es válido y no concuerda con el tipo seleccionado anteriormente (<b>${creditCardName}</b>), favor de actualizar tu información.`);
            } else {
              if ($scope.creditCardType === creditCardTypes.VISA || $scope.creditCardType === creditCardTypes.MASTERCARD) {
                if (creditCardFormated.length !== ccVisaMcLength) {
                  printError(`El tipo de tarjetas <b>${cardType}</b> debería contar con 16 dígitos.`);
                } else {
                  validateCreditCard();
                }
              } else if ($scope.creditCardType === creditCardTypes.AMEX) {
                if (creditCardFormated.length !== ccAmexLength) {
                  printError(`El tipo de tarjetas <b>${cardType}</b> debería contar con 15 dígitos.`);
                } else {
                  validateCreditCard();
                }
              }
            }
          }
        }
      }
    });
    
    const successCallbak = function (response) {
      $('#responseDiv').html('').addClass('ocultar').removeClass('alert alert-danger');
      tokenId = response.data.id;
      $('#token_id').val(tokenId);
      const desctriptionOrders = $cookies.getObject('pedidosAgrupados').map(function (pedido) {
        return pedido.IdPedido;
      });
      const charges = {
        source_id: tokenId,
        amount: $scope.amount,
        currency: $scope.currency,
        description: `(${$cookies.getObject('tipoTarjetaCredito')})Carrito: ${desctriptionOrders.toString()}`,
        device_session_id: deviceSessionId,
        pedidosAgrupados: $cookies.getObject('pedidosAgrupados')
      };
      PedidoDetallesFactory.pagarTarjetaOpenpay(charges)
        .then(function (response) {
          if (response.data.statusCode === 200) {
            if (response.data.content.statusCharge == 'charge_pending') {
              $cookies.remove('paymentId');
              $cookies.putObject('paymentId', response.data.content.paymentId);
              window.location.href = response.data.content.redirect_url;
            } else {
              angular.element(document.getElementById('divComprar')).scope().CreditCardPayment(response.data.content.statusCharge, response.data.content.paymentId);
            }
          } else {
            printError(response.data.message);
          }
        })
        .catch(function (response) {
          $scope.ShowToast('Ocurrió un error al procesar el pago. de tipo: ' + response.data.message, 'danger');
        });
    };

    $scope.btnTdc = (statusCharge, paymentId) => {
      angular.element(document.getElementById('divComprar')).scope().CreditCardPayment(statusCharge, paymentId);
    };

    const printError = (messageError) => {
      $('#responseDiv').html(messageError).removeClass('ocultar').removeClass().addClass('alert alert-danger');
      $('#pay-button').prop('disabled', false);
    };

    const errorCallbak = function (response) {
      let desc = response.data.error_code != undefined ?
        response.data.error_code : response.message;
      printError(getCardError(response.data.error_code));
    };

    $scope.abrirModal = async modal => {
      if (modal !== 'modalCalificacion') document.getElementById(modal).style.display = 'block';
      else {
        PedidoDetallesFactory.verificarEstatusDeRespuesta(parseInt($scope.Session.IdUsuario))
        .then(response => {
          const fecha = response.data.content;
          if (fecha.length === 0 || fecha[0]?.Año < añoActual || fecha[0]?.Año === añoActual && fecha[0]?.MesPendiente <= mesActual) {
            document.getElementById(modal).style.display = 'block';
          }
        })
      }
    };

    $scope.guardarCalificacion = () => (
      PedidoDetallesFactory.guardarCalificacion($scope.Session.IdUsuario, calificacion, $scope.ratingComentary),
      PedidoDetallesFactory.ActualizarEstatusDeRespuesta($scope.Session.IdUsuario, finDeAño ? 1 : mesActual + 1, finDeAño ? añoActual + 1 : añoActual)
    .then(result => {
      if (result.data.success) {
        $scope.ShowToast('Hemos recibido su comentario, muchas gracias.', 'success');
      } else {
        $scope.ShowToast(result.data.message, 'No se ha podido guardar la información')
      }
    })
  )

  $scope.cerrarModal = modal => {
    if (modal === 'modalCalificacion' && calificacion === null) {
      $scope.ShowToast('Por favor ingrese una calificación', 'warning');
    }
    else {
      if (modal === 'modalCalificacion') $scope.guardarCalificacion();
      document.getElementById(modal).style.display = 'none';
      $scope.ClearToast();
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
            $scope.ShowToast('Ocurrió un error al procesar el pago.', 'danger');
          }
        })
        .catch(function (response) {
          $scope.ShowToast('Ocurrió un error al procesar el pago, de tipo: ' + response.data.message, 'danger');
        });
    };

    $scope.comprarSPEI = function () {
      $scope.abrirModal('modalCalificacion');
      PedidoDetallesFactory.getPrepararSPEI()
        .success(function (Datos) {
          $cookies.putObject('pedidosAgrupados', Datos.data['0'].pedidosAgrupados, { secure: $rootScope.secureCookie });

          const desctriptionOrders = $cookies.getObject('pedidosAgrupados').map(function (pedido) {
            return pedido.IdPedido;
          });

          $scope.pedidos = Datos.data[0].pedidos;
          $scope.amount = Datos.data[0].total;
          $scope.FormatedAmount = String(Datos.data[0].total).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1,');
          $scope.currency = Datos.data[0].moneda;
          OpenPay.setId(Datos.data['0'].opId);
          OpenPay.setApiKey(Datos.data['0'].opPublic);
          OpenPay.setSandboxMode(false);
          const charges = {
            amount: $scope.amount,
            currency: $scope.currency,
            description: `Carrito: ${desctriptionOrders.toString()}`,
            pedidosAgrupados: $cookies.getObject('pedidosAgrupados'),
            idCarrito: $scope.pedidos,
            from: $scope.CarritoSpei
          };
          PedidoDetallesFactory.getgenerarPdfSPEI(charges)
            .success(function (pdfRes) {
              date = new Date(pdfRes.fechaCreacion);
              const dateSpei = new Date(pdfRes.fechaCreacion).getFullYear()+'-' + (date.getMonth()+1) + '-'+date.getDate();
              const timeSpei = new Date(date).toLocaleTimeString();
              let amount = $scope.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
              let divPdfSPEI = document.getElementById('pdfSPEI');
              divPdfSPEI.style.display = 'block';
              divPdfSPEI.innerHTML = `
                    <div class="row tituloSpei text-center">
                    <h2>Información de pago (SPEI)</h2>
                </div>
                <div class="row pt-5">
                    <div class="col-sm-6">
                        <p>
                          <b>Fecha y Hora:</b>
                          <br>
                          <span>${dateSpei} ${timeSpei}</span>
                        </p>
            
                        <p>
                            <b>Descripción de compra:</b>
                            <br>
                            <span>${pdfRes.descripcion}</span>
                        </p>
                    </div>
                    
                    <div class="col-sm-6 text-center montoSpei">
                        <div class="total">
                            <p><b>Total a pagar / MXN</b></p>
                            <span class="montoTotalSpei">$ ${amount}</span>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <p>
                        <h3 class="specialBlueText"><b>Como pagar</b></h3>
                    </p>

                    <div class="col-sm-6">
                        <p><b>Desde BBVA</b></p>
                        <p>
                            1. Dentro del menú de "Pagar" seleccione la opción
                            "De Servicios" e ingrese el siguiente "Número de
                            convenio CIE"
                        </p>
                        <p>
                            <b>Número de convenio CIE:</b> <span>${pdfRes.payment_method.agreement}</span>
                        </p>
                        <p>
                            2. Ingrese los datos de registro para concluir con la operación
                        </p>
                        <p>
                            <b>Referencia:</b> <span>${pdfRes.payment_method.name}</span>
                        </p>
                        <p>
                            <b>Importe:</b> <span>$ ${amount} ${pdfRes.moneda}</span>
                        </p>
                        <p>
                            <b>Concepto:</b> <span>${pdfRes.descripcion}</span>
                        </p>
                    </div>

                    <div class="col-sm-6 pagoNormal">
                        <p><b>Desde cualquier otro banco</b></p>
                        <p>
                            1. Ingresa a la sección de transferencias y pagos o
                            pagos a otros bancos y proporciona los datos de
                            la transferencia:
                        </p>
                        <p>
                            <b>Beneficiario:</b> <span>Click suscribe</span>
                        </p>
                        <p>
                            <b>Banco destino:</b> <span>BBVA Bancomer</span>
                        </p>
                        <p>
                            <b>Clabe:</b> <span>${pdfRes.payment_method.clabe}</span>
                        </p>
                        <p>
                            <b>Concepto de pago:</b> <span>${pdfRes.payment_method.name}</span>
                        </p>
                        <p>
                            <b>Referencia:</b> <span>${pdfRes.payment_method.agreement}</span>
                        </p>
                        <p>
                            <b>Importe:</b> <span>$${amount} ${pdfRes.moneda}</span>
                        </p>
                    </div>
                </div><!--
                <div class="row pt-5">
                    <span class="avisoInfo">
                        <i>Si tienes dudas comunicate a pruebas openpay al teléfono (331) 281-5145 o al correo pruebas.openpaycs@gmail.com</i>
                    </span>
                </div>-->
                <div class="row text-center pt-5 mt-5">
                    <p class="text-success">
                        <i>Para guardar el formato en PDF da click en el boton "Generar PDF", donde se abrirá una nueva ventana para su impresión o descarga.</i>
                    </p>
                    <button type="button" onclick="window.open('${pdfRes.ligaPDF}', 'Descargar_Comprobante_de_Pago')" class="btn btn-success btnRounded mt-0">Generar PDF</button>
                </div>`;
              document.getElementById('btnGenSpei').style.display = 'none';
              document.getElementById('divPedidos').style.display = 'none';
            })
            .error(function (data, status, headers, config) {
              const error = !data.message ? 'Ocurrió un error al procesar la solicitud. Intentalo de nuevo.' : data.message;
              $scope.ShowToast(error, 'danger');
            });
        })
        .error(function (data, status, headers, config) {
          const error = !data.message ? 'Ocurrió un error al procesar la solicitud. Intentalo de nuevo.' : data.message;
          $scope.ShowToast(error, 'danger');
        });


    }

    $scope.Comprar = function () {
      angular.element(document.getElementById('auxScope')).scope().gaComprar($scope.PedidoDetalles, $scope.Distribuidor);
      if ($scope.Distribuidor.IdFormaPagoPredilecta === paymentMethods.CREDIT_CARD) $scope.PagarTarjeta();
      if ($scope.Distribuidor.IdFormaPagoPredilecta === paymentMethods.CS_CREDIT) comprarProductos();
      if ($scope.Distribuidor.IdFormaPagoPredilecta === paymentMethods.CASH) comprarPrePago();
      if ($scope.Distribuidor.IdFormaPagoPredilecta === paymentMethods.PAYPAL) $scope.prepararPaypal();
      if ($scope.Distribuidor.IdFormaPagoPredilecta === paymentMethods.SPEI) $scope.comprarSPEI();
    };

    $scope.CreditCardPayment = function (status, paymentId) {
      $scope.currentDistribuidor = $cookies.getObject('currentDistribuidor');
      if ($scope.currentDistribuidor) {
        angular.element(document.getElementById('divComprarTuClick')).scope().ComprarConTarjetaTuClick(status, paymentId);
      } else {
        $scope.ComprarConTarjeta(status, paymentId);
      };
    };

    $scope.ComprarConTarjeta = function (status, paymentId) {
      var datosTarjeta = { 'TarjetaResultIndicator': paymentId, 'TarjetaSessionVersion': status, 'PedidosAgrupados': $cookies.getObject('pedidosAgrupados') };
      if (datosTarjeta.PedidosAgrupados) {
        if (datosTarjeta.PedidosAgrupados[0].Renovacion) {
          PedidosFactory.patchPaymentInformation(datosTarjeta)
            .success(function (compra) {
              $cookies.remove('pedidosAgrupados');
              if (compra.success === 1) {
                let modalPagado = document.getElementById('modalTdcpagado');
                modalPagado.style.display = 'block';
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

    window.onclick = function (event) {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    };

    let globalNumber = 0;
    let maxlengthNumber = 17;
    function _getcaret(input) {
        if ('selectionStart' in input) {
            return input.selectionStart;
        } else if (document.selection) {
            input.focus();
            let sel = document.selection.createRange();
            let selLen = document.selection.createRange().text.length;
            sel.moveStart('character', -input.value.length);
            return sel.text.length - selLen;
        }
    }
    function _setcaret(input, pos) {
        if (input.setSelectionRange) {
            input.focus()
            input.setSelectionRange(pos, pos)
        } else if (input.createTextRange) {
            let range = input.createTextRange();
            range.move('character', pos);
            range.select();
        }
    }

    function _format_465(cc) {
        return [cc.substring(0, 4), cc.substring(4, 10), cc.substring(10, 15)].join(' ').trim()
    }
    function _format_4444(cc) {
        return cc ? cc.match(/[0-9]{1,4}/g).join(' ') : ''
    }
    _CARD_TYPES = [
        { 'type': 'visa', 'pattern': /^4/, 'format': _format_4444, 'maxlength': 16 },
        { 'type': 'master', 'pattern': /^(5[12345])|(2[2-7])/, 'format': _format_4444, 'maxlength': 16 },
        { 'type': 'amex', 'pattern': /^3[47]/, 'format': _format_465, 'maxlength': 15 },
    ]
    function _format_cardnumber(cc, maxlength) {
        cc = cc.replace(/[^0-9]+/g, '')

        for (let i in _CARD_TYPES) {
            const ct = _CARD_TYPES[i]
            if (cc.match(ct.pattern)) {
                cc = cc.substring(0, ct.maxlength)
                return ct.format(cc)
            }
        }

        return _format_4444(cc)
    }

    function _set_creditcard_number(event) {
        const input = event.target
        const maxlength = input.getAttribute('maxlength')
        let oldval = input.value
        let caret_position = _getcaret(input)
        let before_caret = oldval.substring(0,caret_position)
        before_caret = _format_cardnumber(before_caret)
        caret_position = before_caret.length;
        let newNumber = oldval.replace(/ /g,'');
        if(newNumber.length >= maxlengthNumber) {
            return input.value = globalNumber;
        }else {
            let newvalue = _format_cardnumber(oldval, maxlength);
            globalNumber = newvalue;
            if(oldval==newvalue) return
            input.value = newvalue
            _setcaret(input, caret_position)
        }
    }

    function make_credit_card_input(input) {
        input.addEventListener('input',_set_creditcard_number)
        input.addEventListener('keyup',_set_creditcard_number)
        input.addEventListener('keydown',_set_creditcard_number)
        input.addEventListener('keypress',_set_creditcard_number)
        input.addEventListener('change',_set_creditcard_number)
    }

    make_credit_card_input(document.getElementById("cc-number-input"));

  };

  ComprarController.$inject = ['$scope', '$log', '$rootScope', '$location', '$cookies', 'PedidoDetallesFactory', 'TipoCambioFactory', 'PedidosFactory', 'EmpresasFactory', '$route'];

  angular.module('marketplace').controller('ComprarController', ComprarController);
}());
