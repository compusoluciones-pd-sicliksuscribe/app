(function () {
  var DescuentosReadController = function ($scope, $log, $location, $cookies, DescuentosFactory) {
    $scope.sortBy = 'Nivel';
    $scope.reverse = false;

    $scope.init = () => {
      $scope.CheckCookie();
      DescuentosFactory.getDescuentos().then(resultDescuentos => {
        if (resultDescuentos.data.success) {
          $scope.Descuentos = resultDescuentos.data.data;
        } else {
          $scope.ShowToast(resultDescuentos.data.message, 'danger');
        }
      }).catch(error => {
        $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
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
        .then(result => {
          if (result.data.success) {
            $scope.ShowToast(result.data.message, 'success');
          } else {
            $scope.init();
            $scope.ShowToast(result.data.message, 'danger');
          }
        })
        .catch(error => {
          $scope.ShowToast('No pudimos eliminar el descuento seleccionado. Intenta de nuevo más tarde.', 'danger');
          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        });
    };
  };

  DescuentosReadController.$inject = ['$scope', '$log', '$location', '$cookies', 'DescuentosFactory'];

  angular.module('marketplace').controller('DescuentosReadController', DescuentosReadController);
}());
