(function () {
  var SolicitudReadController = function ($scope, $log, $cookies, $location, EmpresasFactory) {
    $scope.EstatusSelect = {};
    $scope.init = function () {
      EmpresasFactory.getSolicitudes()
        .success(function (result) {
          $scope.Solicitudes = result.data;
        })
        .error(function (data) {
          $scope.ShowToast('Error al cargar solicitudes.', 'danger');
        });
      EmpresasFactory.getSiteStatus()
        .success(function (result) {
          $scope.Estatus = result.data;
          $scope.EstatusSelect.IdEstatus = 1;
        })
        .error(function (data) {
          $scope.ShowToast('Error al cargar estatus.', 'danger');
        });
    };

    $scope.init();

    $scope.patch = function (solicitud, IdEstatus) {
      EmpresasFactory.patchSolicitud({ IdSolicitud: solicitud.IdSolicitud, IdEstatus, IdEmpresa: solicitud.IdEmpresa })
        .success(function (result) {
          $scope.init();
          $scope.ShowToast(result.message, 'succes');
        })
        .error(function (data) {
          $scope.ShowToast('Error al actualizar solicitud.', 'danger');
        });
    };
  };

  SolicitudReadController.$inject = ['$scope', '$log', '$cookies', '$location', 'EmpresasFactory'];

  angular.module('marketplace').controller('SolicitudReadController', SolicitudReadController);
}());
