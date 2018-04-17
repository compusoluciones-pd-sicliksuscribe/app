(function () {
  var MonitorReadController = function ($scope, $log, $cookies, $location, EmpresasXEmpresasFactory, PedidoDetallesFactory, $uibModal, $filter, FabricantesFactory, PedidosFactory, EmpresasFactory, UsuariosFactory) {
    $scope.EmpresaSelect = 0;
    var Params = {};
    $scope.form = {};
    $scope.form.habilitar = false;
    $scope.Vacio = 0;
    $scope.Pedidos = {};
    $scope.orders = false;
    $scope.BuscarProductos = {};
    $scope.Contrato = {};
    $scope.Contactos = [];
    $scope.Renovar = {};
    $scope.SessionCookie = $cookies.getObject('Session');
    $scope.currentDistribuidor = $cookies.getObject('currentDistribuidor');

    $scope.init = function () {
      $scope.CheckCookie();
      FabricantesFactory.getFabricantes()
        .success(function (Fabricantes) {
          $scope.selectFabricantes = Fabricantes;
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos cargar la lista de fabricantes, por favor intenta de nuevo más tarde.', 'danger');
        });
      EmpresasXEmpresasFactory.getEmpresasXEmpresas()
        .success(function (Empresas) {
          $scope.selectEmpresas = Empresas;
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });

      if ($cookies.getObject('Session').IdTipoAcceso == 4 || $cookies.getObject('Session').IdTipoAcceso == 5 || $cookies.getObject('Session').IdTipoAcceso == 6) {
        Params.IdEmpresaUsuarioFinal = $cookies.getObject('Session').IdEmpresa;
        if (!$scope.BuscarProductos.IdFabricante) {
          $scope.BuscarProductos.IdFabricante = 0;
        }
        Params.IdFabricante = $scope.BuscarProductos.IdFabricante;
      }
    };

    const getOrderPerCustomer = function (customer) {
      PedidoDetallesFactory.getOrderPerCustomer(Params)
        .then(function (result) {
          if (result.status === 204) {
            $scope.Vacio = 0;
            $scope.Pedidos = {};
          } else if (result.status === 200) {
            $scope.Pedidos = result.data.data;
            $scope.Vacio = 1;
          }
        })
        .catch(function (result) {
          $scope.ShowToast(result.data.message, 'danger');
        });
    };

    const getOrderPerCustomerTuClick = function (customer) {
      PedidoDetallesFactory.getOrderPerCustomerTuClick(Params)
        .then(function (result) {
          if (result.status === 204) {
            $scope.Vacio = 0;
            $scope.Pedidos = {};
          } else if (result.status === 200) {
            $scope.Pedidos = result.data.data;
            $scope.Vacio = 1;
          }
        })
        .catch(function (result) {
          $scope.ShowToast(result.data.message, 'danger');
        });
    };

    const getContactUsers = function () {
      UsuariosFactory.getUsuariosContacto($scope.EmpresaSelect)
        .then(result => {
          $scope.Contactos = result.data.data;
          $scope.Renovar = {};
        });
    };

    const renewContract = function (contractData) {
      PedidosFactory.renewContract(contractData)
        .then(result => {
          $scope.ShowToast(result.data.message, 'success');
          $scope.ActualizarMenu();
          $scope.addPulseCart();
          setTimeout($scope.removePulseCart, 9000);
          $location.path('/Carrito');
        })
        .catch(result => {
          $scope.ShowToast(result.data.message, 'danger');
        });
    };

    $scope.init();

    $scope.ActualizarMonitor = function () {
      Params.IdEmpresaUsuarioFinal = $scope.EmpresaSelect;
      if ($scope.EmpresaSelect === 0) {
        Params.IdEmpresaUsuarioFinal = $cookies.getObject('Session').IdEmpresa;
        Params.IdDistribuidorTuClick = $scope.currentDistribuidor.IdEmpresa;
        $scope.EmpresaSelect = $cookies.getObject('Session').IdEmpresa;
      }
      Params.IdFabricante = $scope.BuscarProductos.IdFabricante;
      if (Params.IdFabricante === 1) {
        $scope.Contrato.tipo = 'all';
      }
      // if (!Params.IdFabricante) {
      //   $scope.BuscarProductos.IdFabricante = null;
      // }
      Params.AutoRenovable = $scope.Contrato.tipo || 'all';
      if (Params.IdFabricante && $scope.EmpresaSelect && Params.IdDistribuidorTuClick) {
        getOrderPerCustomerTuClick(Params);
        if (Params.IdFabricante === 2) getContactUsers();
      } else if (Params.IdFabricante && $scope.EmpresaSelect && (!Params.IdDistribuidorTuClick)) {
        getOrderPerCustomer(Params);
        if (Params.IdFabricante === 2) getContactUsers();
      }
    };

    $scope.ActualizarCantidad = function (IdPedidoDetalle) {
      $scope.Pedidos.forEach(function (Pedido) {
        Pedido.Detalles.forEach(function (Detalles) {
          if (Detalles.IdPedidoDetalle === IdPedidoDetalle) {
            Detalles.MostrarCantidad = !Detalles.MostrarCantidad;
          }
        }, this);
      }, this);
    };

    $scope.Confirmar = function (IdPedidoDetalle) {
      $scope.Pedidos.forEach(function (Pedido) {
        Pedido.Detalles.forEach(function (Detalles) {
          if (Detalles.IdPedidoDetalle === IdPedidoDetalle) {
            Detalles.Mostrar = !Detalles.Mostrar;
          }
        }, this);
      }, this);
    };

    $scope.ActualizarPedidosAlCambiarMonedaOFormaPago = function (pedidoRecienActualizado) {
      for (var i = 0; i < $scope.Pedidos.length; i++) {
        if ($scope.Pedidos[i].IdPedido === pedidoRecienActualizado.IdPedido) {
          $scope.Pedidos[i].IdFormaPagoProxima = pedidoRecienActualizado.IdFormaPagoProxima;
          $scope.Pedidos[i].MonedaPagoProxima = pedidoRecienActualizado.MonedaPagoProxima;
        }
      }
    };

    $scope.ActualizarMoneda = function (pedido) {
      var APedido = {
        IdPedido: pedido.IdPedido,
        IdFormaPagoProxima: pedido.IdFormaPagoProxima,
        MonedaPagoProxima: pedido.MonedaPagoProxima
      };
      PedidosFactory.putPedidoPago(APedido)
        .success(function (result) {
          if (result.success === 0) {
            $scope.ShowToast(result.message, 'danger');
          } else {
            $scope.ActualizarPedidosAlCambiarMonedaOFormaPago(APedido);
            $scope.ShowToast(result.message, 'success');
          }
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde', 'danger');
        });
    };

    $scope.ActualizarPago = function (pedido) {
      var APedido = {
        IdPedido: pedido.IdPedido,
        IdFormaPagoProxima: pedido.IdFormaPagoProxima,
        MonedaPagoProxima: pedido.MonedaPagoProxima
      };
      PedidosFactory.putPedidoPago(APedido)
        .success(function (result) {
          if (result.success === 0) {
            $scope.ShowToast(result.message, 'danger');
          } else {
            $scope.ActualizarPedidosAlCambiarMonedaOFormaPago(APedido);
            $scope.ShowToast(result.message, 'success');
          }
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde', 'danger');
        });
    };

    $scope.ActualizarDetalle = function (pedido, detalles) {
      if (detalles.CantidadProxima <= 0 || !detalles.CantidadProxima) {
        $scope.ShowToast('Cantidad no válida para el producto', 'danger');
        return false;
      }
      if (detalles.CantidadProxima > detalles.Cantidad) {
        $scope.ShowToast('No se puede actualizar a un numero mayor de suscripciones.', 'danger');
        return;
      }
      var PedidoActualizado = {
        IdPedidoDetalle: detalles.IdPedidoDetalle,
        IdEmpresaUsuarioFinal: Params.IdEmpresaUsuarioFinal,
        MonedaCosto: detalles.MonedaPrecio,
        CantidadProxima: detalles.CantidadProxima,
        CargoRealizadoProximoPedido: pedido.CargoRealizadoProximoPedido,
        PorCancelar: 0
      };
      if (!detalles.Activo) {
        PedidoActualizado.PorActualizarCantidad = 0;
      } else {
        if (detalles.CantidadProxima === detalles.Cantidad) {
          PedidoActualizado.PorActualizarCantidad = 0;
        } else {
          PedidoActualizado.PorActualizarCantidad = 1;
        }
      }
      PedidoDetallesFactory.putPedidoDetalle(PedidoActualizado)
        .success(function (PedidoDetalleSuccess) {
          if (PedidoDetalleSuccess.success) {
            detalles.MostrarCantidad = 0;
            detalles.PorCancelar = 0;
            $scope.ShowToast(PedidoDetalleSuccess.message, 'success');
          } else {
            $scope.ShowToast(PedidoDetalleSuccess.message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde', 'danger');
        });
    };

    $scope.tomarFechaFin = function () {
      var FechaFin = new Date();
      FechaFin.setDate(22);
      FechaFin.setMonth(FechaFin.getMonth() + 2);
      return FechaFin;
    };

    $scope.CancelarRenovacion = function (pedido, detalles) {
      const params = {
        CargoRealizadoProximoPedido: pedido.CargoRealizadoProximoPedido,
        PorCancelar: 1,
        ResultadoFabricante1: detalles.EstatusFabricante,
        IdTipoProducto: detalles.IdTipoProducto,
        IdPedidoDetalle: detalles.IdPedidoDetalle
      };
      PedidoDetallesFactory.putPedidoDetalle(params)
        .then(function (result) {
          detalles.PorCancelar = 1;
          detalles.MostrarCantidad = 0;
          $scope.ShowToast(result.data.message, 'success');
        })
        .catch(function (result) {
          $scope.ShowToast(result.data.message, 'danger');
        });
    };

    $scope.CancelarPedido = function (Pedido, Detalles) {
      $scope.Cancelar = true;
      $scope.guardar = Pedido;
      $scope.form.habilitar = true;
      $scope.$emit('LOAD');
      const order = {
        CargoRealizadoProximoPedido: Pedido.CargoRealizadoProximoPedido,
        Activo: 0,
        PorCancelar: 1,
        ResultadoFabricante1: Detalles.EstatusFabricante,
        IdTipoProducto: Detalles.IdTipoProducto,
        IdPedidoDetalle: Detalles.IdPedidoDetalle
      };
      PedidoDetallesFactory.putPedidoDetalle(order)
        .success(function (result) {
          $scope.ShowToast('Suscripción cancelada.', 'success');
          $scope.$emit('UNLOAD');
          $scope.Cancelar = false;
          $scope.ActualizarMonitor();
          $scope.form.habilitar = false;
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast(data.message, 'danger');
        });
    };

    $scope.Reanudar = function (pedido, detalles) {
      const order = {
        CargoRealizadoProximoPedido: pedido.CargoRealizadoProximoPedido,
        Activo: 1,
        PorCancelar: 0,
        ResultadoFabricante1: detalles.EstatusFabricante,
        IdTipoProducto: detalles.IdTipoProducto,
        IdPedidoDetalle: detalles.IdPedidoDetalle
      };
      $scope.form.habilitar = true;
      if (detalles.Cantidad !== detalles.CantidadProxima) {
        order.PorActualizarCantidad = 1;
      }
      PedidoDetallesFactory.putPedidoDetalle(order)
        .success(function (result) {
          if (!result.success) {
            $scope.ShowToast(result.message, 'danger');
          } else {
            $scope.ShowToast('Suscripción reanudada.', 'success');
          }
          $scope.form.habilitar = true;
          $scope.ActualizarMonitor();
          $scope.form.habilitar = false;
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.PedidoDetalleCancel = function () {
      $location.path('/PedidoDetalles');
    };

    $scope.SolicitarRenovacion = function () {
      if ($scope.Renovar.IdUsuarioContacto) {
        const payload = {
          IdContrato: $scope.Renovar.IdContrato,
          IdEmpresaUsuarioFinal: $scope.EmpresaSelect,
          IdUsuarioContacto: $scope.Renovar.IdUsuarioContacto
        };
        renewContract(payload);
      } else {
        $scope.ShowToast('Selecciona un usuario de contacto', 'warning');
      }
    };

    $scope.AgregarContrato = function (pedido) {
      $scope.Renovar.IdContrato = pedido.IdContrato;
    };

    $scope.IniciarTourMonitor = function () {
      $scope.Tour = new Tour({
        steps: [
          {
            element: '.selectOption',
            placement: 'bottom',
            title: 'Selecciona un cliente',
            content: 'Para comenzar, selecciona un cliente para poder ver sus pedidos. Aquí podrás cancelar o renovar suscripciones, disminuir asientos para la renovación y consultar todos los pedidos generados.',
            template: '<div class="popover tour"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div><div class="popover-navigation"><button class="btn btn-default" data-role="prev">« Atrás</button><button class="btn btn-default" data-role="next">Sig »</button><button class="btn btn-default" data-role="end">Finalizar</button></nav></div></div>'
          }
        ],

        backdrop: true,
        storage: false
      });

      $scope.Tour.init();
      $scope.Tour.start();
    };
  };

  MonitorReadController.$inject = ['$scope', '$log', '$cookies', '$location', 'EmpresasXEmpresasFactory', 'PedidoDetallesFactory', '$uibModal', '$filter', 'FabricantesFactory', 'PedidosFactory', 'EmpresasFactory', 'UsuariosFactory'];

  angular.module('marketplace').controller('MonitorReadController', MonitorReadController);
}());
