(function () {
  var DescuentosCreateController = function ($scope, $log, $cookies, $location, DescuentosFactory, NivelesDistribuidorFactory) {
    var Session = {};
    Session = $cookies.getObject('Session');
    $scope.Session = Session;
    $scope.Descuento = {};

    $scope.init = function () {
      $scope.CheckCookie();

      DescuentosFactory.getEspecializaciones()
        .success(function (Especializaciones) {
          if (Especializaciones.success) {
            $scope.selectEspecializaciones = Especializaciones.data;
          } else {
            $scope.ShowToast(Especializaciones.message, 'danger');
            $location.path('/Descuentos');
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });

      DescuentosFactory.getFamilias()
        .success(function (Familias) {
          if (Familias.success) {
            $scope.selectFamilias = Familias.data;
          } else {
            $scope.ShowToast(Familias.message, 'danger');
            $location.path('/Descuentos');
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });

      NivelesDistribuidorFactory.getNivelesDistribuidor()
        .success(function (NivelesDistribuidor) {
          if (NivelesDistribuidor.success) {
            $scope.selectNivelesDistribuidor = NivelesDistribuidor.data;
          } else {
            $scope.ShowToast(NivelesDistribuidor.message, 'danger');
            $location.path('/Descuentos');
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
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

  DescuentosCreateController.$inject = ['$scope', '$log', '$cookies', '$location', 'DescuentosFactory', 'NivelesDistribuidorFactory'];

  angular.module('marketplace').controller('DescuentosCreateController', DescuentosCreateController);
}());
