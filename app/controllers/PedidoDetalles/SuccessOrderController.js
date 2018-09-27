(function () {
  var SuccessOrderController = function ($scope, $log, $rootScope, $location, $cookies, $route) {
    $scope.currentPath = $location.path();
    $scope.orderIdsCookie = $cookies.getObject('orderIdsCookie').data || $cookies.getObject('orderIdsCookie');
    $scope.Session = $cookies.getObject('Session');

    $scope.AceptaPedido = function () {
      deleteCookie('orderIdsCookie');
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
    };

    $scope.init();

    function deleteCookie (CookieName) {
      document.cookie = CookieName + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
  };
  SuccessOrderController.$inject = ['$scope', '$log', '$rootScope', '$location', '$cookies', '$route'];
  angular.module('marketplace').controller('SuccessOrderController', SuccessOrderController);
})();
