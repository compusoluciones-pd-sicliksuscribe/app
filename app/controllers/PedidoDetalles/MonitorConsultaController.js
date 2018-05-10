(function () {
  var MonitorConsultaController = function ($scope, $log, $cookies, $location, $uibModal, $filter, PedidoDetallesFactory, $routeParams) {
    $scope.Pedidos = [];
    $scope.BuscarProductos = {};
    $scope.filter = '';
    $scope.getEnterprise = 0;
    var searchTimeout;
    var itemsPerPage = 10;
    $scope.getNumberOfPages = [1];
    var FilteredOrders = [];

    $scope.setCurrentPage = function (i) { $scope.currentPage = i; };

    const setPagination = function () {
      const pages = Math.ceil(FilteredOrders.length / itemsPerPage);
      $scope.paginatedOrders = {};
      $scope.currentPage = 0;
      $scope.getNumberOfPages = new Array(pages);
      for (var i = 0; i < pages; i++) {
        $scope.paginatedOrders[i] = FilteredOrders.slice(i * itemsPerPage, (i + 1) * itemsPerPage);
      }
    };

    $scope.init = function () {
      getDistributorInformation();
      // $scope.search();
      $scope.callFunctions();
    };

    const getDistributorInformation = function () {
      PedidoDetallesFactory.getDistributorData()
        .then(function (result) {
          // var nuevoPedido = result.data.data.slice(0, 10);
          $scope.Pedidos = result.data.data;
          // FilteredOrders = result.data.data;
        })
        .catch(function (result) {
          $scope.ShowToast(result.data.message, 'danger');
        });

      PedidoDetallesFactory.datesOrders()
        .then(function (result) {
          $scope.Years = result.data.data;
        })
        .catch(function (result) {
          $scope.ShowToast(result.data.message, 'danger');
        });

      PedidoDetallesFactory.getFinalUser()
        .then(function (result) {
          $scope.selectFinalUser = result.data.data;
        })
        .catch(function (result) {
          $scope.ShowToast(result.data.message, 'danger');
        });

      $scope.MesActual = {};
      $scope.YearActual = {};
      $scope.Meses = [
          { id: '01', mes: 'Enero' },
          { id: '02', mes: 'Febrero' },
          { id: '03', mes: 'Marzo' },
          { id: '04', mes: 'Abril' },
          { id: '05', mes: 'Mayo' },
          { id: '06', mes: 'Junio' },
          { id: '07', mes: 'Julio' },
          { id: '08', mes: 'Agosto' },
          { id: '09', mes: 'Septiembre' },
          { id: '10', mes: 'Octubre' },
          { id: '11', mes: 'Noviembre' },
          { id: '12', mes: 'Diciembre' }
      ];

      let hoy = new Date();
      let month = hoy.getMonth() + 1;
      month = month < 10 ? '0' + month : '' + month;
      let year = hoy.getFullYear();
      $scope.MesActual.id = month;
      $scope.YearActual.Year = year;
    };

    const filterProducts = function () {
      const filter = $scope.filter.toLowerCase();
      console.log($scope.filter);
      FilteredOrders = $scope.Pedidos.filter(function (order) {
        // console.log(order);
        if (!order.IdPedido) {
          return false;
        }
        const MesActual = parseInt($scope.MesActual.id);
        return (order.IdPedido === $scope.Pedidos.IdPedido &&
          (order.NombreEmpresa.toLowerCase().includes(filter) ||
          order.IdPedido.toString().includes(filter)) &&
          order.Month === MesActual &&
          order.Year === $scope.YearActual.Year
        );
      });
      setPagination();
      $scope.$apply();
      console.log(FilteredOrders);
    };

    $scope.search = function () {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(filterProducts, 150);
    };

    $scope.callFunctions = function () {
      $scope.search();
    };

    $scope.init();
  };
  MonitorConsultaController.$inject = ['$scope', '$log', '$cookies', '$location', '$uibModal', '$filter', 'PedidoDetallesFactory', '$routeParams'];

  angular.module('marketplace').controller('MonitorConsultaController', MonitorConsultaController);
}());
