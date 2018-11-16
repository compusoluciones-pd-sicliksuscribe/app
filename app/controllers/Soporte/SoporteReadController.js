(function () {
  var SoporteReadController = function ($scope, $log, $cookies, $location, $uibModal, $filter, SoporteFactory , FabricantesFactory , $routeParams) {
    $scope.Confirmar = function (IdSolicitud) {
      $scope.Solicitudes.forEach(function (solicitud) {
        if (solicitud.IdSoporte === IdSolicitud) {
          solicitud.Mostrar = !solicitud.Mostrar;
        }
      }, this);
    };
    const obtenerFabricantes = function () {
      FabricantesFactory.getFabricantes()
      .success(function (Fabricantes) {
        $scope.selectFabricantes = Fabricantes;
      })
      .error(function (data, status, headers, config) {
        $scope.ShowToast('No pudimos cargar la lista de fabricantes, por favor intenta de nuevo más tarde.', 'danger');
      });
    };
    const obtenerCategorias = function () {
      SoporteFactory.getCategorysReport()
          .success(function (Categorias) {
            if (Categorias.success === 1) {
              $scope.selectCategorias = Categorias.data;
            }
            console.log(JSON.stringify($scope.selectCategorias));
          })
          .error(function (data, status, headers, config) {
            $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';

            $scope.ShowToast('No pudimos enviar tu solicitud, por favor intenta de nuevo más tarde.', 'danger');

            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
    };

    const getSolicitudes = function (Fabricante = 'all', Categoria = 'all') {
      const payload = {
        Fabricante,
        Categoria
      };
      SoporteFactory.getSolicitudes(payload)
      .success(function (Solicitudes) {
        $scope.Solicitudes = Solicitudes.data;
      })
      .error(function (data, status, headers, config) {
        $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';

        $scope.ShowToast('No pudimos cargar la lista de solicitudes, por favor intenta de nuevo más tarde.', 'danger');

        $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
      });
    };

    $scope.BajaSolicitud = function (soporte) {
      console.log(JSON.stringify(soporte));
      SoporteFactory.putDeleteSupport(soporte)
        .success(function (data) {
          if (data) {
            $scope.ShowToast(data, 'success');

            $scope.init();
          } else {
            $scope.ShowToast(data, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos dar de baja tu solicitud, por favor intenta de nuevo más tarde', 'danger');

          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.init = function () {
      obtenerCategorias();
      obtenerFabricantes();
      getSolicitudes();
    };
    $scope.init();

    $scope.NuevaSolicitud = function () {
      $location.path('solicitar-soporte');
    };

    $scope.EditarDetalle = function (id) {
      console.log(id);
      $location.path('actualizar-soporte/'+id);
    };
  };
  SoporteReadController.$inject = ['$scope', '$log', '$cookies', '$location', '$uibModal', '$filter', 'SoporteFactory','FabricantesFactory', '$routeParams'];

  angular.module('marketplace').controller('SoporteReadController', SoporteReadController);
}());
