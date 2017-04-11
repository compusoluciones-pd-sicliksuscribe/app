(function () {
  var PedidoDetallesReadController = function ($scope, $log, $location, $cookieStore, PedidoDetallesFactory, TipoCambioFactory, EmpresasXEmpresasFactory, EmpresasFactory, PedidosFactory, $routeParams) {
    $scope.CreditoValido = 1;
    $scope.Distribuidor = {};
    var error = $routeParams.error;

    $scope.validarCarrito = function () {
      PedidoDetallesFactory.getValidarCarrito()
        .success(function (validacion) {
          if (validacion.success === 1) {
            for (var j = 0; j < $scope.PedidoDetalles.length; j++) {
              if ($scope.Distribuidor.IdFormaPagoPredilecta === 1 && $scope.PedidoDetalles[j].MonedaPago !== 'Pesos') {
                $scope.ShowToast('Para pagar con tarjeta bancaria es necesario que los pedidos estén en pesos MXN. Actualiza tu forma de pago o cambia de moneda en los pedidos agregándolos una vez más.', 'danger');
              }

              $scope.CreditoValido = 1;
              $scope.PedidoDetalles[j].TieneCredito = 1;

              for (var i = 0; i < validacion.data[0].length; i++) {
                if ($scope.PedidoDetalles[j].IdEmpresaUsuarioFinal === validacion.data[0][i].IdEmpresaUsuarioFinal && validacion.data[0][i].TieneCredito === 0) {
                  $scope.CreditoValido = 0;
                  $scope.PedidoDetalles[j].TieneCredito = 0;
                }
              }
            }
          } else {
            $scope.ShowToast('No pudimos validar tu carrito de compras, por favor intenta de nuevo.', 'danger');
            $location.path('/Productos');
          }
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos validar tu carrito de compras, por favor intenta de nuevo.', 'danger');
          $location.path('/Productos');
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.init = function () {
      $scope.CheckCookie();
      PedidoDetallesFactory.getPrepararCompra(false)
        .success(function (PedidoDetalles) {
          PedidoDetallesFactory.getPedidoDetalles()
            .success(function (PedidoDetalles) {
              if (PedidoDetalles.success === 1) {
                $scope.PedidoDetalles = PedidoDetalles.data[0];
                $scope.validarCarrito();
                $scope.ValidarFormaPago();
              } else {
                $scope.ShowToast(PedidoDetalles.message, 'danger');
                $location.path('/Productos');
              }

              EmpresasFactory.getEmpresas()
                .success(function (data) {
                  $scope.Distribuidor = data[0];
                })
                .error(function (data, status, headers, config) {
                  $scope.ShowToast('No pudimos cargar los datos de tu empresa, por favor intenta de nuevo más tarde', 'danger');
                  $location.path('/Productos');
                  $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
                });
            })
            .error(function (data, status, headers, config) {
              $scope.ShowToast('No pudimos cargar la información del pedido, por favor intenta de nuevo más tarde.', 'danger');
              $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
            });
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos preparar tu información, por favor intenta de nuevo más tarde.', 'danger');
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.init();

    $scope.QuitarProducto = function (PedidoDetalle) {
      $scope.PedidoDetalles.forEach(function (Elemento, Index) {
        if (Elemento.IdPedidoDetalle === PedidoDetalle.IdPedidoDetalle) {
          $scope.PedidoDetalles.splice(Index, 1);
          $scope.validarCarrito();
          return false;
        }
      });

      PedidoDetallesFactory.deletePedidoDetalles(PedidoDetalle.IdPedidoDetalle)
        .success(function (PedidoDetalleResult) {
          if (PedidoDetalleResult.success === 0) {
            $scope.ShowToast(PedidoDetalleResult.message, 'danger');
            PedidoDetallesFactory.getPedidoDetalles()
              .success(function (PedidoDetalles) {
                if (PedidoDetalles.success === 1) {
                  $scope.PedidoDetalles = PedidoDetalles.data[0];
                  $scope.validarCarrito();
                } else {
                  $scope.ShowToast(PedidoDetalles.message, 'danger');
                  $location.path('/Productos');
                }
              })
              .error(function (data, status, headers, config) {
                $scope.ShowToast('No pudimos cargar tu información, por favor intenta de nuevo más tarde.', 'danger');
                $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
              });
          } else {
            $scope.ActualizarMenu();
            $scope.validarCarrito();
            $scope.ShowToast(PedidoDetalleResult.message, 'success');
          }
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos quitar el producto seleccionado. Intenta de nuevo más tarde.', 'danger');

          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.ActualizarCodigo = function (value) {
      PedidosFactory.putCodigoPromocion(value[0])
        .success(function (resultado) {
          $scope.init();
          $scope.ShowToast(resultado.message, 'success');
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos cargar tu información, por favor intenta de nuevo más tarde.', 'danger');
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.ValidarFormaPago = function () {
      var Disabled = false;

      if ($scope.PedidoDetalles) {
        for (var i = 0; i < $scope.PedidoDetalles.length; i++) {
          var producto = $scope.PedidoDetalles[i];

          if (producto.IdTipoProducto === 3) {
            Disabled = true;
          }
        }
      }

      if (Disabled === true) {
        $scope.Distribuidor.IdFormaPago = 2;
      }

      return Disabled;
    };

    $scope.ActualizarFormaPago = function (IdFormaPago) {
      var empresa = {
        'IdFormaPagoPredilecta': IdFormaPago
      };

      EmpresasFactory.putEmpresaFormaPago(empresa)
        .success(function (actualizacion) {
          if (actualizacion.success === 1) {
            $scope.ShowToast(actualizacion.message, 'success');

            PedidoDetallesFactory.getPedidoDetalles()
              .success(function (PedidoDetalles) {
                if (PedidoDetalles.success === 1) {
                  $scope.PedidoDetalles = PedidoDetalles.data[0];
                  $scope.validarCarrito();
                } else {
                  $scope.ShowToast(PedidoDetalles.message, 'danger');
                  $location.path('/Productos');
                }
              })
              .error(function (data, status, headers, config) {
                $scope.ShowToast('No pudimos cargar tu información, por favor intenta de nuevo más tarde.', 'danger');
                $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
              });
          } else {
            $scope.ShowToast(actualizacion.message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos actualizar tu forma de pago. Intenta de nuevo más tarde.', 'danger');

          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.calcularSubTotal = function (IdPedido) {
      var total = 0;

      for (var i = 0; $scope.PedidoDetalles.length > i; i++) {
        if ($scope.PedidoDetalles[i].IdPedido == IdPedido) {
          if ($scope.PedidoDetalles[i].PrimeraCompraMicrosoft == 0) {
            total = total + ($scope.PedidoDetalles[i].PrecioUnitario * $scope.PedidoDetalles[i].Cantidad);
            
          }
        }
      }
      
      return total;
    };

    $scope.calcularIVA = function (IdPedido) {
      var total = 0;

      for (var i = 0; $scope.PedidoDetalles.length > i; i++) {
        if ($scope.PedidoDetalles[i].IdPedido == IdPedido) {
          if ($scope.PedidoDetalles[i].PrimeraCompraMicrosoft === 0) {
            total = total + ($scope.PedidoDetalles[i].PrecioUnitario * $scope.PedidoDetalles[i].Cantidad);
          }
        }
      }

      if ($scope.Distribuidor.ZonaImpuesto == 'Normal') {
        total = .16 * total;
      }
      if ($scope.Distribuidor.ZonaImpuesto == 'Nacional') {
        total = .16 * total;
      }
      if ($scope.Distribuidor.ZonaImpuesto == 'Frontera') {
        total = .11 * total;
      }

      return total;
    };

    $scope.calcularTotal = function (IdPedido) {
      var total = 0;

      for (var i = 0; $scope.PedidoDetalles.length > i; i++) {
        if ($scope.PedidoDetalles[i].IdPedido == IdPedido) {
          if ($scope.PedidoDetalles[i].PrimeraCompraMicrosoft === 0) {
            total = total + ($scope.PedidoDetalles[i].PrecioUnitario * $scope.PedidoDetalles[i].Cantidad);
          }
        }
      }

      var iva = 0;

      if ($scope.Distribuidor.ZonaImpuesto == 'Normal') {
        iva = .16 * total;
      }
      if ($scope.Distribuidor.ZonaImpuesto == 'Nacional') {
        iva = .16 * total;
      }
      if ($scope.Distribuidor.ZonaImpuesto == 'Frontera') {
        iva = .11 * total;
      }

      total = total + iva;

      return total;
    };

    $scope.Siguiente = function () {
      $scope.validarCarrito();

      var IrSiguiente = true;

      if ($scope.PedidoDetalles) {
        if ($scope.PedidoDetalles.length === 0) {
          IrSiguiente = false;
        }

        for (var i = 0; i < $scope.PedidoDetalles.length; i++) {
          var pedido = $scope.PedidoDetalles[i];

          if (pedido.Cantidad <= 0) {
            IrSiguiente = false;
          }

          if (!pedido.IdEmpresaUsuarioFinal) {
            IrSiguiente = false;
          }
        }
      } else {
        IrSiguiente = false;
      }

      if (IrSiguiente === false) {
        $scope.ShowToast('Revisa que tengas al menos un producto y que tenga un cliente seleccionado con crédito válido.', 'warning');
      } else {
        $location.path('/Comprar');
      }
    };

    $scope.IniciarTourCarrito = function () {
      $scope.Tour = new Tour({

        steps: [{
          element: '.formaPago',
          placement: 'rigth',
          title: 'Forma de pago del distribuidor',
          content: 'Selecciona la forma de pago predilecta para tu empresa, esta es una configuración única para toda la compañia. Si seleccionas pago con tarjeta bancaria tendrás que tener tus pedidos en pesos MXN, si requieres pagar en dolares USD podrás utilizar crédito CompuSoluciones.',
          template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Atrás</button><button class='btn btn-default' data-role='next'>Sig »</button><button class='btn btn-default' data-role='end'>Finalizar</button></nav></div></div>",
        }],

        backdrop: true,
        storage: false
      });

      $scope.Tour.init();
      $scope.Tour.start();
    };
  };

  PedidoDetallesReadController.$inject = ['$scope', '$log', '$location', '$cookieStore', 'PedidoDetallesFactory', 'TipoCambioFactory', 'EmpresasXEmpresasFactory', 'EmpresasFactory', 'PedidosFactory', '$routeParams'];

  angular.module('marketplace').controller('PedidoDetallesReadController', PedidoDetallesReadController);
} ());