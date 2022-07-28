/* eslint-disable eqeqeq */
(function () {
  var FacturacionReadController = function ($scope, $log, $cookies, $location, $uibModal, $filter, FacturacionFactory, EmpresasFactory, $routeParams) {
    var FilteredOrders = [];
    $scope.paginatedOrders = {};
    $scope.currentPage = 0;
    $scope.filter = '';
    var searchTimeout;
    var itemsPerPage = 10;
    $scope.getNumberOfPages = [1];

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

    $scope.search = function () {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(filterProducts, 150);
    };

    const filterProducts = function () {
      const filter = $scope.filter.toLowerCase();
      FilteredOrders = $scope.Pedidos.filter(function (order) {
        if (!order.IdFactura) {
          return false;
        }
        const MesActual = parseInt($scope.MesActual.id);
        return (
          order.IdEstatusFactura === $scope.EstatusSelect.IdEstatusFactura &&
          (order.Nombre.toLowerCase().includes(filter) ||
          order.RFC.toLowerCase().includes(filter) ||
          order.IdPedido.toString().includes(filter)) && order.Month === MesActual &&
          order.Year === $scope.YearActual.Year
        );
      });
      setPagination();
      $scope.$apply();
    };

    $scope.todos = 0;
    $scope.pedidosSeleccionados = [];
    $scope.EstatusSelect = {};
    $scope.DeshabilitarFacturar = false;
    $scope.init = function () {
      FacturacionFactory.selectBills()
        .then(data => {
          var sanitizedData = data.data.data.map((factura) => {
            factura.Total = factura.Detalles.reduce((total, detalle) => {
              var totalDetalle = (detalle.Cantidad * detalle.PrecioUnitario) * 1.16;
              return total + totalDetalle;
            }, 0);
            return factura;
          });
          $scope.Pedidos = sanitizedData;
          FilteredOrders = sanitizedData;
          $scope.search();
        })
        .catch(error => {
          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        });
      FacturacionFactory.billStatus()
        .then(data => {
          $scope.Estatus = data.data.data;
          $scope.EstatusSelect.IdEstatusFactura = 1;
        })
        .catch(error => {
          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        });

      FacturacionFactory.datesBills()
        .then(data => {
          $scope.Years = data.data.data;
        })
        .catch(error => {
          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
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

    $scope.init();

    $scope.filtrarEstatus = function () {
      if ($scope.EstatusSelect.IdEstatusFactura !== 1) {
        $scope.DeshabilitarFacturar = true;
      } else {
        $scope.DeshabilitarFacturar = false;
      }
      $scope.search();
    };

    $scope.facturasSelecionadas = function (IdFactura) {
      for (var y = 0; y < $scope.Pedidos.length; y++) {
        if ($scope.Pedidos[y].IdFactura == IdFactura) {
          if (!$scope.Pedidos[y].Check) {
            if ($scope.todos) {
              $scope.todos = 0;
            }
            for (var x = 0; x < $scope.pedidosSeleccionados.length; x++) {
              if (IdFactura == $scope.pedidosSeleccionados[x]) {
                $scope.pedidosSeleccionados.splice(x, 1);
              }
            }
            $scope.Pedidos[y].Seleccionado = 0;
          } else {
            $scope.pedidosSeleccionados.push(IdFactura);
            $scope.Pedidos[y].Seleccionado = 1;
          }
          break;
        }
      }
    };

    $scope.verDetalles = function (IdFactura) {
      $location.path('/facturas-pendientes/' + IdFactura);
    };

    $scope.timbrarFactura = function () {
      $scope.pedidosSeleccionados.forEach(function (id) {
        FacturacionFactory.ringById(id)
          .then(result => {
            if (result.data.success === 1) {
              $scope.ShowToast('Factura timbrada.', 'success');
            } else {
              $scope.ShowToast(result.data.message, 'danger');
            }
            $scope.pedidosSeleccionados = [];
            $scope.init();
          })
          .catch(error => {
            $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
          });
      });
    };

    function validarRegistroFacturacion () {
      var IdUsuario = $scope.SessionCookie.IdEmpresa;
      EmpresasFactory.getEmpresa(IdUsuario)
        .then(resultado => {
          var altaFacturacion = resultado.data[0].AltaFacturacion;
          if (altaFacturacion === 0) {
            $location.path('/actualizar-datos-facturacion');
          }
        });
    }

    validarRegistroFacturacion();
  };
  FacturacionReadController.$inject = ['$scope', '$log', '$cookies', '$location', '$uibModal', '$filter', 'FacturacionFactory', 'EmpresasFactory', '$routeParams'];

  angular.module('marketplace').controller('FacturacionReadController', FacturacionReadController);
}());
