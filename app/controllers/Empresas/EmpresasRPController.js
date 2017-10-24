(function () {
  var EmpresasRPController = function ($scope, $log, $cookies, $location, $uibModal, $filter, EmpresasXEmpresasFactory, NivelesDistribuidorFactory, $routeParams) {
    $scope.MostrarMensajeError = false;
    $scope.Empresas = [];
    $scope.Niveles = [];

    var error = function (error) {
      $scope.ShowToast(!error ? 'Ha ocurrido un error, intentelo mas tarde.' : error.message, 'danger');
      $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';
    };

    var obtenerEmpresas = function () {
      EmpresasXEmpresasFactory.getExchangeRateByIdEmpresa($routeParams.IdEmpresa)
        .then(function (respuesta) {
          var data = respuesta.data;
          var respuestaExitosa = data.success === 1;
          var empresas = data.data;
          if (respuestaExitosa) {
            var empresasConFormato = empresas.map(function (empresa) {
              empresa.FechaActivo = new Date(empresa.FechaActivo);
              return empresa;
            });
            $scope.Empresas = empresasConFormato;
          }
        })
        .catch(function (result) { error(result.data); });
    };

    var obtenerNiveles = function () {
      NivelesDistribuidorFactory.getNivelesDistribuidor()
        .then(function (result) {
          var response = result.data;
          if (!response.success) {
            error(result.data);
          } else {
            $scope.Niveles = response.data;
          }
        })
        .catch(function (result) { error(result.data); });
    };

    $scope.init = function () {
      obtenerEmpresas();
      obtenerNiveles();
    };

    $scope.init();

    $scope.asignarNivel = function (Empresa, IdNivelCS) {
      if (IdNivelCS === '') {
        IdNivelCS = Empresa.IdNivelCS;
      }
      var IdEmpresasXEmpresa = Empresa.IdEmpresasXEmpresa;
      var nivel = { IdEmpresasXEmpresa: IdEmpresasXEmpresa, IdNivelCS: IdNivelCS };
      NivelesDistribuidorFactory.asignarNivel(nivel)
        .then(function (result) {
          var response = result.data;
          if (!response.success) {
            error(result.data);
          } else {
            $scope.init();
            $scope.ShowToast('Nivel asignado.', 'success');
          }
        })
        .catch(function (result) { error(result.data); });
    };

    $scope.removerNivel = function (id) {
      NivelesDistribuidorFactory.removerNivel(id)
        .then(function (result) {
          var response = result.data;
          if (!response.success) {
            error(result.data);
          } else {
            $scope.init();
            $scope.ShowToast('Nivel removido.', 'success');
          }
        })
        .catch(function (result) { error(result.data); });
    };

    var tipoDeCambioValido = function (tipoDeCambio) {
      return tipoDeCambio > 0;
    };

    var actualizaTipoDeCambioATodasLasEmpresas = function () {
      $scope.Empresas = $scope.Empresas.map(function (Empresa) {
        Empresa.TipoCambioRP = $scope.RPTodos;
        return Empresa;
      });
    };

    var prepararDatosDePeticion = function (datos) {
      var empresas;
      if (typeof datos.map === 'function') {
        empresas = datos.slice();
      } else {
        empresas = [datos];
      }
      return {
        Empresas: empresas.map(function (Empresa) {
          return Object.assign({}, { TipoCambioRP: Number(Empresa.TipoCambioRP), IdEmpresasXEmpresa: Empresa.IdEmpresasXEmpresa });
        })
      };
    };

    $scope.ActualizarTodos = function () {
      if (tipoDeCambioValido($scope.RPTodos)) {
        actualizaTipoDeCambioATodasLasEmpresas();
        var datosDePeticion = prepararDatosDePeticion($scope.Empresas);
        EmpresasXEmpresasFactory.postExchangeRate(datosDePeticion)
          .then(function (respuesta) {
            var data = respuesta.data;
            var respuestaExitosa = data.success === 1;
            if (respuestaExitosa) {
              $scope.ShowToast('Actualizado correctamente.', 'success');
            } else {
              $scope.ShowToast('Error al actualizar el tipo de cambio.', 'danger');
            }
          })
          .catch(function (result) { error(result.data); });
        $scope.MostrarMensajeError = false;
      } else {
        $scope.MostrarMensajeError = true;
      }
    };

    $scope.ActualizarRP = function (Empresa) {
      if (tipoDeCambioValido(Empresa.TipoCambioRP)) {
        var datosDePeticion = prepararDatosDePeticion(Empresa);
        EmpresasXEmpresasFactory.postExchangeRate(datosDePeticion)
          .then(function (respuesta) {
            var data = respuesta.data;
            var respuestaExitosa = data.success === 1;
            if (respuestaExitosa) {
              $scope.ShowToast('Actualizado correctamente.', 'success');
            } else {
              $scope.ShowToast('Error al actualizar el tipo de cambio.', 'danger');
            }
          })
          .catch(function (result) { error(result.data); });
        Empresa.MostrarMensajeError = false;
      } else {
        Empresa.MostrarMensajeError = true;
      }
    };
  };
  EmpresasRPController.$inject = ['$scope', '$log', '$cookies', '$location', '$uibModal', '$filter', 'EmpresasXEmpresasFactory', 'NivelesDistribuidorFactory', '$routeParams'];

  angular.module('marketplace').controller('EmpresasRPController', EmpresasRPController);
}());