(function () {
  var SoporteController = function ($scope) {
    $scope.init = function () {
      $scope.esNavegadorSoportado();
      $scope.navCollapsed = true;
    };

    $scope.init();
  };

  SoporteController.$inject = ['$scope'];

  angular.module('marketplace').controller('SoporteController', SoporteController);
}());
