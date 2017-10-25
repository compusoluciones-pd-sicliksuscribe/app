(function () {
  var SoporteCreateController = function ($scope, $log, $cookies, $location, $uibModal, $filter, SoporteFactory, $routeParams) {

    $scope.init = function () {

    };
    $scope.init();

    $scope.SolicitarSoporte = function () {
      if (!$scope.frm.$invalid) {
        SoporteFactory.postSolicitud({ Solicitud: $scope.Soporte })
          .success(function (resultado) {
            if (resultado.success === 1) {
              $scope.ShowToast('Solicitud enviada.', 'success');
              $location.path('monitor-soporte');
            }
          })
          .error(function (data, status, headers, config) {
            $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';

            $scope.ShowToast('No pudimos enviar tu solicitud, por favor intenta de nuevo más tarde.', 'danger');

            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      }
    };

    $scope.Cancelar = function () {
      $location.path('/monitor-soporte');
    };
  };
  SoporteCreateController.$inject = ['$scope', '$log', '$cookies', '$location', '$uibModal', '$filter', 'SoporteFactory', '$routeParams'];

  angular.module('marketplace').controller('SoporteCreateController', SoporteCreateController);
}());
