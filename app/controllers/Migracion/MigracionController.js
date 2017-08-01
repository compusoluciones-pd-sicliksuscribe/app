(function () {
  var MigracionController = function ($scope, $log, $location, $cookieStore) {
    var a = { Cliente: 'Cliente 1', Estatus: 'Orgasmo' };
    var b = { Cliente: 'Cliente 2', Estatus: 'Orgasmos' };
    var c = { Cliente: 'Cliente 3', Estatus: 'Orgasmoz' };
    $scope.migraciones = [a, b, c];
  };

  MigracionController.$inject = ['$scope', '$log', '$location', '$cookieStore'];

  angular.module('marketplace').controller('MigracionController', MigracionController);
}());
