(function () {
  var MonitorReadController = function ($scope, $log, $cookies, $location, EmpresasXEmpresasFactory, PedidoDetallesFactory, $uibModal, $filter, FabricantesFactory, PedidosFactory, EmpresasFactory, UsuariosFactory, AmazonDataFactory, ActualizarCSNFactory) {
    $scope.EmpresaSelect = 0;
    var Params = {};
    $scope.form = {};
    $scope.form.habilitar = false;
    $scope.Vacio = 0;
    $scope.orders = false;
    $scope.BuscarProductos = {};
    $scope.Contrato = {};
    $scope.Contactos = [];
    $scope.Renovar = {};
    $scope.Extender = {};
    $scope.terminos = false;
    $scope.SessionCookie = $cookies.getObject('Session');

    $scope.init = function () {
      $scope.procesandoExtension = false;
      $scope.procesandoExtensionLbl = 'Extender contrato';
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
            $scope.Pedidos = '';
          } else if (result.status === 200) {
            $scope.Pedidos = result.data.data;
            $scope.Pedidos.forEach(pedido => {
              pedido.Detalles.forEach(detalle => {
                detalle.NumeroSerie && detalle.EstatusFabricante === 'accepted' && detalle.PedidoAFabricante
                ? pedido.listoRenovar = 1 : pedido.listoRenovar = 0;
              });
            });
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

    const extendContract = contractData => {
      $scope.procesandoExtension = true;
      $scope.procesandoExtensionLbl = 'Procesando...';
      PedidosFactory.extendContract(contractData)
        .then(result => {
          $scope.procesandoExtension = false;
          $scope.procesandoExtensionLbl = 'Extender contrato';
          $scope.cerrarModal(`extenderModal${contractData.IdContrato}`);
          $scope.Extender.IdContrato = null;
          if (result.data.success) {
            $scope.ShowToast(result.data.message, 'success');
            $scope.ActualizarMenu();
            $scope.addPulseCart();
            $scope.Pedidos.filter(pedido => { if (pedido.IdContrato === contractData.IdContrato) pedido.PorExtender = 1; });
          } else {
            $scope.ShowToast(result.data.message, 'danger');
          }
        })
        .catch(result => {
          $scope.procesandoExtension = false;
          $scope.procesandoExtensionLbl = 'Extender contrato';
          $scope.cerrarModal(`extenderModal${contractData.IdContrato}`);
          $scope.Extender.IdContrato = null;
          $scope.ShowToast(result.data.message, 'danger');
        });
    };

    $scope.init();

    $scope.ActualizarMonitor = function () {
      Params.IdEmpresaUsuarioFinal = $scope.EmpresaSelect;
      if ($scope.EmpresaSelect === null || $scope.EmpresaSelect === undefined) {
        Params.IdEmpresaUsuarioFinal = $cookies.getObject('Session').IdEmpresa;
      }
      Params.IdFabricante = $scope.BuscarProductos.IdFabricante;
      if (Params.IdFabricante === 1) {
        $scope.Contrato.tipo = 'all';
      }
      Params.EstatusContrato = $scope.Contrato.tipo || 'all';
      if (Params.IdFabricante && $scope.EmpresaSelect) {
        getOrderPerCustomer(Params);
        if (Params.IdFabricante === 2) getContactUsers();
        ActualizarCSNFactory.getUfCSN(Params.IdEmpresaUsuarioFinal)
        .then(result => {
          if (result.data.success) {
            $scope.csnUf = result.data.data.CSN ? result.data.data.CSN : 'El cliente no tiene un CSN registrado en click.';
            $scope.hayCSNUF = true;
          } else $scope.ShowToast('No pudimos cargar el csn de este cliente.', 'danger')  
        })
        .catch(() => $scope.ShowToast('No pudimos cargar el csn de este cliente, por favor intenta de nuevo más tarde.', 'danger'));
      }
      getTerminos($scope.EmpresaSelect);
    };

    $scope.ActualizarCantidad = function (IdPedidoDetalle) {
      $scope.Pedidos.forEach(function (Pedido) {
        if (Pedido.IdPedidoDetalle == IdPedidoDetalle) {
          if (Pedido.IdTipoProducto !== 6) Pedido.MostrarCantidad = !Pedido.MostrarCantidad;
        }
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
          $scope.Pedidos[i].IdFormaPagoProxima = parseInt(pedidoRecienActualizado.IdFormaPagoProxima);
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
          $scope.ShowToast('No pudimos conectarnos a la base de datos, por favor intenta de nuevo más tarde', 'danger');
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
          $scope.ShowToast('No pudimos conectarnos a la base de datos, por favor intenta de nuevo más tarde', 'danger');
        });
    };

    $scope.ActualizarDetalle = function (pedido, detalles) {
      if (pedido.IdFabricante !== 5 && (detalles.CantidadProxima <= 0 || !detalles.CantidadProxima) && pedido.IdFabricante !== 7) {
        $scope.ShowToast('Cantidad no válida para el producto', 'danger');
        return false;
      }
      if (pedido.IdFabricante !== 5 && (detalles.CantidadProxima > detalles.Cantidad) && pedido.IdFabricante !== 7 && pedido.IdFabricante !== 1) {
        $scope.ShowToast('No se puede actualizar a un número mayor de suscripciones.', 'danger');
        return;
      }

      var PedidoActualizado = {
        IdPedidoDetalle: detalles.IdPedidoDetalle,
        IdEmpresaUsuarioFinal: Params.IdEmpresaUsuarioFinal,
        MonedaCosto: detalles.MonedaPrecio,
        CantidadProxima: detalles.CantidadProxima,
        CargoRealizadoProximoPedido: pedido.CargoRealizadoProximoPedido,
        PorCancelar: 0,
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
      if (detalles.Cantidad !== detalles.CantidadProxima) {
        const detail = {
          CantidadProxima: detalles.CantidadProxima,
          IdPedidoDetalle: detalles.IdPedidoDetalle,
          IdEmpresaUsuarioFinal: Params.IdEmpresaUsuarioFinal,
          IdPedido: pedido.IdContrato ? detalles.IdPedido : pedido.IdPedido
        };
        PedidoDetallesFactory.updateSubscriptionNextQuantity(detail)
          .then(function (updateResult) {
            $scope.ShowToast(updateResult.data.message, 'success');
          })
          .catch(function (error) {
            $scope.ShowToast(error.data.message, 'danger');
          });
      }
      PedidoDetallesFactory.putPedidoDetalle(PedidoActualizado)
        .success(function (PedidoDetalleSuccess) {
          PedidoDetallesFactory.postPartitionFlag(pedido)
          .catch(function (result) {
            $scope.ShowToast(result.data.message, 'danger');
          });
          if (PedidoDetalleSuccess.success) {
            detalles.MostrarCantidad = 0;
            detalles.PorCancelar = 0;
            $scope.ShowToast(PedidoDetalleSuccess.message, 'success');
          } else {
            $scope.ShowToast(PedidoDetalleSuccess.message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos conectarnos a la base de datos, por favor intenta de nuevo más tarde', 'danger');
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
          PedidoDetallesFactory.postPartitionFlag(pedido)
          .catch(function (result) {
            $scope.ShowToast(result.data.message, 'danger');
          });
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
      const hoy = new Date();
      const order = {
        CargoRealizadoProximoPedido: Number(Pedido.CargoRealizadoProximoPedido),
        Activo: 0,
        PorCancelar: 1,
        ResultadoFabricante1: Detalles.EstatusFabricante,
        IdTipoProducto: Detalles.IdTipoProducto,
        IdPedidoDetalle: Detalles.IdPedidoDetalle,
        FechaInicio: Pedido.FechaInicio,
        FechaFin: hoy.getFullYear() + '-' + (hoy.getUTCMonth() + 1).toString().padStart(2, 0) + '-' + hoy.getDate().toString().padStart(2, 0),
        IdProducto: Detalles.IdProducto,
        IdEsquemaRenovacion: Pedido.IdEsquemaRenovacion,
        IdPedido: Pedido.IdPedido
      };
      if (Pedido.IdFabricante === 1) {
        PedidoDetallesFactory.putPedidoDetalleMicrosoft(order)
        .success(function (result) {
          if (result.success === 0) {
            $scope.ShowToast(result.message, 'danger');
          } else {
            $scope.ShowToast('Suscripción cancelada.', 'success');
          }
          $scope.$emit('UNLOAD');
          $scope.Cancelar = false;
          $scope.ActualizarMonitor();
          $scope.form.habilitar = false;
          if (!result) $scope.ShowToast('Ocurrió un error.', 'danger');
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast(data.message, 'danger');
        });
      } else {
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
      }
    };

    $scope.validarInfoPedido = function (modal, pedido, detalle) {
      const CREDITO = 2;
      if (pedido.IdFormaPagoProxima === CREDITO && pedido.EsOrdenInicial === 0 && pedido.IdEsquemaRenovacion === 1) {
        $scope.obtenerProrrateo(pedido, detalle);
        $scope.abrirModal(modal, pedido, detalle);
      }
      else $scope.CancelarPedido(pedido, detalle);
    };

    $scope.obtenerProrrateo = function (pedido, detalle) {
      const MENSUAL = 1;
      if (pedido.IdEsquemaRenovacion === MENSUAL) {
        PedidoDetallesFactory.getProratePriceMonth(pedido, detalle)
        .success(function (result) {
          $scope.prorrateo = result.data;
        });
      } else {
        PedidoDetallesFactory.getProratePriceAnnual(pedido, detalle)
        .success(function (result) {
          $scope.prorrateo = result.data;
        });
      }
    };

    $scope.abrirModal = function (modal, pedido, detalle) {
      document.getElementById(modal).style.display = 'block';
      $scope.fechaInicio = new Date(pedido.FechaInicio);
      $scope.nvaFechaFin = new Date();
      $scope.infoPedido = pedido;
      $scope.infoDetalle = detalle;
    };

    $scope.cerrarModal = function (modal) {
      document.getElementById(modal).style.display = 'none';
    };

    $scope.CancelarPedidoAutodesk = function (Pedido, Detalles) {
      $scope.Cancelar = true;
      $scope.guardar = Pedido;
      $scope.form.habilitar = true;
      $scope.$emit('LOAD');
      Pedido.IdPedidoDetalle = Detalles.IdPedidoDetalle;
      PedidoDetallesFactory.updateProductoAutodesk(Pedido, 0)
        .success(function (result) {
          if (result.success === 1) {
            $scope.ShowToast(result.message, 'success');
            $scope.$emit('UNLOAD');
            $scope.Cancelar = false;
            $scope.ActualizarMonitor();
            $scope.form.habilitar = false;
          }
        })
        .error(function (error) {
          $scope.ShowToast(error, 'danger');
        });
    };

    $scope.ReanudarPedidoAutodesk = function (Pedido, Detalles) {
      Pedido.IdPedidoDetalle = Detalles.IdPedidoDetalle;
      PedidoDetallesFactory.updateProductoAutodesk(Pedido, 1)
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
        .catch(function (error) {
          $scope.ShowToast(error.data.message, 'danger');
          $log.log('data error: ' + error.data.message + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
          $scope.form.habilitar = true;
          $scope.ActualizarMonitor();
          $scope.form.habilitar = false;
        });
    };

    $scope.Reanudar = function (pedido, detalles) {
      const order = {
        CargoRealizadoProximoPedido: Number(pedido.CargoRealizadoProximoPedido),
        Activo: 1,
        PorCancelar: 0,
        ResultadoFabricante1: detalles.EstatusFabricante,
        IdTipoProducto: detalles.IdTipoProducto,
        IdPedidoDetalle: detalles.IdPedidoDetalle,
        FechaInicio: pedido.FechaInicio,
        FechaFin: new Date(),
        IdProducto: detalles.IdProducto,
        IdEsquemaRenovacion: pedido.IdEsquemaRenovacion,
        IdPedido: pedido.IdPedido
      };
      $scope.form.habilitar = true;
      if (detalles.Cantidad !== detalles.CantidadProxima) {
        order.PorActualizarCantidad = 1;
      }
      if (pedido.IdFabricante === 1) {
        PedidoDetallesFactory.putPedidoDetalleMicrosoft(order)
        .success(function (result) {
          if (!result) {
            $scope.ShowToast('Ocurrió un error', 'danger');
          } else {
            $scope.ShowToast(result.message, 'danger');
          }
          $scope.form.habilitar = true;
          $scope.ActualizarMonitor();
          $scope.form.habilitar = false;
        })
        .catch(function (error) {
          $scope.ShowToast(error.data.message, 'danger');
          $log.log('data error: ' + error.data.message + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
          $scope.form.habilitar = true;
          $scope.ActualizarMonitor();
          $scope.form.habilitar = false;
        });
      } else {
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
        .catch(function (error) {
          $scope.ShowToast(error.data.message, 'danger');
          $log.log('data error: ' + error.data.message + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
          $scope.form.habilitar = true;
          $scope.ActualizarMonitor();
          $scope.form.habilitar = false;
        });
      }
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

    const getTerminos = function (IdEmpresa) {
      EmpresasXEmpresasFactory.getAcceptanceAgreementByClient(IdEmpresa)
        .success(function (result) {
          if (!result.AceptoTerminosMicrosoft) {
            $scope.terminos = false;
          } else {
            $scope.terminos = true;
          }
        })
        .catch(function (error) {
          $scope.ShowToast(error.data.message, 'danger');
          $log.log('data error: ' + error.data.message + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
          $scope.form.habilitar = true;
          $scope.ActualizarMonitor();
          $scope.form.habilitar = false;
        });
    };

    $scope.AceptarTerminos = function (IdEmpresa) {
      PedidoDetallesFactory.acceptAgreement(IdEmpresa)
      .success(function (result) {
        if (!result.success) {
          $scope.ShowToast('Ocurrió un error, favor de contactar a Soporte', 'danger');
        } else {
          $scope.ShowToast('Terminos y condiciones aceptados.', 'success');
          $scope.ActualizarMonitor();
        }
        $scope.form.habilitar = true;
        $scope.ActualizarMonitor();
        $scope.form.habilitar = false;
      })
      .catch(function (error) {
        $scope.ShowToast(error.data.message, 'danger');
        $log.log('data error: ' + error.data.message + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        $scope.form.habilitar = true;
        $scope.ActualizarMonitor();
        $scope.form.habilitar = false;
      });
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

    $scope.getEndDateContract = (contratoActual, estatusPedidos) => {
      $scope.estatusPedidos = estatusPedidos;
      PedidosFactory.getEndDateContract(contratoActual, $cookies.getObject('Session').IdEmpresa, $scope.EmpresaSelect)
        .then(result => {
          $scope.OpcionesExtencion = result.data.data.contractDates;
          $scope.validarModal(contratoActual);
        })
        .catch(result => {
          $scope.ShowToast(result.data.message, 'danger');
        });
    };

    $scope.validarModal = contratoActual => {
      $scope.OpcionesExtencion.length > 0 ? document.getElementById(`extenderModal${contratoActual}`).style.display = 'block'
      : document.getElementById('noExtender').style.display = 'block';
    };

    $scope.cerrarModal = modal => {
      document.getElementById(modal).style.display = 'none';
    };

    $scope.solicitarExtension = IdContrato => {
      if ($scope.Extender.IdContrato) {
        let payload = {
          IdContrato: IdContrato,
          IdEmpresaUsuarioFinal: $scope.EmpresaSelect,
          IdContratoRelacionado: $scope.Extender.IdContrato,
          EstatusPedidos: $scope.estatusPedidos
        };
        extendContract(payload);
        payload = {};
        $scope.estatusPedidos = 0;
      } else {
        $scope.ShowToast('Especifica una fecha fin para la extensión del contrato.', 'warning');
      }
    };
  };

  MonitorReadController.$inject = ['$scope', '$log', '$cookies', '$location', 'EmpresasXEmpresasFactory', 'PedidoDetallesFactory', '$uibModal', '$filter', 'FabricantesFactory', 'PedidosFactory', 'EmpresasFactory', 'UsuariosFactory','AmazonDataFactory', 'ActualizarCSNFactory'];

  angular.module('marketplace').controller('MonitorReadController', MonitorReadController);
}());
