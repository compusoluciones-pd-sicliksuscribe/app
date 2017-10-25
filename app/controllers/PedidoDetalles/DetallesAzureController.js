(function () {
  var DetallesAzureController = function ($scope, $log, $cookies, $location, $uibModal, $filter, PedidoDetallesFactory, $routeParams) {
    var IdPedido = $routeParams.IdPedido;
    $scope.Mostrar = false;
    $scope.MostrarMensaje = false;
    $scope.init = function () {
      PedidoDetallesFactory.getAzureUsage(IdPedido)
        .success(function (usage) {
          if (usage.data.length < 1) {
            $scope.Mostrar = false;
            $scope.MostrarMensaje = true;
          } else {
            $scope.Mostrar = true;
            $scope.MostrarMensaje = false;
          }
          $scope.Total = 0;
          $scope.UsageDetails = usage.data.map(function(item){
            if (item.Unidad === 'Hours') {
              item.Utilizado = Number(item.Utilizado).toFixed(2);
            } else {
              item.Utilizado = Number(item.Utilizado).toFixed(4);
            }
            $scope.Total += Number(item.Total);
            return item;
          });
          $scope.FechaActualizacion = usage.data[0].FechaActivo;
        })
        .error(function (data, status, headers, config) {
          $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';

          $scope.ShowToast('No pudimos cargar la lista de fabricantes, por favor intenta de nuevo más tarde.', 'danger');

          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });

    };
    $scope.init();

  };
  DetallesAzureController.$inject = ['$scope', '$log', '$cookies', '$location', '$uibModal', '$filter', 'PedidoDetallesFactory', '$routeParams'];

  angular.module('marketplace').controller('DetallesAzureController', DetallesAzureController);
}());
