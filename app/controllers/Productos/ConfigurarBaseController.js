(function () {
  var ConfigurarBaseController = function ($scope, $log, $location, $cookieStore, $routeParams, ProductosFactory, FabricantesFactory, TiposProductosFactory, PedidoDetallesFactory, TipoCambioFactory, ProductoGuardadosFactory, EmpresasXEmpresasFactory) {
    var IdProducto = $routeParams.IdProducto;
    var IdPedidoDetalle = $routeParams.IdPedidoDetalle;
    $scope.init = function () {
      ProductosFactory.getBaseSubscription(IdProducto)
        .then(function (result) {
          $scope.suscripciones = result.data.data;
          console.log($scope.suscripciones);
          console.log(result);
        })
        .catch(console.log);
    };

    $scope.init();

    $scope.actualizarBase = function (IdPedidoDetalleBase) {
      ProductosFactory.putBaseSubscription({ IdPedidoDetalle: IdPedidoDetalle, IdPedidoDetalleBase: IdPedidoDetalleBase })
        .then(function (resultadoUpdate) {
          if (resultadoUpdate.data.success) {
            $scope.ShowToast(resultadoUpdate.data.message, 'success');
            $location.path('/Carrito');
          } else {
            $scope.ShowToast(resultadoUpdate.data.message, 'danger');
          }
        })
        .catch(console.log);
    };


  };

  ConfigurarBaseController.$inject = ['$scope', '$log', '$location', '$cookieStore', '$routeParams', 'ProductosFactory', 'FabricantesFactory', 'TiposProductosFactory', 'PedidoDetallesFactory', 'TipoCambioFactory', 'ProductoGuardadosFactory', 'EmpresasXEmpresasFactory'];

  angular.module('marketplace').controller('ConfigurarBaseController', ConfigurarBaseController);
}());
