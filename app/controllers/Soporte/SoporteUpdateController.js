(function () {
  var SoporteUpdateController = function ($scope, $log, $cookies, $location, $uibModal, $filter, SoporteFactory, $routeParams) {
    var idSoporte = $routeParams.idSoporte;
    var combo = [];
    $scope.init = function () {
      SoporteFactory.getSolicitud(idSoporte)
        .then(resultado => {
          if (resultado.data.success === 1) {
            $scope.Soporte = resultado.data.data[0];
            $scope.Soporte.IdEstatus = resultado.data.data[0].IdEstatus.toString();
          }
        }).catch(error => {
          $scope.Mensaje = 'No pudimos conectarnos a la base de datos, por favor intenta de nuevo más tarde.';
          $scope.ShowToast('No pudimos cargar los datos del detalle, por favor intenta de nuevo más tarde.', 'danger');
          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        });
      SoporteFactory.getStatus()
        .then(resultado => {
          if (resultado.data.success === 1) {
            $scope.combo = resultado.data.data;
          }
        }).catch(error => {
          $scope.Mensaje = 'No pudimos conectarnos a la base de datos, por favor intenta de nuevo más tarde.';
          $scope.ShowToast('No pudimos cargar la lista de status, por favor intenta de nuevo más tarde.', 'danger');
          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
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
          .then(resultado => {
            if (resultado.data.success === 1) {
              $scope.ShowToast('Soporte actualizado.', 'success');
              $location.path('monitor-soporte');
            } else {
              $scope.ShowToast('Error al guardar los datos, verifica que los caracteres sean correctos.', 'danger');
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
  SoporteUpdateController.$inject = ['$scope', '$log', '$cookies', '$location', '$uibModal', '$filter', 'SoporteFactory', '$routeParams'];

  angular.module('marketplace').controller('SoporteUpdateController', SoporteUpdateController);
}());
