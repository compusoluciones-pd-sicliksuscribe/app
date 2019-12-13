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
      /* If JSONData is not an object then JSON.parse will parse the JSON string in an Object*/
      var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
      var CSV = '';
      /* Set Report title in first row or line*/
      CSV += ReportTitle + '\r\n\n';
      /* This condition will generate the Label/Header*/
      if (ShowLabel) {
        var row = '';

        /* This loop will extract the label from 1st index of on array*/
        for (var index in arrData[0]) {
          /* Now convert each value to string and comma-seprated*/
          row += index + ',';
        }

        row = row.slice(0, -1);

        /* append Label row with line break*/
        CSV += row + '\r\n';
      }

      /* 1st loop is to extract each row*/
      for (var i = 0; i < arrData.length; i++) {
        var row = '';

        /* 2nd loop will extract each column and convert it in string comma-seprated*/
        for (var index in arrData[i]) {
          row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);

        /* add a line break after each row*/
        CSV += row + '\r\n';
      }

      if (CSV == '') {
        alert('Información inválida');
        return;
      }

      /* Generate a file name*/
      var fileName = 'Clicksuscribe_';
      /* this will remove the blank-spaces from the title and replace it with an underscore*/
      fileName += ReportTitle.replace(/ /g, '_');

      /* Initialize file format you want csv or xls*/
      var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

      /* Now the little tricky part.*/
      /* you can use either>> window.open(uri);*/
      /* but this will not work in some browsers*/
      /* or you will not get the correct file extension*/

      /* this trick will generate a temp <a /> tag*/
      var link = document.createElement('a');
      link.href = uri;

      /* set the visibility hidden so it will not effect on your web-layout*/
      link.style = 'visibility:hidden';
      link.download = fileName + '.csv';

      /* this part will append the anchor tag and remove it after automatic click*/
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
