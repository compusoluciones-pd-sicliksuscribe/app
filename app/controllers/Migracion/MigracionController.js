(function () {
  var MigracionController = function ($scope, $log, $location, $cookies, MigracionFactory) {
    $scope.editarMigracion = function (id) {
      $location.path('/migraciones/' + id);
    };

    $scope.init = function () {
      MigracionFactory.getMigraciones()
        .then(response => {
          $scope.migraciones = response.data.Migraciones;
        })
        .catch(console.log);
    };

    $scope.init();
  };

  MigracionController.$inject = ['$scope', '$log', '$location', '$cookies', 'MigracionFactory'];

  angular.module('marketplace').controller('MigracionController', MigracionController);
}());
