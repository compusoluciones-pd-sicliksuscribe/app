'use strict';

(function () {
  

  var IndexController = function ($scope, $log, $location, $cookies, $rootScope, PedidosFactory, PedidoDetallesFactory, ngToast, $uibModal, $window, UsuariosFactory, deviceDetector, ComprasUFFactory, EmpresasFactory) {
    $scope.indexBuscarProductos = {};
    $scope.SessionCookie = {};
    $scope.ProductosCarrito = 0;
    $scope.navCollapsed = true;
    $scope.currentPath = $location.path();
    $scope.currentDistribuidor = {};
    $scope.currentDistribuidor.UrlLogo = 'images/LogoSVG.svg';
    $scope.secondaryColor = '';

    $scope.ContarProductosCarrito = function () {
      if (!$scope.currentDistribuidor.IdEmpresa) {
        $scope.ProductosCarrito = 0;
        PedidoDetallesFactory.getContarProductos()
          .success(function (cuenta) {
            if (cuenta.success === 1) {
              $scope.ProductosCarrito = cuenta.data[0].Cantidad;
            }
          })
          .error(function (data, status, headers, config) {
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      } else {
        $scope.ContarProductosCarritoUF();
      }
    };

    $scope.ContarProductosCarritoUF = function () {
      $scope.ProductosCarrito = 0;
      ComprasUFFactory.getCantidadProductosCarrito($scope.currentDistribuidor.IdEmpresa)
        .success(function (cuenta) {
          if (cuenta.success) {
            $scope.ProductosCarrito = cuenta.data[0].Cantidad;
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.$on('LOAD', function () { $scope.cargando = true; });

    $scope.$on('UNLOAD', function () { $scope.cargando = false; });

    $scope.ShowToast = function (Mensaje, className) {
      /* className = "success", "info", "warning" or "danger"*/
      ngToast.create({
        className: className,
        content: '' + Mensaje + '',
        dismissButton: true
      });
    };

    $scope.ClearToast = function () {
      ngToast.dismiss();
    };

    $scope.cambiarDistribuidor = function (Distribuidor, reload) {
      if (Distribuidor) {
        $scope.getColor();
        var expireDate = new Date();
        expireDate.setTime(expireDate.getTime() + 600 * 60000);
        $cookies.putObject('currentDistribuidor', Distribuidor, { 'expires': expireDate, secure: $rootScope.secureCookie });
        if ($cookies.getObject('currentDistribuidor')) {
          $scope.currentDistribuidor = $cookies.getObject('currentDistribuidor');
        } else {
          $scope.currentDistribuidor = {};
          $scope.currentDistribuidor.UrlLogo = 'images/LogoSVG.svg';
        }
        if (reload) {
          $location.path('/');
          $scope.ActualizarMenu();
        }
        if (window.location.hash === '#/') {
          $scope.ShowToast('¡Bienvenido a ' + Distribuidor.NombreEmpresa + '!', 'success');
        }
      }
    };

    $scope.detectarSitioActivoURL = function () {
      var Session = $cookies.getObject('Session');
      if ($scope.currentDistribuidor.IdEmpresa) {
        for (var i = 0; i < Session.distribuidores.length; i++) {
          if (Session.distribuidores[i]) {
            if (Session.distribuidores[i].IdEmpresa === $scope.currentDistribuidor.IdEmpresa) {
              $scope.cambiarDistribuidor(Session.distribuidores[i], false);
            }
          }
        }
      }
    };

    $scope.addPulseCart = function () {
      document.getElementById('shoppingCartBG').className += ' elementBGPulse';
      document.getElementById('shoppingCartBGUF').className += ' elementBGPulseUF';
    };
    $scope.removePulseCart = function () {
      var classes = document.getElementById('shoppingCartBG').className;
      document.getElementById('shoppingCartBG').className = classes.replace(' elementBGPulse', '');
      classes = document.getElementById('shoppingCartBGUF').className;
      document.getElementById('shoppingCartBGUF').className = classes.replace(' elementBGPulseUF', '');
    };

    $scope.ActualizarMenu = function (location) {
      $scope.navCollapsed = true;
      if ($cookies.getObject('Session')) {
        $scope.SessionCookie = $cookies.getObject('Session');
        $scope.ContarProductosCarrito();
        if ($scope.SessionCookie.IdTipoAcceso === 4 || $scope.SessionCookie.IdTipoAcceso === '4' ||
          $scope.SessionCookie.IdTipoAcceso === 5 || $scope.SessionCookie.IdTipoAcceso === '5' ||
          $scope.SessionCookie.IdTipoAcceso === 8 || $scope.SessionCookie.IdTipoAcceso === '8' ||
          $scope.SessionCookie.IdTipoAcceso === 6 || $scope.SessionCookie.IdTipoAcceso === '6') {
          $scope.cambiarDistribuidor($cookies.getObject('currentDistribuidor'), false);
        }
      }
    };

    $scope.esNavegadorSoportado = function () {
      if (!validarNavegador(deviceDetector)) {
        $scope.navCollapsed = true;
        $location.path('/Navegadores');
      } else if (validarNavegador(deviceDetector) && $location.$$url === '/Navegadores') {
        $location.path('/');
      }
    };

    $scope.CheckCookie = function () {
      if (!validarNavegador(deviceDetector)) {
        $scope.navCollapsed = true;
        $location.path('/Navegadores');
      } else {
        $scope.navCollapsed = true;

        if ($cookies.getObject('Session') == '' || $cookies.getObject('Session') == undefined || $cookies.getObject('Session') == null) {
          $location.path('/Login');
        } else {
          var fecha = new Date();

          if ($cookies.getObject('Session').Expira < fecha.getTime()) {
            $scope.CerrarSesion();
          } else {
            if ($cookies.getObject('Session').LeyoTerminos != 1) {
              $scope.ShowToast('Para usar el sitio necesitas aceptar los terminos y condiciones', 'danger');
              $location.path('/TerminosCondiciones');
            }
          }
        }
      }
    };

    /* Valida si el navegador que esta usando el usuario es soportado por las tecnologías de click suscribe*/
    function validarNavegador (deviceDetector) {
      var esSoportado = false;
      if (deviceDetector.browser === 'ie' && parseInt(obtenerPrimeraCifraVersionNavegador(deviceDetector)) >= 9) { esSoportado = true; }
      if (deviceDetector.browser === 'chrome' && parseInt(obtenerPrimeraCifraVersionNavegador(deviceDetector)) >= 47) { esSoportado = true; }
      if (deviceDetector.browser === 'firefox' && parseInt(obtenerPrimeraCifraVersionNavegador(deviceDetector)) >= 43) { esSoportado = true; }
      if (deviceDetector.browser === 'safari' && parseInt(obtenerPrimeraCifraVersionNavegador(deviceDetector)) >= 5) { esSoportado = true; }
      if (deviceDetector.browser === 'opera' && parseInt(obtenerPrimeraCifraVersionNavegador(deviceDetector)) >= 34) { esSoportado = true; }
      if (deviceDetector.browser === 'ms-edge') { esSoportado = false; }
      if (deviceDetector.device === 'android') { esSoportado = true; }
      if (deviceDetector.device === 'ipad') { esSoportado = true; }
      if (deviceDetector.device === 'iphone') { esSoportado = true; }
      return esSoportado;
    }

    /* Obtiene la primera cifra de la versión del navegador que esta usando el usaurio*/
    function obtenerPrimeraCifraVersionNavegador (deviceDetector) {
      var arregloCifrasVersion = deviceDetector.browser_version.split('.');
      return arregloCifrasVersion[0];
    }
    $scope.getColor = function() {
      $scope.secondaryColor = $scope.currentDistribuidor.SecondaryColor === '#ffffff' ? `background:${$scope.currentDistribuidor.PrimaryColor}` : `background:${$scope.currentDistribuidor.SecondaryColor}`;
    }

    $scope.init = function () {
      if (!validarNavegador(deviceDetector)) {
        $scope.navCollapsed = true;
        $location.path('/Navegadores');
        return false;
      } else {
        $scope.navCollapsed = true;
        obtenerSubdominio();
        $scope.ActualizarMenu();
      }
      $scope.getColor();
    };

    $scope.init();

    function obtenerSubdominio () {
      var url = window.location.href;
      var subdomain = url.replace('http://', '');
      subdomain = subdomain.replace('https://', '');
      subdomain = subdomain.substring(0, subdomain.indexOf($rootScope.dominio));
      subdomain = subdomain.replace(new RegExp('[.]', 'g'), '');
      subdomain = subdomain.replace('www', '');
      if (subdomain !== '') {
        EmpresasFactory.getSitio(subdomain).success(function (empresa) {
          if (empresa.data[0]) {
            $scope.cambiarDistribuidor(empresa.data[0], false);
            $scope.ActualizarMenu();
            $scope.currentDistribuidor = $cookies.getObject('currentDistribuidor');
            selectNavicon($scope.currentDistribuidor.Icon);
          } else {
            window.location.href = 'https://clicksuscribe.compusoluciones.com/#/';
            $scope.currentDistribuidor = {};
            $scope.currentDistribuidor.UrlLogo = 'images/LogoSVG.svg';
          }
        });
      } else {
        selectNavicon();
      }
    }
    $scope.selectMenu = function () {
      $scope.currentDistribuidor = $cookies.getObject('currentDistribuidor') || {};
      if ($scope.currentDistribuidor) {
        if ($scope.currentDistribuidor.IdEmpresa != 0 && $scope.currentDistribuidor.IdEmpresa != null) {
          return true;
        }

        if(!$scope.SessionCookie.IdTipoAcceso && $scope.currentDistribuidor.IdEmpresa)
        {
          return true;
        }
      }
      return false;
    };

    $scope.Buscar = function () {
      try {
        $scope.goToPage('Productos/' + $scope.indexBuscarProductos.Busqueda.replace('/', ''));
      } catch (error) { }
    };

    $scope.BuscarUF = function () {
      try {
        $scope.goToPage('uf/Productos/' + $scope.indexBuscarProductos.Busqueda.replace('/', ''));
      } catch (error) { }
    };

    function createLocationTracker (location) {
      let locationfstPart;
      ga(function (tracker) {
        locationfstPart = tracker.get('location');
      })
      ga('set', 'page', locationfstPart + '#/' + location);
      ga('send', 'pageview');
    }

    $scope.goToPage = function (location, carousel) {
      createLocationTracker(location);
      if (location === 'Productos')
        ga('send', 'event', 'Catalogo de ' + location, 'Redireccionar', 'Redirigió a: /' + location);
      else if (carousel) {
        ga('send', 'event', 'Catalogo de ' + location, 'Redireccionar desde carousel', 'Redirigió a: /' + location);
      }
      else
        ga('send', 'event', location, 'Redireccionar', 'Redirigió a: /' + location);
      $scope.navCollapsed = true;
      $location.path('/' + location);
    };

    $scope.gaAgregarCarrito = function (producto) {
      ga('send', 'event', 'Carrito', 'Agregar al carrito', 'Se agregó producto: ' + producto.IdERP + ' - ' + producto.Nombre);
    };

    $scope.gaFinCompra = function () {
      createLocationTracker('Comprar');
      ga('send', 'event', 'Carrito', 'Finalizar compra', 'Detalles del pedido');
    };

    $scope.gaComprar = function (orders, distribuitorDetails) {
      $scope.PedidoDetalles = orders;
      $scope.Distribuidor = distribuitorDetails;
      let total = 0;
      let pedidos = '|';
      orders.forEach(order => {
        if (order.MonedaPago === 'Pesos') {
          total += ($scope.calcularTotal(order.IdPedido) / order.TipoCambio);
        } else {
          total += $scope.calcularTotal(order.IdPedido);
        }
        pedidos = pedidos + String(order.IdPedido) + '|';
      });
      createLocationTracker('SuccessOrder');
      ga('send', 'event', 'Carrito', 'Concretar compra', 'Se realizó la compra. Pedidos: ' + pedidos, Math.floor(total));
    };

    $scope.gaAceptarCompra = function () {
      createLocationTracker('');
      ga('send', 'event', 'Carrito', 'Aceptar compra', 'Se aceptó la compra');
    }

    $scope.calcularSubTotal = function (IdPedido) {
      let total = 0;
      $scope.PedidoDetalles.forEach(function (order) {
        order.Productos.forEach(function (product) {
          if (order.IdPedido === IdPedido && !product.PrimeraCompraMicrosoft) {
            const productPrice = $scope.calculatePriceWithExchangeRate(order, product, 'PrecioUnitario');
            if (isTiredProduct(product)) {
              total = total + productPrice;
            } else {
              total = total + (productPrice * product.Cantidad);
            }
          }
        });
      });
      return total;
    };

    $scope.calcularTotal = function (IdPedido) {
      let total = $scope.calcularSubTotal(IdPedido);
      let iva = 0;
      if ($scope.Distribuidor.ZonaImpuesto === 'Normal') iva = 0.16 * total;
      if ($scope.Distribuidor.ZonaImpuesto === 'Nacional') iva = 0.16 * total;
      if ($scope.Distribuidor.ZonaImpuesto === 'Frontera') iva = 0.11 * total;
      total = total + iva;
      return total;
    };

    $scope.calculatePriceWithExchangeRate = function (order, details, value) {
      let total = 0;
      if (order.MonedaPago === 'Pesos' && details.MonedaPrecio === 'Dólares') {
        total = details[value] * order.TipoCambio;
      } else if (order.MonedaPago === 'Dólares' && details.MonedaPrecio === 'Pesos' && details.IdProducto !== ELECTRONIC_SERVICE) {
        total = details[value] / order.TipoCambio;
      } else {
        total = details[value];
      }
      if (order.IdEsquemaRenovacion === 2 && value === 'PrecioRenovacion') {
        total *= 12;
      }
      return total;
    };

    const isTiredProduct = function (product) {
      return product.tieredPrice > 0;
    };

    $scope.CerrarSesion = function () {
      try {
        $scope.navCollapsed = true;

        var Session =
          {
            Token: '',
            CorreoElectronico: '',
            Nombre: '',
            IdUsuario: '',
            ApellidoPaterno: '',
            ApellidoMaterno: '',
            IdTipoAcceso: '',
            NombreTipoAcceso: '',
            IdEmpresa: '',
            NombreEmpresa: '',
            LeyoTerminos: ''
          };

        var expireDate = new Date();

        expireDate.setTime(expireDate.getTime() + 1);

        $cookies.remove('Session');
        $cookies.remove('Pedido');
       // $cookies.remove('currentDistribuidor');

        $scope.SessionCookie = {};
        $scope.currentDistribuidor = {};

        angular.forEach($cookies, function (v, k) {
          $cookies.remove(k);
        });

        $scope = $scope.$new(true);

        UsuariosFactory.getCerrarSession()
          .success(function (result) {
            $window.location.reload();
            $location.path('/Login');
          })
          .error(function (data, status, headers, config) {
            $window.location.reload();
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
            $location.path('/Login');
          });

        $location.path('/Login');
        $scope.ActualizarMenu();
      } catch (error) {

      }
    };

    $scope.ActualizarDatosSession = function () {
      $scope.SessionCookie = $cookies.getObject('Session');
      if ($scope.SessionCookie.IdTipoAcceso === 4 || $scope.SessionCookie.IdTipoAcceso === '4') {
        $scope.cambiarDistribuidor($cookies.getObject('currentDistribuidor'), false);
      }
    };

    $scope.IniciarTour = function () {
      $scope.Tour = new Tour({

        steps: [
          {
            element: '.five',
            title: 'Ver todos los productos',
            placement: 'bottom',
            content: 'Consulta la lista de productos filtrando por fabricante o tipo, configura el producto para agregarlos al carrito de compras.',
            template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Atrás</button><button class='btn btn-default' data-role='next'>Sig »</button><button class='btn btn-default' data-role='end'>Finalizar</button></nav></div></div>",
          },
          {
            element: '.one',
            placement: 'bottom',
            title: 'Mis clientes',
            content: 'Aquí podrás administrar a tus colaboradores, consultar tus clientes y ver el monitor de suscripciones.',
            template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Atrás</button><button class='btn btn-default' data-role='next'>Sig »</button><button class='btn btn-default' data-role='end'>Finalizar</button></nav></div></div>",
          },
          {
            element: '.four',
            title: 'Mi perfil',
            placement: 'bottom',
            content: 'Actualiza tus datos personales como tu contraseña de acceso.',
            template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Atrás</button><button class='btn btn-default' data-role='next'>Sig »</button><button class='btn btn-default' data-role='end'>Finalizar</button></nav></div></div>",
          },
          {
            element: '.two',
            title: 'Carrito de compras',
            placement: 'bottom',
            content: 'Aquí podrás consultar todos los productos que agregues para tu compra.',
            template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Atrás</button><button class='btn btn-default' data-role='next'>Sig »</button><button class='btn btn-default' data-role='end'>Finalizar</button></nav></div></div>",
          },
          {
            element: '.three',
            title: 'Buscador',
            placement: 'bottom',
            content: 'Puedes buscar cualquier producto por su nombre, fabricante, o Id.',
            template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Atrás</button><button class='btn btn-default' data-role='next'>Sig »</button><button class='btn btn-default' data-role='end'>Finalizar</button></nav></div></div>",
          }
        ],

        backdrop: true,
        storage: false
      });

      $scope.Tour.init();
      $scope.Tour.start();
    };
  };
  function selectNavicon (icon) {
    var link = document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    if (icon) { link.href = icon; } else { link.href = 'images/icon.png'; }
    document.getElementsByTagName('head')[0].appendChild(link);
  };

  $('body').click(function (evt) {    
    if (evt.target.id !== 'collapseEmpresaId' && evt.target.id !== 'Clientes' ){
      var botonOn = document.getElementById('collapseEmpresa');
      var botonOn2 = document.getElementById('collapseClientes');
      botonOn.classList.remove('in', 'show');
      botonOn2.classList.remove('in', 'show');
    }
  });

  IndexController.$inject = ['$scope', '$log', '$location', '$cookies', '$rootScope', 'PedidosFactory', 'PedidoDetallesFactory', 'ngToast', '$uibModal', '$window', 'UsuariosFactory', 'deviceDetector', 'ComprasUFFactory', 'EmpresasFactory'];

  angular.module('marketplace').controller('IndexController', IndexController);
}());
