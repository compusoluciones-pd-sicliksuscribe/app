(function () {
  var EmpresasRPUFController = function ($scope, $log, $cookies, $location, $uibModal, $filter, EmpresasXEmpresasFactory, NivelesDistribuidorFactory, $routeParams) {
    $scope.MostrarMensajeError = false;
    $scope.Empresas = [];
    $scope.Niveles = [];

    var error = function (error) {
      $scope.ShowToast(!error ? 'Ha ocurrido un error, intentelo mas tarde.' : error.message, 'danger');
      $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';
    };

    var obtenerEmpresas = function () {
      EmpresasXEmpresasFactory.getClientsTuclick()
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
      NivelesDistribuidorFactory.getNivelesDistribuidorFinalUser()
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

    $scope.asignarNivelTuClick = function (Empresa, IdNivelDis) {
      if (IdNivelDis === '') {
        IdNivelDis = Empresa.IdNivelDis;
      }
      var IdEmpresasXEmpresa = Empresa.IdEmpresasXEmpresa;
      var nivel = { IdEmpresasXEmpresa: IdEmpresasXEmpresa, IdNivelDis: IdNivelDis };
      NivelesDistribuidorFactory.asignarNivelTuclick(nivel)
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
      NivelesDistribuidorFactory.removerNivelTuclick(id)
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
  };
  EmpresasRPUFController.$inject = ['$scope', '$log', '$cookies', '$location', '$uibModal', '$filter', 'EmpresasXEmpresasFactory', 'NivelesDistribuidorFactory', '$routeParams'];

  angular.module('marketplace').controller('EmpresasRPUFController', EmpresasRPUFController);
}());
