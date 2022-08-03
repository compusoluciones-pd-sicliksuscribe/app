(function () {
  var PromocionsReadController = function ($scope, $log, $location, $cookies, PromocionsFactory) {
    $scope.sortBy = 'Nombre';
    $scope.reverse = false;

    $scope.init = function () {
      $scope.CheckCookie();
      PromocionsFactory.getPromocions($scope.SessionCookie.IdEmpresa)
        .then(Promocions => {
          $scope.Promocions = Promocions.data;
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
  };

  PromocionsReadController.$inject = ['$scope', '$log', '$location', '$cookies', 'PromocionsFactory'];

  angular.module('marketplace').controller('PromocionsReadController', PromocionsReadController);
}());
