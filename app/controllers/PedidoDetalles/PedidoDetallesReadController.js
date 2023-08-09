(function () {
  var PedidoDetallesReadController = function ($scope, $log, $location, $cookies, PedidoDetallesFactory, TipoCambioFactory, EmpresasXEmpresasFactory, EmpresasFactory, PedidosFactory, UsuariosFactory, $routeParams) {
    $scope.CreditoValido = 1;
    $scope.legacyCSP = 0;
    $scope.error = false;
    $scope.Distribuidor = {};
    $scope.flagAnnualMensual = '';
    $scope.flagTYC=0;
    $scope.flagLCO='';
    const ON_DEMAND = 3;
    const ELECTRONIC_SERVICE = 74;
    const CREATEORDER = 'CREATEORDER';
    const ADDSEAT = 'ADDSEAT';
    const COTERM = 'COTERM';
    const paymentMethods = {
      CREDIT_CARD: 1,
      CS_CREDIT: 2,
      PAYPAL: 3,
      PREPAY: 4,
      SPEI: 5
    };
    const makers = {
      MICROSOFT: 1,
      AUTODESK: 2,
      COMPUSOLUCIONES: 3,
      HP: 4,
      APERIO: 5,
      COMPUCAMPO: 8,
      AWS: 10,
      IBM: 11
    };

    const tipoAcceso = {
      SUPER_USUARIO: 10,
    };

    const error = function (error) {
      $scope.ShowToast(!error ? 'Ha ocurrido un error, inténtelo más tarde.' : error.message, 'danger');
      $scope.Mensaje = 'No pudimos conectarnos a la base de datos, por favor intenta de nuevo más tarde.';
    };

    const getEnterprises = function () {
      return EmpresasFactory.getEmpresas()
        .then(function (result) {
          $scope.Distribuidor = result.data[0];
          $scope.Distribuidor.MonedaPago = 'Pesos';
          EmpresasFactory.getTerminosNuevoComercio($scope.Distribuidor.IdEmpresa)
          .then (function (response){
            $scope.Distribuidor.NuevoComercioTYC = response.data.Firma;
        })
        .catch(function (result) {
          error(result.data);
          $location.path('/Productos');
        });
    });
  }

    const esquemaAzurePlan = 8;
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
        case paymentMethods.PREPAY:
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
        case makers.AWS:
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

    const getOrderDetails = function (validate) {
      return PedidoDetallesFactory.getPedidoDetalles()
        .then(function (result) {
          $scope.flagAnnualMensual = '';
          $scope.flagTYC = 0;
          $scope.flagLCO = '';
          $scope.orden = new Array(result.data.data.length);
          $scope.PedidoDetalles = result.data.data;
          if ($scope.PedidoDetalles[0].IdFormaPago === 1) validarTC();
          if ($scope.SessionCookie.IdTipoAcceso === 10) {
            const estaEnLista = $scope.usuariosCompra.filter(usuario => usuario.IdUsuario === $scope.PedidoDetalles[0].IdUsuarioCompra);
            if (estaEnLista.length > 0) {
              $scope.usuarioCompraSelect = $scope.PedidoDetalles[0].IdUsuarioCompra;
              $scope.actualizarUsuarioCompra();
            }
          }
          let contAddseatCoterm = 0;
          $scope.PedidoDetalles.forEach(function (elem) {
            $scope.CreditoValido = 1;
            let IdEsquemaRenovacion = elem.IdEsquemaRenovacion;
            elem.hasCredit = 1;
            elem.Forma = getPaymentMethods(elem.IdFormaPago);
            elem.NombreFabricante = getMakers(elem.IdFabricante);
            elem.Productos.forEach(function (item) {
              if (item.IdFabricante === 1 && elem.IdEsquemaRenovacion === 9 && elem.IdFormaPago!==2) {$scope.flagAnnualMensual +=elem.Productos[0].IdPedido +' ';}
              if (item.IdFabricante === 1 && $scope.Distribuidor.NuevoComercioTYC === 0) {$scope.flagTYC ++;}
              if (item.IdFabricante === 1 && elem.Productos[0].NumeroSerie === CREATEORDER && elem.Productos[0].validacion === 0 && IdEsquemaRenovacion !== 8 && elem.Productos[0].Academy === 0 ){$scope.flagLCO += elem.Productos[0].IdPedido +' ';}
              if (item.PrecioUnitario == null) $scope.error = true;
              if (elem.Productos[0].NumeroSerie == ADDSEAT || elem.Productos[0].NumeroSerie == COTERM) contAddseatCoterm ++;
            });
          });
          if ($scope.error) {
            $scope.ShowToast('Ocurrió un error al procesar sus productos del carrito. Favor de contactar a soporte de CompuSoluciones.', 'danger');
          }
          if (!validate) {
            $scope.ValidarFormaPago();
          }
          if ($scope.flagAnnualMensual !== '') {
            $('#btnSiguiente').prop('disabled', true);
            $scope.ShowToast('Tu carrito no se puede procesar por los siguientes pedidos: '+$scope.flagAnnualMensual+' debido que las compras con un esquema anual con facturación mensual se deben finalizar con la forma de pago de crédito.', 'danger');
           }else if ($scope.flagTYC >= 1) {
            $('#btnSiguiente').prop('disabled', true);
            $scope.ShowToast('Debes firmar los Terminos y Condiciones del Nuevo Comercio de Microsoft para continuar con tu compra', 'danger');
           }else if ($scope.flagLCO !== '') {
            $('#btnSiguiente').prop('disabled', true);
            $scope.ShowToast('Tu carrito no se puede procesar por los siguientes pedidos: '+$scope.flagLCO+' debido a politicas de Microsoft. Para poder continuar elimine dicho pedido del carrito', 'danger');
           }  else {
             $('#btnSiguiente').prop('disabled', false);
           }
           if (contAddseatCoterm >= 1) {
            document.getElementById('radioSPEI').style.display = 'none';
            document.getElementById('currencySpei').style.display = 'none';
            $scope.Distribuidor.IdFormaPagoPredilecta == paymentMethods.SPEI ? $('#btnSiguiente').prop('disabled', true) : '' ; 
          }
        })
        .then(function () {
          if ($scope.isPayingWithCSCredit()) validarCarrito();
        })
        .then(function () {
          if ($scope.isPayWithPrepaid()) CambiarMonedaPrepaid();
        })
        .catch(function (result) {
          error(result.data);
          $location.path('/Productos');
        });
    };

    const validarCarrito = function () {
      if (parseInt($scope.Distribuidor.IdFormaPagoPredilecta) === 2) {
        return PedidoDetallesFactory.getValidarCarrito()
        .then(result => {
          if (result.data.data.resellerCreditData.availableCredit <= 0) $scope.CreditoValido = 0;
          $scope.PedidoDetalles.forEach(item => {
            if ($scope.Distribuidor.IdFormaPagoPredilecta === 1 || $scope.Distribuidor.IdFormaPagoPredilecta === 4 && item.MonedaPago !== 'Pesos') {
              $scope.ShowToast('Para pagar con tarjeta bancaria o con Transferencia, es necesario que los pedidos estén en pesos MXN. Actualiza tu forma de pago o cambia de moneda en los pedidos agregándolos una vez más.', 'danger');
            }
          });
        })
        .catch(function (result) {
          error(result.data);
          $location.path('/Productos');
        });             
      }
    };

    const ActualizarFormaPago = function (IdFormaPago) {
      let empresa;
      if ($scope.SessionCookie.IdTipoAcceso === tipoAcceso.SUPER_USUARIO) {
        $scope.Distribuidor.IdFormaPagoPredilecta === paymentMethods.PAYPAL || $scope.Distribuidor.IdFormaPagoPredilecta === paymentMethods.CREDIT_CARD ?
        empresa = { IdFormaPagoPredilecta: paymentMethods.CS_CREDIT } : empresa = { IdFormaPagoPredilecta: IdFormaPago || $scope.Distribuidor.IdFormaPagoPredilecta };
      } else empresa = { IdFormaPagoPredilecta: IdFormaPago || $scope.Distribuidor.IdFormaPagoPredilecta };
      EmpresasFactory.putEmpresaFormaPago(empresa)
        .then(function (result) {
          if (result.data.success) {
            $scope.ShowToast(result.data.message, 'success');
            CambiarMoneda();
            getOrderDetails(true);
          } else $scope.ShowToast(result.data.message, 'danger');
        })
        .catch(function (result) { error(result.data); });
    };

    var CambiarMoneda = function (tipoMoneda) {
      $scope.Distribuidor.MonedaPago = tipoMoneda || 'Pesos';
      const MonedaPago = $scope.Distribuidor.MonedaPago;
      EmpresasFactory.putEmpresaCambiaMoneda({ MonedaPago })
      .then(function (result) {
        if (result.data.success) {
          $scope.ShowToast(result.data.message, 'success');
          getOrderDetails(true);
        } else $scope.ShowToast(result.data.message, 'danger');
      })
      .catch(function (result) { error(result.data); });
    };

    var CambiarMonedaPrepaid = function () {
      const MonedaPago = $scope.Distribuidor.MonedaPago;
      EmpresasFactory.putEmpresaCambiaMoneda({ MonedaPago })
      .then(function (result) {
        if (!result.data.success) {
          $scope.ShowToast(result.data.message, 'danger');
        }
      })
      .catch(function (result) { error(result.data); });
    };

    const getUsuarioCompra = () => {
      UsuariosFactory.getUsuariosAdministradores()
        .then(result => ($scope.usuariosCompra = result.data));
    };

    const actualizarOrdenesCompra = () => {
      const pedidos = $scope.PedidoDetalles.map((pedido, index) => ({
        IdPedido: pedido.IdPedido,
        IdOrdenCompra: pedido.IdOrdenCompra,
        OrdenCompra: $scope.orden[index] ? $scope.orden[index] : ($scope.orden[index] === '' ? null : pedido.OrdenCompra)
      }));
      PedidoDetallesFactory.actualizarOrdenesCompra(pedidos)
        .catch(result => { error(result.data); });
    };

    $scope.init = async () => {
      $scope.CheckCookie();
      await PedidoDetallesFactory.getPrepararCompra(0)
        .catch(function (result) { error(result.data);});
      if ($scope.SessionCookie.IdTipoAcceso === 10) getUsuarioCompra();
      getEnterprises()
        .then(getOrderDetails)
        .then(ActualizarFormaPago)
        .catch(function (result) { error(result.data); });
    };

    $scope.init();

    $scope.QuitarProducto = function (PedidoDetalle) {
      $scope.PedidoDetalles.forEach(function (order, indexOrder) {
        order.Productos.forEach(function (product, indexProduct) {
          if (product.IdPedidoDetalle === PedidoDetalle.IdPedidoDetalle) {
            $scope.PedidoDetalles[indexOrder].Productos.splice(indexProduct, 1);
          }
          if ($scope.PedidoDetalles[indexOrder].Productos.length === 0) $scope.PedidoDetalles.splice(indexOrder, 1);
        });
      });
      if (PedidoDetalle.IdFabricante !== makers.AWS) {
        return PedidoDetallesFactory.deletePedidoDetalles(PedidoDetalle.IdPedidoDetalle)
        .success(function (PedidoDetalleResult) {
          if (!PedidoDetalleResult.success) {
            $scope.ShowToast(PedidoDetalleResult.message, 'danger');
          } else {
            $scope.ActualizarMenu();
            $scope.ShowToast(PedidoDetalleResult.message, 'success');
          }
          return getOrderDetails(true);
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos quitar el producto seleccionado. Intenta de nuevo más tarde.', 'danger');
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
      } else {
        $scope.ShowToast('No pudimos quitar el producto seleccionado, corresponde a un producto de AWS.', 'danger');
      }
    };

    $scope.ValidarFormaPago = function () {
      var disabled = false;
      if ($scope.PedidoDetalles) {
        $scope.PedidoDetalles.forEach(function (order) {
          order.Productos.forEach(function (product) {
            if (product.IdTipoProducto === 3) {
              disabled = true;
            }
          });
        });
      }
      return disabled;
    };

    const hasProtectedExchangeRate = function (orderDetails) {
      return orderDetails.some(function (detail) {
        return detail.TipoCambioProtegido > 0;
      });
    };

    const isOnDemandProduct = function (product) {
      return product.IdTipoProducto === ON_DEMAND;
    };

    const detailHasOnDemandProduct = function (orderDetail) {
      const products = orderDetail.Productos;
      return products.some(isOnDemandProduct);
    };

    const containsOnDemandProduct = function (orderDetails) {
      return orderDetails.reduce(function (accumulator, currentDetail) {
        const hasOndemandProduct = detailHasOnDemandProduct(currentDetail);
        return accumulator || hasOndemandProduct;
      }, false);
    };

    const setPaymentMethod = function (paymentMethod) {
      $scope.Distribuidor.IdFormaPago = paymentMethod;
      $scope.Distribuidor.IdFormaPagoPredilecta = paymentMethod;
    };

    $scope.validateUSD = function () {
      const orderDetails = $scope.PedidoDetalles;
      if (!orderDetails) return false;
      if (hasProtectedExchangeRate(orderDetails)) return false;
      if (containsOnDemandProduct(orderDetails)) {
        setPaymentMethod(paymentMethods.CS_CREDIT);
        return false;
      }
      return true;
    };

    $scope.isPayingWithPaypal = function () {
      return Number($scope.Distribuidor.IdFormaPagoPredilecta) === paymentMethods.PAYPAL;
    };

    $scope.isPayingWithCSCredit = function () {
      const IdFormaPago = Number($scope.Distribuidor.IdFormaPagoPredilecta);
      return IdFormaPago === paymentMethods.CS_CREDIT || IdFormaPago === paymentMethods.PREPAY;
    };

    $scope.isPayingWithCreditCard = function () {
      const IdFormaPago = Number($scope.Distribuidor.IdFormaPagoPredilecta);
      return IdFormaPago === paymentMethods.CREDIT_CARD;
    };

    $scope.isPayWithPrepaid = function () {
      const IdFormaPago = Number($scope.Distribuidor.IdFormaPagoPredilecta);
      return IdFormaPago === paymentMethods.PREPAY;
    };

    $scope.isPayingWithSPEI = function () {
      const IdFormaPago = Number($scope.Distribuidor.IdFormaPagoPredilecta);
      return IdFormaPago === paymentMethods.SPEI;
    };

    $scope.hasProtectedExchangeRate = function () {
      const orderDetails = $scope.PedidoDetalles;
      if (orderDetails) return hasProtectedExchangeRate(orderDetails);
    };

    $scope.ActualizarFormaPago = ActualizarFormaPago;
    $scope.CambiarMoneda = CambiarMoneda;

    $scope.modificarContratoBase = function (IdProducto, IdPedidoDetalle) {
      $location.path('/autodesk/productos/' + IdProducto + '/detalle/' + IdPedidoDetalle);
    };

    $scope.removeRenew = function (pedido) {
      const params = {
        IdPedido: pedido.IdPedido,
        IdEmpresaUsuarioFinal: pedido.IdEmpresaUsuarioFinal
      };
      PedidoDetallesFactory.removeRenew(params)
        .then(function (result) {
          $scope.PedidoDetalles.forEach(function (order, indexOrder) {
            if (pedido.IdPedido === order.IdPedido) {
              $scope.PedidoDetalles.splice(indexOrder, 1);
              if ($scope.isPayingWithCSCredit()) validarCarrito();
            }
          });
          $scope.ActualizarMenu();
          $scope.ShowToast(result.data.message, 'success');
        })
        .catch(function (result) {
          $scope.ShowToast(result.data.message, 'danger');
        });
    };

    $scope.removeExt = function (pedido) {
      const params = {
        IdPedido: pedido.IdPedido,
        IdEmpresaUsuarioFinal: pedido.IdEmpresaUsuarioFinal
      };
      PedidoDetallesFactory.removeExt(params)
        .then(function (result) {
          $scope.PedidoDetalles.forEach(function (order, indexOrder) {
            if (pedido.IdPedido === order.IdPedido) {
              $scope.PedidoDetalles.splice(indexOrder, 1);
              if ($scope.isPayingWithCSCredit()) validarCarrito();
            }
          });
          $scope.ActualizarMenu();
          $scope.ShowToast(result.data.message, 'success');
        })
        .catch(function (result) {
          $scope.ShowToast(result.data.message, 'danger');
        });
    };

    const isTiredProduct = function (product) {
      return product.tieredPrice > 0;
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
    $scope.calcularTotalconDescuentoAWS = function (total, descuento) {
      return total - total * descuento / 100;
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

    $scope.calcularProductTotal = function (order, product, value) {
      const priceWithExchangeRate = $scope.calculatePriceWithExchangeRate(order, product, value);
      if (isTiredProduct(product)) return priceWithExchangeRate;
      return priceWithExchangeRate * product.Cantidad;
    };

    $scope.calcularProductTotalAWS = function (order, product, value) {
      const priceWithExchangeRate = $scope.calculatePriceWithExchangeRate(order, product, value);
      if (isTiredProduct(product)) return priceWithExchangeRate;
      return priceWithExchangeRate * product.Cantidad;
    };

    $scope.tipoTarjeta = (tipo, cookie) => {
      if (cookie) $cookies.putObject('tipoTarjetaCredito', tipo);
      PedidoDetallesFactory.setCreditCardType($scope.PedidoDetalles, tipo)
        .then(() => $scope.ShowToast('Tipo de tarjeta actualizada.', 'success'))
        .catch(() => $scope.ShowToast('No fue posible actualizar el usuario de compra.', 'danger'));
      if ($scope.flagAnnualMensual !== '' ||
        $scope.flagTYC >= 1 ||
        $scope.flagLCO !== '') {
        $('#btnSiguiente').prop('disabled', true);
      } else {
        $('#btnSiguiente').prop('disabled', false);
      }
    };

    const validarTC = () => {
      let tipoTarjetaCredito = $cookies.getObject('tipoTarjetaCredito');
      if (!tipoTarjetaCredito ||
        $scope.flagAnnualMensual !== '' ||
        $scope.flagTYC >= 1 ||
        $scope.flagLCO !== '') {
        $('#btnSiguiente').prop('disabled', true);
      } else {
        $scope.tipoTarjeta(tipoTarjetaCredito, false);
        $('#TC_' + tipoTarjetaCredito).prop('checked', true);
        $('#btnSiguiente').prop('disabled', false);
      }
    };

    $scope.next = function () {
      if ($scope.isPayingWithCSCredit()) validarCarrito();
      let next = true;
      if (!$scope.PedidoDetalles || $scope.PedidoDetalles.length === 0) next = false;
      else {
        $scope.PedidoDetalles.forEach(function (order) {
          PedidoDetallesFactory.idOrderComparePaymentCurrency(order)
          .then(function (result) {
            result.data.data.forEach(function (compararPedidosAnteriores) {
              if (order.MonedaPago !== compararPedidosAnteriores.MonedaPago && order.IdFabricante === 1) {
                $cookies.putObject('compararPedidosAnteriores', compararPedidosAnteriores);
                document.getElementById('modalTipoMoneda').style.display = 'block';
              }
            });
          })
          .catch(function (result) {
            $scope.ShowToast(result.data.message, 'danger');
          });
          if (!order.IdEmpresaUsuarioFinal) next = false;
          order.Productos.forEach(function (product) {
            if (product.Cantidad <= 0) next = false;
          });
        });
      }
      if (!next) {
        $scope.ShowToast('Revisa que tengas al menos un producto y que tenga un cliente seleccionado con crédito válido.', 'warning');
      } else {
        $location.path('/Comprar');
        angular.element(document.getElementById('auxScope')).scope().gaFinCompra();
      }
    };

    $scope.IniciarTourCarrito = function () {
      $scope.Tour = new Tour({

        steps: [{
          element: '.formaPago',
          placement: 'rigth',
          title: 'Forma de pago del distribuidor',
          content: 'Selecciona la forma de pago predilecta para tu empresa, esta es una configuración única para toda la compañia. Si seleccionas pago con tarjeta bancaria tendrás que tener tus pedidos en pesos MXN, si requieres pagar en dólares USD podrás utilizar crédito CompuSoluciones.',
          template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Atrás</button><button class='btn btn-default' data-role='next'>Sig »</button><button class='btn btn-default' data-role='end'>Finalizar</button></nav></div></div>"
        }],

        backdrop: true,
        storage: false
      });

      $scope.Tour.init();
      $scope.Tour.start();
    };

    $scope.actualizarUsuarioCompra = () => {
      const idPedidos = $scope.PedidoDetalles.map(pedido => pedido.IdPedido);
      const idUsuarioCompra = $scope.usuarioCompraSelect;
      PedidoDetallesFactory.actualizarUsuarioCompra(idPedidos, idUsuarioCompra)
        .then(() => $scope.ShowToast('Usuario de compra actualizado.', 'success'))
        .catch(() => $scope.ShowToast('No fue posible actualizar el usuario de compra.', 'danger'));
    };

    $scope.marcarSP = async (idPedido, marcado, promo = 0) => {
      const { IdPedido } = $scope.PedidoDetalles.find(pedido => pedido.IdPedido === idPedido)
      await PedidoDetallesFactory.marcarSP(IdPedido, marcado, promo)
    };

    $scope.abrirModal = (modal, idContrato, idEsquemaRenovacion) => {
      document.getElementById(modal).style.display = 'block';
      $scope.idContratoInicioFuturo = idContrato;
      $scope.idEsquemaRenovacion = idEsquemaRenovacion;
    };

    $scope.cerrarModal = (modal) => {
      document.getElementById(modal).style.display = 'none';
    };

    $scope.inicioFuturo = async fechaInicio => {
      PedidoDetallesFactory.actualizarFechaInicio($scope.idContratoInicioFuturo, fechaInicio, $scope.idEsquemaRenovacion)
        .then(async result => {
          if (result.data.success) {
            $scope.ShowToast( result.data.message, 'success');
            $scope.Contrato.FechaInicio = undefined;
            await getOrderDetails();
          } else {
            $scope.ShowToast(result.data.message, 'danger');
          }
        })
        .catch(() => $scope.ShowToast(result.data.message, 'danger'));
    };

    $scope.saveOrder = () => {
      actualizarOrdenesCompra();
    };
  };

  PedidoDetallesReadController.$inject = ['$scope', '$log', '$location', '$cookies', 'PedidoDetallesFactory', 'TipoCambioFactory', 'EmpresasXEmpresasFactory', 'EmpresasFactory', 'PedidosFactory', 'UsuariosFactory', '$routeParams'];

  angular.module('marketplace').controller('PedidoDetallesReadController', PedidoDetallesReadController);
}());
