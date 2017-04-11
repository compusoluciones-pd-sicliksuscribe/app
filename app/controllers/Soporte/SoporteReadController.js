(function () {
  var SoporteReadController = function ($scope, $log, $cookieStore, $location, $uibModal, $filter, SoporteFactory, $routeParams) {

    $scope.init = function () {
      SoporteFactory.getSolicitudes()
        .success(function (Solicitudes) {
          $scope.Solicitudes = Solicitudes.data;
        })
        .error(function (data, status, headers, config) {
          $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';

          $scope.ShowToast('No pudimos cargar la lista de solicitudes, por favor intenta de nuevo más tarde.', 'danger');

          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };
    $scope.init();

    $scope.NuevaSolicitud = function () {
      $location.path('solicitar-soporte');
    };
  };
  SoporteReadController.$inject = ['$scope', '$log', '$cookieStore', '$location', '$uibModal', '$filter', 'SoporteFactory', '$routeParams'];

  angular.module('marketplace').controller('SoporteReadController', SoporteReadController);
}());
