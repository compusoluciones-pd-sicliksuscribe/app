(function () {
  var DescuentosUpdateController = function ($scope, $log, $cookies, $location, DescuentosFactory, $routeParams) {
    var Session = {};
    Session = $cookies.getObject('Session');
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
        .then(result => {
          if (result.data.success) {
            $location.path('/Descuentos');
            $scope.ShowToast(result.data.message, 'success');
          } else {
            $scope.ShowToast(result.data.message, 'danger');
          }
        })
        .error(error => {
          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        });
    };
  };

  DescuentosUpdateController.$inject = ['$scope', '$log', '$cookies', '$location', 'DescuentosFactory', '$routeParams'];

  angular.module('marketplace').controller('DescuentosUpdateController', DescuentosUpdateController);
}());
