(function () {
  var DescuentosNivelesController = function ($scope, $location, $cookies, $routeParams, DescuentosNivelesFactory) {
    $scope.sortBy = 'Nombre';
    $scope.reverse = false;
    $scope.Nivel = $cookies.getObject('nivel');
    $scope.paginatedProducts = {};
    $scope.getNumberOfPages = [1];
    $scope.IdEmpresa = 1;
    $scope.filter = '';
    $scope.check;
    $scope.currentPage = 0;
    $scope.setCurrentPage = function (i) { $scope.currentPage = i; };
    const productosEnCache = {};
    let filteredProducts = [];
    let searchTimeout;
    const IdDescuento = $routeParams.IdDescuento;

    const error = function (error) {
      $scope.ShowToast(!error ? 'Ha ocurrido un error, inténtelo más tarde.' : error.message, 'danger');
      $scope.Mensaje = 'No pudimos conectarnos a la base de datos, por favor intenta de nuevo más tarde.';
    };

    const setPagination = function () {
      const pages = Math.ceil(filteredProducts.length / 50);
      $scope.paginatedProducts = {};
      $scope.currentPage = 0;
      $scope.getNumberOfPages = new Array(pages);
      for (var i = 0; i < pages; i++) {
        $scope.paginatedProducts[i] = filteredProducts.slice(i * 50, (i + 1) * 50);
      }
    };

    const filterProducts = function () {
      const filter = $scope.filter.toLowerCase();
      filteredProducts = productosEnCache[$scope.IdEmpresa].filter(function (p) {
        if (p.name.indexOf(filter) > -1) return true;
        return false;
      });
      setPagination();
      $scope.$apply();
    };

    const addDiscount = function (product) {
      DescuentosNivelesFactory.addDiscountLevels(IdDescuento, product)
        .then(result => {
          if (result.data.success) $scope.ShowToast(result.data.message, 'success');
          else $scope.ShowToast(result.data.message, 'danger');
        })
        .catch(result => {
          error(result.data);
        });
    };

    $scope.getProducts = function () {
      $scope.porcentaje = '';
      DescuentosNivelesFactory.getDiscountLevels(IdDescuento, $scope.IdEmpresa)
        .then(result => {
          const response = result.data;
          if (!response.success) error(result.data);
          else {
            $scope.Productos = response.data;
            $scope.getNumberOfPages = new Array(Math.ceil($scope.Productos.length / 50));
            productosEnCache[$scope.IdEmpresa] = response.data.map(function (p) {
              p.name = p.Nombre.toLowerCase();
              return p;
            });
            filteredProducts = productosEnCache[$scope.IdEmpresa];
            setPagination();
          }
        })
        .catch(result => {
          error(result.data);
        });
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
        let discount = product.PrecioNormal - (product.PrecioNormal * Number((product.PorcentajeDescuento / 100) || 0));
        product.PrecioFinal = Number(discount.toFixed(4));
        product.Activo = 1;
      } else {
        product.PrecioFinal = '';
        product.Activo = 0;
      }
    };

    $scope.Actualizar = function (product) {
      product.Activo = !product.Activo ? 0 : 1;
      const discount = { Productos: [{ IdProducto: product.IdProducto, Activo: product.Activo }] };
      if (product.Activo && (product.PorcentajeDescuento > 0 && product.PorcentajeDescuento < 101)) {
        discount.Productos[0].PorcentajeDescuento = product.PorcentajeDescuento;
        addDiscount(discount);
      } else if (!product.Activo) addDiscount(discount);
      else $scope.ShowToast('El descuento debe ser en un rango entre 1 y 100', 'danger');
    };

    $scope.guardarTodo = function (discount) {
      const discounts = { Productos: [] };
      if (discount) {
        discounts.Productos = filteredProducts.map(function (product) {
          return {
            IdProducto: product.IdProducto, Activo: product.Activo, PorcentajeDescuento: discount, Activo: 1,
          }
        });
        addDiscount(discounts);
      } else $scope.ShowToast('El descuento debe ser en un rango entre 1 y 100', 'danger');
    };

    $scope.calcularPrecioVenta = function (discount) {
      filteredProducts.forEach(function (product) {
        product.PorcentajeDescuento = discount;
        product.Activo = 1;
        product.PrecioFinal = product.PrecioNormal - (product.PrecioNormal * Number('.' + product.PorcentajeDescuento || 0));
      });
    };

    $scope.init = function () {
      $scope.CheckCookie();
      $scope.refrescarMisProductos();
    };

    $scope.init();
  };

  DescuentosNivelesController.$inject = ['$scope', '$location', '$cookies', '$routeParams', 'DescuentosNivelesFactory'];

  angular.module('marketplace').controller('DescuentosNivelesController', DescuentosNivelesController);
}());
