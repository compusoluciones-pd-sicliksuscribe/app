(function () {
  var NivelesReadController = function ($scope, $log, $location, $cookies, NivelesDistribuidorFactory) {
    $scope.sortBy = 'Nivel';
    $scope.reverse = false;
    $scope.Nivel = {};

    $scope.init = function () {
      $scope.CheckCookie();
      NivelesDistribuidorFactory.getNivelesDistribuidor()
        .then(resultNiveles => {
          if (resultNiveles.data.success) {
            $scope.Niveles = resultNiveles.data.data;
            $scope.Nivel.Nivel = '';
          } else {
            $scope.ShowToast(resultNiveles.data.message, 'danger');
          }
        })
        .catch(error => {
          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        });
    };

    $scope.init();

    $scope.OrdenarPor = function (Atributo) {
      $scope.sortBy = Atributo;
      $scope.reverse = !$scope.reverse;
    };

    $scope.agregarNivel = function () {
      NivelesDistribuidorFactory.postNivelesDistribuidor($scope.Nivel)
        .then(result => {
          if (result.data.success) {
            $scope.ShowToast(result.data.message, 'success');
            $scope.init();
          } else {
            $scope.ShowToast(result.data.message, 'danger');
          }
        })
        .catch(error => {
          $scope.ShowToast('No pudimos eliminar el descuento seleccionado. Intenta de nuevo más tarde.', 'danger');
          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        });
    };

    $scope.eliminarNivel = function (Nivel) {
      $scope.Niveles.forEach((Elemento, Index) => {
        if (Elemento.IdNivelDistribuidor === Nivel.IdNivelDistribuidor) {
          $scope.Niveles.splice(Index, 1);
          return false;
        }
      });

      NivelesDistribuidorFactory.deleteNivelesDistribuidor(Nivel.IdNivelDistribuidor)
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

    $scope.configurarNivel = function (nivel) {
      var path = '/Niveles/' + nivel.IdNivelDistribuidor + '/Productos';
      $location.path(path);
    };
  };

  NivelesReadController.$inject = ['$scope', '$log', '$location', '$cookies', 'NivelesDistribuidorFactory'];

  angular.module('marketplace').controller('NivelesReadController', NivelesReadController);
}());
