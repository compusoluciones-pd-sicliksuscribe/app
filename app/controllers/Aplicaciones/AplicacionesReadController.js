(function () {
  var AplicacionesReadController = function ($scope, $log, $location, $cookieStore, MigracionFactory) {
    $scope.goToMigraciones = function () {
      $location.path('/migraciones');
    };

    $scope.init = function () {
     
    };

    $scope.init();
  };

  AplicacionesReadController.$inject = ['$scope', '$log', '$location', '$cookieStore', 'MigracionFactory'];

  angular.module('marketplace').controller('AplicacionesReadController', AplicacionesReadController);
}());
