(function () {
  var DescuentosNivelesCSController = function ($scope, $location, $cookies, $routeParams, NivelesDistribuidorFactory, DescuentosNivelesFactory) {
    var IdNivelCS = Number($routeParams.IdNivel);
    $scope.sortBy = 'Nombre';
    $scope.reverse = false;
    $scope.Nivel = IdNivelCS;
    $scope.paginatedProducts = {};
    $scope.getNumberOfPages = [1];
    $scope.IdEmpresa = 1;
    $scope.filter = '';
    $scope.check;
    $scope.currentPage = 0;
    $scope.setCurrentPage = function (i) { $scope.currentPage = i; };
    var productosEnCache = {};
    let filteredProducts = [];
    let searchTimeout;

    var error = function (error) {
      $scope.ShowToast(!error ? 'Ha ocurrido un error, intentelo mas tarde.' : error.message, 'danger');
      $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';
    };

    var setPagination = function () {
      var pages = Math.ceil(filteredProducts.length / 50);
      $scope.paginatedProducts = {};
      $scope.currentPage = 0;
      $scope.getNumberOfPages = new Array(pages);
      for (var i = 0; i < pages; i++) {
        $scope.paginatedProducts[i] = filteredProducts.slice(i * 50, (i + 1) * 50);
      }
    };

    var filterProducts = function () {
      var filter = $scope.filter.toLowerCase();
      filteredProducts = productosEnCache[$scope.IdEmpresa].filter(function (p) {
        if (p.name.indexOf(filter) > -1) return true;
        return false;
      });
      setPagination();
      $scope.$apply();
    };

    const updateDiscounts = function (levels) {
      return NivelesDistribuidorFactory.createLevelDiscount(levels)
        .then(function (result) {
          if (result.data.success === 1) {
            $scope.ShowToast(result.data.message, 'success');
          } else {
            $scope.ShowToast('No se pudo actualizar el descuento, reviza que la cantidad sea un numero entero.', 'danger');
          }
        })
        .catch(function (result) { error(result.data); });
    };

    $scope.deleteDiscounts = function (product) {
      const discounts = { IdNivelCS: IdNivelCS, Productos: [] };
      discounts.Productos = filteredProducts.map(function (product) {
        return { IdProducto: product.IdProducto, Activo: 0 };
      });
      updateDiscounts(discounts)
        .then(function () { $scope.getProducts(); });
    };

    $scope.isNumber = function (evt) {
      evt = evt || window.event;
      var charCode = (evt.which) ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      }
      return true;
    };

    $scope.getProducts = function () {
      $scope.porcentaje = '';
      NivelesDistribuidorFactory.getProductosPorNivel(IdNivelCS)
        .then(function (result) {
          const response = result.data;
          if (!response.success) {
            error(result.data);
          } else {
            const produtosConPrecioFinal = response.data.map(function (producto) {
              producto.PrecioFinal = Number(((producto.PrecioNormal * (100 - producto.PorcentajeDescuento)) / 100).toFixed(2));
              producto.Activo = producto.PorcentajeDescuento ? 1 : 0;
              return producto;
            });
            $scope.Productos = produtosConPrecioFinal;
            $scope.getNumberOfPages = new Array(Math.ceil(produtosConPrecioFinal.length / 50));
            productosEnCache[$scope.IdEmpresa] = response.data.map(function (p) {
              p.name = p.Nombre.toLowerCase();
              return p;
            });
            filteredProducts = productosEnCache[$scope.IdEmpresa];
            setPagination();
          }
        })
        .catch(function (result) { error(result.data); });
    };

    $scope.refrescarMisProductos = function () {
      $scope.filter = '';
      if (productosEnCache[$scope.IdEmpresa]) {
        filteredProducts = productosEnCache[$scope.IdEmpresa];
        $scope.Productos = productosEnCache[$scope.IdEmpresa];
        setPagination();
        return;
      }
      $scope.getProducts();
    };

    $scope.search = function () {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(filterProducts, 150);
    };

    $scope.OrdenarPor = function (Atributo) {
      $scope.sortBy = Atributo;
      $scope.reverse = !$scope.reverse;
    };

    $scope.calcularDescuento = function (product) {
      if (product.PorcentajeDescuento && (product.PorcentajeDescuento > 0 && product.PorcentajeDescuento < 101)) {
        product.PrecioFinal = product.PrecioNormal - (product.PrecioNormal * ((product.PorcentajeDescuento || 0) * 0.01));
        product.PrecioFinal = Number(product.PrecioFinal.toFixed(4));
      } else product.PrecioFinal = '';
    };

    $scope.Actualizar = function (product) {
      const Activo = product.PorcentajeDescuento > 0 && product.PorcentajeDescuento < 101;
      if (!Activo && product.Activo) $scope.ShowToast('El descuento debe ser en un rango entre 1 y 100', 'danger');
      else {
        const PorcentajeDescuento = (!product.PorcentajeDescuento || product.PorcentajeDescuento === '') ? null : product.PorcentajeDescuento;
        const request = {
          IdNivelCS: IdNivelCS,
          Productos: [{
            Activo: Activo ? 1 : 0,
            IdProducto: product.IdProducto,
            PorcentajeDescuento: PorcentajeDescuento
          }]
        };
        updateDiscounts(request);
      }
    };

    $scope.resetDiscount = function (product) {
      if (!product.Activo) {
        product.PorcentajeDescuento = '';
        product.PrecioFinal = '';
      }
    };

    $scope.guardarTodo = function (levels) {
      var discounts = { IdNivelCS: IdNivelCS, Productos: [] };
      if (levels) {
        discounts.Productos = filteredProducts.map(function (product) {
          return {
            IdProducto: product.IdProducto,
            Activo: 1,
            PorcentajeDescuento: levels
          };
        });
        updateDiscounts(discounts);
      } else $scope.ShowToast('El descuento debe ser en un rango entre 1 y 100', 'danger');
    };

    $scope.calcularPrecioVenta = function (discount) {
      discount = discount || 100;
      $scope.porcentaje = Number(discount.toString().replace(/[^0-9]+/g, ''));
      filteredProducts.forEach(function (product) {
        product.PorcentajeDescuento = discount;
        product.PrecioFinal = product.PrecioNormal - (product.PrecioNormal * ((product.PorcentajeDescuento || 0) * 0.01));
        product.PrecioFinal = Number(product.PrecioFinal.toFixed(4));
        product.Activo = 1;
      });
    };

    var obtenerNivel = function () {
      NivelesDistribuidorFactory.getNivelesDistribuidor()
        .then(function (result) {
          var response = result.data;
          if (!response.success) {
            error(result.data);
          } else {
            var nivel = response.data.filter(function (nivel) {
              return nivel.IdNivelDistribuidor === IdNivelCS;
            }).pop().Nivel;
            $scope.Nivel = nivel;
          }
        })
        .catch(function (result) { error(result.data); });
    };

    $scope.init = function () {
      $scope.CheckCookie();
      $scope.refrescarMisProductos();
      obtenerNivel();
    };

    $scope.init();
  };

  DescuentosNivelesCSController.$inject = ['$scope', '$location', '$cookies', '$routeParams', 'NivelesDistribuidorFactory', 'DescuentosNivelesFactory'];

  angular.module('marketplace').controller('DescuentosNivelesCSController', DescuentosNivelesCSController);
}());
