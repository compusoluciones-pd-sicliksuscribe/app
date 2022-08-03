/* eslint-disable handle-callback-err */
(function () {
  var SoporteCreateController = function ($scope, $log, $cookies, $location, $uibModal, $filter, FabricantesFactory, SoporteFactory, $routeParams) {
    $scope.selectFabricantes = {};
    $scope.selectCategorias = {};

    const obtenerFabricantes = function () {
      FabricantesFactory.getFabricantes()
      .then(Fabricantes => {
        $scope.selectFabricantes = Fabricantes.data;
      })
      .catch(error => {
        $scope.ShowToast('No pudimos cargar la lista de fabricantes, por favor intenta de nuevo más tarde.', 'danger');
      });
    };

    const obtenerCategorias = function () {
      SoporteFactory.getCategorysReport()
          .then(Categorias => {
            if (Categorias.data.success === 1) {
              $scope.selectCategorias = Categorias.data.data;
            }
          })
          .catch(error => {
            $scope.Mensaje = 'No pudimos conectarnos a la base de datos, por favor intenta de nuevo más tarde.';

            $scope.ShowToast('No pudimos enviar tu solicitud, por favor intenta de nuevo más tarde.', 'danger');

            $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
          });
    };

    $scope.init = function () {
      obtenerFabricantes();
      obtenerCategorias();
    };

    $scope.init();

    $scope.SolicitarSoporte = function () {
      if (!$scope.frm.$invalid) {
        SoporteFactory.postSolicitud({ Solicitud: $scope.Soporte })
          .then(resultado => {
            if (resultado.data.success === 1) {
              $scope.ShowToast('Solicitud enviada.', 'success');
              $location.path('monitor-soporte');
            }
          })
          .catch(error => {
            $scope.Mensaje = 'No pudimos conectarnos a la base de datos, por favor intenta de nuevo más tarde.';

            $scope.ShowToast('No pudimos enviar tu solicitud, por favor intenta de nuevo más tarde.', 'danger');

            $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
          });
      }
    };

    $scope.Cancelar = function () {
      $location.path('/monitor-soporte');
    };
  };
  SoporteCreateController.$inject = ['$scope', '$log', '$cookies', '$location', '$uibModal', '$filter', 'FabricantesFactory', 'SoporteFactory', '$routeParams'];

  angular.module('marketplace').controller('SoporteCreateController', SoporteCreateController);
}());
