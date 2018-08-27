(function () {
  var SuccessOrderController = function ($scope, $log, $rootScope, $location, $cookies, $route) {
    $scope.currentPath = $location.path();
    $scope.orderIdsCookie = $cookies.getObject('orderIdsCookie');
    $scope.Session = $cookies.getObject('Session');

    console.log('hola ', $scope.orderIdsCookie);

    $scope.MainView = function () {
      alert('aceptar eda');
    };

    $scope.init = function () {
      if ($scope.currentPath === '/SuccessOrder') {
        $scope.CheckCookie();
      }
    };

    $scope.init();

  };
  SuccessOrderController.$inject = ['$scope', '$log', '$rootScope', '$location', '$cookies', '$route'];
  angular.module('marketplace').controller('SuccessOrderController', SuccessOrderController);
})();
