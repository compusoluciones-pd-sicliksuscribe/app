(function () {
  var ComprarController = function ($scope, $log, $rootScope, $location, $cookies, PedidoDetallesFactory, UsuariosFactory, PedidosFactory, EmpresasFactory, jwtHelper, $route,ngToast) {
    $scope.currentPath = $location.path();
    $scope.PedidoDetalles = {};
    $scope.Distribuidor = {};
    const ELECTRONIC_SERVICE = 74;
    const CLICKSUSCRIBE = 2;
    $scope.error = false;
    $scope.CREDIT_CARD = 1;
    const paymentMethods = {
      CREDIT_CARD: 1,
      CS_CREDIT: 2,
      PAYPAL: 3,
      CASH: 4,
      STORE: 5
    };
    const makers = {
      MICROSOFT: 1,
      AUTODESK: 2,
      COMPUSOLUCIONES: 3,
      HP: 4,
      APERIO: 5,
      AMAZONWEBSERVICES:10
    };
    $scope.monthCard=0
    $scope.tipoMonedaCambio = $cookies.getObject('compararPedidosAnteriores');
    $scope.errorName = false;
    $scope.name = '';
    $scope.card = '';
    $scope.errorDate = '';
    $scope.year = '';
    $scope.month = '';
    $scope.session = $cookies.getObject('Session');
    $scope.anios = [{nombre:'Año',valor:'default'},{nombre:'2020',valor:20},{nombre:'2021',valor:21},{nombre:'2022',valor:22},{nombre:'2023',valor:23},{nombre:'2024',valor:24},{nombre:'2025',valor:25}];
    $scope.meses = [{nombre:'Mes',valor:'default'},{nombre:'Enero',valor: '01'},{nombre:'Febrero',valor: '02'},{nombre:'Marzo',valor: '03'},{nombre:'Abril',valor: '04'},{nombre:'Mayo',valor: '05'},{nombre:'Junio',valor: '06'},{nombre:'Julio',valor: '07'},{nombre:'Agosto',valor: '08'},{nombre:'Septiembre',valor: '09'},{nombre:'Octubre',valor: '10'},{nombre:'Noviembre',valor: '11'},{nombre:'Diciembre',valor: '12'}]

    const error = function (message) {
      $scope.ShowToast(!message ? 'Ha ocurrido un error, intentelo mas tarde.' : message, 'danger');
      $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';
    };
     $scope.ShowME = function (Mensaje, className) {
       /* className = "success", "info", "warning" or "danger"*/
       ngToast.create({
         className: className,
         content: '' + Mensaje + '',
         dismissButton: true
       });
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
          maker = 'HRWARE';
          break;
        case makers.HP:
          maker = 'HP';
          break;
        case makers.COMPUCAMPO:
          maker = 'Compucampo';
          break;
          case makers.AMAZONWEBSERVICES:
          maker ='Amazon Web Services';
          break;
        default:
          maker = null;
      }
      return maker;
    };

    const keyAntifraude = () => {
      OpenPay.setId('mgp4crl0qu5nxy0ed2af');
      OpenPay.setApiKey('pk_9f2f5b3c557045298d7df2c67fe378fe');
      if ($rootScope.sandbox) OpenPay.setSandboxMode(true);
      $scope.deviceSessionId = OpenPay.deviceData.setup("payment-form", "device_session_id");
    }

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

    const orderCookie = (orderIdsCookie) => {
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

    const comprarPrePago = async function () { // transferencia
      keyAntifraude();
      const siclikToken = await $scope.getSiclikToken();
      const openpayCustomerId = await getOpenPayCustomer(siclikToken);
      const body = {
        openpayCustomerId,
        deviceSessionId: $scope.deviceSessionId,
      }
      PedidosFactory.payWithSpeiOpenpay(body)
        .then(function (speiResult) {
          if (speiResult.data.success) {
            $scope.ActualizarMenu();
            speiResult.data.data.MetodoPago = 'Transferencia';
            orderCookie(speiResult.data);
          } else {
            $scope.ShowToast('Ocurrio un error intente más tarde.', 'danger');
            $location.path('/Carrito');
          }
        })
        .catch(function (result) {
          $scope.ShowToast('Ocurrio un error intente más tarde.', 'danger');
          $location.path('/Carrito/e');
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
        $scope.Distribuidor.IdFormaPagoPredilecta = 1;
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

    $scope.cerrarModal = modal => {
      document.getElementById(modal).style.display = 'none';
    }
    
    $("#card").keyup(function(){              
      var ta      =   $("#card");
      letras      =   ta.val().replace(/ /g, "");
      ta.val(letras)
    }); 

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
    
    $scope.PagarTarjeta = function (sourceId, openpayCustomerId, siclikToken) { // tarjeta de credito
      if ($scope.Distribuidor.IdFormaPagoPredilecta === 1) {
        keyAntifraude();
        PedidoDetallesFactory.getPrepararTarjetaCredito()
          .success(function (resultTC) {
            $scope.amount = resultTC.data[0].amount;
            $scope.currency = resultTC.data[0].currency;
          })
          .error(function (data, status, headers, config) {
            const error = !data.message ? 'Ocurrio un error al procesar la solicitud. Intentalo de nuevo.' : data.message;
            $scope.ShowToast(error, 'danger');
          });
      }
    };

    const getCardPaymentError = error => {
      switch (error) {
        case 1612:
          return 'El monto transacción esta fuera de los limites permitidos.';
        case 1618:
          return 'El número de intentos de cargo es mayor al permitido.';
        case 1623:
          return 'El número de tarjeta es invalido.';
        case 1624:
          return 'La fecha de expiración de la tarjeta es anterior a la fecha actual.';
        case 1625:
          return 'El código de seguridad de la tarjeta (CVV2) no fue proporcionado.';
        case 1626:
          return 'El número de tarjeta es de prueba, solamente puede usarse en Sandbox.';
        case 1627:
          return 'La tarjeta no es valida para pago con puntos.';        
        case 1628:
          return 'El código de seguridad de la tarjeta (CVV2) es inválido.';
        case 1629:
          return 'Autenticación 3D Secure fallida.';
        case 1630:
          return 'Tipo de tarjeta no soportada.';
        case 1631:
          return 'La tarjeta fue declinada.';
        case 1632:
          return 'La tarjeta ha expirado.';
        case 1633:
          return 'La tarjeta no tiene fondos suficientes.';
        case 1634:
          return 'La tarjeta ha sido identificada como una tarjeta robada.';
        case 1635:
          return 'La tarjeta ha sido rechazada por el sistema antifraudes.';
        case 1636:
          return 'La operación no esta permitida para este cliente o esta.';
        case 1637:
          return 'La tarjeta fue declinada.';        
        case 1638:
          return 'La tarjeta no es soportada en transacciones en línea.';
        case 1639:
          return 'La tarjeta fue reportada como perdida.';
        case 1640:
          return 'El banco ha restringido la tarjeta.';
        case 1641:
          return 'El banco ha solicitado que la tarjeta sea retenida. Contacte al banco.';
        case 1642:
          return 'Se requiere solicitar al banco autorización para realizar este pago.';
        default:
          return 'Ocurrió un error, contactar a soporte.';
      }
    }

    async function success_callbak (response) {
      const siclikToken = await $scope.getSiclikToken();
      const openpayCustomerId = await getOpenPayCustomer(siclikToken);
        const bodyRequest = {
          deviceSessionId: $scope.deviceSessionId,
          sourceId: response.data.id,
          openpayCustomerId,
        };
        PedidosFactory.payWithCardOpenpay(bodyRequest)
        .then(function (resultPayment) {
          if (resultPayment.data.success) {
            $cookies.remove('pedidosAgrupados');
            $('#modalPagoTC').modal('hide');
            $scope.cerrarModal('modalPagoTC');
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
    };

    $scope.checkErrors = errors => {
      errors.forEach(er => {
        if (er === 'holder_name is required') {
          $scope.ShowToast('El nombre es requerido', 'danger');
          printError('El nombre es requerido', 'alert-danger');
        }
        if (er === 'card_number is required') {
          printError('El número de tarjeta es requerido', 'alert-danger');
        }
        if (er === 'expiration_year expiration_month is required') {
          printError('La fecha de expiración es requerida', 'alert-danger');
        }
        if (er === 'card_number length is invalid') {
          printError('El número de su tarjeta es inválido', 'alert-danger');
        }
        if (er === 'The card number verification digit is invalid') {
          printError('El número de verificacion de su tarjeta es inválido', 'alert-danger');
        }
        if (er === 'The CVV2 security code is required') {
          printError('El código de seguridad CVV2 es requerido', ' alert-danger');
        }
        if (er === 'valid expirations months are 01 to 12') {          
          printError('Los meses de expiración válidos son de 01 a 12', ' alert-danger');
        }
        if (er === 'The expiration date has expired') {
           printError('La fecha ha expirado', ' alert-danger');
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

    const getActualSubdomain = function () {
      let subdomain = window.location.href;
      subdomain = subdomain.replace('/#/Comprar', '');
      return subdomain;
    };

    function printError (messageError, className) {
      $('#responseDiv').html(messageError).removeClass("ocultar").removeClass().addClass(`alert ${className}`)
    }

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

    const comprarEnTienda = async function() { // En tienda
      keyAntifraude();
      const siclikToken = await $scope.getSiclikToken();
      const openpayCustomerId = await getOpenPayCustomer(siclikToken);
      const body = {
        openpayCustomerId,
        deviceSessionId: $scope.deviceSessionId,
      }
      PedidosFactory.payInStore(body)
        .then(function (speiResult) {
          if (speiResult.data.success) {
            $scope.ActualizarMenu();
            speiResult.data.data.MetodoPago = 'Pago en tienda';
            orderCookie(speiResult.data);
          } else {
            $scope.ShowToast('Ocurrio un error intente más tarde.', 'danger');
            $location.path('/Carrito');
          }
        })
        .catch(function (result) {
          $scope.ShowToast('Ocurrio un error intente más tarde.', 'danger');
          $location.path('/Carrito/e');
        });
    };

    $scope.Comprar = function () {
      angular.element(document.getElementById('auxScope')).scope().gaComprar($scope.PedidoDetalles, $scope.Distribuidor);
      if ($scope.Distribuidor.IdFormaPagoPredilecta === paymentMethods.CREDIT_CARD) $scope.PagarTarjeta();
      if ($scope.Distribuidor.IdFormaPagoPredilecta === paymentMethods.CS_CREDIT) comprarProductos();
      if ($scope.Distribuidor.IdFormaPagoPredilecta === paymentMethods.CASH) comprarPrePago();
      if ($scope.Distribuidor.IdFormaPagoPredilecta === paymentMethods.STORE) comprarEnTienda();
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
              $cookies.remove('pedidosAgrupados'); // revisar
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

  ComprarController.$inject = ['$scope', '$log', '$rootScope', '$location', '$cookies', 'PedidoDetallesFactory', 'UsuariosFactory', 'PedidosFactory', 'EmpresasFactory', 'jwtHelper', '$route', 'ngToast'];

  angular.module('marketplace').controller('ComprarController', ComprarController);
}());
