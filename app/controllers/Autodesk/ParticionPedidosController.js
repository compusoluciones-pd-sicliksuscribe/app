(function () {
  var ParticionPedidosController = function ($scope, $log, $location, $cookies, $routeParams, ParticionPedidosFactory, $anchorScroll, lodash) {
    const getMonitorData = function () {
      return ParticionPedidosFactory.getPedidosParticionados()
          .then(result => {
            $scope.ordenes = result.data;
            $scope.ordenesAux = result.data;
            pagination();
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
        if (orden.NombreEmpresa.toLowerCase().indexOf(valor.toLowerCase()) >= 0) {
          resultados.push(orden);
        }
      });
      $scope.ordenes = resultados;
      pagination();
    };
  };

  ParticionPedidosController.$inject =
    ['$scope', '$log', '$location', '$cookies', '$routeParams', 'ParticionPedidosFactory', '$anchorScroll'];

  angular.module('marketplace').controller('ParticionPedidosController', ParticionPedidosController);
}());
