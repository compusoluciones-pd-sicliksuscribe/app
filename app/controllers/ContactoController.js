(function () {
  var ContactoController = function ($scope) {
    $scope.init = function () {
      $scope.esNavegadorSoportado();
      $scope.navCollapsed = true;
    };
    $scope.init();
  };

  ContactoController.$inject = ['$scope'];

  angular.module('marketplace').controller('ContactoController', ContactoController);
}());
