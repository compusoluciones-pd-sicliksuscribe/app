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
      if ($scope.datosDeMigracion.ImportarDominio === 0) {
        $scope.pasoActual = 2;
        $scope.pasoSeleccionado = 2;
        return;
      }
      if ($scope.datosDeMigracion.CrearAdministrador === 0) {
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
      var nuevaMigracion = {
        NombreMigracion: $scope.datosDeMigracion.NombreMigracion,
        IdContexto: $scope.datosDeMigracion.IdContexto
      };
      return MigracionFactory.postMigracion(nuevaMigracion);
    };

    $scope.validarDominio = function () {
      if ($scope.datosDeMigracion.Dominio.trim() !== '') {
        MigracionFactory.getDominio($scope.datosDeMigracion)
          .then(function (response) {
            if (response.data.success === 0) {
              $scope.datosDeMigracion.NombreCliente = '';
              return $scope.ShowToast(response.data.message, 'danger');
            }
            $scope.datosDeMigracion.NombreCliente = response.data.items[0].companyProfile.companyName;
          });
      }
    };

    $scope.importarDominio = function () {
      if ($scope.datosDeMigracion.Dominio) {
        if ($scope.datosDeMigracion.Dominio.trim()) {
          let cliente = {
            migration: {
              IdMigracion: $scope.datosDeMigracion.IdMigracion
            },
            context: $scope.datosDeMigracion.Contexto,
            domain: $scope.datosDeMigracion.Dominio
          };
          return MigracionFactory.postCliente(cliente);
        }
        return Promise.reject({
          success: 0,
          message: 'Ingresa el dominio de microsoft'
        });
      }
      return Promise.reject({
        success: 0,
        message: 'Ingresa el dominio de microsoft'
      });
    };

    $scope.crearAdministrador = function () {
      let usuario = {
        IdMigracion: $scope.datosDeMigracion.IdMigracion,
        userInfo: {
          Usuario: $scope.datosDeMigracion.Usuario,
          Nombre: $scope.datosDeMigracion.NombreUsuario,
          Apellidos: $scope.datosDeMigracion.ApellidosUsuario,
          Secreto: $scope.datosDeMigracion.Secreto
        },
        context: $scope.datosDeMigracion.Contexto
      };
      return MigracionFactory.postUsuario(usuario);
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
      MigracionFactory.patchMigracion(objParaActualizar)
        .then(function (response) {
          if (response.data.success) {
            return $scope.ShowToast(response.data.message, 'success');
          }
          $scope.ShowToast(response.data.message, 'danger');
          $scope.pasoActual--;
          $scope.pasoSeleccionado = $scope.pasoActual;
        });
    };

    $scope.setSelected = function (index) {
      if (index <= $scope.pasoActual) {
        $scope.pasoSeleccionado = index;
      }
    };
    $scope.regresar = function () {
      $location.path('/migraciones');
    };

    $scope.actualizarSiguientePaso = function () {
      $scope.actualizarPasosEnBaseDeDatos();
      if ($scope.pasoActual > $scope.pasoSeleccionado) {
        $scope.pasoSeleccionado = $scope.pasoSeleccionado + 1;
      } else {
        $scope.pasoActual = $scope.pasoActual + 1;
        $scope.pasoSeleccionado = $scope.pasoActual;
      }
    };

    $scope.siguientePasoSinActualizar = function () {
      if ($scope.pasoActual > $scope.pasoSeleccionado) {
        $scope.pasoSeleccionado = $scope.pasoSeleccionado + 1;
      } else {
        $scope.pasoActual = $scope.pasoActual + 1;
        $scope.pasoSeleccionado = $scope.pasoActual;
      }
    };

    $scope.completarPaso = function () {
      if ($scope.pasoSeleccionado === 0 && $scope.datosDeMigracion.NombreMigracion !== '') {
        $scope.siguientePasoSinActualizar();
      }
      if ($scope.pasoActual === 0) {
        $scope.crearMigracion()
          .then(function (response) {
            if (response.data.success) {
              $location.path('/migraciones/' + response.data.data.insertId);
              return $scope.ShowToast(response.data.message, 'success');
            }
            $scope.ShowToast(response.data.message, 'danger');
            $scope.pasoActual--;
            $scope.pasoSeleccionado = $scope.pasoActual;
          });
      }
      if ($scope.pasoSeleccionado === 1 && $scope.datosDeMigracion.RelacionarMayorista == '1') {
        $scope.siguientePasoSinActualizar();
      }
      if ($scope.pasoActual === 1) {
        $scope.actualizarSiguientePaso();
      }
      if ($scope.pasoSeleccionado === 2 && $scope.datosDeMigracion.Dominio !== '') {
        $scope.siguientePasoSinActualizar();
      }
      if ($scope.pasoActual === 2) {
        $scope.importarDominio()
          .then(function (resultado) {
            if (resultado.data.success === 0) {
              return $scope.ShowToast(resultado.data.message, 'danger');
            }
            $scope.actualizarSiguientePaso();
          })
          .catch(function (err) {
            if (err.success === 0) {
              return $scope.ShowToast(err.message, 'danger');
            }
          });
      }
      if ($scope.pasoSeleccionado === 3 && $scope.datosDeMigracion.Usuario !== '') {
        $scope.siguientePasoSinActualizar();
      }
      if ($scope.pasoActual === 3) {
        $scope.crearAdministrador()
          .then(function (resultado) {
            console.log(resultado);
            if (resultado.data.success === 0) {
              return $scope.ShowToast(resultado.data.message, 'danger');
            }
            $scope.actualizarSiguientePaso();
          });
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
