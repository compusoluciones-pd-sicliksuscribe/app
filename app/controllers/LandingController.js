(function () {
  var LandingController = function ($scope, $log, $location, $cookies, PromocionsFactory, deviceDetector) {
    $scope.Promociones = {};

    $scope.init = function () {
      $scope.esNavegadorSoportado();
      $scope.navCollapsed = true;
      if ($scope.currentDistribuidor) {
        PromocionsFactory.getPromocions($scope.currentDistribuidor.IdEmpresa)
        .success(function (Promociones) {
          $scope.Promociones = Promociones;
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
      }
    };

    $scope.init();
  };

  LandingController.$inject = ['$scope', '$log', '$location', '$cookies', 'PromocionsFactory', 'deviceDetector'];

  angular.module('marketplace').controller('LandingController', LandingController);
}());
