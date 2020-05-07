(function () {
  var SuccessOrderController = function ($scope, $log, $rootScope, $location, $cookies, $route, PedidoDetallesFactory) {
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

    $scope.abrirModal = function (modal) {
      document.getElementById(modal).style.display = 'block';
    };

    $scope.cerrarModal = function (modal) {
      document.getElementById(modal).style.display = 'none';
    };

    $scope.init = function () {
      if ($scope.currentPath === '/SuccessOrder') {
        $scope.CheckCookie();
        $scope.MPNID = $scope.orderIdsCookie[0].IdMicrosoftDist;
        PedidoDetallesFactory.getMPIDInformation(parseInt($scope.MPNID))
        .success(function (response) {
          response.data.status === 'active' ? $scope.isMPNIDActive = true : $scope.isMPNIDActive = false;
          if (!$scope.isMPNIDActive) $scope.abrirModal('isValidMPNIDModal');
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
      }
    };

    $scope.init();

    function deleteCookie (CookieName) {
      document.cookie = CookieName + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
  };
  SuccessOrderController.$inject = ['$scope', '$log', '$rootScope', '$location', '$cookies', '$route', 'PedidoDetallesFactory'];
  angular.module('marketplace').controller('SuccessOrderController', SuccessOrderController);
})();
