(function () {

  var PromocionsReadController = function ($scope, $log, $location, $cookies, PromocionsFactory) {
    $scope.sortBy = 'Nombre';
    $scope.reverse = false;

    $scope.init = function () {
      $scope.CheckCookie();
      PromocionsFactory.getPromocions($scope.SessionCookie.IdEmpresa)
        .success(function (Promocions) {
          $scope.Promocions = Promocions;
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
  };

  PromocionsReadController.$inject = ['$scope', '$log', '$location', '$cookies', 'PromocionsFactory'];

  angular.module('marketplace').controller('PromocionsReadController', PromocionsReadController);
}());
