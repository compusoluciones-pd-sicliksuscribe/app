(function () {
  var DescuentosReadController = function ($scope, $log, $location, $cookies, DescuentosFactory) {
    $scope.sortBy = 'Nivel';
    $scope.reverse = false;

    $scope.init = function () {
      $scope.CheckCookie();
      DescuentosFactory.getDescuentos()
        .success(function (resultDescuentos) {
          if (resultDescuentos.success) {
            $scope.Descuentos = resultDescuentos.data;
          } else {
            $scope.ShowToast(resultDescuentos.message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.init();

    $scope.OrdenarPor = function (Atributo) {
      $scope.sortBy = Atributo;
      $scope.reverse = !$scope.reverse;
    };

    $scope.eliminarDescuento = function (Descuento) {
      $scope.Descuentos.forEach(function (Elemento, Index) {
        if (Elemento.IdConfiguracionDescuento === Descuento.IdConfiguracionDescuento) {
          $scope.Descuentos.splice(Index, 1);
          return false;
        }
      });

      DescuentosFactory.deleteDescuento(Descuento.IdConfiguracionDescuento)
        .success(function (result) {
          if (result.success) {
            $scope.ShowToast(result.message, 'success');
          } else {
            $scope.init();
            $scope.ShowToast(result.message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos eliminar el descuento seleccionado. Intenta de nuevo más tarde.', 'danger');
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };
  };

  DescuentosReadController.$inject = ['$scope', '$log', '$location', '$cookies', 'DescuentosFactory'];

  angular.module('marketplace').controller('DescuentosReadController', DescuentosReadController);
}());
