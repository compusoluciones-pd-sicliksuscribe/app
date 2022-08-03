(function () {
  var SolicitudReadController = function ($scope, $log, $cookies, $location, EmpresasFactory) {
    $scope.EstatusSelect = {};
    $scope.init = function () {
      EmpresasFactory.getSolicitudes()
        .then(result => {
          $scope.Solicitudes = result.data.data;
        })
        .catch(data => {
          $scope.ShowToast('Error al cargar solicitudes.', 'danger');
        });
      EmpresasFactory.getSiteStatus()
        .then(result => {
          $scope.Estatus = result.data.data;
          $scope.EstatusSelect.IdEstatus = 1;
        })
        .catch(data => {
          $scope.ShowToast('Error al cargar estatus.', 'danger');
        });
    };

    $scope.init();

    $scope.patch = function (solicitud, IdEstatus) {
      EmpresasFactory.patchSolicitud({ IdSolicitud: solicitud.IdSolicitud, IdEstatus, IdEmpresa: solicitud.IdEmpresa })
        .then(result => {
          $scope.init();
          $scope.ShowToast(result.data.message, 'succes');
        })
        .catch(data => {
          $scope.ShowToast('Error al actualizar solicitud.', 'danger');
        });
    };
  };

  SolicitudReadController.$inject = ['$scope', '$log', '$cookies', '$location', 'EmpresasFactory'];

  angular.module('marketplace').controller('SolicitudReadController', SolicitudReadController);
}());
