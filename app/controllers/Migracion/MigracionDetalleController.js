(function () {
  var MigracionDetalleController = function ($scope, $log, $location, $cookieStore, $routeParams, MigracionFactory) {
    $scope.idMigracion = $routeParams.idMigracion;
    $scope.pasoSeleccionado = 0;
    $scope.pasoActual = 0;
    $scope.pasosDeMigracion = [
      { IdPaso: 0, llaveDePaso: 'NombreMigracion', nombreDePaso: 'Nombre  migración' },
      { IdPaso: 1, llaveDePaso: 'RelacionarMayorista', nombreDePaso: 'Relacionar mayorista' },
      { IdPaso: 2, llaveDePaso: 'ImportarDominio', nombreDePaso: 'Crear cliente aplicación' },
      { IdPaso: 3, llaveDePaso: 'CrearAdministrador', nombreDePaso: 'Crear administrador' },
      { IdPaso: 4, llaveDePaso: 'OrdenarSuscripciones', nombreDePaso: 'Ordenar suscripciones' },
      { IdPaso: 5, llaveDePaso: 'CancelarSuscripciones', nombreDePaso: 'Cancelar suscripciones' },
      { IdPaso: 6, llaveDePaso: 'AsignarAsientos', nombreDePaso: 'Asignar asientos' }
    ];
    $scope.contextos = [
      { IdContexto: 1, Contexto: 'sandbox' },
      { IdContexto: 2, Contexto: 'produccion' }
    ];

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

    $scope.actualizarPasos = function () {
      if ($scope.idMigracion === '0') {
        $scope.pasoActual = 0;
        $scope.pasoSeleccionado = 0;
        return;
      }
      if ($scope.datosDeMigracion.RelacionarMayorista === 0) {
        $scope.pasoActual = 1;
        $scope.pasoSeleccionado = 1;
        return;
      }
      if ($scope.datosDeMigracion.CrearAdministrador === 0) {
        $scope.pasoActual = 2;
        $scope.pasoSeleccionado = 2;
        return;
      }
      if ($scope.datosDeMigracion.ImportarDominio === 0) {
        $scope.pasoActual = 3;
        $scope.pasoSeleccionado = 3;
        return;
      }
      if ($scope.datosDeMigracion.OrdenarSuscripciones === 0) {
        $scope.pasoActual = 4;
        $scope.pasoSeleccionado = 4;
        return;
      }
      if ($scope.datosDeMigracion.CancelarSuscripciones === 0) {
        $scope.pasoActual = 5;
        $scope.pasoSeleccionado = 5;
        return;
      }
      if ($scope.datosDeMigracion.AsignarAsientos === 0) {
        $scope.pasoActual = 6;
        $scope.pasoSeleccionado = 6;
        return;
      }
      $scope.pasoActual = 7;
      $scope.pasoSeleccionado = 7;
      return;
    };

    $scope.init = function () {
      if ($scope.idMigracion !== '0') {
        MigracionFactory.getMigracion($scope.idMigracion)
          .then(function (response) {
            $scope.datosDeMigracion = response.data.data[0];
            $scope.actualizarPasos();
          });
      }
      $scope.actualizarPasos();
    };

    $scope.init();

    $scope.crearMigracion = function () {
      console.log($scope.datosDeMigracion);
      var nuevaMigracion = {
        NombreMigracion: $scope.datosDeMigracion.NombreMigracion,
        IdContexto: $scope.datosDeMigracion.IdContexto
      };
      MigracionFactory.postMigracion(nuevaMigracion)
        .then(function (response) {
          console.log(response, response.data.data.success);
          if (response.data.success) {
            $location.path('/migraciones/' + response.data.data.insertId);
            return $scope.ShowToast(response.data.message, 'success');
          }
          $scope.ShowToast(response.data.message, 'danger');
          $scope.pasoActual--;
          $scope.pasoSeleccionado = $scope.pasoActual;
        });
    };

    $scope.actualizarPasosEnBaseDeDatos = function () {
      for (let x = 0; x < $scope.pasosDeMigracion.length; x++) {
        if ($scope.pasoActual === $scope.pasosDeMigracion[x].IdPaso) {
          $scope.nombrePorActualizar = $scope.pasosDeMigracion[x].llaveDePaso;
        }
      }
      var objParaActualizar = {
        IdMigracion: $scope.idMigracion
      };
      objParaActualizar[$scope.nombrePorActualizar] = 1;
      if ($scope.datosDeMigracion[$scope.nombrePorActualizar] != 1) {
        MigracionFactory.patchMigracion(objParaActualizar)
          .then(function (response) {
            if (response.data.success) {
              return $scope.ShowToast(response.data.message, 'success');
            }
            $scope.ShowToast(response.data.message, 'danger');
            $scope.pasoActual--;
            $scope.pasoSeleccionado = $scope.pasoActual;
          });
      }
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
      $scope.actualizarPasosEnBaseDeDatos();
      if ($scope.pasoActual === 0) {
        $scope.crearMigracion();
      }
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
      copyTextarea.select();
      document.execCommand('copy');
    };
  };

  MigracionDetalleController.$inject = ['$scope', '$log', '$location', '$cookieStore', '$routeParams', 'MigracionFactory'];

  angular.module('marketplace').controller('MigracionDetalleController', MigracionDetalleController);
}());
