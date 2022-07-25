(function () {
  var DescuentosCreateController = function ($scope, $log, $cookies, $location, DescuentosFactory, NivelesDistribuidorFactory) {
    var Session = {};
    Session = $cookies.getObject('Session');
    $scope.Session = Session;
    $scope.Descuento = {};

    $scope.init = function () {
      $scope.CheckCookie();

      DescuentosFactory.getEspecializaciones()
        .then(Especializaciones => {
          if (Especializaciones.data.success) {
            $scope.selectEspecializaciones = Especializaciones.data.data;
          } else {
            $scope.ShowToast(Especializaciones.data.message, 'danger');
            $location.path('/Descuentos');
          }
        })
        .catch(error => {
          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        });

      DescuentosFactory.getFamilias()
        .then(Familias => {
          if (Familias.data.success) {
            $scope.selectFamilias = Familias.data.data;
          } else {
            $scope.ShowToast(Familias.data.message, 'danger');
            $location.path('/Descuentos');
          }
        })
        .catch(error => {
          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        });

      NivelesDistribuidorFactory.getNivelesDistribuidor()
        .then(NivelesDistribuidor => {
          if (NivelesDistribuidor.data.success) {
            $scope.selectNivelesDistribuidor = NivelesDistribuidor.data.data;
          } else {
            $scope.ShowToast(NivelesDistribuidor.data.message, 'danger');
            $location.path('/Descuentos');
          }
        })
        .catch(error => {
          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        });
    };

    $scope.init();

    $scope.filtrarFamilia = function () {
      $scope.selectFamiliasFiltered = $scope.selectFamilias.filter(tipo => tipo['Especializacion'] === $scope.Descuento.Especializacion);
    };

    $scope.descuentoCancelar = function () {
      $location.path('/Descuentos');
    };

    $scope.descuentoCrear = function () {
      DescuentosFactory.postDescuento($scope.Descuento)
        .then(result => {
          if (result.data.success) {
            $location.path('/Descuentos');
            $scope.ShowToast(result.data.message, 'success');
          } else {
            $scope.ShowToast(result.data.message, 'danger');
          }
        })
        .catch(error => {
          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        });
    };
  };

  DescuentosCreateController.$inject = ['$scope', '$log', '$cookies', '$location', 'DescuentosFactory', 'NivelesDistribuidorFactory'];

  angular.module('marketplace').controller('DescuentosCreateController', DescuentosCreateController);
}());
