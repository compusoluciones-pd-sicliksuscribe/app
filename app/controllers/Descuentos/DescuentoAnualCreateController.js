(function () {
    var DescuentoAnualCreateController = function ($scope, $log, $cookies, $location, DescuentosFactory, $routeParams) {
      var Session = {};
      Session = $cookies.getObject('Session');
      $scope.Session = Session;
  
      $scope.init = function () {
        $scope.CheckCookie();
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
          .error(function (data, status, headers, config) {
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      };
    };
  DescuentoAnualCreateController.$inject = ['$scope', '$log', '$cookies', '$location', 'DescuentosFactory', '$routeParams'];
  angular.module('marketplace').controller('DescuentoAnualCreateController',  DescuentoAnualCreateController);
}());
  