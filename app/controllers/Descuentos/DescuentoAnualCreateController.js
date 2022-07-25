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
        .then(result => {
          if (result.data.success) {
            $scope.DescuentoAnual.PorcentajeDescuento = result.data.data.DescuentoAnual;
            $scope.FechaExpiracion = new Date(result.data.data.FechaExpiracion);
          } else {
            if (result.data.message) {
              $scope.ShowToast(result.data.message, 'danger');
            } else {
              $scope.ShowToast('No tienes descuentos activos', 'danger');
            }
          }
        })
        .catch(error => {
          $scope.ShowToast(error.message, 'danger');
        });
    };

    $scope.init();

    $scope.descuentoCancelar = function () {
      $location.path('/Descuento-Anual');
    };

    $scope.DescuentoAnual = function () {
      var dateExpiration = document.getElementById('FechaExpiracion').value;
      DescuentosFactory.postDescuentoAnual($scope.DescuentoAnual.PorcentajeDescuento, dateExpiration)
          .then(result => {
            if (result.data.success) {
              $location.path('/Descuento-Anual');
              $scope.ShowToast(result.data.message, 'success');
            } else {
              $scope.ShowToast('Ingresa una fecha válida.', 'danger');
            }
          })
          .catch(error => {
            $scope.ShowToast(error.message, 'danger');
          });
    };
  };
  DescuentoAnualCreateController.$inject = ['$scope', '$log', '$cookies', '$location', 'DescuentosFactory', '$routeParams'];
  angular.module('marketplace').controller('DescuentoAnualCreateController', DescuentoAnualCreateController);
}());

