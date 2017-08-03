(function () {
  var MigracionDetalleController = function ($scope, $log, $location, $cookieStore, $routeParams) {
    var a = { Cliente: 'Cliente 1', Estatus: 'Orgasmo' };
    var b = { Cliente: 'Cliente 2', Estatus: 'Orgasmos' };
    var c = { Cliente: 'Cliente 3', Estatus: 'Orgasmoz' };
    $scope.migraciones = [a, b, c];
    $scope.idMigracion = $routeParams.idMigracion;
    $scope.pasoSeleccionado = 0;
    $scope.pasoActual = 0;
    $scope.pasosDeMigracion = [
      { llaveDePaso: 'NombreCliente', nombreDePaso: 'Nombre' },
      { llaveDePaso: 'RelacionarMayorista', nombreDePaso: 'Relacionar Mayorista' },
      { llaveDePaso: 'ImportarDominio', nombreDePaso: 'Crear cliente aplicación' },
      { llaveDePaso: 'CrearAdministrador', nombreDePaso: 'Crear administrador' },
      { llaveDePaso: 'OrdenarSuscripciones', nombreDePaso: 'Ordenar suscripciones' },
      { llaveDePaso: 'CancelarSuscripciones', nombreDePaso: 'Cancelar suscripciones' },
      { llaveDePaso: 'AsignarAsientos', nombreDePaso: 'Asignar asientos' }
    ];
    $scope.datosDeMigracion = {
      NombreCliente: 1,
      RelacionarMayorista: 1,
      CrearAdministrador: 1,
      ImportarDominio: 1,
      OrdenarSuscripciones: 0,
      CancelarSuscripciones: 0,
      AsignarAsientos: 0
    };
    $scope.setSelected = function (index) {
      if (index <= $scope.pasoActual) {
        $scope.pasoSeleccionado = index;
      }
    };
    $scope.regresar = function () {
      $location.path('/migraciones');
    };
    $scope.completarPaso = function () {
      if ($scope.pasoActual > $scope.pasoSeleccionado) {
        $scope.pasoSeleccionado = $scope.pasoActual;
      } else {
        $scope.pasoActual = $scope.pasoActual + 1;
        $scope.pasoSeleccionado = $scope.pasoActual;
      }
    };
  };

  MigracionDetalleController.$inject = ['$scope', '$log', '$location', '$cookieStore', '$routeParams'];

  angular.module('marketplace').controller('MigracionDetalleController', MigracionDetalleController);
}());
