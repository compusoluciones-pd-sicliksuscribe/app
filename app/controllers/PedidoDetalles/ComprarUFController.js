(function () {
  var ComprarUFController = function ($scope, $log, $location, $cookieStore, $route, ComprasUFFactory, EmpresasFactory) {
    $scope.distribuidor = {};
    $scope.currentPath = $location.path();
    $scope.currentDistribuidor = $cookieStore.get('currentDistribuidor');
    $scope.TotalEnPesos = 0;
    $scope.SubtotalEnPesos = 0;
    $scope.IVA = 0;
    $scope.CarritoValido = false;

    $scope.obtenerDatosEmpresa = function () {
      EmpresasFactory.getEmpresa($scope.currentDistribuidor.IdEmpresa)
        .success(function (empresa) {
          $scope.distribuidor = empresa[0];
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos validar tu carrito de compras, por favor intenta de nuevo.', 'danger');
          $location.path('/uf/Carrito');
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.validarCarrito = function () {
      EmpresasFactory.getValidarCreditoUF($scope.currentDistribuidor.IdEmpresa)
        .success(function (validacion) {
          $scope.TotalEnPesos = validacion.data.TotalActualEnSuCarrito;
          $scope.SubtotalEnPesos = validacion.data.SubtotalActualEnSuCarrito;
          $scope.IVA = validacion.data.IVA;
          if (!validacion.success) {
            $scope.ShowToast('Haz llegado a tu tope de compras, por favor elimina productos de tu carrito o ponte en contacto con tu distribuidor.', 'danger');
            $location.path('/uf/Carrito');
          } else {
            $scope.CarritoValido = true;
          }
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos validar tu carrito de compras, por favor intenta de nuevo.', 'danger');
          $location.path('/uf/Carrito');
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.init = function () {
      if ($scope.currentPath === '/uf/Comprar') {
        $scope.CheckCookie();
        $scope.obtenerDatosEmpresa();
        ComprasUFFactory.getComprasUF($scope.currentDistribuidor.IdEmpresa, 1)
          .success(function (carritoDeCompras) {
            $scope.validarCarrito();
            if (carritoDeCompras.success) {
              $scope.PedidoDetalles = carritoDeCompras.data[0];
            } else {
              $scope.ShowToast(carritoDeCompras.message, 'danger');
              $location.path('/uf/Carrito');
            }
          })
          .error(function (data, status, headers, config) {
            $scope.ShowToast('No pudimos preparar tu información, por favor intenta de nuevo más tarde.', 'danger');
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      }
    };

    $scope.init();

    $scope.Atras = function () {
      $location.path('/uf/Carrito');
    };

    $scope.Comprar = function () {
      ComprasUFFactory.getComprarUF($scope.currentDistribuidor.IdEmpresa, 1)
          .success(function (compra) {
            if (compra.success) {
              $scope.ActualizarMenu();
              $location.path('/Monitor');
              $scope.ShowToast(compra.message, 'success');
            } else {
              $location.path('/uf/Carrito');
              $scope.ShowToast(compra.message, 'danger');
            }
          })
          .error(function (data, status, headers, config) {
            $scope.ShowToast('No pudimos preparar tu información, por favor intenta de nuevo más tarde.', 'danger');
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
    };
  };

  ComprarUFController.$inject = ['$scope', '$log', '$location', '$cookieStore', '$route', 'ComprasUFFactory', 'EmpresasFactory'];

  angular.module('marketplace').controller('ComprarUFController', ComprarUFController);
}());
