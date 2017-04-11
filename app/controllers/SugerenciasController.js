(function () {
  var SugerenciasController = function ($scope) {
    $scope.init = function () {
      $scope.navCollapsed = true;
    };

    $scope.init();
  };

  SugerenciasController.$inject = ['$scope'];

  angular.module('marketplace').controller('SugerenciasController', SugerenciasController);
}());
