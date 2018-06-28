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
        .success(function (data) {
          var sanitizedData = data.data.map(function (factura) {
            factura.Total = factura.Detalles.reduce(function (total, detalle) {
              var totalDetalle = (detalle.Cantidad * detalle.PrecioUnitario) * 1.16;
              return total + totalDetalle;
            }, 0);
            return factura;
          });
          $scope.Pedidos = sanitizedData;
          FilteredOrders = sanitizedData;
          $scope.search();
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
      FacturacionFactory.billStatus()
        .success(function (data) {
          $scope.Estatus = data.data;
          $scope.EstatusSelect.IdEstatusFactura = 1;
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });

      FacturacionFactory.datesBills()
        .success(function (data) {
          $scope.Years = data.data;
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
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
          .success(function (result) {
            if (result.success === 1) {
              $scope.ShowToast('Factura timbrada.', 'success');
            } else {
              $scope.ShowToast(result.message, 'danger');
            }
            $scope.pedidosSeleccionados = [];
            $scope.init();
          })
          .error(function (data, status, headers, config) {
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      });
    };

    function validarRegistroFacturacion () {
      var IdUsuario = $scope.SessionCookie.IdEmpresa;
      EmpresasFactory.getEmpresa(IdUsuario)
        .success(function (resultado) {
          var altaFacturacion = resultado[0].AltaFacturacion;
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
