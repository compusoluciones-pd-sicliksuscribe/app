(function () {
  var SincronizadorReadController = function ($scope, $log, $location, $cookies, $routeParams, SincronizadorManualFactory, $anchorScroll, lodash) {
    $scope.modal = {};
    $scope.detalle = {};
    $scope.agentes = [];
    $scope.BuscarSuscripcion = {};

    $scope.mostrarModal = function (titulo, detalle) {
      const comentario = titulo === 'Ventas' ? detalle.ComentarioVenta : detalle.ComentarioOperacion;
      Object.assign($scope.modal, detalle, { titulo }, { comentario });
    };

    const getSincronizadorManual = function (agente) {
      return SincronizadorManualFactory.getSincronizadorManual(agente)
        .then(function (response) {
          $scope.detallesSincronizador = response.data.data;
          return $scope.detallesSincronizador;
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
          if (item.IdPedido === detalle.IdPedido) {
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
      getSincronizadorManual($scope.BuscarSuscripcion.agente);
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

    $scope.init = function () {
      getSincronizadorManual('all')
        .then(setAgentes);
    };

    $scope.init();
  };

  SincronizadorReadController.$inject =
    ['$scope', '$log', '$location', '$cookies', '$routeParams', 'SincronizadorManualFactory', '$anchorScroll'];

  angular.module('marketplace').controller('SincronizadorReadController', SincronizadorReadController);
}());
