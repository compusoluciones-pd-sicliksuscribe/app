(function () {
  var NavegadoresController = function ($scope) {
    $scope.init = function () {
      $scope.esNavegadorSoportado();
      $scope.navCollapsed = true;
    };

    $scope.init();
  };
  NavegadoresController.$inject = ['$scope'];
  angular.module('marketplace').controller('NavegadoresController', NavegadoresController);
}());
