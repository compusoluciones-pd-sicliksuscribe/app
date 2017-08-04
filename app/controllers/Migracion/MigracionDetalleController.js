(function () {
  var MigracionDetalleController = function ($scope, $log, $location, $cookieStore, $routeParams, MigracionFactory) {
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
    $scope.contextos = [
      { IdContexto: 1, Contexto: 'sandbox' },
      { IdContexto: 2, Contexto: 'produccion' }
    ];

    $scope.init = function () {
      if ($scope.idMigracion !== 0) {
        MigracionFactory.getMigracion($scope.idMigracion)
          .then(function (response) {
            $scope.datosDeMigracion = response.data.data[0];
          });
      } else {
        $scope.datosDeMigracion = {
          NombreMigracion: '',
          NombreCliente: '',
          Dominio: '',
          IdContexto: 1,
          Contexto: 'sandox',
          RelacionarMayorista: 0,
          CrearAdministrador: 0,
          ImportarDominio: 0,
          OrdenarSuscripciones: 0,
          CancelarSuscripciones: 0,
          AsignarAsientos: 0
        };
      }
    };

    $scope.init();

    $scope.crearMigracion = function () {
      console.log($scope.datosDeMigracion);
      var nuevaMigracion = {
        NombreMigracion: $scope.datosDeMigracion;
        
      }
      MigracionFactory.postMigracion($scope.datosDeMigracion)
        .then()
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
        $scope.pasoSeleccionado = $scope.pasoSeleccionado + 1;
      } else {
        $scope.pasoActual = $scope.pasoActual + 1;
        $scope.pasoSeleccionado = $scope.pasoActual;
      }
    };
    $scope.pasoAnterior = function () {
      if ($scope.pasoSeleccionado > 0) {
        $scope.pasoSeleccionado = $scope.pasoSeleccionado - 1;
      }
    };
    $scope.copyToCipbard = function () {
      var copyTextarea = document.querySelector('#invite-url');
      console.log(copyTextarea)
      copyTextarea.select();
      document.execCommand('copy');
      console.log($scope.datosDeMigracion);
    };
  };

  MigracionDetalleController.$inject = ['$scope', '$log', '$location', '$cookieStore', '$routeParams', 'MigracionFactory'];

  angular.module('marketplace').controller('MigracionDetalleController', MigracionDetalleController);
}());
