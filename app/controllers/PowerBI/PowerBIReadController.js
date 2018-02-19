(function () {
  var PowerBIReadController = function ($scope, $log, $cookies, $location, $uibModal, $filter, PedidoDetallesFactory, $routeParams) {

    $scope.init = function () {

    };
    $scope.init();
  };

  PowerBIReadController.$inject = ['$scope', '$log', '$cookies', '$location', '$uibModal', '$filter', 'PedidoDetallesFactory', '$routeParams'];

  angular.module('marketplace').controller('PowerBIReadController', PowerBIReadController);
}());
