(function () {
  var DescuentoAnualCreateController = function ($scope, $log, $cookies, $location, DescuentosFactory, $routeParams) {
    var Session = {};
    Session = $cookies.getObject('Session');
    $scope.Session = Session;
    $scope.descuentoAnual = {};

    $scope.init = function () {
      $scope.CheckCookie();

      $scope.obtenerDescuentoAnual();
    };

    $scope.obtenerDescuentoAnual = function () {
      DescuentosFactory.getDescuentoAnual()
        .success(function (result) {
          if (result.success) {
            $scope.DescuentoAnual.PorcentajeDescuento = result.data.DescuentoAnual;
          } else {
            $scope.ShowToast(result.message, 'danger');
          }
        })
        .error(function (result) {
          $scope.ShowToast(result.message, 'danger');
        });
    };

    $scope.init();

    $scope.descuentoCancelar = function () {
      $location.path('/Descuento-Anual');
    };

    $scope.DescuentoAnual = function () {
      DescuentosFactory.postDescuentoAnual($scope.DescuentoAnual.PorcentajeDescuento)
          .success(function (result) {
            if (result.success) {
              $location.path('/Descuento-Anual');
              $scope.ShowToast(result.message, 'success');
            } else {
              $scope.ShowToast(result.message, 'danger');
            }
          })
          .error(function (result) {
            $scope.ShowToast(result.message, 'danger');
          });
    };
  };
  DescuentoAnualCreateController.$inject = ['$scope', '$log', '$cookies', '$location', 'DescuentosFactory', '$routeParams'];
  angular.module('marketplace').controller('DescuentoAnualCreateController', DescuentoAnualCreateController);
}());
