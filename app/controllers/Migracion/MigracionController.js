(function () {
  var MigracionController = function ($scope, $log, $location, $cookieStore, MigracionFactory) {
    $scope.editarMigracion = function (id) {
      $location.path('/migraciones/' + id);
    };

    $scope.init = function () {
      MigracionFactory.getMigraciones()
        .then(function (response) {
          $scope.migraciones = response.data.Migraciones;
        })
        .catch(console.log);
    };

    $scope.init();
  };

  MigracionController.$inject = ['$scope', '$log', '$location', '$cookieStore', 'MigracionFactory'];

  angular.module('marketplace').controller('MigracionController', MigracionController);
}());
