(function () {
  var SuccessOrderController = function ($scope, $log, $rootScope, $location, $cookies, $route, PedidosFactory) {
    $scope.currentPath = $location.path();
    $scope.orderIdsCookie = $cookies.getObject('orderIdsCookie').data || $cookies.getObject('orderIdsCookie');
    $scope.Session = $cookies.getObject('Session');

    $scope.AceptaPedido = function () {
      angular.element(document.getElementById('auxScope')).scope().gaAceptarCompra();
      deleteCookie('orderIdsCookie');
      deleteCookie('compararPedidosAnteriores');
      $location.path('/');
    };

    $scope.numeroConfirmacion = function (data) {
      if (!data) return false;
      else return true;
    };

    $scope.init = function () {
      if ($scope.currentPath === '/SuccessOrder') {
        $scope.CheckCookie();
      }
      
      PedidosFactory.postInsertOrderWithOutaffecting($scope.orderIdsCookie)
      .then(function (result) {
        return result;
      })
      .catch(function (result) { error(result.data); });




      // var Pedido = $scope.orderIdsCookie[0].IdPedido;
      // // console.log("resp",Pedido);
      // PedidosFactory.postPedidoForPDF(Pedido)
      // .then(function (result) {
      //   console.log("resp",result.data);
      // })
      // .catch(function (result) { error(result.data); });
      // .success(function (resp) {
        
      

          // $scope.Pedidos = ordersToPay.data;
          // if (!ordersToPay.data || ordersToPay.data.length === 0) {
          //   $scope.DeshabilitarPagar = true;
          //   return $scope.DeshabilitarPagar;
          // }
          // $scope.PedidosAgrupados = groupBy(ordersToPay.data, function (item) { return [item.IdPedido]; });
          // for (let x = 0; x < $scope.PedidosAgrupados.length; x++) {
          //   $scope.PedidosObj[$scope.PedidosAgrupados[x][0].IdPedido] = $scope.PedidosAgrupados[x][0];
          // }
          // $scope.TipoCambio = ordersToPay.data[0].TipoCambio;
        // });
        
    };

    $scope.init();

    function deleteCookie (CookieName) {
      document.cookie = CookieName + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
  };
  SuccessOrderController.$inject = ['$scope', '$log', '$rootScope', '$location', '$cookies', '$route','PedidosFactory'];
  angular.module('marketplace').controller('SuccessOrderController', SuccessOrderController);
})();
