(function () {
  var NivelesReadController = function ($scope, $log, $location, $cookieStore, NivelesDistribuidorFactory) {
    $scope.sortBy = 'Nivel';
    $scope.reverse = false;
    $scope.Nivel = {};

    $scope.init = function () {
      $scope.CheckCookie();
      NivelesDistribuidorFactory.getNivelesDistribuidor()
        .success(function (resultNiveles) {
          if (resultNiveles.success) {
            $scope.Niveles = resultNiveles.data;
            $scope.Nivel.Nivel = '';
          } else {
            $scope.ShowToast(resultNiveles.message, 'danger');
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

    $scope.agregarNivel = function () {
      NivelesDistribuidorFactory.postNivelesDistribuidor($scope.Nivel)
        .success(function (result) {
          if (result.success) {
            $scope.ShowToast(result.message, 'success');
            $scope.init();
          } else {
            $scope.ShowToast(result.message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos eliminar el descuento seleccionado. Intenta de nuevo más tarde.', 'danger');
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.eliminarNivel = function (Nivel) {
      $scope.Niveles.forEach(function (Elemento, Index) {
        if (Elemento.IdNivelDistribuidor === Nivel.IdNivelDistribuidor) {
          $scope.Niveles.splice(Index, 1);
          return false;
        }
      });

      NivelesDistribuidorFactory.deleteNivelesDistribuidor(Nivel.IdNivelDistribuidor)
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

  NivelesReadController.$inject = ['$scope', '$log', '$location', '$cookieStore', 'NivelesDistribuidorFactory'];

  angular.module('marketplace').controller('NivelesReadController', NivelesReadController);
}());
