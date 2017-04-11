(function () {
  var DescuentosUpdateController = function ($scope, $log, $cookieStore, $location, DescuentosFactory, $routeParams) {
    var Session = {};
    Session = $cookieStore.get('Session');
    $scope.Session = Session;
    $scope.Descuento = JSON.parse($routeParams.Descuento);

    $scope.init = function () {
      $scope.CheckCookie();
    };

    $scope.init();

    $scope.descuentoCancelar = function () {
      $location.path('/Descuentos');
    };

    $scope.descuentoActualizar = function () {
      DescuentosFactory.putDescuento($scope.Descuento)
        .success(function (result) {
          if (result.success) {
            $location.path('/Descuentos');
            $scope.ShowToast(result.message, 'success');
          } else {
            $scope.ShowToast(result.message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };
  };

  DescuentosUpdateController.$inject = ['$scope', '$log', '$cookieStore', '$location', 'DescuentosFactory', '$routeParams'];

  angular.module('marketplace').controller('DescuentosUpdateController', DescuentosUpdateController);
}());
