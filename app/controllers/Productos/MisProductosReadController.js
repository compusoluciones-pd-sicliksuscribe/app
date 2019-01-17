(function () {
  var MisProductosReadController = function ($scope, $log, $location, $cookieStore, $routeParams, ProductosFactory) {
    $scope.sortBy = 'Nombre';
    $scope.reverse = false;
    $scope.precioCalculado;
    $scope.porcentaje;
    // porcentajeAnterior = null;
    $scope.IdEmpresa = 1;
    const productosEnCache = {};
    var filteredProducts = [];
    $scope.paginatedProducts = {};
    $scope.currentPage = 0;
    $scope.filter = '';
    var searchTimeout;

    $scope.init = function () {
      $scope.btnGuardar = true;
      $scope.CheckCookie();
      $scope.refrescarMisProductos();
    };

    $scope.OrdenarPor = function (Atributo) {
      $scope.sortBy = Atributo;
      $scope.reverse = !$scope.reverse;
    };

    $scope.getNumberOfPages = [1];

    $scope.setCurrentPage = i => ($scope.currentPage = i);

    const setPagination = () => {
      const pages = Math.ceil(filteredProducts.length / 50);
      $scope.paginatedProducts = {};
      $scope.currentPage = 0;
      $scope.getNumberOfPages = new Array(pages);
      for (var i = 0; i < pages; i++) {
        $scope.paginatedProducts[i] = filteredProducts.slice(i * 50, (i + 1) * 50);
      }
    };

    $scope.refrescarMisProductos = function (IdEmpresa) {
      $scope.filter = '';
      if (productosEnCache[$scope.IdEmpresa]) {
        filteredProducts = productosEnCache[$scope.IdEmpresa];
        $scope.Productos = productosEnCache[$scope.IdEmpresa];
        setPagination();
        return;
      }
      ProductosFactory.getMisProductos($scope.IdEmpresa)
        .success(function (misProductos) {
          $scope.Productos = misProductos.data;
          $scope.getNumberOfPages = new Array(Math.ceil($scope.Productos.length / 50));
          productosEnCache[$scope.IdEmpresa] = misProductos.data.map(p => {
            p.name = p.Nombre.toLowerCase();
            return p;
          });
          filteredProducts = productosEnCache[$scope.IdEmpresa];
          setPagination();
        })
        .error(function (data, status, headers, config) {
          $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';
          $scope.ShowToast('No pudimos cargar la lista de productos, por favor intenta de nuevo más tarde.', 'danger');
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.search = () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(filterProducts, 150);
    };

    const filterProducts = () => {
      const filter = $scope.filter.toLowerCase();
      filteredProducts = productosEnCache[$scope.IdEmpresa].filter(p => {
        return p.IdERP.toLowerCase().includes(filter) || p.name.includes(filter);
      });
      setPagination();
      $scope.$apply();
    };

    $scope.init();

    function esNumerico (numero) {
      try {
        return (numero - 0) === numero && ('' + numero).trim().length > 0;
      } catch (error) {
        return false;
      }
    }

    function decimalesValidos (numero) {
      try {
        var decimales = numero.toString().split('.')[1];
        if (decimales) {
          if (decimales.toString().length > 2) {
            return false;
          }
        }
        return true;
      } catch (error) {
        return true;
      }
    }

    /* Validar los campos de forma que mande el toast sin hacer operaciones en el api */
    $scope.validaActualizar = function (producto) {
      if (producto.Precio > 9999999) {
        $scope.ShowToast('Escribe un precio más pequeño, solo números', 'danger');
        return false;
      }
      if (producto.Precio < 0) {
        $scope.ShowToast('Escribe un precio mayor que cero, solo números', 'danger');
        return false;
      }
      if (!(producto.Precio) && producto.Precio !== '0' && producto.Precio !== 0) {
        $scope.ShowToast('Escribe un precio.', 'danger');
        return false;
      }
      if (!esNumerico(producto.Precio)) {
        $scope.ShowToast('Escribe un precio, solo números', 'danger');
        return false;
      }
      if (!decimalesValidos(producto.Precio)) {
        $scope.ShowToast('Escribe máximo dos decimales', 'danger');
        return false;
      }
      if (producto.Nombre === '') {
        $scope.ShowToast('El nombre no debe de ir vacío', 'danger');
        return false;
      }
      return true;
    };

    $scope.Actualizar = function (producto) {
      if (!$scope.validaActualizar(producto)) {
        return;
      }
      ProductosFactory.putMiProducto(producto)
        .success(function (actualizacion) {
          if (actualizacion.success) {
            $scope.ShowToast(actualizacion.message, 'success');
          } else {
            $scope.ShowToast(actualizacion.message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';
          $scope.ShowToast('No pudimos cargar la lista de productos, por favor intenta de nuevo más tarde.', 'danger');
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          $scope.init();
        });
    };

    $scope.calcularPrecioVenta = function () {
      if ($scope.porcentaje >= 0 && $scope.porcentaje !== null) {
        // porcentajeAnterior = $scope.porcentaje;
        $scope.precioCalculado = true;
        $scope.Productos.forEach(function (producto) {
          producto.Precio = (($scope.porcentaje * producto.PrecioNormal / 100) + producto.PrecioNormal);
          producto.Precio = Math.round(producto.Precio * 100) / 100;
          producto.Moneda = producto.MonedaPrecio;
          $scope.btnGuardar = false;
        }, this);
      } else if (typeof $scope.porcentaje !== 'undefined') {
        $scope.precioCalculado = false;
        $scope.Productos.forEach(function (producto) {
          producto.Moneda = '';
          producto.Precio = null;
          $scope.btnGuardar = true;
        }, this);
        // $scope.porcentaje = porcentajeAnterior = null;
      } else {
        // $scope.porcentaje = porcentajeAnterior;
      }
    };

    $scope.guardarTodo = function () {
      var productos = [];
      if ($scope.porcentaje >= 0) {
        $scope.Productos.forEach(function (producto) {
          if ($scope.validaActualizar(producto)) {
            productos.push(producto);
          }
        }, this);
        if (productos.length > 0) {
          $scope.actualizarTodos(productos);
        }
      } else {
        $scope.precioCalculado = false;
        $scope.Productos.forEach(function (producto) {
          producto.Moneda = '';
          producto.Precio = null;
        }, this);
      }
    };

    $scope.actualizarTodos = function (Productos) {
      const pFormat = Productos.map(p => {
        const newP = {};
        newP['IdProducto'] = p.IdProducto;
        newP['Moneda'] = p.Moneda;
        newP['Precio'] = p.Precio;
        newP['Activo'] = p.Activo;
        return newP;
      });
      ProductosFactory.putMisProductos(pFormat)
        .success(function (actualizacion) {
          if (actualizacion.success) {
            $scope.ShowToast(actualizacion.message, 'success');
            $scope.porcentaje = null;
            $scope.init();
          } else {
            $scope.ShowToast(actualizacion.message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';
          $scope.ShowToast('No pudimos cargar la lista de productos, por favor intenta de nuevo más tarde.', 'danger');
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.IniciarTourMisProductos = function () {
      $scope.Tour = new Tour({
        steps: [
          {
            element: '.txtPercent',
            placement: 'bottom',
            title: 'Porcentaje a sumar',
            content: 'Puede ingresar un porcentaje para calcular el precio de todos sus productos en base a la moneda en que lo ofrece CompuSoluciones.',
            template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Atrás</button><button class='btn btn-default' data-role='next'>Sig »</button><button class='btn btn-default' data-role='end'>Finalizar</button></nav></div></div>"
          },
          {
            element: '.btnReset',
            placement: 'left',
            title: 'Restaurar',
            content: 'En caso de no querer guardar los cambios realizados por la calculadora, puede regresar a ver los precios que ya tenía guardados.',
            template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Atrás</button><button class='btn btn-default' data-role='next'>Sig »</button><button class='btn btn-default' data-role='end'>Finalizar</button></nav></div></div>"
          },
          {
            element: '.btnSaveAll',
            placement: 'left',
            title: 'Guardar todo',
            content: 'Esta opción le permite guardar todos los precios calculados, sin necesidad de ir presionando el botón de guardado en cada producto.',
            template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Atrás</button><button class='btn btn-default' data-role='next'>Sig »</button><button class='btn btn-default' data-role='end'>Finalizar</button></nav></div></div>"
          }
        ],
        backdrop: true,
        storage: false
      });
      $scope.Tour.init();
      $scope.Tour.start();
    };
  };

  MisProductosReadController.$inject = ['$scope', '$log', '$location', '$cookieStore', '$routeParams', 'ProductosFactory'];

  angular.module('marketplace').controller('MisProductosReadController', MisProductosReadController);
}());
