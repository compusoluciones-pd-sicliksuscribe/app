(function () {
  var MigracionController = function ($scope, $log, $location, $cookieStore) {
    var a = { IdMigracion: 1, Cliente: 'Cliente 1', Estatus: 'hue' };
    var b = { IdMigracion: 2, Cliente: 'Cliente 2', Estatus: 'hues' };
    var c = { IdMigracion: 3, Cliente: 'Cliente 3', Estatus: 'huez' };
    $scope.migraciones = [a, b, c];
    $scope.editarMigracion = function (id) {
      $location.path('/migraciones/' + id);
    };
  };

  MigracionController.$inject = ['$scope', '$log', '$location', '$cookieStore'];

  angular.module('marketplace').controller('MigracionController', MigracionController);
}());
