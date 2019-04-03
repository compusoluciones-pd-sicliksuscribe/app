(function () {
  var DescuentoAnualCreateController = function ($scope, $log, $cookies, $location, DescuentosFactory, $routeParams) {
    var Session = {};
    Session = $cookies.getObject('Session');
    $scope.Session = Session;
    $scope.descuentoAnual = {};
    $scope.FechaExpiracion = '';

    $scope.init = function () {
      $scope.CheckCookie();
      $scope.obtenerDescuentoAnual();
    };

    $scope.obtenerDescuentoAnual = function () {
      DescuentosFactory.getDescuentoAnual()
        .success(function (result) {
          if (result.success) {
            $scope.DescuentoAnual.PorcentajeDescuento = result.data.DescuentoAnual;
            $scope.FechaExpiracion = new Date(result.data.FechaExpiracion);
          } else {
            if (result.message) {
              $scope.ShowToast(result.message, 'danger');
            } else {
              $scope.ShowToast('No tienes descuentos activos', 'danger');
            }
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
      var dateExpiration = document.getElementById("FechaExpiracion").value;
      DescuentosFactory.postDescuentoAnual($scope.DescuentoAnual.PorcentajeDescuento, dateExpiration)
          .success(function (result) {
            if (result.success) {
              $location.path('/Descuento-Anual');
              $scope.ShowToast(result.message, 'success');
            } else {
              $scope.ShowToast("Ingresa una fecha válida.", 'danger');
            }
          })
          .error(function (result) {
            $scope.ShowToast(result.message,'danger');
          });
    };
  };
  DescuentoAnualCreateController.$inject = ['$scope', '$log', '$cookies', '$location', 'DescuentosFactory', '$routeParams'];
  angular.module('marketplace').controller('DescuentoAnualCreateController', DescuentoAnualCreateController);
}());

