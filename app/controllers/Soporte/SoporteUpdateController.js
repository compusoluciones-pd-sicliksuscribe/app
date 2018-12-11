(function () {
  var SoporteUpdateController = function ($scope, $log, $cookies, $location, $uibModal, $filter, SoporteFactory, $routeParams) {
    var idSoporte = $routeParams.idSoporte;
    var combo = [];
    $scope.init = function () {
      SoporteFactory.getSolicitud(idSoporte)
        .success(function (resultado) {
          if (resultado.success === 1) {
            $scope.Soporte = resultado.data[0];
            $scope.Soporte.IdEstatus = resultado.data[0].IdEstatus.toString();
          }
        }).error(function (data, status, headers, config) {
          $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';
          $scope.ShowToast('No pudimos cargar los datos del detalle, por favor intenta de nuevo más tarde.', 'danger');
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
      SoporteFactory.getStatus()
        .success(function (resultado) {
          if (resultado.success === 1) {
            $scope.combo = resultado.data;
          }
        }).error(function (data, status, headers, config) {
          $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';
          $scope.ShowToast('No pudimos cargar la lista de status, por favor intenta de nuevo más tarde.', 'danger');
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };
    $scope.init();
    $scope.ActualizarSoporte = function () {
      if (!$scope.frm.$invalid) {
        var soporte = {
          IdEstatus: $scope.Soporte.IdEstatus,
          DescripcionSolucion: $scope.Soporte.DescripcionSolucion
        };
        SoporteFactory.patchSolicitud(idSoporte, soporte)
          .success(function (resultado) {
            if (resultado.success === 1) {
              $scope.ShowToast('Soporte actualizado.', 'success');
              $location.path('monitor-soporte');
            }else {
            $scope.ShowToast('Error al guardar los datos, verifica que los caracteres sean correctos.', 'danger');
          }
          })
          .error(function (data, status, headers, config) {
            $scope.Mensaje = 'No pudimos conectarnos a la base de datos, por favor intenta de nuevo más tarde.';
            $scope.ShowToast('No pudimos enviar tu solicitud, por favor intenta de nuevo más tarde.', 'danger');
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      }
    };

    $scope.Cancelar = function () {
      $location.path('/monitor-soporte');
    };
  };
  SoporteUpdateController.$inject = ['$scope', '$log', '$cookies', '$location', '$uibModal', '$filter', 'SoporteFactory', '$routeParams'];

  angular.module('marketplace').controller('SoporteUpdateController', SoporteUpdateController);
}());
