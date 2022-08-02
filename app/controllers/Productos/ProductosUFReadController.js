/* eslint-disable handle-callback-err */
/* eslint-disable no-implied-eval */
/* eslint-disable no-undef */
(function () {
  var ProductosUFReadController = function ($scope, $log, $location, $cookies, $routeParams, ProductosXEmpresaFactory, FabricantesFactory, TiposProductosFactory, PedidoDetallesFactory, TipoCambioFactory, ProductoGuardadosFactory, EmpresasXEmpresasFactory, EmpresasFactory, $anchorScroll, ProductosFactory, ComprasUFFactory, UsuariosFactory) {
    var BusquedaURL = $routeParams.Busqueda;
    $scope.BuscarProductos = {};
    $scope.Pagina = 0;
    $scope.sortBy = 'Nombre';
    $scope.reverse = false;
    $scope.TipoCambio = 0;
    /* $scope.TipoCambioMs = 0; */
    $scope.Mensaje = '...';
    $scope.selectProductos = {};
    var cookie = $cookies.getObject('Session');

    $scope.BuscarProducto = function (ResetPaginado) {
      $scope.Mensaje = 'Buscando...';
      $scope.BuscarProductos.IdEmpresaDistribuidor = $scope.currentDistribuidor.IdEmpresa;
      if (ResetPaginado === true) {
        $scope.Pagina = 0;
        $scope.BuscarProductos.Offset = $scope.Pagina * 6;
      }

      ProductosXEmpresaFactory.postBuscarProductosXEmpresa($scope.BuscarProductos)
        .then(Productos => {
          if (Productos.data.success) {
            $scope.Productos = Productos.data.data.map(function (item) {
              item.IdPedidoContrato = 0;
              item.TieneContrato = true;
              item.IdEmpresaUsuarioFinal = item.IdEmpresa;
              item.MonedaCompra = 'Dólares';
              return item;
            });

            if (Productos.data.data.length <= 0) {
              $scope.Mensaje = 'No encontramos resultados de esta búsqueda.';
              $scope.ShowToast('No encontramos resultados de esta búsqueda.', 'danger');
              if ($scope.Pagina) { $scope.PaginadoAtras(); }
            }
          } else {
            $scope.Mensaje = Productos.data.message;
          }
        })
        .catch(error => {
          $scope.Mensaje = 'No pudimos contactarnos a la base de datos, por favor intenta de nuevo más tarde.';
          $scope.ShowToast('No pudimos contactarnos a la base de datos, por favor intenta de nuevo más tarde.', 'danger');
          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        });

      TipoCambioFactory.getTipoCambio()
        .then(TipoCambio => {
          $scope.TipoCambio = TipoCambio.data.Dolar;
          /* $scope.TipoCambioMs = TipoCambio.DolarMS; */
        })
        .catch(error => {
          $scope.Mensaje = 'No pudimos contactarnos a la base de datos, por favor intenta de nuevo más tarde.';
          $scope.ShowToast('No pudimos obtener el tipo de cambio, por favor intenta una vez más.', 'danger');
          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        });
    };

    $scope.init = function () {
      $scope.CheckCookie();
      $scope.ActualizarMenu();
      FabricantesFactory.getFabricantes()
        .then(Fabricantes => {
          $scope.selectFabricantes = Fabricantes.data;
        })
        .catch(error => {
          $scope.Mensaje = 'No pudimos contactarnos a la base de datos, por favor intenta de nuevo más tarde.';
          $scope.ShowToast('No pudimos cargar la lista de fabricantes, por favor intenta de nuevo más tarde.', 'danger');
          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        });

      TiposProductosFactory.getTiposProductos()
        .then(TiposProductos => {
          $scope.selectTiposProductos = TiposProductos.data;
        })
        .catch(error => {
          $scope.Mensaje = 'No pudimos contactarnos a la base de datos, por favor intenta de nuevo más tarde.';

          $scope.ShowToast('No pudimos cargar la lista de tipos de productos, por favor intenta de nuevo más tarde.', 'danger');

          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
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
      const distribuidores = cookie.distribuidores;
      distribuidores.forEach(item => {
        if (Number(item.IdEmpresa) === Number($scope.currentDistribuidor.IdEmpresa)) {
          $scope.ProtectedRP = item.TipoCambioRP;
          return $scope.ProtectedRP;
        }
      });
      $scope.ProtectedRP = null;
    }

    $scope.revisarProducto = function (Producto) {
      var IdProducto = Producto.IdProducto;
      var cookie = $cookies.getObject('Session');
      var IdEmpresaUsuarioFinal = cookie.IdEmpresa;
      ProductosFactory.getProductContractsTuClick(IdEmpresaUsuarioFinal, IdProducto, $scope.currentDistribuidor.IdEmpresa)
        .then(respuesta => {
          if (respuesta.data.success === 1) {
            Producto.contratos = respuesta.data.data;
            if (Producto.contratos.length >= 1) {
              Producto.TieneContrato = true;
              Producto.IdPedidoContrato = respuesta.data.data[0].IdPedido;
            }
            if ((Producto.IdAccionAutodesk === 2 || !Producto.IdAccionAutodesk) && Producto.contratos.length === 0) {
              Producto.TieneContrato = false;
            }
            if (Producto.IdAccionAutodesk === 1) Producto.contratos.unshift({ IdPedido: 0, NumeroContrato: 'Nuevo contrato...' });
            setProtectedRebatePrice(cookie);
          } else {
            $scope.ShowToast('No pudimos cargar la información de tus contratos, por favor intenta de nuevo más tarde.', 'danger');
          }
        })
        .catch(() => {
          $scope.ShowToast('No pudimos cargar la información de tus contratos, por favor intenta de nuevo más tarde.', 'danger');
        });

      UsuariosFactory.getUsuariosContactoTuClick(IdEmpresaUsuarioFinal, $scope.currentDistribuidor.IdEmpresa)
        .then(respuesta => {
          if (respuesta.data.success === 1) {
            Producto.usuariosContacto = respuesta.data.data;
          } else {
            $scope.ShowToast('No pudimos cargar la información de tus contactos, por favor intenta de nuevo más tarde.', 'danger');
          }
        })
        .catch(() => {
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
              .then(data => {
                $scope.selectProductos = data.data;
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
              .catch(error => {
                $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
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

    $scope.ValidarDominioMS = function (Producto, Cantidad) {
      var IdEmpresaUsuarioFinal = cookie.IdEmpresa;
      if (Producto.IdFabricante === 1) {
        EmpresasFactory.getDominioMsByIdUF(IdEmpresaUsuarioFinal)
        .then(result => {
          if (result.data.IdMicrosoftUF !== null && result.data.IdMicrosoftUF !== '') {
            $scope.AgregarCarrito(Producto, Cantidad);
          } else {
            $scope.ShowToast('No cuentas con dominio de microsoft, ponte en contacto con tu distribuidor', 'danger');
            return;
          }
        })
        .catch(error => {
          $scope.Mensaje = 'No pudimos conectarnos a la base de datos, por favor intenta de nuevo más tarde.';
        });
      } else {
        $scope.AgregarCarrito(Producto, Cantidad);
      }
    };

    const postPedidoAutodesk = function (NuevoProducto, NuevoProducto2) {
      PedidoDetallesFactory.postPedidoDetalleFinalUser(NuevoProducto, $scope.currentDistribuidor.IdEmpresa)
      .then(PedidoDetalleResult => {
        if (PedidoDetalleResult.data.success === 1) {
          if (NuevoProducto.IdFabricante === 2 && NuevoProducto.IdAccionAutodesk === '2') {
            ProductosFactory.getBaseSubscription(NuevoProducto.IdProducto)
              .then(function (result) {
                $scope.suscripciones = result.data.data;
                if (result.data.data.length >= 1) {
                  $location.path('/autodesk/productos/' + NuevoProducto.IdProducto + '/detalle/' + PedidoDetalleResult.data.data.insertId);
                }
              });
          }
          $scope.ShowToast(PedidoDetalleResult.data.message, 'success');
          NuevoProducto2.IdPedidoDetalle = PedidoDetalleResult.data.data.insertId;
          $scope.AgregarComprasUF(NuevoProducto2);
          $scope.ActualizarMenu();
          $scope.addPulseCart();
          setTimeout($scope.removePulseCart, 9000);
        } else {
          $scope.ShowToast(PedidoDetalleResult.data.message, 'danger');
        }
      })
      .catch(error => {
        $scope.Mensaje = 'No pudimos conectarnos a la base de datos, por favor intenta de nuevo más tarde.';
        $scope.ShowToast('No pudimos agregar este producto a tu carrito de compras, por favor intenta de nuevo más tarde.', 'danger');
        $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
      });
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
        MonedaPago: 'Pesos',
        IdEsquemaRenovacion: Producto.IdEsquemaRenovacion,
        IdFabricante: Producto.IdFabricante,
        CodigoPromocion: Producto.CodigoPromocion,
        ResultadoFabricante2: Producto.IdProductoPadre,
        Especializacion: Producto.Especializacion,
        IdUsuarioContacto: Producto.IdUsuarioContacto,
        IdAccionAutodesk: Producto.IdAccionAutodesk || 0
      };

      var NuevoProducto2 = {
        IdProducto: Producto.IdProducto,
        Cantidad: Producto.Cantidad,
        IdEmpresaDistribuidor: $scope.currentDistribuidor.IdEmpresa,
        MonedaCompra: Producto.MonedaCompra
      };
      if (NuevoProducto.IdAccionAutodesk === 1 && !Producto.TieneContrato) {
        return postPedidoAutodesk(NuevoProducto, NuevoProducto2);
      }

      if (!Producto.IdUsuarioContacto && Producto.IdFabricante === 2 && Producto.TieneContrato) {
        const contrato = Producto.contratos
          .filter(function (p) {
            return Producto.IdPedidoContrato === p.IdPedido;
          })[0].NumeroContrato;
        NuevoProducto.ContratoBaseAutodesk = contrato.trim();
        // NuevoProducto.IdAccionAutodesk = Producto.IdAccionProductoAutodesk === 1 ? 3 : 2;
      }
      if (NuevoProducto.IdAccionAutodesk === 1 && Producto.TieneContrato) {
        ProductosFactory.getProductExists(cookie.IdEmpresa, Producto.IdProducto, NuevoProducto.ContratoBaseAutodesk)
        .then(function (result) {
          if (result.data.data.length >= 1) {
            NuevoProducto.IdAccionAutodesk = 2;
          } else {
            NuevoProducto.IdAccionAutodesk = 3;
          }
          if (Producto.IdPedidoContrato === 0) { // Cuando se elige la acción de nuevo contrato y existen contratos adicionales disponibles
            NuevoProducto.IdAccionAutodesk = 1;
          }
          return postPedidoAutodesk(NuevoProducto, NuevoProducto2);
        });
      }
      if (Producto.IdFabricante !== 2) {
        PedidoDetallesFactory.postPedidoDetalleFinalUser(NuevoProducto, $scope.currentDistribuidor.IdEmpresa)
        .then(PedidoDetalleResult => {
          if (PedidoDetalleResult.data.success === 1) {
            if (NuevoProducto.IdFabricante === 2 && Producto.Accion === 'asiento') {
              ProductosFactory.getBaseSubscription(NuevoProducto.IdProducto)
                .then(result => {
                  $scope.suscripciones = result.data.data;
                  if (result.data.data.length >= 1) {
                    $location.path('/autodesk/productos/' + NuevoProducto.IdProducto + '/detalle/' + PedidoDetalleResult.data.data.insertId);
                  }
                });
            };
            NuevoProducto2.IdPedidoDetalle = PedidoDetalleResult.data.insertId;
            $scope.AgregarComprasUF(NuevoProducto2);
            $scope.ShowToast(PedidoDetalleResult.message, 'success');
            $scope.ActualizarMenu();
            $scope.addPulseCart();
            setTimeout($scope.removePulseCart, 9000);
          } else {
            $scope.ShowToast(PedidoDetalleResult.message, 'danger');
          }
        })
        .catch(error => {
          $scope.Mensaje = 'No pudimos conectarnos a la base de datos, por favor intenta de nuevo más tarde.';

          $scope.ShowToast('No pudimos agregar este producto a tu carrito de compras, por favor intenta de nuevo más tarde.', 'danger');

          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        });
      }
    };

    $scope.AgregarComprasUF = function (NuevoProducto2) {
      const currentDistribuidor = $scope.currentDistribuidor.IdEmpresa;
      ComprasUFFactory.postComprasUF(NuevoProducto2, currentDistribuidor)
            .then(ProductoResult => {
              if (ProductoResult.data.success) {
                $scope.ActualizarMenu();
                $scope.ClearToast();
                $scope.ShowToast('Producto guardado en tu carrito de compras.', 'success');
                $scope.addPulseCart();
                setTimeout($scope.removePulseCart, 9000);
              } else {
                $scope.ShowToast(ProductoResult.data.message, 'danger');
              }
            })
          .catch(error => {
            $scope.Mensaje = 'No pudimos conectarnos a la base de datos, por favor intenta de nuevo más tarde.';

            $scope.ShowToast('No pudimos agregar este producto a tu carrito de compras, por favor intenta de nuevo más tarde.', 'danger');

            $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
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

      for (let i = startY; i > stopY; i -= step) {
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
        while (node.offsetParent && node.offsetParent !== document.body) {
          node = node.offsetParent;
          y += node.offsetTop;
        } return y;
      }
    };

    $scope.CalculaDescuento = function (precio, descuento) {
      var total = 0;
      total = precio - ((precio * descuento) * 0.01);
      return total;
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
    ['$scope', '$log', '$location', '$cookies', '$routeParams', 'ProductosXEmpresaFactory', 'FabricantesFactory', 'TiposProductosFactory', 'PedidoDetallesFactory', 'TipoCambioFactory', 'ProductoGuardadosFactory', 'EmpresasXEmpresasFactory', 'EmpresasFactory', '$anchorScroll', 'ProductosFactory', 'ComprasUFFactory', 'UsuariosFactory'];

  angular.module('marketplace').controller('ProductosUFReadController', ProductosUFReadController);
}());
