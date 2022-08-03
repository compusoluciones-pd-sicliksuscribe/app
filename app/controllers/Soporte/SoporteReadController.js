/* eslint-disable handle-callback-err */
(function () {
  var SoporteReadController = function ($scope, $log, $cookies, $location, $uibModal, $filter, SoporteFactory, FabricantesFactory, $routeParams) {
    $scope.soporteIdCategoria = '';

    $scope.Confirmar = function (IdSolicitud) {
      $scope.Solicitudes.forEach(function (solicitud) {
        if (solicitud.IdSoporte === IdSolicitud) {
          solicitud.Mostrar = !solicitud.Mostrar;
        }
      }, this);
    };
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

    $scope.getSolicitudes = function () {
      const payload = {
        Fabricante: $scope.soporteIdFabricante || 'all',
        Categoria: $scope.soporteIdCategoria || 'all'
      };
      SoporteFactory.getSolicitudes(payload)
      .then(Solicitudes => {
        $scope.Solicitudes = Solicitudes.data.data;
      })
      .catch(error => {
        $scope.Mensaje = 'No pudimos conectarnos a la base de datos, por favor intenta de nuevo más tarde.';

        $scope.ShowToast('No pudimos cargar la lista de solicitudes, por favor intenta de nuevo más tarde.', 'danger');

        $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
      });
    };

    $scope.BajaSolicitud = function (soporte) {
      SoporteFactory.putDeleteSupport(soporte)
      .then(data => {
        if (data.data) {
          $scope.ShowToast(data.data, 'success');
          $scope.init();
        } else {
          $scope.ShowToast(data.data, 'danger');
        }
      })
        .catch(error => {
          $scope.ShowToast('No pudimos dar de baja tu solicitud, por favor intenta de nuevo más tarde', 'danger');

          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        });
    };

    $scope.init = function () {
      obtenerCategorias();
      obtenerFabricantes();
      $scope.getSolicitudes();
    };
    $scope.init();

    $scope.NuevaSolicitud = function () {
      $location.path('solicitar-soporte');
    };

    $scope.EditarDetalle = function (id) {
      $location.path(`actualizar-soporte/${id}`);
    };
  };
  SoporteReadController.$inject = ['$scope', '$log', '$cookies', '$location', '$uibModal', '$filter', 'SoporteFactory', 'FabricantesFactory', '$routeParams'];

  angular.module('marketplace').controller('SoporteReadController', SoporteReadController);
}());
