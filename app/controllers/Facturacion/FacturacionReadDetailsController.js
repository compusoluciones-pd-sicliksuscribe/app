(function () {
  function FacturacionReadDetailsController ($scope, $log, $cookies, $location, $window, $uibModal, $filter, FacturacionFactory, $routeParams) {
    var IdFactura = $routeParams.IdFactura;
    var searchTimeout = {};
    var tipoDeCambioUpdated = false;

    $scope.factura = {
      receptor: {
        rfc: 'XAXX010101000',
        nombre: 'DEMO RECEPTOR'
      },
      conceptos: []
    };

    $scope.formaDePagoActual = {};
    $scope.formaDePago = [
      { id: '01', nombre: 'Efectivo' },
      { id: '03', nombre: 'Transferencia electrónica de fondos' },
      { id: '04', nombre: 'Tarjeta de crédito' },
      { id: '28', nombre: 'Tarjeta de débito' },
      { id: '29', nombre: 'Tarjeta de servicios' },
      { id: '99', nombre: 'Por definir' }
    ];

    $scope.importeInvalido = false;
    $scope.concepto = {};

    $scope.cobro = {
      subtotal: 0,
      iva: 0,
      total: 0
    };

    $scope.catMonedaPago = ['Pesos', 'Dólares'];
    $scope.tipoCambio = '';
    $scope.monedaPago = 'Pesos';

    $scope.editTipoDeCambio = function () {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(updateTipoDeCambio, 1000);
      tipoDeCambioUpdated = false;
    };

    function updateTipoDeCambio () {
      $scope.changeTipoDeCambio();
    };

    $scope.changeTipoDeCambio = function () {
      if (tipoDeCambioUpdated) {
        return;
      }
      var factura = { IdFactura: IdFactura, TipoCambio: $scope.tipoCambio };
      FacturacionFactory.updateExtras(factura)
        .success(function (result) {
          if (result.success === 1) {
            $scope.ShowToast('Tipo de cambio Actualizado.', 'success');
            tipoDeCambioUpdated = true;
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.changeMonedaPago = function () {
      var factura = { IdFactura: IdFactura, MonedaPago: $scope.monedaPago, TipoCambio: $scope.tipoCambio, FormaDePago: $scope.formaDePagoActual.id };
      FacturacionFactory.updateExtras(factura)
        .success(function (result) {
          if (result.success === 1) {
            $scope.factura.conceptos = $scope.factura.conceptos.map(function (concepto) {
              if ($scope.monedaPago === 'Pesos') {
                concepto.precio = (concepto.precioOrigianl * $scope.tipoCambio);
                concepto.precioOrigianl = (concepto.precioOrigianl * $scope.tipoCambio);
              } else {
                concepto.precio = (concepto.precioOrigianl / $scope.tipoCambio);
                concepto.precioOrigianl = (concepto.precioOrigianl / $scope.tipoCambio);
              }
              concepto.precio = Number(concepto.precio.toFixed(2));
              return concepto;
            });
            $scope.calculaPrecios();
            $scope.factura.conceptos.forEach(function (concepto) {
              $scope.editarConcepto(concepto.id);
            });
            $scope.ShowToast('Moneda de pago Actualizada.', 'success');
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.changeFormaPago = function () {
      var factura = { IdFactura: IdFactura, FormaDePago: $scope.formaDePagoActual.id };
      FacturacionFactory.updateExtras(factura)
        .success(function (result) {
          if (result.success === 1) {
            $scope.ShowToast('Forma de pago Actualizada.', 'success');
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.calculaPrecios = function () {
      $scope.factura.conceptos.map(function (c, i) {
        c.id = i;
        c.total = (c.precio * c.cantidad).toFixed(2);
        return c;
      });
      var subtotal = $scope.factura.conceptos.reduce(function (subTotal, concepto) {
        return subTotal + +concepto.total;
      }, 0).toFixed(2);
      var iva = (subtotal * 0.16).toFixed(2);
      $scope.cobro = {
        subtotal: subtotal,
        iva: iva,
        total: (+subtotal + +iva).toFixed(2)
      };
      validaImporte();
    };

    function validaImporte () {
      $scope.importeInvalido = $scope.factura.conceptos.some(function (concepto) {
        return concepto.total <= 0;
      });
    }

    $scope.borraConcepto = function (id) {
      var IdFacturaDetalle = $scope.factura.conceptos[id].IdFacturaDetalle;
      FacturacionFactory.deleteBill(IdFacturaDetalle)
        .success(function (result) {
          if (result.success === 1) {
            $scope.factura.conceptos = $scope.factura.conceptos.filter(function (v, i) {
              return i !== id;
            });
            $scope.calculaPrecios();
          } else {
            $scope.ShowToast('Problemas de conexión con el servicio, intenta más tarde. (borrarConcepto)', 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.calculaConcepto = function () {
      if (!$scope.concepto.precio || Number.isNaN($scope.concepto.precio)) {
        $scope.concepto.precio = 0;
      }
      if (!$scope.concepto.cantidad) {
        $scope.concepto.cantidad = 0;
      }
      $scope.concepto.total = ($scope.concepto.precio * $scope.concepto.cantidad).toFixed(2);
    };

    $scope.agregaConcepto = function () {
      if (!$scope.concepto.descripcion || !$scope.concepto.cantidad) {
        $scope.ShowToast('Verifica la descripcion y/o cantidad del concepto.', 'danger');
        return;
      }
      var nuevoConcepto = {
        PrecioUnitario: $scope.concepto.precio,
        IdFactura: IdFactura,
        Cantidad: $scope.concepto.cantidad,
        NombreProducto: $scope.concepto.descripcion,
        MonedaPrecio: 'Pesos'
      };
      FacturacionFactory.createBill(nuevoConcepto)
        .success(function (result) {
          if (result.success === 1) {
            $scope.concepto.precioOrigianl = $scope.concepto.precio;
            $scope.factura.conceptos.push($scope.concepto);
            $scope.concepto = {};
            $scope.calculaPrecios();
            $scope.ShowToast('Concepto agregado.', 'success');
            init();
          } else {
            $scope.ShowToast('Problemas de conexión con el servicio, intenta más tarde. (createBill)', 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.cancelarFactura = function () {
      FacturacionFactory.cancelBill(IdFactura)
      .success(function (resultado) {
        if (resultado.success === 1) {
          $scope.ShowToast('Cancelado para facturar', 'success');
          $location.path('/facturas-pendientes/');
        } else {
          $scope.ShowToast('Problemas de conexión con el servicio, intenta más tarde. (cancelBill)', 'danger');
        }
      })
      .error(function (data, status, headers, config) {
        $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
      });
    };

    $scope.activarFactura = function () {
      var obj = { IdFactura: IdFactura, IdEstatusFactura: '1' };
      var conceptoActivado = Object.assign({}, obj);
      FacturacionFactory.activateBill(conceptoActivado)
        .success(function (resultado) {
          if (resultado.success === 1) {
            $scope.ShowToast('Concepto Actualizado.', 'success');
            $location.path('/facturas-pendientes/');
          } else {
            $scope.ShowToast('Problemas de conexión con el servicio, intenta más tarde. (activateBill)', 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.editarConcepto = function (id) {
      var conceptoEditado = Object.assign({}, $scope.factura.conceptos[id]);
      if (conceptoEditado.cantidad <= 0 || conceptoEditado.descripcion === '') {
        $scope.ShowToast('Verifica la descripción y/o cantidad del concepto.', 'danger');
        return;
      }
      conceptoEditado.Cantidad = conceptoEditado.cantidad;
      conceptoEditado.PrecioUnitario = conceptoEditado.precio;
      conceptoEditado.NombreProducto = conceptoEditado.descripcion;
      delete conceptoEditado.descripcion;
      delete conceptoEditado.precioOrigianl;
      delete conceptoEditado.cantidad;
      delete conceptoEditado.precio;
      delete conceptoEditado.$$hashKey;
      delete conceptoEditado.id;
      delete conceptoEditado.total;
      delete conceptoEditado.IdPedido;
      delete conceptoEditado.IdProducto;
      delete conceptoEditado.urlXML;
      delete conceptoEditado.urlPDF;
      delete conceptoEditado.FechaActivo;
      FacturacionFactory.updateBill(conceptoEditado)
        .success(function (resultado) {
          if (resultado.success === 1) {
            $scope.ShowToast('Concepto Actualizado.', 'success');
          } else {
            $scope.ShowToast('Problemas de conexión con el servicio, intenta más tarde. (updateBill)', 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.regresar = function () {
      $location.path('/facturas-pendientes');
    };
    $scope.pdf = function () {
      $window.open($scope.factura.conceptos[0].urlPDF);
    };
    $scope.xml = function () {
      $window.open($scope.factura.conceptos[0].urlXML);
    };

    function init () {
      FacturacionFactory.selectBillsDetails(IdFactura)
        .success(function (result) {
          if (result.message === 'IdFactura incorrecta') {
            $location.path('/facturas-pendientes');
          }
          if (result.data.length === 0) {
            return;
          }
          var conceptos = result.data.map(function (concepto) {
            concepto.cantidad = concepto.Cantidad;
            concepto.precio = concepto.PrecioUnitario;
            concepto.descripcion = concepto.NombreProducto;
            concepto.urlXML = concepto.UrlFactura;
            concepto.urlPDF = concepto.UrlPDF;
            concepto.precioOrigianl = concepto.precio;
            delete concepto.NombreProducto;
            delete concepto.Cantidad;
            delete concepto.PrecioUnitario;
            delete concepto.UrlFactura;
            delete concepto.UrlPDF;
            delete concepto.FechaActivo;
            return concepto;
          });
          if (result.success === 1) {
            $scope.factura.conceptos = conceptos;
            $scope.calculaPrecios();
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
      FacturacionFactory.getReceptor(IdFactura)
        .success(function (result) {
          if (result.data.length === 0) {
            return;
          }
          if (result.success === 1) {
            var data = result.data[0];
            $scope.factura.receptor.rfc = data.RFC;
            $scope.factura.receptor.IdEstatusFactura = data.IdEstatusFactura;
            $scope.factura.receptor.nombre = data.Nombre;
            $scope.tipoCambio = data.TipoCambio;
            $scope.monedaPago = data.MonedaPago;
            $scope.formaDePagoActual = $scope.formaDePago.filter(function (val) {
              return val.id === data.FormaDePago;
            }).pop();
          } else {
            $scope.ShowToast('Problemas de conexión con el servicio, intenta más tarde. (getReceptor)', 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    }

    $scope.timbrarFactura = function () {
      FacturacionFactory.ringById(IdFactura)
        .success(function (result) {
          if (result.success === 1) {
            $scope.ShowToast('Factura timbrada.', 'success');
           // $location.path('/facturas-pendientes/');
            init();
          } else {
            $scope.ShowToast('Problemas de conexión con el servicio, intenta más tarde. (timbrarFactura)', 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    init();
  };
  FacturacionReadDetailsController.$inject = ['$scope', '$log', '$cookies', '$location', '$window', '$uibModal', '$filter', 'FacturacionFactory', '$routeParams'];

  angular.module('marketplace').controller('FacturacionReadDetailsController', FacturacionReadDetailsController);
}());
