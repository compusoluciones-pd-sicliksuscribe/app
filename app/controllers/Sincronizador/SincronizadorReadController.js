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
