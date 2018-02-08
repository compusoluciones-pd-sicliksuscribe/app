(function () {
  var ProductosUFReadController = function ($scope, $log, $location, $cookies, $routeParams, ProductosXEmpresaFactory, FabricantesFactory, TiposProductosFactory, PedidoDetallesFactory, TipoCambioFactory, ProductoGuardadosFactory, EmpresasXEmpresasFactory, $anchorScroll, ProductosFactory, ComprasUFFactory, UsuariosFactory) {
    var BusquedaURL = $routeParams.Busqueda;
    $scope.BuscarProductos = {};
    $scope.Pagina = 0;
    $scope.sortBy = 'Nombre';
    $scope.reverse = false;
    $scope.TipoCambio = 0;
    /* $scope.TipoCambioMs = 0; */
    $scope.Mensaje = '...';
    $scope.selectProductos = {};

    $scope.BuscarProducto = function (ResetPaginado) {
      $scope.Mensaje = 'Buscando...';
      $scope.BuscarProductos.IdEmpresaDistribuidor = $scope.currentDistribuidor.IdEmpresa;
      if (ResetPaginado === true) {
        $scope.Pagina = 0;
        $scope.BuscarProductos.Offset = $scope.Pagina * 6;
      }
      ProductosXEmpresaFactory.postBuscarProductosXEmpresa($scope.BuscarProductos)
        .success(function (Productos) {
          if (Productos.success) {
            $scope.Productos = Productos.data[0].map(function (item) {
              item.IdPedidoContrato = 0;
              item.TieneContrato = true;
              item.IdEmpresaUsuarioFinal = item.IdEmpresa;
              item.MonedaCompra = 'Dólares';
              return item;
            });
            if ($scope.Productos == '') {
              $scope.Mensaje = 'No encontramos resultados de tu búsqueda...';
              if ($scope.Pagina > 0) {
                $scope.ShowToast('No encontramos más resultados de esta busqueda, regresaremos a la página anterior.', 'danger');
                $scope.PaginadoAtras();
              }
            }
          } else {
            $scope.Mensaje = Productos.message;
          }
        })
        .error(function (data, status, headers, config) {
          $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';
          $scope.ShowToast('No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.', 'danger');
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });

      TipoCambioFactory.getTipoCambio()
        .success(function (TipoCambio) {
          $scope.TipoCambio = TipoCambio.Dolar;
          /* $scope.TipoCambioMs = TipoCambio.DolarMS; */
        })
        .error(function (data, status, headers, config) {
          $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';
          $scope.ShowToast('No pudimos obtener el tipo de cambio, por favor intenta una vez más.', 'danger');
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.init = function () {
      $scope.CheckCookie();
      $scope.ActualizarMenu();
      FabricantesFactory.getFabricantes()
        .success(function (Fabricantes) {
          $scope.selectFabricantes = Fabricantes;
        })
        .error(function (data, status, headers, config) {
          $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';
          $scope.ShowToast('No pudimos cargar la lista de fabricantes, por favor intenta de nuevo más tarde.', 'danger');
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });

      TiposProductosFactory.getTiposProductos()
        .success(function (TiposProductos) {
          $scope.selectTiposProductos = TiposProductos;
        })
        .error(function (data, status, headers, config) {
          $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';

          $scope.ShowToast('No pudimos cargar la lista de tipos de productos, por favor intenta de nuevo más tarde.', 'danger');

          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });

      $scope.BuscarProductos.IdProducto = undefined;
      $scope.BuscarProductos.IdFabricante = $scope.BuscarProductos.IdFabricante;
      $scope.BuscarProductos.IdTipoProducto = $scope.BuscarProductos.IdTipoProducto;
      $scope.BuscarProductos.Offset = $scope.Pagina * 6;

      if (BusquedaURL !== 'undefined') {
        $scope.BuscarProductos.Busqueda = BusquedaURL;
        $scope.BuscarProducto(false);
      } else {
        $scope.BuscarProductos.Busqueda = undefined;
        $scope.BuscarProducto(false);
      }
    };

    $scope.init();

    $scope.contractSetted = function (producto) {
      if (producto.IdPedidoContrato) {
        producto.IdUsuarioContacto = undefined;
      }
    };

    function setProtectedRebatePrice (cookie) {
      const endUser = cookie.distribuidores[1].TipoCambioRP;
      var protectedRP = !endUser ? null : endUser;
      $scope.ProtectedRP = protectedRP;
    }

    $scope.revisarProducto = function (Producto) {
      var IdProducto = Producto.IdProducto;
      var cookie = $cookies.getObject('Session');
      var IdEmpresaUsuarioFinal = cookie.IdEmpresa;
      ProductosFactory.getProductContracts(IdEmpresaUsuarioFinal, IdProducto)
        .success(function (respuesta) {
          if (respuesta.success === 1) {
            Producto.contratos = respuesta.data;
            if (Producto.contratos.length >= 1) {
              Producto.TieneContrato = true;
              Producto.IdPedidoContrato = respuesta.data[0].IdPedido;
            }
            if ((Producto.IdAccionAutodesk === 2 || !Producto.IdAccionAutodesk) && Producto.contratos.length === 0) {
              Producto.TieneContrato = false;
            }
            if (Producto.IdAccionAutodesk === 1) Producto.contratos.unshift({ IdPedido: 0, ResultadoFabricante6: 'Nuevo contrato...' });

            setProtectedRebatePrice(cookie);
          } else {
            $scope.ShowToast('No pudimos cargar la información de tus contratos, por favor intenta de nuevo más tarde.', 'danger');
          }
        })
        .error(function () {
          $scope.ShowToast('No pudimos cargar la información de tus contratos, por favor intenta de nuevo más tarde.', 'danger');
        });
      UsuariosFactory.getUsuariosContacto(IdEmpresaUsuarioFinal)
        .success(function (respuesta) {
          if (respuesta.success === 1) {
            Producto.usuariosContacto = respuesta.data;
          } else {
            $scope.ShowToast('No pudimos cargar la información de tus contactos, por favor intenta de nuevo más tarde.', 'danger');
          }
        })
        .error(function () {
          $scope.ShowToast('No pudimos cargar la información de tus contactos, por favor intenta de nuevo más tarde.', 'danger');
        });

      if (Producto.IdTipoProducto === 4 && Producto.IdFabricante === 1) {
        ProductosFactory.postComplementos(Producto)
          .then(function (data) {
            var IdProductoFabricanteExtra = '';
            for (var x = 0; x < data.data.length; x++) {
              IdProductoFabricanteExtra += data.data[x].IdProductoFabricante + '|';
              if (x === data.data.length - 1) {
                IdProductoFabricanteExtra += data.data[x].IdProductoFabricante;
              }
            }

            Producto.IdProductoFabricanteExtra = IdProductoFabricanteExtra;

            PedidoDetallesFactory.postPedidoDetallesAddOns(Producto)
              .success(function (data) {
                $scope.selectProductos = data;
                $scope.Productos.forEach(function (producto) {
                  if (producto.IdProducto === IdProducto) {
                    if ($scope.selectProductos.length === 0) {
                      producto.Mostrar = false;
                      producto.MostrarMensajeP = true;
                      producto.Required = true;
                    } else {
                      producto.Mostrar = true;
                      producto.Required = true;
                      producto.MostrarMensajeP = false;
                    }
                  }
                }, this);
              })
              .error(function (data, status, headers, config) {
                $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
              });
          });
      }
    };

    $scope.CalcularPrecioTotal = function (Precio, Cantidad, MonedaCompra, MonedaProducto, TipoCambio, ProtectedRP) {
      var total = 0.0;
      var rebatePrice = ProtectedRP || TipoCambio;
      if (MonedaCompra === 'Pesos' && MonedaProducto === 'Dólares') {
        Precio = Precio * rebatePrice;
      }

      if (MonedaCompra === 'Dólares' && MonedaProducto === 'Pesos') {
        Precio = Precio / rebatePrice;
      }

      total = Precio * Cantidad;
      if (!total) { total = 0.00; }
      return total;
    };

    $scope.AgregarCarrito = function (Producto, Cantidad) {
      if (!Producto.IdProducto) { $scope.ShowToast('Selecciona un producto', 'danger'); return; }
      if (!Cantidad) { $scope.ShowToast('Escribe una cantidad válida', 'danger'); return; }
      var cookie = $cookies.getObject('Session');
      var IdEmpresaUsuarioFinal = cookie.IdEmpresa;

      var NuevoProducto = {
        IdProducto: Producto.IdProducto,
        Cantidad: Cantidad,
        IdEmpresaUsuarioFinal: IdEmpresaUsuarioFinal,
        MonedaPago: Producto.MonedaCompra,
        IdEsquemaRenovacion: Producto.IdEsquemaRenovacion,
        IdFabricante: Producto.IdFabricante,
        CodigoPromocion: Producto.CodigoPromocion,
        ResultadoFabricante2: Producto.IdProductoPadre,
        Especializacion: Producto.Especializacion,
        IdUsuarioContacto: Producto.IdUsuarioContacto,
        IdAccionAutodesk: Producto.IdAccionAutodesk
      };

      var NuevoProducto2 = {
        IdProducto: Producto.IdProducto,
        Cantidad: Producto.Cantidad,
        IdEmpresaDistribuidor: $scope.currentDistribuidor.IdEmpresa,
        MonedaCompra: Producto.MonedaCompra
      };

      if (!Producto.IdUsuarioContacto && Producto.IdFabricante === 2 && Producto.TieneContrato) {
        const contrato = Producto.contratos
          .filter(function (p) {
            return Producto.IdPedidoContrato === p.IdPedido;
          })[0].ResultadoFabricante6;
        NuevoProducto.ContratoBaseAutodesk = contrato.trim();
        // NuevoProducto.IdAccionAutodesk = Producto.IdAccionProductoAutodesk === 1 ? 3 : 2;
      }
      if (Producto.IdFabricante === 2 && Producto.IdAccionAutodesk === 2 && !Producto.TieneContrato) {
        return $scope.ShowToast('No cuentas con un contrato para este producto.', 'danger');
      }
      if (!NuevoProducto.IdAccionAutodesk) delete NuevoProducto.IdAccionAutodesk;
      if (NuevoProducto.IdAccionAutodesk === 1 && NuevoProducto.ContratoBaseAutodesk) NuevoProducto.IdAccionAutodesk = 3;

      PedidoDetallesFactory.postPedidoDetalle(NuevoProducto)
        .success(function (PedidoDetalleResult) {
          if (PedidoDetalleResult.success === 1) {
            if (NuevoProducto.IdFabricante === 2 && Producto.Accion === 'asiento') {
              ProductosFactory.getBaseSubscription(NuevoProducto.IdProducto)
                .then(function (result) {
                  $scope.suscripciones = result.data.data;
                  if (result.data.data.length >= 1) {
                    $location.path("/autodesk/productos/" + NuevoProducto.IdProducto + "/detalle/" + PedidoDetalleResult.data.insertId);
                  }
                });
            };
            $scope.AgregarComprasUF(NuevoProducto2);
            $scope.ShowToast(PedidoDetalleResult.message, 'success');
            $scope.ActualizarMenu();
            $scope.addPulseCart();
            setTimeout($scope.removePulseCart, 9000);
          } else {
            $scope.ShowToast(PedidoDetalleResult.message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';

          $scope.ShowToast('No pudimos agregar este producto a tu carrito de compras, por favor intenta de nuevo más tarde.', 'danger');

          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.AgregarComprasUF = function (NuevoProducto2) {
      ComprasUFFactory.postComprasUF(NuevoProducto2)
            .success(function (ProductoResult) {
              if (ProductoResult.success) {
                $scope.ActualizarMenu();
                $scope.ClearToast();
                $scope.ShowToast('Producto guardado en tu carrito de compras.', 'success');
                $scope.addPulseCart();
                setTimeout($scope.removePulseCart, 9000);
              } else {
                $scope.ShowToast(ProductoResult.message, 'danger');
              }
            })
          .error(function (data, status, headers, config) {
            $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';

            $scope.ShowToast('No pudimos agregar este producto a tu carrito de compras, por favor intenta de nuevo más tarde.', 'danger');

            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
    };

    $scope.OrdenarPor = function (Atributo) {
      $scope.sortBy = Atributo;
      $scope.reverse = !$scope.reverse;
    };

    $scope.scrollTo = function (eID) {
      var startY = currentYPosition();
      var stopY = elmYPosition(eID);
      var distance = stopY > startY ? stopY - startY : startY - stopY;

      if (distance < 100) {
        scrollTo(0, stopY); return;
      }

      var speed = Math.round(distance / 100);
      if (speed >= 20) speed = 20;
      var step = Math.round(distance / 25);
      var leapY = stopY > startY ? startY + step : startY - step;
      var timer = 0;

      if (stopY > startY) {
        for (var i = startY; i < stopY; i += step) {
          setTimeout('window.scrollTo(0, ' + leapY + ')', timer * speed);
          leapY += step; if (leapY > stopY) leapY = stopY; timer++;
        } return;
      }

      for (var i = startY; i > stopY; i -= step) {
        setTimeout('window.scrollTo(0, ' + leapY + ')', timer * speed);
        leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
      }

      function currentYPosition () {
        if (self.pageYOffset) { return self.pageYOffset; }

        if (document.documentElement && document.documentElement.scrollTop) {
          return document.documentElement.scrollTop;
        }

        if (document.body.scrollTop) { return document.body.scrollTop; }
        return 0;
      }

      function elmYPosition (eID) {
        var elm = document.getElementById(eID);
        var y = elm.offsetTop;
        var node = elm;
        while (node.offsetParent && node.offsetParent != document.body) {
          node = node.offsetParent;
          y += node.offsetTop;
        } return y;
      }
    };

    $scope.PaginadoInicio = function () {
      $scope.BuscarProducto(true);

      $scope.scrollTo('TopPage');
    };

    $scope.PaginadoAtras = function () {
      $scope.Pagina = $scope.Pagina - 1;
      $scope.BuscarProductos.Offset = $scope.Pagina * 6;
      $scope.BuscarProducto(false);

      $scope.scrollTo('TopPage');
    };

    $scope.PaginadoSiguiente = function () {
      $scope.Pagina = $scope.Pagina + 1;
      $scope.BuscarProductos.Offset = $scope.Pagina * 6;
      $scope.BuscarProducto(false);

      $scope.scrollTo('TopPage');
    };
  };

  ProductosUFReadController.$inject =
    ['$scope', '$log', '$location', '$cookies', '$routeParams', 'ProductosXEmpresaFactory', 'FabricantesFactory', 'TiposProductosFactory', 'PedidoDetallesFactory', 'TipoCambioFactory', 'ProductoGuardadosFactory', 'EmpresasXEmpresasFactory', '$anchorScroll', 'ProductosFactory', 'ComprasUFFactory', 'UsuariosFactory'];

  angular.module('marketplace').controller('ProductosUFReadController', ProductosUFReadController);
}());
