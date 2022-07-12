(function () {
  var ParticionPedidosController = function ($scope, $log, $location, $cookies, $routeParams, ParticionPedidosFactory, $anchorScroll, lodash) {
    const getMonitorData = () => {
      return ParticionPedidosFactory.getPedidosParticionados()
          .then(result => {
            if (result.data.success === 0) $scope.ShowToast(`Hubo un problema al obtener los datos: ${result.data.message}.`, 'danger');
            else {
              $scope.ordenes = result.data.data.orders;
              $scope.ordenesAux = result.data.data.orders;
            }
          })
          .catch(function () {
            $scope.ShowToast('No fue posible obtener los datos de los pedidos, por favor intenta de nuevo más tarde.', 'danger');
          });
    };

    $scope.init = () => getMonitorData();

    $scope.init();

    $scope.buscar = valor => {
      let resultados = [];
      $scope.ordenesAux.forEach(orden => {
        if (orden.IdPedido.toString().indexOf(valor) >= 0) resultados.push(orden);
      });
      $scope.ordenes = resultados;
    };

    $scope.confirmarParticion = idPedido => {
      ParticionPedidosFactory.confirmarParticion(idPedido)
        .then(result => {
          result.data.success ? $scope.ShowToast('Partición confirmada.', 'success')
          : $scope.ShowToast('Hubo un error al tratar de confirmar la partición, intentelo más tarde.', 'danger');
          $scope.init();
          $scope.ngOnInit();
        });
    };
  };

  ParticionPedidosController.$inject =
    ['$scope', '$log', '$location', '$cookies', '$routeParams', 'ParticionPedidosFactory', '$anchorScroll'];

  angular.module('marketplace').controller('ParticionPedidosController', ParticionPedidosController);
}());
