(function () {
  var PowerBIReadController = function ($scope, $log, $cookieStore, $location, $uibModal, $filter, PedidoDetallesFactory, $routeParams) {

    $scope.init = function () {

    };
    $scope.init();
  };

  PowerBIReadController.$inject = ['$scope', '$log', '$cookieStore', '$location', '$uibModal', '$filter', 'PedidoDetallesFactory', '$routeParams'];

  angular.module('marketplace').controller('PowerBIReadController', PowerBIReadController);
}());
