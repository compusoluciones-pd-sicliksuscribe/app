(function () {
  var SincronizadorReadController = function ($scope, $log, $location, $cookies, $routeParams, ProductosXEmpresaFactory, FabricantesFactory, TiposProductosFactory, PedidoDetallesFactory, TipoCambioFactory, ProductoGuardadosFactory, EmpresasXEmpresasFactory, EmpresasFactory, $anchorScroll, ProductosFactory, ComprasUFFactory, UsuariosFactory) {
    $scope.titulo = '';
    $scope.pedidos = {};

    $scope.mostrarModal = function (titulo) {
      $scope.titulo = titulo;
    };

    $scope.init = function () {

    };

    $scope.init();
  };

  SincronizadorReadController.$inject =
    ['$scope', '$log', '$location', '$cookies', '$routeParams', 'ProductosXEmpresaFactory', 'FabricantesFactory', 'TiposProductosFactory', 'PedidoDetallesFactory', 'TipoCambioFactory', 'ProductoGuardadosFactory', 'EmpresasXEmpresasFactory', 'EmpresasFactory', '$anchorScroll', 'ProductosFactory', 'ComprasUFFactory', 'UsuariosFactory'];

  angular.module('marketplace').controller('SincronizadorReadController', SincronizadorReadController);
}());
