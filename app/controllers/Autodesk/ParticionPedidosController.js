(function () {
  var ParticionPedidosController = function ($scope, $log, $location, $cookies, $routeParams, ParticionPedidosFactory, $anchorScroll, lodash) {
    const getMonitorData = function () {
      return ParticionPedidosFactory.getPedidosParticionados()
          .then(result => {
            if (result.data.success === 0) {
              $scope.ShowToast(`Hubo un problema al obtener los datos: ${result.data.message}.`, 'danger');
            } else {
              $scope.ordenes = result.data.data.orders;
              $scope.ordenesAux = result.data.data.orders;
              pagination();
            }
          })
          .catch(function () {
            $scope.ShowToast('No fue posible obtener los datos de los pedidos, por favor intenta de nuevo más tarde.', 'danger');
          });
    };

    const pagination = () => {
      $scope.filtered = [];
      $scope.currentPage = 1;
      $scope.numPerPage = 10;
      $scope.maxSize = 5;

      $scope.$watch('currentPage + numPerPage', function () {
        let begin = (($scope.currentPage - 1) * $scope.numPerPage),
          end = begin + $scope.numPerPage;
        $scope.filtered = $scope.ordenes.slice(begin, end);
      });
    };

    $scope.init = function () {
      getMonitorData();
    };

    $scope.init();

    $scope.buscar = function (valor) {
      let resultados = [];
      $scope.ordenesAux.forEach(orden => {
        if (orden.IdPedido.toString().indexOf(valor) >= 0) resultados.push(orden);
      });
      $scope.ordenes = resultados;
      pagination();
    };

    $scope.confirmarParticion = function (IdPedido, detalles) {
      ParticionPedidosFactory.confirmarParticion({IdPedido, detalles})
        .then(result => {
          result.data[0].success ? $scope.ShowToast('Partición confirmada.', 'success')
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
