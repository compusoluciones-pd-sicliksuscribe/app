(function () {
  var SincronizadorReadController = function ($scope, $log, $location, $cookies, $routeParams, SincronizadorManualFactory, $anchorScroll, lodash) {
    $scope.modal = {};
    $scope.detalle = {};
    $scope.agentes = [];
    $scope.BuscarSuscripcion = {};
    $scope.ActualizarFiltrados = {};
    $scope.AgentesSincronizador = {};
    $scope.estado = {};
    $scope.Offset = 0;
    $scope.Pagina = 0;

    $scope.mostrarModal = function (titulo, detalle) {
      const comentario = titulo === 'Ventas' ? detalle.ComentarioVenta : detalle.ComentarioOperacion;
      Object.assign($scope.modal, detalle, { titulo }, { comentario });
    };

    const getSincronizadorManual = function (agente, offset) {
      return SincronizadorManualFactory.getSincronizadorManual(agente, offset)
        .then(function (response) {
          $scope.detallesSincronizador = response.data;
          const tamaño = $scope.detallesSincronizador.length;
          console.log(tamaño);
          if (tamaño === 0) {
            $scope.ShowToast('No se encontraron más resultados para la busqueda.', 'danger');
            $scope.PaginadoAtras();
          }
          return $scope.detallesSincronizador;
        })
        .catch(function () {
          $scope.ShowToast('No pudimos cargar la lista de detalles, por favor intenta de nuevo más tarde.', 'danger');
        });
    };

    const getAgentes = function () {
      return SincronizadorManualFactory.getAgentes()
        .then(function (response) {
          $scope.AgentesSincronizador = response.data.data;
          return $scope.AgentesSincronizador;
        })
        .catch(function () {
          $scope.ShowToast('No pudimos cargar la lista de detalles, por favor intenta de nuevo más tarde.', 'danger');
        });
    };

    const setAgentes = function (agente) {
      const selectAgentes = agente.map(item => item.Agente).filter(item => item);
      $scope.agentes = deleteDuplicate(selectAgentes);
      $scope.agentes = $scope.agentes.map(nombre => ({ nombre }));
    };

    const updateSincronizador = function (payload, detalle) {
      return SincronizadorManualFactory.updateSincronizadorManual(payload)
      .then(function (result) {
        $scope.detallesSincronizador = $scope.detallesSincronizador.map(function (item) {
          if (item.IdPedidoDetalle === detalle.IdPedidoDetalle) {
            if (detalle.titulo === 'Ventas') {
              item.ComentarioVenta = $scope.modal.comentario;
            } else if (detalle.titulo === 'Operación') {
              item.ComentarioOperacion = $scope.modal.comentario;
            }
          }
          return item;
        });
        $scope.ShowToast(result.data.message, 'success');
      }).catch(function (result) {
        $scope.ShowToast('No se realizarón los cambios, intentalo mas tarde.', 'danger');
      });
    };

    const deleteDuplicate = (object) => (
      object.reduce((accumulator, current) => {
        if (accumulator.length === 0 || accumulator[accumulator.length - 1] !== current) {
          accumulator.push(current);
        }
        return accumulator;
      }, [])
    );

    $scope.BuscarSuscripciones = function () {
      const Agente = ($scope.BuscarSuscripcion.agente === '' || $scope.BuscarSuscripcion.agente == null) ? 'all' : $scope.BuscarSuscripcion.agente;
      $scope.BuscarSuscripcion.agente = Agente;
      $scope.Pagina = 0;
      $scope.Offset = 0;
      getSincronizadorManual($scope.BuscarSuscripcion.agente, $scope.Offset);
    };

    $scope.guardarConModal = function (detalle) {
      detalle.titulo === 'Ventas'
        ? ((detalle.ComentarioVenta = $scope.modal.comentario) && (detalle.ComentarioOperacion = undefined))
        : ((detalle.ComentarioOperacion = $scope.modal.comentario) && (detalle.ComentarioVenta = undefined));
      return $scope.guardarTodo(detalle);
    };

    $scope.guardarTodo = function (detalle) {
      const payload = {
        suscripciones: [{
          IdPedidoDetalle: detalle.IdPedidoDetalle,
          ComentarioOperacion: detalle.ComentarioOperacion,
          ComentarioVenta: detalle.ComentarioVenta
        }]
      };
      return updateSincronizador(payload, detalle)
        .then(function () {
          $scope.modal = {};
        });
    };

    $scope.guardarEstados = function (detalle) {
      const payload = {
        suscripciones: [{
          IdPedidoDetalle: detalle.IdPedidoDetalle,
          EstadoOperacion: detalle.EstadoOperacion,
          EstadoVenta: detalle.EstadoVenta
        }]
      };
      return updateSincronizador(payload, detalle);
    };

    $scope.ActualizarFiltrados = function (bandera) {
      Promise.all($scope.detallesSincronizador.map(function (pedido) {
        if (bandera === 'Ventas') {
          pedido.EstadoVenta = $scope.estado.venta;
        }
        pedido.EstadoOperacion = $scope.estado.operacion;
        return updateSincronizador({
          suscripciones: [{
            IdPedidoDetalle: pedido.IdPedidoDetalle,
            EstadoOperacion: pedido.EstadoOperacion,
            EstadoVenta: pedido.EstadoVenta
          }]
        }, pedido);
      }))
        .then(function () {
          $scope.Offset = 0;
          getSincronizadorManual($scope.BuscarSuscripcion.agente, $scope.Offset);
        });
    };

    $scope.Sincronizar = function (detalle) {
      if (detalle.accionCsp === 'Cancelar') {
        return SincronizadorManualFactory.SincronizarCancelar(detalle)
        .then(function () {
          $scope.ShowToast('Cambios realizados exitosamente.', 'success');
          $scope.Pagina = 0;
          $scope.Offset = $scope.Pagina * 50;
          getSincronizadorManual($scope.BuscarSuscripcion.agente, $scope.Offset);
        })
        .catch(function () {
          $scope.ShowToast('No pudimos cargar la lista de detalles, por favor intenta de nuevo más tarde.', 'danger');
        });
      }
      const payload = {
        IdDistribuidor: detalle.IdDistribuidor,
        IdCliente: detalle.IdCliente,
        IdProducto: detalle.IdProducto,
        accionCsp: detalle.accionCsp
      };
      return SincronizadorManualFactory.Sincronizar(payload)
      .then(function () {
        $scope.ShowToast('Cambios realizados exitosamente.', 'success');
        $scope.Pagina = 0;
        $scope.Offset = $scope.Pagina * 50;
        getSincronizadorManual($scope.BuscarSuscripcion.agente, $scope.Offset);
      })
      .catch(function () {
        $scope.ShowToast('No pudimos cargar la lista de detalles, por favor intenta de nuevo más tarde.', 'danger');
      });
    };

    $scope.PaginadoInicio = function () {
      $scope.Pagina = 0;
      $scope.Offset = $scope.Pagina * 50;
      if ($scope.BuscarSuscripcion.agente === undefined) {
        $scope.BuscarSuscripcion.agente = 'all';
      }
      getSincronizadorManual($scope.BuscarSuscripcion.agente, $scope.Offset);
    };

    $scope.PaginadoAtras = function () {
      $scope.Pagina = $scope.Pagina - 1;
      $scope.Offset = $scope.Pagina * 50;
      if ($scope.BuscarSuscripcion.agente === undefined) {
        $scope.BuscarSuscripcion.agente = 'all';
      }
      getSincronizadorManual($scope.BuscarSuscripcion.agente, $scope.Offset);

    };

    $scope.PaginadoSiguiente = function () {
      $scope.Pagina = $scope.Pagina + 1;
      $scope.Offset = $scope.Pagina * 50;
      if ($scope.BuscarSuscripcion.agente === undefined) {
        $scope.BuscarSuscripcion.agente = 'all';
      }
      getSincronizadorManual($scope.BuscarSuscripcion.agente, $scope.Offset);
    };

    $scope.init = function () {
      getAgentes()
      .then(setAgentes);
      $scope.Offset = 0;
      getSincronizadorManual('all', $scope.Offset);
    };

    $scope.init();
  };

  SincronizadorReadController.$inject =
    ['$scope', '$log', '$location', '$cookies', '$routeParams', 'SincronizadorManualFactory', '$anchorScroll'];

  angular.module('marketplace').controller('SincronizadorReadController', SincronizadorReadController);
}());
