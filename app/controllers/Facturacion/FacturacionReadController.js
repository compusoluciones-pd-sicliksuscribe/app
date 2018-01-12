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
        return (
          order.IdEstatusFactura === $scope.EstatusSelect.IdEstatusFactura &&
          (order.Nombre.toLowerCase().includes(filter) ||
          order.RFC.toLowerCase().includes(filter) ||
          order.IdPedido.toString().includes(filter))
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
    };

    $scope.init();

    $scope.filtrarEstatus = function () {
      if ($scope.EstatusSelect.IdEstatusFactura !== 1) {
        $scope.DeshabilitarFacturar = true;
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
              $scope.ShowToast('Problemas de conexión con el servicio, intenta más tarde.', 'danger');
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
