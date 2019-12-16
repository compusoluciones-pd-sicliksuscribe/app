(function () {
  var MonitorConsultaController = function ($scope, $log, $cookies, $location, $uibModal, $filter, PedidoDetallesFactory, $routeParams) {
    $scope.Pedidos = [];
    $scope.BuscarProductos = {};
    $scope.filter = '';
    $scope.getEnterprise = {};
    $scope.selectFinalUser = {};
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
      $scope.callFunctions();
    };

    $scope.JSONToCSVConvertor = function (JSONData, ReportTitle, ShowLabel) {
      var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
      var CSV = '';
      CSV += ReportTitle + '\r\n\n';
      if (ShowLabel) {
        var row = '';
        for (var index in arrData[0]) {
          row += index + ',';
        }
        row = row.slice(0, -1);
        CSV += row + '\r\n';
      }

      for (var i = 0; i < arrData.length; i++) {
        var row = '';
        for (var index in arrData[i]) {
          row += '"' + arrData[i][index] + '",';
        }
        row.slice(0, row.length - 1);
        CSV += row + '\r\n';
      }

      if (CSV == '') {
        alert('Información inválida');
        return;
      }

      var fileName = 'Clicksuscribe_';
      fileName += ReportTitle.replace(/ /g, '_');

      var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

      var link = document.createElement('a');
      link.href = uri;

      link.style = 'visibility:hidden';
      link.download = fileName + '.csv';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    var maxSize = 5000;

    const cleanObject = data => {
      data.forEach(element => {
        delete element.IdCompraUF;
        delete element.IdPedidoDetalle;
        delete element.IdEmpresaUsuarioFinal;
        delete element.IdUsuarioCompra;
        delete element.EstatusDist;
        delete element.EstatusUF;
      });
      return data;
    }

    $scope.GenerarReporte = function () {
      var d = new Date();
      var NombreReporte = 'Ventas tuclick';
      if(FilteredOrders.length > 0) {
        const newOrders = FilteredOrders;
        const cleanData = cleanObject(newOrders);
        var repeat = Math.ceil(cleanData.length / maxSize);
        for (var j = 0; j < repeat; j++) {
          var start = j * maxSize;
          var end = start + maxSize;
          var parte =  cleanData.slice(start, end);
          var number = j + 1;
          NombreReporte = NombreReporte + '_' + number;
          $scope.JSONToCSVConvertor(parte, NombreReporte, true);
        }
      } else {
        $scope.ShowToast('Sin registros', 'danger');
      }
      return;
  };

    const getDistributorInformation = function () {
      PedidoDetallesFactory.getDistributorData()
        .then(function (result) {
          $scope.Pedidos = result.data.data;
          FilteredOrders = result.data.data;
          $scope.search();
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
      FilteredOrders = $scope.Pedidos.filter(function (order) {
        if (!order.IdPedido) {
          return false;
        }
        const MesActual = parseInt($scope.MesActual.id);
        return (
          ((order.IdEmpresaUsuarioFinal === $scope.getEnterprise.IdEmpresaUsuarioFinal) || !$scope.getEnterprise.IdEmpresaUsuarioFinal) &&
          (order.NombreEmpresa.toLowerCase().includes(filter) ||
          order.IdPedido.toString().includes(filter)) &&
          order.Month === MesActual &&
          order.Year === $scope.YearActual.Year
        );
      });
      setPagination();
      $scope.$apply();
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
