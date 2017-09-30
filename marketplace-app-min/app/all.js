(function () {
  var app = angular.module('marketplace', ['ngRoute', 'ngAnimate', 'ngCookies', 'ngTouch', 'angular-jwt', 'angular-parallax', 'ui.bootstrap', 'angular.filter', 'angularFileUpload', 'ngToast', 'ui.mask', 'directives.loading', 'bcherny/formatAsCurrency', 'ng.deviceDetector']);
  app.config(function ($routeProvider) {
    $routeProvider

      .when('/', { controller: 'LandingController', templateUrl: 'app/views/Landing.html' })
      .when('/index', { controller: 'LandingController', templateUrl: 'app/views/Landing.html' })
      .when('/Login', { controller: 'UsuariosLoginController', templateUrl: 'app/views/Usuarios/UsuariosLogin.html' })
      .when('/Iniciar', { controller: 'UsuariosLoginController', templateUrl: 'app/views/Usuarios/UsuariosLogin.html' })
      .when('/IniciarSesion', { controller: 'UsuariosLoginController', templateUrl: 'app/views/Usuarios/UsuariosLogin.html' })
      .when('/Recuperar', { controller: 'UsuariosRecuperarController', templateUrl: 'app/views/Usuarios/UsuariosRecuperar.html' })
      .when('/SoporteCSP', { controller: 'SoporteController', templateUrl: 'app/views/Soporte.html' })
      .when('/Contacto', { controller: 'ContactoController', templateUrl: 'app/views/Contactanos.html' })
      .when('/Sugerencias', { controller: 'SugerenciasController', templateUrl: 'app/views/Sugerencias.html' })
      .when('/404', { templateUrl: 'app/views/error.html' })
      .when('/offline', { templateUrl: 'app/views/offline.html' })
      .when('/Desbloquear/:encryptedObject', { controller: 'DesbloquearCuentaController', templateUrl: 'app/views/Usuarios/DesbloquearCuenta.html' })
      .when('/Navegadores', { controller: 'NavegadoresController', templateUrl: 'app/views/Navegadores.html' })
      .when('/ConfirmarCuenta/:encryptedObject', { controller: 'ConfirmarCuentaController', templateUrl: 'app/views/Usuarios/ConfirmarCuenta.html' })

      .when('/Usuario/:IdUsuario', {
        controller: 'UsuariosUpdateController', templateUrl: 'app/views/Usuarios/UsuariosUpdate.html',
        resolve: {
          'check': function ($location, $cookieStore) {
            var Session = $cookieStore.get('Session');
            if (!(Session.IdTipoAcceso === 1 || Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3 || Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === 5 || Session.IdTipoAcceso === 6 || Session.IdTipoAcceso === 7)) { $location.path('/404'); }
          }
        }
      })

      .when('/MisProductos', {
        controller: 'MisProductosReadController', templateUrl: 'app/views/Productos/MisProductosRead.html',
        resolve: {
          'check': function ($location, $cookieStore) {
            var Session = $cookieStore.get('Session');
            if (!(Session.IdTipoAcceso === 2 && Session.IdEmpresa == 214)) { $location.path('/404'); }
          }
        }
      })

      .when('/Configuracion', {
        controller: 'ConfiguracionUpdateController', templateUrl: 'app/views/Empresas/ConfiguracionUpdate.html',
        resolve: {
          'check': function ($location, $cookieStore) {
            var Session = $cookieStore.get('Session');
            if (!(Session.IdTipoAcceso === 2 && Session.IdEmpresa == 214)) { $location.path('/404'); }
          }
        }
      })
      .when('/autodesk/productos/:IdProducto/detalle/:IdPedidoDetalle', {
        controller: 'ConfigurarBaseController', templateUrl: 'app/views/Productos/ConfigurarBase.html',
        resolve: {
          'check': function ($location, $cookieStore) {
            var Session = $cookieStore.get('Session');
            if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3)) { $location.path('/404'); }
          }
        }
      })

      .when('/monitor-soporte', {
        controller: 'SoporteReadController', templateUrl: 'app/views/Soporte/SoporteRead.html',
        resolve: {
          'check': function ($location, $cookieStore) {
            var Session = $cookieStore.get('Session');
            if (!(Session.IdTipoAcceso === 1 || Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3)) { $location.path('/404'); }
          }
        }
      })

      .when('/solicitar-soporte', {
        controller: 'SoporteCreateController', templateUrl: 'app/views/Soporte/SoporteCreate.html',
        resolve: {
          'check': function ($location, $cookieStore) {
            var Session = $cookieStore.get('Session');
            if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3)) { $location.path('/404'); }
          }
        }
      })

      .when('/actualizar-soporte/:idSoporte', {
        controller: 'SoporteUpdateController', templateUrl: 'app/views/Soporte/SoporteUpdate.html',
        resolve: {
          'check': function ($location, $cookieStore) {
            var Session = $cookieStore.get('Session');
            if (!(Session.IdTipoAcceso === 1)) { $location.path('/404'); }
          }
        }
      })

      .when('/power-bi', {
        controller: 'PowerBIReadController', templateUrl: 'app/views/PowerBI/PowerBIRead.html',
        resolve: {
          'check': function ($location, $cookieStore) {
            var Session = $cookieStore.get('Session');
            if (!(Session.IdTipoAcceso === 1)) { $location.path('/404'); }
          }
        }
      })

      .when('/aplicaciones', {
        controller: 'AplicacionesReadController', templateUrl: 'app/views/Aplicaciones/AplicacionesRead.html',
        resolve: {
          'check': function ($location, $cookieStore) {
            var Session = $cookieStore.get('Session');
            if (!(Session.IdTipoAcceso === 2 && Session.IdEmpresa === 110)) { $location.path('/404'); }
          }
        }
      })

      .when('/migraciones', {
        controller: 'MigracionController', templateUrl: 'app/views/Migracion/Migracion.html',
        resolve: {
          'check': function ($location, $cookieStore) {
            var Session = $cookieStore.get('Session');
            if (!(Session.IdTipoAcceso === 2 && Session.IdEmpresa === 110)) { $location.path('/404'); }
          }
        }
      })

      .when('/migraciones/:idMigracion', {
        controller: 'MigracionDetalleController', templateUrl: 'app/views/Migracion/MigracionDetalle.html',
        resolve: {
          'check': function ($location, $cookieStore) {
            var Session = $cookieStore.get('Session');
            if (!(Session.IdTipoAcceso === 2 && Session.IdEmpresa === 110)) { $location.path('/404'); }
          }
        }
      })

      .when('/ConfigurarRPs/:IdEmpresa', {
        controller: 'EmpresasRPController', templateUrl: 'app/views/Empresas/EmpresasRP.html',
        resolve: {
          'check': function ($location, $cookieStore) {
            var Session = $cookieStore.get('Session');
            if (!(Session.IdTipoAcceso === 1)) { $location.path('/404'); }
          }
        }
      })

      .when('/Monitor', {
        controller: 'MonitorReadController', templateUrl: 'app/views/PedidoDetalles/MonitorRead.html',
        resolve: {
          'check': function ($location, $cookieStore) {
            var Session = $cookieStore.get('Session');
            if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3 || Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === 5 || Session.IdTipoAcceso === 6 || Session.IdTipoAcceso === 7)) { $location.path('/404'); }
          }
        }
      })

      .when('/MonitorPagos', {
        controller: 'MonitorPagos', templateUrl: 'app/views/PedidoDetalles/MonitorPagos.html',
        resolve: {
          'check': function ($location, $cookieStore) {
            var Session = $cookieStore.get('Session');
            if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3 || Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === 5 || Session.IdTipoAcceso === 6 || Session.IdTipoAcceso === 7)) { $location.path('/404'); }
          }
        }
      })

      .when('/MonitorPagos/refrescar', {
        controller: 'MonitorPagos', templateUrl: 'app/views/PedidoDetalles/MonitorPagos.html',
        resolve: {
          'check': function ($location, $cookieStore) {
            var Session = $cookieStore.get('Session');
            if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3 || Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === 5 || Session.IdTipoAcceso === 6 || Session.IdTipoAcceso === 7)) { $location.path('/404'); }
          }
        }
      })

      .when('/DetallesAzure/:IdPedido', {
        controller: 'DetallesAzureController', templateUrl: 'app/views/PedidoDetalles/DetallesAzure.html',
        resolve: {
          'check': function ($location, $cookieStore) {
            var Session = $cookieStore.get('Session');
            if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3)) { $location.path('/404'); }
          }
        }
      })

      .when('/TerminosCondiciones', {
        controller: 'TerminosReadController', templateUrl: 'app/views/Usuarios/TerminosRead.html',
        resolve: {
          'check': function ($location, $cookieStore) {
            var Session = $cookieStore.get('Session');
            if (!(Session.IdTipoAcceso === 1 || Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3 || Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === 5 || Session.IdTipoAcceso === 6 || Session.IdTipoAcceso === 7)) { $location.path('/404'); }
          }
        }
      })

      .when('/Usuario', {
        controller: 'UsuariosCreateController', templateUrl: 'app/views/Usuarios/UsuariosCreate.html',
        resolve: { 'check': function ($location, $cookieStore) { var Session = $cookieStore.get('Session'); if (!(Session.IdTipoAcceso === 1 || Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === 6 || Session.IdTipoAcceso === 7)) { $location.path('/404'); } } }
      })

      .when('/Usuarios', {
        controller: 'UsuariosReadController', templateUrl: 'app/views/Usuarios/UsuariosRead.html',
        resolve: { 'check': function ($location, $cookieStore) { var Session = $cookieStore.get('Session'); if (!(Session.IdTipoAcceso === 1 || Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === 6 || Session.IdTipoAcceso === 7)) { $location.path('/404'); } } }
      })

      .when('/Empresa', {
        controller: 'EmpresasCreateController', templateUrl: 'app/views/Empresas/EmpresasCreate.html',
        resolve: { 'check': function ($location, $cookieStore) { var Session = $cookieStore.get('Session'); if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 7)) { $location.path('/404'); } } }
      })

      .when('/Empresa/:IdEmpresa', {
        controller: 'EmpresasUpdateController', templateUrl: 'app/views/Empresas/EmpresasUpdate.html',
        resolve: { 'check': function ($location, $cookieStore) { var Session = $cookieStore.get('Session'); if (!(Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === 6)) { $location.path('/404'); } } }
      })

      .when('/Clientes', {
        controller: 'EmpresasXEmpresasReadController', templateUrl: 'app/views/EmpresasXEmpresas/EmpresasXEmpresasRead.html',
        resolve: { 'check': function ($location, $cookieStore) { var Session = $cookieStore.get('Session'); if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3 || Session.IdTipoAcceso === 7)) { $location.path('/404'); } } }
      })

      .when('/Productos/:Busqueda', {
        controller: 'ProductosReadController', templateUrl: 'app/views/Productos/ProductosRead.html',
        resolve: { 'check': function ($location, $cookieStore) { var Session = $cookieStore.get('Session'); if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3 || Session.IdTipoAcceso === 7)) { $location.path('/404'); } } }
      })

      .when('/Productos', {
        controller: 'ProductosReadController', templateUrl: 'app/views/Productos/ProductosRead.html',
        resolve: { 'check': function ($location, $cookieStore) { var Session = $cookieStore.get('Session'); if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3 || Session.IdTipoAcceso === 7)) { $location.path('/404'); } } }
      })

      .when('/Comprar', {
        controller: 'ComprarController', templateUrl: 'app/views/PedidoDetalles/Comprar.html',
        resolve: { 'check': function ($location, $cookieStore) { var Session = $cookieStore.get('Session'); if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3)) { $location.path('/404'); } } }
      })

      .when('/uf/Comprar', {
        controller: 'ComprarUFController', templateUrl: 'app/views/PedidoDetalles/ComprarUF.html',
        resolve: { 'check': function ($location, $cookieStore) { var Session = $cookieStore.get('Session'); if (!(Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === 5 || Session.IdTipoAcceso === 6)) { $location.path('/404'); } } }
      })

      .when('/Carrito', {
        controller: 'PedidoDetallesReadController', templateUrl: 'app/views/PedidoDetalles/PedidoDetallesRead.html',
        resolve: { 'check': function ($location, $cookieStore) { var Session = $cookieStore.get('Session'); if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3)) { $location.path('/404'); } } }
      })

      .when('/Carrito/:error', {
        controller: 'PedidoDetallesReadController', templateUrl: 'app/views/PedidoDetalles/PedidoDetallesRead.html',
        resolve: { 'check': function ($location, $cookieStore) { var Session = $cookieStore.get('Session'); if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3)) { $location.path('/404'); } } }
      })

      .when('/uf/Productos/:Busqueda', {
        controller: 'ProductosUFReadController', templateUrl: 'app/views/Productos/ProductosUFRead.html',
        resolve: { 'check': function ($location, $cookieStore) { var Session = $cookieStore.get('Session'); if (!(Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === 5 || Session.IdTipoAcceso === 6)) { $location.path('/404'); } } }
      })

      .when('/uf/Productos', {
        controller: 'ProductosUFReadController', templateUrl: 'app/views/Productos/ProductosUFRead.html',
        resolve: { 'check': function ($location, $cookieStore) { var Session = $cookieStore.get('Session'); if (!(Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === 5 || Session.IdTipoAcceso === 6)) { $location.path('/404'); } } }
      })

      .when('/uf/Carrito', {
        controller: 'PedidoDetallesUFReadController', templateUrl: 'app/views/PedidoDetalles/PedidoDetallesUFRead.html',
        resolve: { 'check': function ($location, $cookieStore) { var Session = $cookieStore.get('Session'); if (!(Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === 5 || Session.IdTipoAcceso === 6)) { $location.path('/404'); } } }
      })

      .when('/uf/Carrito/:error', {
        controller: 'PedidoDetallesUFReadController', templateUrl: 'app/views/PedidoDetalles/PedidoDetallesUFRead.html',
        resolve: { 'check': function ($location, $cookieStore) { var Session = $cookieStore.get('Session'); if (!(Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === 5 || Session.IdTipoAcceso === 6)) { $location.path('/404'); } } }
      })

      .when('/Favoritos', {
        controller: 'ProductoGuardadosReadController', templateUrl: 'app/views/ProductoGuardados/ProductoGuardadosRead.html',
        resolve: { 'check': function ($location, $cookieStore) { var Session = $cookieStore.get('Session'); if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3)) { $location.path('/404'); } } }
      })

      .when('/Empresas/Importar/:IdEmpresa', {
        controller: 'EmpresasImportController', templateUrl: 'app/views/Empresas/EmpresasImport.html',
        resolve: { 'check': function ($location, $cookieStore) { var Session = $cookieStore.get('Session'); if (!(Session.IdTipoAcceso === 1)) { $location.path('/404'); } } }
      })

      .when('/Empresas/Importar/:IdEmpresa/:IdMicrosoft/:Dominio/:Name', {
        controller: 'EmpresasCompletarController', templateUrl: 'app/views/Empresas/EmpresasCompletar.html',
        resolve: { 'check': function ($location, $cookieStore) { var Session = $cookieStore.get('Session'); if (!(Session.IdTipoAcceso === 1)) { $location.path('/404'); } } }
      })

      .when('/Empresas', {
        controller: 'EmpresasReadController', templateUrl: 'app/views/Empresas/EmpresasRead.html',
        resolve: { 'check': function ($location, $cookieStore) { var Session = $cookieStore.get('Session'); if (!(Session.IdTipoAcceso === 1)) { $location.path('/404'); } } }
      })

      .when('/Credito/:IdEmpresa', {
        controller: 'EmpresasCreditoUpdateController', templateUrl: 'app/views/Empresas/EmpresasCreditoUpdate.html',
        resolve: { 'check': function ($location, $cookieStore) { var Session = $cookieStore.get('Session'); if (!(Session.IdTipoAcceso === 1)) { $location.path('/404'); } } }
      })

      .when('/Promocion', {
        controller: 'PromocionsCreateController', templateUrl: 'app/views/Promocions/PromocionsCreate.html',
        resolve: { 'check': function ($location, $cookieStore) { var Session = $cookieStore.get('Session'); if (!(Session.IdTipoAcceso === 1)) { $location.path('/404'); } } }
      })

      .when('/Promocions', {
        controller: 'PromocionsReadController', templateUrl: 'app/views/Promocions/PromocionsRead.html',
        resolve: { 'check': function ($location, $cookieStore) { var Session = $cookieStore.get('Session'); if (!(Session.IdTipoAcceso === 1)) { $location.path('/404'); } } }
      })

      .when('/Promocion/:IdPromocion', {
        controller: 'PromocionsUpdateController', templateUrl: 'app/views/Promocions/PromocionsUpdate.html',
        resolve: { 'check': function ($location, $cookieStore) { var Session = $cookieStore.get('Session'); if (!(Session.IdTipoAcceso === 1)) { $location.path('/404'); } } }
      })

      .when('/Reportes', {
        controller: 'ReportesController', templateUrl: 'app/views/Reportes.html',
        resolve: { 'check': function ($location, $cookieStore) { var Session = $cookieStore.get('Session'); if (!(Session.IdTipoAcceso === 1 || Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3 || Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === 5 || Session.IdTipoAcceso === 6 || Session.IdTipoAcceso === 7)) { $location.path('/404'); } } }
      })

      .when('/Niveles', {
        controller: 'NivelesReadController', templateUrl: 'app/views/Niveles/NivelesRead.html',
        resolve: {
          'check': function ($location, $cookieStore, jwtHelper) {
            var Session = $cookieStore.get('Session');
            var decoded = jwtHelper.decodeToken(Session.Token);
            if (!(decoded.IdTipoAcceso === 1)) {
              $location.path('/404');
            }
          }
        }
      })

      .when('/Niveles/Distribuidor', {
        controller: 'NivelesClienteFinalController', templateUrl: 'app/views/Niveles/NivelesClienteFinal.html',
        resolve: {
          'check': function ($location, $cookieStore, jwtHelper) {
            var Session = $cookieStore.get('Session');
            var decoded = jwtHelper.decodeToken(Session.Token);
            if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3) || !decoded.Niveles) { $location.path('/404'); }
          }
        }
      })

      .when('/Niveles/Distribuidor/:IdDescuento/Descuentos', {
        controller: 'DescuentosNivelesController', templateUrl: 'app/views/Descuentos/DescuentosNiveles.html',
        resolve: {
          'check': function ($location, $cookieStore, jwtHelper) {
            var Session = $cookieStore.get('Session');
            var decoded = jwtHelper.decodeToken(Session.Token);
            if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3) || !decoded.Niveles) { $location.path('/404'); }
          }
        }
      })

      .when('/Niveles/:IdNivel/Productos', {
        controller: 'DescuentosNivelesCSController', templateUrl: 'app/views/Descuentos/DescuentosNivelesCS.html',
        resolve: {
          'check': function ($location, $cookieStore, jwtHelper) {
            var Session = $cookieStore.get('Session');
            if (!Session.IdTipoAcceso === 1) { $location.path('/404'); }
          }
        }
      })

      .when('/Descuentos', {
        controller: 'DescuentosReadController', templateUrl: 'app/views/Descuentos/DescuentosRead.html',
        resolve: { 'check': function ($location, $cookieStore) { var Session = $cookieStore.get('Session'); if (!(Session.IdTipoAcceso === 1)) { $location.path('/404'); } } }
      })

      .when('/Descuento', {
        controller: 'DescuentosCreateController', templateUrl: 'app/views/Descuentos/DescuentosCreate.html',
        resolve: { 'check': function ($location, $cookieStore) { var Session = $cookieStore.get('Session'); if (!(Session.IdTipoAcceso === 1)) { $location.path('/404'); } } }
      })

      .when('/Descuento/:Descuento', {
        controller: 'DescuentosUpdateController', templateUrl: 'app/views/Descuentos/DescuentosUpdate.html',
        resolve: { 'check': function ($location, $cookieStore) { var Session = $cookieStore.get('Session'); if (!(Session.IdTipoAcceso === 1)) { $location.path('/404'); } } }
      })

      .when('/Version', {
        controller: 'VersionController', templateUrl: 'app/views/VersionControl/VersionControl.html',
        resolve: { 'check': function ($location, $cookieStore) { var Session = $cookieStore.get('Session'); if (!(Session.IdTipoAcceso === 2)) { $location.path('/404'); } } }
      })

      /* .when('/:Subdominio', { controller: 'UsuariosLoginController', templateUrl: 'app/views/Usuarios/UsuariosLogin.html' }) */

      .otherwise({ redirectTo: '/404' });
  });
}());


angular.module('marketplace')

  .run(function ($rootScope, $location, $anchorScroll, $routeParams) {
    $rootScope.rsTitle = 'click suscribe | CompuSoluciones';
    $rootScope.rsVersion = '2.1.1';
    /* $rootScope.API = 'http://localhost:8080/';
    $rootScope.MAPI = 'http://localhost:8083/';
    $rootScope.dominio = 'localhost';*/
    $rootScope.API = 'https://pruebas.compusoluciones.com/';
    $rootScope.MAPI = 'http://microsoft-api.us-east-1.elasticbeanstalk.com/';
    $rootScope.dominio = 'clicksuscribe';
  });

(function () {
  var ContactoController = function ($scope) {
    $scope.init = function () {
      $scope.esNavegadorSoportado();
      $scope.navCollapsed = true;
    };
    $scope.init();
  };

  ContactoController.$inject = ['$scope'];

  angular.module('marketplace').controller('ContactoController', ContactoController);
}());

'use strict';

(function () {
  var IndexController = function ($scope, $log, $location, $cookieStore, $rootScope, PedidosFactory, PedidoDetallesFactory, ngToast, $uibModal, $window, UsuariosFactory, deviceDetector, ComprasUFFactory, EmpresasFactory) {
    $scope.indexBuscarProductos = {};
    $scope.SessionCookie = {};
    $scope.ProductosCarrito = 0;
    $scope.navCollapsed = true;
    $scope.currentPath = $location.path();
    $scope.currentDistribuidor = {};
    $scope.currentDistribuidor.UrlLogo = 'images/LogoSVG.svg';

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
        var expireDate = new Date();
        expireDate.setTime(expireDate.getTime() + 600 * 60000);
        $cookieStore.put('currentDistribuidor', Distribuidor, { 'expires': expireDate });
        if ($cookieStore.get('currentDistribuidor')) {
          $scope.currentDistribuidor = $cookieStore.get('currentDistribuidor');
        } else {
          $scope.currentDistribuidor = {};
          $scope.currentDistribuidor.UrlLogo = 'images/LogoSVG.svg';
        }
        if (reload) {
          $location.path('/');
          $scope.ActualizarMenu();
        }
        $scope.ShowToast('¡Bienvenido a ' + Distribuidor.NombreEmpresa + '!', 'success');
      }
    };

    $scope.detectarSitioActivoURL = function () {
      var Session = $cookieStore.get('Session');
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
      if ($cookieStore.get('Session')) {
        $scope.SessionCookie = $cookieStore.get('Session');
        $scope.ContarProductosCarrito();
        if ($scope.SessionCookie.IdTipoAcceso === 4 || $scope.SessionCookie.IdTipoAcceso === '4' ||
          $scope.SessionCookie.IdTipoAcceso === 5 || $scope.SessionCookie.IdTipoAcceso === '5' ||
          $scope.SessionCookie.IdTipoAcceso === 6 || $scope.SessionCookie.IdTipoAcceso === '6') {
          $scope.cambiarDistribuidor($cookieStore.get('currentDistribuidor'), false);
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

        if ($cookieStore.get('Session') == '' || $cookieStore.get('Session') == undefined || $cookieStore.get('Session') == null) {
          $location.path('/Login');
        } else {
          var fecha = new Date();

          if ($cookieStore.get('Session').Expira < fecha.getTime()) {
            $scope.CerrarSesion();
          } else {
            if ($cookieStore.get('Session').LeyoTerminos != 1) {
              $scope.ShowToast('Para usar el sitio necesitas aceptar los terminos y condiciones', 'danger');
              $location.path('/TerminosCondiciones');
            }
          }
        }
      }
    };

    /* Valida si el navegador que esta usando el usuario es soportado por las tecnologías de click suscribe*/
    function validarNavegador(deviceDetector) {
      var esSoportado = false;
      if (deviceDetector.browser === 'ie' && parseInt(obtenerPrimeraCifraVersionNavegador(deviceDetector)) >= 9) { esSoportado = true; }
      if (deviceDetector.browser === 'chrome' && parseInt(obtenerPrimeraCifraVersionNavegador(deviceDetector)) >= 47) { esSoportado = true; }
      if (deviceDetector.browser === 'firefox' && parseInt(obtenerPrimeraCifraVersionNavegador(deviceDetector)) >= 43) { esSoportado = true; }
      if (deviceDetector.browser === 'safari' && parseInt(obtenerPrimeraCifraVersionNavegador(deviceDetector)) >= 5) { esSoportado = true; }
      if (deviceDetector.browser === 'opera' && parseInt(obtenerPrimeraCifraVersionNavegador(deviceDetector)) >= 34) { esSoportado = true; }
      if (deviceDetector.browser === 'ms-edge') { esSoportado = true; }
      if (deviceDetector.device === 'android') { esSoportado = true; }
      if (deviceDetector.device === 'ipad') { esSoportado = true; }
      if (deviceDetector.device === 'iphone') { esSoportado = true; }
      return esSoportado;
    }

    /* Obtiene la primera cifra de la versión del navegador que esta usando el usaurio*/
    function obtenerPrimeraCifraVersionNavegador(deviceDetector) {
      var arregloCifrasVersion = deviceDetector.browser_version.split('.');
      return arregloCifrasVersion[0];
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
    };

    $scope.init();

    function obtenerSubdominio() {
      var url = window.location.href;
      var subdomain = url.replace('http://', '');
      subdomain = subdomain.replace('https://', '');
      subdomain = subdomain.substring(0, subdomain.indexOf($rootScope.dominio));
      subdomain = subdomain.replace(new RegExp('[.]', 'g'), '');
      subdomain = subdomain.replace('www', '');

      if (!subdomain == '') {
        EmpresasFactory.getSitio(subdomain).success(function (empresa) {
          $scope.cambiarDistribuidor(empresa.data[0], false);
          $scope.ActualizarMenu();
        });
        if ($cookieStore.get('currentDistribuidor')) {
          $scope.currentDistribuidor = $cookieStore.get('currentDistribuidor');
        } else {
          $scope.currentDistribuidor = {};
          $scope.currentDistribuidor.UrlLogo = 'images/LogoSVG.svg';
        }
      }
    }

    $scope.selectMenu = function () {
      if ($scope.currentDistribuidor) {
        if ((($scope.SessionCookie.IdTipoAcceso == 4 || $scope.SessionCookie.IdTipoAcceso == 5 || $scope.SessionCookie.IdTipoAcceso == 6)
          && (($scope.currentDistribuidor.IdEmpresa != 0) && $scope.currentDistribuidor.IdEmpresa != null) && $scope.SessionCookie.IdTipoAcceso != 2)) {
          return true;
        }

        if (!$scope.SessionCookie.IdTipoAcceso && $scope.currentDistribuidor.IdEmpresa) {
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

    $scope.goToPage = function (location) {
      $scope.navCollapsed = true;
      $location.path('/' + location);
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

        $cookieStore.put('Session', Session, { 'expires': expireDate });
        $cookieStore.put('currentDistribuidor', Session, { 'expires': expireDate });
        $cookieStore.put('Pedido', Session, { 'expires': expireDate });

        $cookieStore.put('Session', null);
        $cookieStore.put('currentDistribuidor', null);
        $cookieStore.put('Pedido', null);

        $cookieStore.remove('Session');
        $cookieStore.remove('Pedido');
        $cookieStore.remove('currentDistribuidor');

        $scope.SessionCookie = {};
        $scope.currentDistribuidor = {};

        angular.forEach($cookieStore, function (v, k) {
          $cookieStore.remove(k);
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
      $scope.SessionCookie = $cookieStore.get('Session');
      if ($scope.SessionCookie.IdTipoAcceso === 4 || $scope.SessionCookie.IdTipoAcceso === '4') {
        $scope.cambiarDistribuidor($cookieStore.get('currentDistribuidor'), false);
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

  IndexController.$inject = ['$scope', '$log', '$location', '$cookieStore', '$rootScope', 'PedidosFactory', 'PedidoDetallesFactory', 'ngToast', '$uibModal', '$window', 'UsuariosFactory', 'deviceDetector', 'ComprasUFFactory', 'EmpresasFactory'];

  angular.module('marketplace').controller('IndexController', IndexController);
}());

(function () {
  var LandingController = function ($scope, $log, $location, $cookieStore, PromocionsFactory, deviceDetector) {
    $scope.Promociones = {};

    $scope.init = function () {
      $scope.esNavegadorSoportado();
      $scope.navCollapsed = true;
      PromocionsFactory.getPromocions()
        .success(function (Promociones) {
          $scope.Promociones = Promociones;
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.init();
  };

  LandingController.$inject = ['$scope', '$log', '$location', '$cookieStore', 'PromocionsFactory', 'deviceDetector'];

  angular.module('marketplace').controller('LandingController', LandingController);
}());

(function () {
  var NavegadoresController = function ($scope) {
    $scope.init = function () {
      $scope.esNavegadorSoportado();
      $scope.navCollapsed = true;
    };

    $scope.init();
  };
  NavegadoresController.$inject = ['$scope'];
  angular.module('marketplace').controller('NavegadoresController', NavegadoresController);
}());

(function () {
  var ReportesController = function ($scope, $log, $location, $cookieStore, ReportesFactory) {

    $scope.perfil = $cookieStore.get('Session');

    $scope.reportesSel = '';

    $scope.init = function () {
      $scope.navCollapsed = true;
      $scope.CheckCookie();
      ReportesFactory.getReportes()
        .success(function (result) {
          if (result) {
            $scope.reportesSel = result.data[0];
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.init();

    $scope.GenerarReporte = function (params) {
      ReportesFactory.getGenerarReporte($scope.reporteSel)
        .success(function (result) {
          if (result) {
            for (var i = 0; i < $scope.reportesSel.length; i++) {
              if ($scope.reportesSel[i].IdReporte === $scope.reporteSel) {
                var d = new Date();
                var sDate = ('0' + d.getDate()).slice(-2) + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + d.getFullYear() + ' ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
                var NombreReporte = $scope.reportesSel[i].NombreReporte + '_' + sDate;
                $scope.JSONToCSVConvertor(result.data[0], NombreReporte, true);
                return;
              }
            }
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.JSONToCSVConvertor = function (JSONData, ReportTitle, ShowLabel) {
      /* If JSONData is not an object then JSON.parse will parse the JSON string in an Object*/
      var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
      var CSV = '';
      /* Set Report title in first row or line*/
      CSV += ReportTitle + '\r\n\n';
      /* This condition will generate the Label/Header*/
      if (ShowLabel) {
        var row = '';

        /* This loop will extract the label from 1st index of on array*/
        for (var index in arrData[0]) {
          /* Now convert each value to string and comma-seprated*/
          row += index + ',';
        }

        row = row.slice(0, -1);

        /* append Label row with line break*/
        CSV += row + '\r\n';
      }

      /* 1st loop is to extract each row*/
      for (var i = 0; i < arrData.length; i++) {
        var row = '';

        /* 2nd loop will extract each column and convert it in string comma-seprated*/
        for (var index in arrData[i]) {
          row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);

        /* add a line break after each row*/
        CSV += row + '\r\n';
      }

      if (CSV == '') {
        alert('Información inválida');
        return;
      }

      /* Generate a file name*/
      var fileName = 'Clicksuscribe_';
      /* this will remove the blank-spaces from the title and replace it with an underscore*/
      fileName += ReportTitle.replace(/ /g, '_');

      /* Initialize file format you want csv or xls*/
      var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

      /* Now the little tricky part.*/
      /* you can use either>> window.open(uri);*/
      /* but this will not work in some browsers*/
      /* or you will not get the correct file extension*/

      /* this trick will generate a temp <a /> tag*/
      var link = document.createElement('a');
      link.href = uri;

      /* set the visibility hidden so it will not effect on your web-layout*/
      link.style = 'visibility:hidden';
      link.download = fileName + '.csv';

      /* this part will append the anchor tag and remove it after automatic click*/
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  };

  ReportesController.$inject = ['$scope', '$log', '$location', '$cookieStore', 'ReportesFactory'];

  angular.module('marketplace').controller('ReportesController', ReportesController);
}());

(function () {
  var SoporteController = function ($scope) {
    $scope.init = function () {
      $scope.esNavegadorSoportado();
      $scope.navCollapsed = true;
    };

    $scope.init();
  };

  SoporteController.$inject = ['$scope'];

  angular.module('marketplace').controller('SoporteController', SoporteController);
}());

(function () {
  var SugerenciasController = function ($scope) {
    $scope.init = function () {
      $scope.navCollapsed = true;
    };

    $scope.init();
  };

  SugerenciasController.$inject = ['$scope'];

  angular.module('marketplace').controller('SugerenciasController', SugerenciasController);
}());

angular.module('directives.loading', [])
  .directive('cargando', ['$http', function ($http) {
    return {
      restrict: 'A',
      link: function (scope, elm, attrs) {
        scope.isLoading = function () {
          return $http.pendingRequests.length > 0;
        };

        scope.$watch(scope.isLoading, function (v) {
          if (v) {
            elm.show();
          } else {
            elm.hide();
          }
        });
      }
    };
  }]);

(function () {
  var AccesosAmazonFactory = function ($http, $cookieStore, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookieStore.get('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.getAccesosAmazon = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'AccesosAmazon');
    };

    return factory;
  };

  AccesosAmazonFactory.$inject = ['$http', '$cookieStore', '$rootScope'];

  angular.module('marketplace').factory('AccesosAmazonFactory', AccesosAmazonFactory);
}());

(function () {
  var ComprasUFFactory = function ($http, $cookieStore, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookieStore.get('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.postComprasUF = function (producto) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'ComprasUF', producto);
    };

    factory.getComprasUF = function (IdEmpresaDistribuidor, ActualizarPrecios) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'ComprasUF/' + IdEmpresaDistribuidor + '/' + ActualizarPrecios);
    };

    factory.deleteComprasUF = function (IdCompraUF) {
      factory.refreshToken();
      return $http.delete($rootScope.API + 'ComprasUF/' + IdCompraUF);
    };

    factory.getCantidadProductosCarrito = function (IdEmpresaDistribuidor) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'CantidadProductosCarritoUF/' + IdEmpresaDistribuidor);
    };

    factory.getComprarUF = function (IdEmpresaDistribuidor) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'ComprarUF/' + IdEmpresaDistribuidor);
    };

    return factory;
  };

  ComprasUFFactory.$inject = ['$http', '$cookieStore', '$rootScope'];

  angular.module('marketplace').factory('ComprasUFFactory', ComprasUFFactory);
}());

(function () {
  var DescuentosFactory = function ($http, $cookieStore, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookieStore.get('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.postDescuento = function (Descuento) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'ConfiguracionDescuento', Descuento);
    };

    factory.putDescuento = function (Descuento) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'ConfiguracionDescuento/' + Descuento.IdConfiguracionDescuento, Descuento);
    };

    factory.deleteDescuento = function (IdConfiguracionDescuento) {
      factory.refreshToken();
      return $http.delete($rootScope.API + 'ConfiguracionDescuento/' + IdConfiguracionDescuento);
    };

    factory.getDescuentos = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'ConfiguracionDescuento');
    };

    factory.getEspecializaciones = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'Especializaciones');
    };

    return factory;
  };

  DescuentosFactory.$inject = ['$http', '$cookieStore', '$rootScope'];

  angular.module('marketplace').factory('DescuentosFactory', DescuentosFactory);
}());

(function () {
  var DescuentosNivelesFactory = function ($http, $cookieStore, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookieStore.get('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.getDiscountLevels = function (levelId, enterpriseId) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'distributor/customer/' + levelId + '/discount-level/' + enterpriseId);
    };

    factory.addDiscountLevels = function (levelId, product) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'distributor/customer/' + levelId + '/discount-level', product);
    };

    return factory;
  };

  DescuentosNivelesFactory.$inject = ['$http', '$cookieStore', '$rootScope'];

  angular.module('marketplace').factory('DescuentosNivelesFactory', DescuentosNivelesFactory);
}());

(function () {
  var EmpresasFactory = function ($http, $cookieStore, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookieStore.get('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.validaMail = function (mail) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'validaMail/', { mail: mail });
    };

    factory.getCliente = function (Id) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'Importar/', { IdMicrosoft: Id });
    };

    factory.getEmpresas = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'Empresas');
    };

    factory.getEmpresasMicrosoft = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'Empresa/Microsoft');
    };

    factory.getEmpresa = function (IdEmpresa) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'Empresas/' + IdEmpresa);
    };

    factory.postEmpresa = function (Empresa) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'Empresas', Empresa);
    };

    factory.postEmpresaMicrosoft = function (ObjMicrosoft) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'Empresa/Microsoft', ObjMicrosoft);
    };

    factory.putEmpresaFormaPago = function (parametros) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'Empresas/FormaPago', parametros);
    };

    factory.putEmpresa = function (Empresa) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'Empresas', Empresa);
    };

    factory.revisarDominio = function (Empresa) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'Empresa/Dominio/' + Empresa);
    };

    factory.revisarRFC = function (ObjRFC) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'Empresa/RFC', ObjRFC);
    };

    factory.checkRFC = function (ObjRFC) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'Empresa/check', ObjRFC);
    };

    factory.validarBajaEmpresa = function (Empresa) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'Empresa/ValidarBajaEmpresa', Empresa);
    };

    factory.postCartaConfirmacion = function (Empresa) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'Empresas/CartaConfirmacion', Empresa);
    };

    factory.putActualizarNivelDistribuidor = function (Empresa) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'Empresas/NivelDistribuidor', Empresa);
    };

    factory.putActualizarAgenteMarca = function (Empresa) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'Empresas/AgenteMarca', Empresa);
    };

    factory.getMiSitio = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'MiSitio');
    };

    factory.putMiSitio = function (miSitio) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'MiSitio', miSitio);
    };

    factory.getSitio = function (Subdominio) {
      return $http.get($rootScope.API + 'Sitio/' + Subdominio);
    };

    factory.getCreditoDisponibleUF = function (IdEmpresaDistribuidor) {
      return $http.get($rootScope.API + 'CreditoDisponible/' + IdEmpresaDistribuidor);
    };

    factory.getValidarCreditoUF = function (IdEmpresaDistribuidor) {
      return $http.get($rootScope.API + 'ValidarCredito/' + IdEmpresaDistribuidor);
    };

    factory.updateAutomaticPayment = function (RealizarCargoProximo) {
      factory.refreshToken();
      return $http.patch($rootScope.API + 'enterprise/update-automatic-payment/' + RealizarCargoProximo);
    };

    factory.getClientes = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'enterprise/clients');
    };

    return factory;
  };

  EmpresasFactory.$inject = ['$http', '$cookieStore', '$rootScope'];

  angular.module('marketplace').factory('EmpresasFactory', EmpresasFactory);
}());

(function () {
  var EmpresasXEmpresasFactory = function ($http, $cookieStore, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookieStore.get('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.getEmpresasXEmpresas = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'EmpresasXEmpresas');
    };

    factory.getExchangeRateByIdEmpresa = function (IdEmpresa) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'exchange-rate/' + IdEmpresa);
    };

    factory.postExchangeRate = function (Empresas) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'exchange-rate', Empresas);
    };

    factory.postEmpresasXEmpresa = function (EmpresasXEmpresa) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'EmpresasXEmpresas', EmpresasXEmpresa);
    };

    factory.putEmpresasXEmpresa = function (EmpresasXEmpresa) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'EmpresasXEmpresas', EmpresasXEmpresa);
    };

    factory.getClients = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'enterprise/clients');
    };

    return factory;
  };

  EmpresasXEmpresasFactory.$inject = ['$http', '$cookieStore', '$rootScope'];

  angular.module('marketplace').factory('EmpresasXEmpresasFactory', EmpresasXEmpresasFactory);
}());

(function () {
  var EstadosFactory = function ($http, $cookieStore, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookieStore.get('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.getEstados = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'Estados');
    };

    factory.getEstado = function (IdEstado) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'Estados/' + IdEstado);
    };

    return factory;
  };

  EstadosFactory.$inject = ['$http', '$cookieStore', '$rootScope'];

  angular.module('marketplace').factory('EstadosFactory', EstadosFactory);
}());

(function () {
  var FabricantesFactory = function ($http, $cookieStore, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookieStore.get('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.getFabricantes = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'Fabricantes');
    };

    factory.getFabricante = function (IdFabricante) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'Fabricantes/' + IdFabricante);
    };

    factory.postFabricante = function (Fabricante) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'Fabricantes', Fabricante);
    };

    factory.putFabricante = function (Fabricante) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'Fabricantes', Fabricante);
    };

    return factory;
  };

  FabricantesFactory.$inject = ['$http', '$cookieStore', '$rootScope'];

  angular.module('marketplace').factory('FabricantesFactory', FabricantesFactory);
}());

(function () {
  var MigracionFactory = function ($http, $cookieStore, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookieStore.get('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.getMigraciones = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'migrations');
    };

    factory.getMigracion = function (IdMigracion) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'migrations/' + IdMigracion);
    };

    factory.postMigracion = function (migracion) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'migrations', migracion);
    };

    factory.patchMigracion = function (migracion) {
      factory.refreshToken();
      return $http.patch($rootScope.API + 'migrations', migracion);
    };

    factory.getDominio = function (obj) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'migrations/customer/' + obj.Contexto + '/' + obj.Dominio);
    };

    factory.postUsuario = function (user) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'migrations/user', user);
    };

    factory.postCliente = function (cliente) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'migrations/customer', cliente);
    };

    return factory;
  };

  MigracionFactory.$inject = ['$http', '$cookieStore', '$rootScope'];

  angular.module('marketplace').factory('MigracionFactory', MigracionFactory);
}());

(function () {
  var NivelesClienteFinalFactory = function ($http, $cookieStore, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookieStore.get('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.getMisProductos = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'MisProductos');
    };

    factory.getLevels = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'distributor/customer/level');
    };

    factory.deleteLevel = function (levelId) {
      factory.refreshToken();
      return $http.delete($rootScope.API + 'distributor/customer/' + levelId + '/level');
    };

    factory.addLevel = function (level) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'distributor/customer/level', level);
    };

    return factory;
  };

  NivelesClienteFinalFactory.$inject = ['$http', '$cookieStore', '$rootScope'];

  angular.module('marketplace').factory('NivelesClienteFinalFactory', NivelesClienteFinalFactory);
}());

(function () {
  var NivelesDistribuidorFactory = function ($http, $cookieStore, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookieStore.get('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.postNivelesDistribuidor = function (NivelDistribuidor) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'NivelDistribuidor', NivelDistribuidor);
    };

    factory.putNivelesDistribuidor = function (IdNivelDistribuidor, NivelDistribuidor) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'NivelDistribuidor/' + IdNivelDistribuidor, NivelDistribuidor);
    };

    factory.deleteNivelesDistribuidor = function (IdNivelDistribuidor) {
      factory.refreshToken();
      return $http.delete($rootScope.API + 'NivelDistribuidor/' + IdNivelDistribuidor);
    };

    factory.getNivelesDistribuidor = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'NivelDistribuidor');
    };

    factory.getProductosPorNivel = function (idNivelCS) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'levels/' + idNivelCS + '/products');
    };

    factory.asignarNivel = function (nivel) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'levels/assign', nivel);
    };

    factory.createLevelDiscount = function (level) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'levels/discount', level);
    };

    factory.removerNivel = function (id) {
      factory.refreshToken();
      return $http.delete($rootScope.API + 'levels/' + id);
    };

    return factory;
  };

  NivelesDistribuidorFactory.$inject = ['$http', '$cookieStore', '$rootScope'];

  angular.module('marketplace').factory('NivelesDistribuidorFactory', NivelesDistribuidorFactory);
}());

(function () {
  var PedidoDetallesFactory = function ($http, $cookieStore, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookieStore.get('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    // Agregar al carrito
    factory.postPedidoDetalle = function (PedidoDetalle) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'shopping-cart', PedidoDetalle);
    };

    // Obtener productos del carrito
    factory.getPedidoDetalles = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'shopping-cart');
    };

    // Preparar productos del carrito
    factory.getPrepararCompra = function (commission) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'shopping-cart/prepare-purchase/' + commission);
    };

    // Eliminar productos del carrito
    factory.deletePedidoDetalles = function (IdPedidoDetalle) {
      factory.refreshToken();
      return $http.delete($rootScope.API + 'shopping-cart/' + IdPedidoDetalle);
    };

    // Comprar productos
    factory.getComprar = function () {
      factory.refreshToken();
      return $http.post($rootScope.API + 'shopping-cart/buy');
    };

    // Valida el credito de los clientes
    factory.getValidarCarrito = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'shopping-cart/validate-cart');
    };

    factory.postPedidoDetallesAddOns = function (Producto) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'PedidoDetalles/AddOns', Producto);
    };

    factory.postMonitor = function (IdEmpresaUsuarioFinal) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'Monitor', IdEmpresaUsuarioFinal);
    };

    factory.putPedidoDetalle = function (PedidoDetalle) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'PedidoDetalles', PedidoDetalle);
    };

    factory.getContarProductos = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'PedidoDetalles/ContarProductos');
    };

    factory.postWarningCredito = function (params) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'warningCredito', params);
    };

    factory.getPrepararTarjetaCredito = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'PrepararTarjetaCredito');
    };

    factory.getAzureUsage = function (IdPedido) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'microsoft/billing/azure-usage-report/' + IdPedido);
    };

    factory.getPendingOrdersToPay = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'orders/get-pending-orders-to-pay/1');
    };

    factory.monitorCalculations = function (Pedidos) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'orders/pending-orders-monitor-calculations/1', Pedidos);
    };

    factory.payWidthCard = function (Pedidos) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'orders/pay-width-card', Pedidos);
    };

    return factory;
  };

  PedidoDetallesFactory.$inject = ['$http', '$cookieStore', '$rootScope'];

  angular.module('marketplace').factory('PedidoDetallesFactory', PedidoDetallesFactory);
}());

(function () {
  var PedidosFactory = function ($http, $cookieStore, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookieStore.get('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.putPedido = function (Pedido) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'Pedidos', Pedido);
    };

    factory.putPedidoPago = function (Pedido) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'Pedidos/Pago', Pedido);
    };

    factory.putCodigoPromocion = function (Pedido) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'Pedidos/CodigoPromocion', Pedido);
    };

    factory.patchPaymentInformation = function (paymentResult) {
      factory.refreshToken();
      return $http.patch($rootScope.API + 'orders/update-payment-details', paymentResult);
    };

    return factory;
  };

  PedidosFactory.$inject = ['$http', '$cookieStore', '$rootScope'];

  angular.module('marketplace').factory('PedidosFactory', PedidosFactory);
}());

(function () {
  var ProductoGuardadosFactory = function ($http, $cookieStore, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookieStore.get('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.getProductoGuardados = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'ProductoGuardados');
    };

    factory.getProductoGuardado = function (IdProductoGuardado) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'ProductoGuardados/' + IdProductoGuardado);
    };

    factory.postProductoGuardado = function (ProductoGuardado) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'ProductoGuardados', ProductoGuardado);
    };

    factory.putProductoGuardado = function (ProductoGuardado) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'ProductoGuardados', ProductoGuardado);
    };

    return factory;
  };

  ProductoGuardadosFactory.$inject = ['$http', '$cookieStore', '$rootScope'];

  angular.module('marketplace').factory('ProductoGuardadosFactory', ProductoGuardadosFactory);
}());

(function () {
  var ProductosFactory = function ($http, $cookieStore, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookieStore.get('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.postBuscarProductos = function (Busqueda) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'BuscarProductos', Busqueda);
    };

    factory.postComplementos = function (Producto) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'BuscarComplementos', Producto);
    };

    factory.getProductos = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'Productos');
    };

    factory.getMisProductos = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'MisProductos');
    };

    factory.putMiProducto = function (producto) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'MiProducto', producto);
    };

    factory.putMisProductos = function (productos) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'ActualizarMisProductos', productos);
    };

    factory.getBaseSubscription = function (IdProducto) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'autodesk/subscription/base/' + IdProducto);
    };

    factory.putBaseSubscription = function (body) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'autodesk/subscription/base', body);
    };

    factory.getProductContracts = function (idEmpresaUsuarioFinal, idProducto) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'autodesk/contacts/' + idEmpresaUsuarioFinal + '/contract/' + idProducto);
    };

    return factory;
  };

  ProductosFactory.$inject = ['$http', '$cookieStore', '$rootScope'];

  angular.module('marketplace').factory('ProductosFactory', ProductosFactory);
}());

(function () {
  var ProductosXEmpresaFactory = function ($http, $cookieStore, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookieStore.get('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.postBuscarProductosXEmpresa = function (Busqueda) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'BuscarProductosXEmpresa', Busqueda);
    };

    return factory;
  };

  ProductosXEmpresaFactory.$inject = ['$http', '$cookieStore', '$rootScope'];

  angular.module('marketplace').factory('ProductosXEmpresaFactory', ProductosXEmpresaFactory);
}());

(function () {
  var PromocionsFactory = function ($http, $cookieStore, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookieStore.get('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.getPromocions = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'Promocions');
    };

    factory.getPromocion = function (IdPromocion) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'Promocions/' + IdPromocion);
    };

    factory.postPromocion = function (Promocion) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'Promocions', Promocion);
    };

    factory.putPromocion = function (Promocion) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'Promocions', Promocion);
    };

    return factory;
  };

  PromocionsFactory.$inject = ['$http', '$cookieStore', '$rootScope'];

  angular.module('marketplace').factory('PromocionsFactory', PromocionsFactory);
}());

(function () {
  var ReportesFactory = function ($http, $cookieStore, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookieStore.get('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.getReportes = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'Reportes');
    };

    factory.getGenerarReporte = function (IdReporte) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'GenerarReporte/' + IdReporte);
    };

    return factory;
  };

  ReportesFactory.$inject = ['$http', '$cookieStore', '$rootScope'];

  angular.module('marketplace').factory('ReportesFactory', ReportesFactory);
}());

(function () {
  var SoporteFactory = function ($http, $cookieStore, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookieStore.get('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.getSolicitudes = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'support');
    };

    factory.postSolicitud = function (Solicitud) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'support', Solicitud);
    };

    factory.patchSolicitud = function (idSolicitud, Solicitud) {
      factory.refreshToken();
      return $http.patch($rootScope.API + 'support/' + idSolicitud, Solicitud);
    };

    factory.getStatus = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'support-status');
    };

    factory.getSolicitud = function (idSolicitud) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'support/' + idSolicitud);
    };

    return factory;
  };

  SoporteFactory.$inject = ['$http', '$cookieStore', '$rootScope'];

  angular.module('marketplace').factory('SoporteFactory', SoporteFactory);
}());

(function () {
  var TipoCambioFactory = function ($http, $cookieStore, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookieStore.get('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.getTipoCambio = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'TipoCambio');
    };

    return factory;
  };

  TipoCambioFactory.$inject = ['$http', '$cookieStore', '$rootScope'];

  angular.module('marketplace').factory('TipoCambioFactory', TipoCambioFactory);
}());

(function () {
  var TiposAccesosFactory = function ($http, $cookieStore, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookieStore.get('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.getTiposAccesos = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'TiposAccesos');
    };

    factory.getTipoAcceso = function (IdTipoAcceso) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'TiposAccesos/' + IdTipoAcceso);
    };

    return factory;
  };

  TiposAccesosFactory.$inject = ['$http', '$cookieStore', '$rootScope'];

  angular.module('marketplace').factory('TiposAccesosFactory', TiposAccesosFactory);
}());

(function () {
  var TiposProductosFactory = function ($http, $cookieStore, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookieStore.get('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.getTiposProductos = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'TiposProductos');
    };

    factory.getTipoProducto = function (IdTipoProducto) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'TiposProductos/' + IdTipoProducto);
    };

    return factory;
  };

  TiposProductosFactory.$inject = ['$http', '$cookieStore', '$rootScope'];

  angular.module('marketplace').factory('TiposProductosFactory', TiposProductosFactory);
}());

(function () {
  var UsuariosFactory = function ($http, $cookieStore, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookieStore.get('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.getUsuarios = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'Usuarios');
    };

    factory.getUsuario = function (IdUsuario) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'Usuarios/' + IdUsuario);
    };

    factory.getCorreo = function (Usuario) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'Usuarios/Correo', Usuario);
    };

    factory.postUsuario = function (Usuario) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'Usuarios', Usuario);
    };

    factory.postUsuarioCliente = function (Usuario) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'users', Usuario);
    };

    factory.putUsuario = function (Usuario) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'Usuarios', Usuario);
    };

    factory.postUsuarioIniciarSesion = function (usuario) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'Usuarios/Login', usuario);
    };

    factory.postRecuperar = function (usuario) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'Usuarios/Recuperar', usuario);
    };

    factory.getCerrarSession = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'Usuarios/CerrarSession');
    };

    factory.desbloquearCuenta = function (encryptedObject) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'Usuarios/Desbloquear/' + encryptedObject);
    };

    factory.confirmarCuenta = function (encryptedObject) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'Usuarios/ConfirmarCuenta/' + encryptedObject);
    };

    factory.getUsuariosContacto = function (idEmpresaUsuarioFinal) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'users/' + idEmpresaUsuarioFinal);
    };

    factory.getUsuariosPropios = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'users');
    };

    factory.getAccessosParaDistribuidor = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'users-access');
    };

    return factory;
  };

  UsuariosFactory.$inject = ['$http', '$cookieStore', '$rootScope'];

  angular.module('marketplace').factory('UsuariosFactory', UsuariosFactory);
}());


(function () {
  var UsuariosXEmpresasFactory = function ($http, $cookieStore, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookieStore.get('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.getUsuariosXEmpresas = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'UsuariosXEmpresas');
    };

    factory.getUsuariosXEmpresa = function (IdEmpresa) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'UsuariosXEmpresas/' + IdEmpresa);
    };


    factory.postUsuariosXEmpresa = function (UsuariosXEmpresa) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'UsuariosXEmpresas', UsuariosXEmpresa);
    };

    factory.putUsuariosXEmpresa = function (UsuariosXEmpresa) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'UsuariosXEmpresas', UsuariosXEmpresa);
    };

    return factory;
  };

  UsuariosXEmpresasFactory.$inject = ['$http', '$cookieStore', '$rootScope'];

  angular.module('marketplace').factory('UsuariosXEmpresasFactory', UsuariosXEmpresasFactory);
}());

(function () {
  var VersionFactory = function ($http, $cookieStore, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookieStore.get('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.getVersiones = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'versions');
    };

    factory.getVersionDetalle = function (IdVersion) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'versions/' + IdVersion);
    };

    return factory;
  };
  VersionFactory.$inject = ['$http', '$cookieStore', '$rootScope'];
  angular.module('marketplace').factory('VersionFactory', VersionFactory);
}());
(function () {
  var AplicacionesReadController = function ($scope, $log, $location, $cookieStore, MigracionFactory) {
    $scope.goToMigraciones = function () {
      $location.path('/migraciones');
    };

    $scope.init = function () {

    };

    $scope.init();
  };

  AplicacionesReadController.$inject = ['$scope', '$log', '$location', '$cookieStore', 'MigracionFactory'];

  angular.module('marketplace').controller('AplicacionesReadController', AplicacionesReadController);
}());

(function () {
  var DescuentosCreateController = function ($scope, $log, $cookieStore, $location, DescuentosFactory, NivelesDistribuidorFactory) {
    var Session = {};
    Session = $cookieStore.get('Session');
    $scope.Session = Session;
    $scope.Descuento = {};

    $scope.init = function () {
      $scope.CheckCookie();

      DescuentosFactory.getEspecializaciones()
        .success(function (Especializaciones) {
          if (Especializaciones.success) {
            $scope.selectEspecializaciones = Especializaciones.data;
          } else {
            $scope.ShowToast(Especializaciones.message, 'danger');
            $location.path('/Descuentos');
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });

      NivelesDistribuidorFactory.getNivelesDistribuidor()
        .success(function (NivelesDistribuidor) {
          if (NivelesDistribuidor.success) {
            $scope.selectNivelesDistribuidor = NivelesDistribuidor.data;
          } else {
            $scope.ShowToast(NivelesDistribuidor.message, 'danger');
            $location.path('/Descuentos');
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.init();

    $scope.descuentoCancelar = function () {
      $location.path('/Descuentos');
    };

    $scope.descuentoCrear = function () {
      DescuentosFactory.postDescuento($scope.Descuento)
        .success(function (result) {
          if (result.success) {
            $location.path('/Descuentos');
            $scope.ShowToast(result.message, 'success');
          } else {
            $scope.ShowToast(result.message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };
  };

  DescuentosCreateController.$inject = ['$scope', '$log', '$cookieStore', '$location', 'DescuentosFactory', 'NivelesDistribuidorFactory'];

  angular.module('marketplace').controller('DescuentosCreateController', DescuentosCreateController);
}());

(function () {
  var DescuentosNivelesController = function ($scope, $location, $cookieStore, $routeParams, DescuentosNivelesFactory) {
    $scope.sortBy = 'Nombre';
    $scope.reverse = false;
    $scope.Nivel = $cookieStore.get('nivel');
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
      $scope.ShowToast(!error ? 'Ha ocurrido un error, intentelo mas tarde.' : error.message, 'danger');
      $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';
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
        .then(function (result) {
          if (result.data.success) $scope.ShowToast(result.data.message, 'success');
          else $scope.ShowToast(result.data.message, 'danger');
        })
        .catch(function (result) { error(result.data); });
    };

    $scope.getProducts = function () {
      $scope.porcentaje = '';
      DescuentosNivelesFactory.getDiscountLevels(IdDescuento, $scope.IdEmpresa)
        .then(function (result) {
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
        product.PrecioFinal = product.PrecioNormal - (product.PrecioNormal * Number('.' + product.PorcentajeDescuento || 0));
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
        product.PrecioFinal = product.PrecioNormal - (product.PrecioNormal * Number('.' + product.PorcentajeDescuento || 0));
      });
    };

    $scope.init = function () {
      $scope.CheckCookie();
      $scope.refrescarMisProductos();
    };

    $scope.init();
  };

  DescuentosNivelesController.$inject = ['$scope', '$location', '$cookieStore', '$routeParams', 'DescuentosNivelesFactory'];

  angular.module('marketplace').controller('DescuentosNivelesController', DescuentosNivelesController);
}());

(function () {
  var DescuentosNivelesCSController = function ($scope, $location, $cookieStore, $routeParams, NivelesDistribuidorFactory, DescuentosNivelesFactory) {
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

  DescuentosNivelesCSController.$inject = ['$scope', '$location', '$cookieStore', '$routeParams', 'NivelesDistribuidorFactory', 'DescuentosNivelesFactory'];

  angular.module('marketplace').controller('DescuentosNivelesCSController', DescuentosNivelesCSController);
}());

(function () {
  var DescuentosReadController = function ($scope, $log, $location, $cookieStore, DescuentosFactory) {
    $scope.sortBy = 'Nivel';
    $scope.reverse = false;

    $scope.init = function () {
      $scope.CheckCookie();
      DescuentosFactory.getDescuentos()
        .success(function (resultDescuentos) {
          if (resultDescuentos.success) {
            $scope.Descuentos = resultDescuentos.data;
          } else {
            $scope.ShowToast(resultDescuentos.message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.init();

    $scope.OrdenarPor = function (Atributo) {
      $scope.sortBy = Atributo;
      $scope.reverse = !$scope.reverse;
    };

    $scope.eliminarDescuento = function (Descuento) {
      $scope.Descuentos.forEach(function (Elemento, Index) {
        if (Elemento.IdConfiguracionDescuento === Descuento.IdConfiguracionDescuento) {
          $scope.Descuentos.splice(Index, 1);
          return false;
        }
      });

      DescuentosFactory.deleteDescuento(Descuento.IdConfiguracionDescuento)
        .success(function (result) {
          if (result.success) {
            $scope.ShowToast(result.message, 'success');
          } else {
            $scope.init();
            $scope.ShowToast(result.message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos eliminar el descuento seleccionado. Intenta de nuevo más tarde.', 'danger');
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };
  };

  DescuentosReadController.$inject = ['$scope', '$log', '$location', '$cookieStore', 'DescuentosFactory'];

  angular.module('marketplace').controller('DescuentosReadController', DescuentosReadController);
}());

(function () {
  var DescuentosUpdateController = function ($scope, $log, $cookieStore, $location, DescuentosFactory, $routeParams) {
    var Session = {};
    Session = $cookieStore.get('Session');
    $scope.Session = Session;
    $scope.Descuento = JSON.parse($routeParams.Descuento);

    $scope.init = function () {
      $scope.CheckCookie();
    };

    $scope.init();

    $scope.descuentoCancelar = function () {
      $location.path('/Descuentos');
    };

    $scope.descuentoActualizar = function () {
      DescuentosFactory.putDescuento($scope.Descuento)
        .success(function (result) {
          if (result.success) {
            $location.path('/Descuentos');
            $scope.ShowToast(result.message, 'success');
          } else {
            $scope.ShowToast(result.message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };
  };

  DescuentosUpdateController.$inject = ['$scope', '$log', '$cookieStore', '$location', 'DescuentosFactory', '$routeParams'];

  angular.module('marketplace').controller('DescuentosUpdateController', DescuentosUpdateController);
}());

(function () {
  var ConfiguracionUpdateController = function ($scope, $log, $location, $cookieStore, $routeParams, EmpresasFactory, FileUploader, AccesosAmazonFactory) {

    $scope.init = function () {
      $scope.CheckCookie();
      var cookie = $cookieStore.get('Session');
      $scope.IdEmpresa = cookie.IdEmpresa;
      EmpresasFactory.getMiSitio()
        .success(function (miClickSuscribe) {
          if (miClickSuscribe.success) {
            $scope.miSitio = miClickSuscribe.data[0];
          } else {
            $scope.ShowToast(miClickSuscribe.message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';
          $scope.ShowToast('No pudimos cargar la información de tu sitio, por favor intenta de nuevo más tarde.', 'danger');
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.init();

    /** Actualiza los datos de la empresa para su sitio **/
    function putMiSitio() {
      EmpresasFactory.putMiSitio($scope.miSitio)
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
        });
    }

    /** Declaro el uploader como un nuevo FileUploader **/
    var uploader = $scope.uploader = new FileUploader({});

    /** Al momento de anexar el archivo se hace la validación del formato, si no es el esperado no permite subir el archivo y manda un mensaje **/
    uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        var extension = item.type.slice(item.type.lastIndexOf('/') + 1);
        if (!(extension === 'jpeg' || extension === 'jpg' || extension === 'gif' || extension === 'png')) {
          $scope.ShowToast('Archivo no válido, por favor adjunta formatos jpeg, jpg, gif o png.', 'danger');
          $scope.miSitio.UrlLogo = null;
        }
        return this.queue.length < 1 && '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    /** Antes de subir el archivo le cambio el nombre por el Id de la empresa para hacerlo único **/
    uploader.onBeforeUploadItem = function (item) {
      var extension = item.file.name.split('.');
      item.file.name = $scope.IdEmpresa.toString() + '.' + extension[1];
    };

    /** Subo la imágen y establesco la liga para ser guardada despues si no hay errores **/
    function subirImagen(fileItem, data) {
      var fileChooser = document.getElementById('fileUploadImagen');
      var file = fileChooser.files[0];
      $scope.miSitio.UrlLogo = 'https://s3.amazonaws.com/marketplace.compusoluciones.com/Anexos/logos/' + fileItem.file.name;
      AWS.config.update({ accessKeyId: data[0].AccessKey, secretAccessKey: data[0].SecretAccess });
      var bucketName = data[0].Bucket;
      var bucket = new AWS.S3({ params: { Bucket: bucketName } });
      var objKey = 'Anexos/logos/' + fileItem.file.name;
      var params = { Key: objKey, ContentType: fileItem.type, Body: file, ACL: 'public-read' };
      bucket.putObject(params, function (err, data) {
        if (err) {
          $scope.ShowToast(err, 'danger');
        } else {
          putMiSitio();
        }
      });
    }

    /** Una vez que se termino de anexar va y busca las credenciales de Amazon y lasa pasa a la función subirImagen junto con el archivo para comenzar la subida **/
    uploader.onCompleteItem = function (fileItem, response, status, headers) {
      AccesosAmazonFactory.getAccesosAmazon()
        .success(function (result) {
          if (result[0].Success === true) {
            subirImagen(fileItem, result);
          } else {
            $scope.ShowToast(result[0].Message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('Error al obtener la conexión', 'danger');
        });
    };

    /** Si trae anexo algo lo sube, si no hace el puro update sin actualizar nada**/
    $scope.Guardar = function () {
      if (uploader.queue[0]) {
        uploader.queue[0].upload();
      } else {
        if ($scope.miSitio.UrlLogo) {
          $scope.miSitio.UrlLogo = $scope.miSitio.UrlLogo.split('?')[0];
        }
        putMiSitio();
      }
    };
  };

  ConfiguracionUpdateController.$inject = ['$scope', '$log', '$location', '$cookieStore', '$routeParams', 'EmpresasFactory', 'FileUploader', 'AccesosAmazonFactory'];

  angular.module('marketplace').controller('ConfiguracionUpdateController', ConfiguracionUpdateController);
}());

(function () {
  var EmpresasCompletarController = function ($scope, $log, $location, $cookieStore, $routeParams, EmpresasFactory, EmpresasXEmpresasFactory, EstadosFactory, UsuariosFactory, UsuariosXEmpresasFactory) {
    var IdEmpresaDistribuidor = $routeParams.IdEmpresa;
    var IdMicrosoft = $routeParams.IdMicrosoft;
    var Dominio = $routeParams.Dominio;
    var DatosMicrosoft;
    $scope.Name = $routeParams.Name;
    $scope.mensajerfc = '';
    $scope.mensajeL = '';
    $scope.Combo = {};
    $scope.Empresa = {};
    $scope.Empresa.Lada = '52';
    $scope.MostrarCorreo = false;
    $scope.CorreoRepetido = false;
    $scope.direccionValidada = false;

    $scope.init = function () {
      $scope.esNavegadorSoportado();
      $scope.CheckCookie();
      EmpresasFactory.getEmpresa(IdEmpresaDistribuidor)
        .success(function (Empresa) {
          $scope.EmpresaD = Empresa[0];
          $scope.Combo.TipoRFC = [{
            Nombre: 'Persona Física'
          }, {
            Nombre: 'Persona Moral'
          }];
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });

      EmpresasFactory.getCliente(IdMicrosoft)
        .success(function (Empresa) {
          if (!$scope.direccionValida(Empresa.default_address)) {
            $scope.ShowToast('El cliente no cuenta con toda la información para ser importado, actualiza sus datos entrando a partner center ', 'danger');
            return;
          }
          $scope.direccionValidada = true;
          DatosMicrosoft = Empresa;
          if (!Empresa.email) {
            $scope.MostrarCorreo = true;
          } else {
            $scope.MostrarCorreo = false;
            $scope.Empresa.CorreoContacto = Empresa.email;
            $scope.validiaMail(Empresa.email);
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.init();

    $scope.direccionValida = function (direccion) {
      if (direccion.address_line1 && direccion.city && direccion.country && direccion.phone_number
        && direccion.postal_code && direccion.region) return true;
      return false;
    };

    $scope.validiaMail = function (email, callMeMaybe) {
      EmpresasFactory.validaMail(email)
        .success(function (mail) {
          if (mail.data[0].Existe === 1) {
            $scope.MostrarCorreo = true;
            $scope.CorreoRepetido = true;
          } else {
            $scope.CorreoRepetido = false;
            $scope.MostrarCorreo = false;
          }
          if (callMeMaybe && $scope.CorreoRepetido === false) {
            callMeMaybe();
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.intentaImportar = function () {
      $scope.validiaMail($scope.Empresa.CorreoContacto, $scope.EmpresaImportar);
    };
    $scope.EmpresaImportar = function () {
      $scope.ValidarRFC();
      if ($scope.Empresa.MonedaPago !== 'Pesos' && $scope.Empresa.MonedaPago !== 'Dólares') {
        return $scope.ShowToast('Selecciona una moneda de pago.', 'danger');
      }
      if ($scope.Empresa.IdFormaPagoPredilecta != 1 && $scope.Empresa.IdFormaPagoPredilecta != 2) {
        return $scope.ShowToast('Selecciona una forma de pago.', 'danger');
      }
      if ($scope.Empresa.MonedaPago === 'Dólares' && $scope.Empresa.IdFormaPagoPredilecta == 1) {
        return $scope.ShowToast('Para pagar con tarjeta es necesario que la moneda sea Pesos.', 'danger');
      }

      var ObjRFC = {
        RFC: $scope.Empresa.RFC
      };
      EmpresasFactory.revisarRFC(ObjRFC)
        .success(function (result) {
          if (result[0].Success === 1) {
            $scope.frm.RFC.$invalid = true;
            $scope.frm.RFC.$pristine = false;
            $scope.mensajerfc = result[0].Message;
          } else {
            UsuariosXEmpresasFactory.getUsuariosXEmpresa(IdEmpresaDistribuidor)
              .success(function (UsuariosXEmpresas) {
                if (UsuariosXEmpresas.length === 0) {
                  $scope.ShowToast('Agrega un administrador, para el distribuidor.', 'danger');
                } else {
                  var ObjMicrosoft = {
                    RFC: $scope.Empresa.RFC,
                    NombreEmpresa: DatosMicrosoft.company_name,
                    Direccion: DatosMicrosoft.default_address.address_line1,
                    Ciudad: DatosMicrosoft.default_address.city,
                    Estado: DatosMicrosoft.default_address.region,
                    CodigoPostal: DatosMicrosoft.default_address.postal_code,
                    NombreContacto: DatosMicrosoft.first_name || DatosMicrosoft.default_address.first_name,
                    ApellidosContacto: DatosMicrosoft.last_name || DatosMicrosoft.default_address.last_name,
                    CorreoContacto: $scope.Empresa.CorreoContacto,
                    TelefonoContacto: DatosMicrosoft.default_address.phone_number,
                    ZonaImpuesto: 'Normal',
                    Lada: '52',
                    IdMicrosoftUF: IdMicrosoft,
                    DominioMicrosoftUF: Dominio,
                    IdEmpresaDistribuidor: IdEmpresaDistribuidor,
                    IdUsuario: UsuariosXEmpresas[0].IdUsuario,
                    MonedaPago: $scope.Empresa.MonedaPago,
                    FormaPago: $scope.Empresa.IdFormaPagoPredilecta,
                  };
                  EmpresasFactory.postEmpresaMicrosoft(ObjMicrosoft)
                    .success(function (result) {
                      $location.path("/Empresas");
                      $scope.ShowToast('Se esta importando la empresa, por favor espere ', 'success');
                    })
                    .error(function (data, status, headers, config) {
                      $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
                    });
                }
              })
              .error(function (data, status, headers, config) {
                $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
              });
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    function isNumeric(num) {
      return !isNaN(num);
    }

    $scope.EmpresaCancel = function () {
      $location.path('/Empresas/Importar/' + IdEmpresaDistribuidor);
    };

    $scope.ValidarRFC = function () {
      EmpresasFactory.checkRFC({ RFC: $scope.Empresa.RFC })
        .success(function (result) {
          if (result[0].Success === 1) {
            for (var i = 0; i < $scope.Empresa.RFC.length; i++) {
              if ($scope.Empresa.RFC[i] == '-' || $scope.Empresa.RFC[i] == ' ' || $scope.Empresa.RFC[i] == '/' || $scope.Empresa.RFC[i] == '.' || $scope.Empresa.RFC[i] == ',') {
                $scope.frm.RFC.$invalid = true;
                $scope.frm.RFC.$pristine = false;
                $scope.valido = false;
                $scope.mensajerfc = 'El RFC es Incorrecto';
              } else {
                $scope.valido = true;
                $scope.frm.RFC.$invalid = false;

                if ($scope.Empresa.TipoRFC == undefined) {
                  $scope.frm.RFC.$invalid = true;
                  $scope.frm.RFC.$pristine = false;
                  $scope.mensajerfc = 'Selecciona un tipo RFC';
                } else {
                  $scope.valido = true;
                  $scope.frm.RFC.$invalid = false;
                  if ($scope.Empresa.TipoRFC === 'Persona Física') {
                    if (isNumeric($scope.Empresa.RFC[0]) === true || isNumeric($scope.Empresa.RFC[1]) === true || isNumeric($scope.Empresa.RFC[2]) === true || isNumeric($scope.Empresa.RFC[3]) === true) {
                      $scope.frm.RFC.$invalid = true;
                      $scope.frm.RFC.$pristine = false;
                      $scope.valido = false;
                      $scope.mensajerfc = 'Los primeros 4 digitos deben ser letras.';
                    } else {
                      if ($scope.Empresa.RFC.length != '13') {
                        $scope.frm.RFC.$invalid = true;
                        $scope.frm.RFC.$pristine = false;
                        $scope.valido = false;
                        $scope.mensajerfc = 'El RFC debe tener 13 digitos.';
                      } else {
                        $scope.valido = true;
                        $scope.frm.RFC.$invalid = false;
                      }
                    }
                  }

                  if ($scope.Empresa.TipoRFC === 'Persona Moral') {
                    if (isNumeric($scope.Empresa.RFC[0]) === true || isNumeric($scope.Empresa.RFC[1]) === true || isNumeric($scope.Empresa.RFC[2]) === true) {
                      $scope.frm.RFC.$invalid = true;
                      $scope.frm.RFC.$pristine = false;
                      $scope.valido = false;
                      $scope.mensajerfc = 'Los primeros 3 digitos deben ser letras.';
                    } else {
                      if ($scope.Empresa.RFC.length != '12') {
                        $scope.frm.RFC.$invalid = true;
                        $scope.frm.RFC.$pristine = false;
                        $scope.valido = false;
                        $scope.mensajerfc = 'El RFC debe tener 12 digitos.';
                      } else {
                        $scope.valido = true;
                        $scope.frm.RFC.$invalid = false;
                      }
                    }
                  }
                }
              }
            }
          } else {
            $scope.frm.RFC.$invalid = true;
            $scope.frm.RFC.$pristine = false;
            $scope.valido = false;
            $scope.mensajerfc = 'Este RFC ya esta registrado como distribuidor.';
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.ComboRFC = function () {
      EmpresasFactory.checkRFC({ RFC: $scope.Empresa.RFC })
        .success(function (result) {
          if (result[0].Success === 1) {
            if ($scope.Empresa.TipoRFC == undefined) {
              $scope.frm.RFC.$invalid = true;
              $scope.frm.RFC.$pristine = false;
              $scope.valido = false;
              $scope.mensajerfc = 'Selecciona un tipo RFC';
            } else {
              $scope.valido = true;
              $scope.frm.RFC.$invalid = false;
              if ($scope.Empresa.RFC != undefined) {
                for (var i = 0; i < $scope.Empresa.RFC.length; i++) {
                  if ($scope.Empresa.RFC[i] == '-' || $scope.Empresa.RFC[i] == ' ' || $scope.Empresa.RFC[i] == '/' || $scope.Empresa.RFC[i] == '.' || $scope.Empresa.RFC[i] == ',') {
                    $scope.frm.RFC.$invalid = true;
                    $scope.frm.RFC.$pristine = false;
                    $scope.valido = false;
                    $scope.mensajerfc = 'El RFC es Incorrecto';
                  } else {
                    $scope.frm.RFC.$invalid = false;
                    $scope.valido = true;

                    if ($scope.Empresa.TipoRFC === 'Persona Física') {
                      if (isNumeric($scope.Empresa.RFC[0]) === true || isNumeric($scope.Empresa.RFC[1]) === true || isNumeric($scope.Empresa.RFC[2]) === true || isNumeric($scope.Empresa.RFC[3]) === true) {
                        $scope.frm.RFC.$invalid = true;
                        $scope.frm.RFC.$pristine = false;
                        $scope.valido = false;
                        $scope.mensajerfc = 'Los primeros 4 digitos deben ser letras.';
                      } else {
                        if ($scope.Empresa.RFC.length != '13') {
                          $scope.frm.RFC.$invalid = true;
                          $scope.frm.RFC.$pristine = false;
                          $scope.valido = false;
                          $scope.mensajerfc = 'El RFC debe tener 13 digitos.';
                        } else {
                          $scope.valido = true;
                          $scope.frm.RFC.$invalid = false;
                        }
                      }
                    }

                    if ($scope.Empresa.TipoRFC === 'Persona Moral') {
                      if (isNumeric($scope.Empresa.RFC[0]) === true || isNumeric($scope.Empresa.RFC[1]) === true || isNumeric($scope.Empresa.RFC[2]) === true) {
                        $scope.frm.RFC.$invalid = true;
                        $scope.frm.RFC.$pristine = false;
                        $scope.valido = false;
                        $scope.mensajerfc = 'Los primeros 3 digitos deben ser letras.';
                      } else {
                        if ($scope.Empresa.RFC.length != '12') {
                          $scope.frm.RFC.$invalid = true;
                          $scope.frm.RFC.$pristine = false;
                          $scope.valido = false;
                          $scope.mensajerfc = 'El RFC debe tener 12 digitos.';
                        } else {
                          $scope.valido = true;
                          $scope.frm.RFC.$invalid = false;
                        }
                      }
                    }
                  }
                }
              }
            }
          } else {
            $scope.frm.RFC.$invalid = true;
            $scope.frm.RFC.$pristine = false;
            $scope.valido = false;
            $scope.mensajerfc = 'Este RFC ya esta registrado como distribuidor.';
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };
  };

  EmpresasCompletarController.$inject = ['$scope', '$log', '$location', '$cookieStore', '$routeParams', 'EmpresasFactory', 'EmpresasXEmpresasFactory', 'EstadosFactory', 'UsuariosFactory', 'UsuariosXEmpresasFactory'];

  angular.module('marketplace').controller('EmpresasCompletarController', EmpresasCompletarController);
}());

(function () {
  var EmpresasCreateController = function ($scope, $log, $cookieStore, $location, EmpresasFactory, EstadosFactory, UsuariosFactory) {
    $scope.Empresa = {};
    $scope.AlertaDominio = '';
    $scope.Empresa.IdERP = null;
    $scope.Combo = {};
    $scope.loading = false;
    $scope.Empresa.Formulario = false;
    $scope.Empresa.TelefonoContacto = '';
    $scope.Empresa.TelefonoContacto2 = '';
    $scope.valido;
    $scope.mensajerfc = '';

    $scope.init = function () {
      $scope.CheckCookie();

      EstadosFactory.getEstados()
        .success(function (result) {
          $scope.Combo.EstadoOptions = result;
          $scope.Combo.TipoRFC = [{ Nombre: 'Persona Física' }, { Nombre: 'Persona Moral' }];
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });

      $scope.Empresa.Lada = 52;
    };

    $scope.init();

    $scope.tel = function () {
      if ($scope.Empresa.TelefonoContacto.length == 10) {
        var value = $scope.Empresa.TelefonoContacto;
        var country, city, number;

        country = 1;
        city = value.slice(0, 3);
        number = value.slice(3);

        number = number.slice(0, 3) + '-' + number.slice(3);
        $scope.Empresa.TelefonoContacto2 = (' (' + city + ') ' + number).trim();
      }
    };

    function isNumeric(num) {
      return !isNaN(num);
    }

    $scope.ValidarRFC = function () {
      EmpresasFactory.checkRFC({ RFC: $scope.Empresa.RFC })
        .success(function (result) {
          if (result[0].Success === 1) {
            for (var i = 0; i < $scope.Empresa.RFC.length; i++) {
              if ($scope.Empresa.RFC[i] == "-" || $scope.Empresa.RFC[i] == ' ' || $scope.Empresa.RFC[i] == '/' || $scope.Empresa.RFC[i] == '.' || $scope.Empresa.RFC[i] == ',') {
                $scope.frm.RFC.$invalid = true;
                $scope.frm.RFC.$pristine = false;
                $scope.valido = false;
                $scope.mensajerfc = 'El RFC es Incorrecto'
              } else {
                $scope.valido = true;
                $scope.frm.RFC.$invalid = false;
                if ($scope.Empresa.TipoRFC == undefined) {
                  $scope.frm.RFC.$invalid = true;
                  $scope.frm.RFC.$pristine = false;
                  $scope.mensajerfc = 'Selecciona un tipo RFC';
                } else {
                  $scope.valido = true;
                  $scope.frm.RFC.$invalid = false;
                  if ($scope.Empresa.TipoRFC === 'Persona Física') {
                    if (isNumeric($scope.Empresa.RFC[0]) === true || isNumeric($scope.Empresa.RFC[1]) === true || isNumeric($scope.Empresa.RFC[2]) === true || isNumeric($scope.Empresa.RFC[3]) === true) {
                      $scope.frm.RFC.$invalid = true;
                      $scope.frm.RFC.$pristine = false;
                      $scope.valido = false;
                      $scope.mensajerfc = 'Los primeros 4 digitos deben ser letras.';
                    } else {
                      if ($scope.Empresa.RFC.length != '13') {
                        $scope.frm.RFC.$invalid = true;
                        $scope.frm.RFC.$pristine = false;
                        $scope.valido = false;
                        $scope.mensajerfc = 'El RFC debe tener 13 digitos.';
                      } else {
                        $scope.valido = true;
                        $scope.frm.RFC.$invalid = false;
                      }
                    }
                  }

                  if ($scope.Empresa.TipoRFC === 'Persona Moral') {
                    if (isNumeric($scope.Empresa.RFC[0]) === true || isNumeric($scope.Empresa.RFC[1]) === true || isNumeric($scope.Empresa.RFC[2]) === true) {
                      $scope.frm.RFC.$invalid = true;
                      $scope.frm.RFC.$pristine = false;
                      $scope.valido = false;
                      $scope.mensajerfc = 'Los primeros 3 digitos deben ser letras.';
                    } else {
                      if ($scope.Empresa.RFC.length != '12') {
                        $scope.frm.RFC.$invalid = true;
                        $scope.frm.RFC.$pristine = false;
                        $scope.valido = false;
                        $scope.mensajerfc = 'El RFC debe tener 12 digitos.';
                      } else {
                        $scope.valido = true;
                        $scope.frm.RFC.$invalid = false;
                      }
                    }
                  }
                }
              }
            }
          } else {
            $scope.frm.RFC.$invalid = true;
            $scope.frm.RFC.$pristine = false;
            $scope.valido = false;
            $scope.mensajerfc = 'Este RFC ya esta registrado como distribuidor.';
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.change = function () {
      EmpresasFactory.revisarDominio($scope.Empresa.DominioMicrosoft)
        .success(function (result) {
          if (result === 'false') {
            $scope.frm.DominioMicrosoft.$pristine = false;
            $scope.frm.DominioMicrosoft.$invalid = true;
            $scope.Empresa.MensajeDominio = 'Ya existe el dominio, Intenta con uno diferente.';
          } else {
            $scope.frm.DominioMicrosoft.$pristine = true;
            $scope.frm.RFC.$invalid = false;
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.ComboRFC = function () {
      EmpresasFactory.checkRFC({ RFC: $scope.Empresa.RFC })
        .success(function (result) {
          if (result[0].Success === 1) {
            if ($scope.Empresa.TipoRFC == undefined) {
              $scope.frm.RFC.$invalid = true;
              $scope.frm.RFC.$pristine = false;
              $scope.valido = false;
              $scope.mensajerfc = 'Selecciona un tipo RFC';
            } else {
              $scope.valido = true;
              $scope.frm.RFC.$invalid = false;
              if ($scope.Empresa.RFC != undefined) {
                for (var i = 0; i < $scope.Empresa.RFC.length; i++) {
                  if ($scope.Empresa.RFC[i] == "-" || $scope.Empresa.RFC[i] == ' ' || $scope.Empresa.RFC[i] == '/' || $scope.Empresa.RFC[i] == '.' || $scope.Empresa.RFC[i] == ',') {
                    $scope.frm.RFC.$invalid = true;
                    $scope.frm.RFC.$pristine = false;
                    $scope.valido = false;
                    $scope.mensajerfc = 'El RFC es Incorrecto';
                  } else {
                    $scope.frm.RFC.$invalid = false;
                    $scope.valido = true;

                    if ($scope.Empresa.TipoRFC === 'Persona Física') {
                      if (isNumeric($scope.Empresa.RFC[0]) === true || isNumeric($scope.Empresa.RFC[1]) === true || isNumeric($scope.Empresa.RFC[2]) === true || isNumeric($scope.Empresa.RFC[3]) === true) {
                        $scope.frm.RFC.$invalid = true;
                        $scope.frm.RFC.$pristine = false;
                        $scope.valido = false;
                        $scope.mensajerfc = 'Los primeros 4 digitos deben ser letras.';
                      } else {
                        if ($scope.Empresa.RFC.length != '13') {
                          $scope.frm.RFC.$invalid = true;
                          $scope.frm.RFC.$pristine = false;
                          $scope.valido = false;
                          $scope.mensajerfc = 'El RFC debe tener 13 digitos.';
                        } else {
                          $scope.valido = true;
                          $scope.frm.RFC.$invalid = false;
                        }
                      }
                    }

                    if ($scope.Empresa.TipoRFC === 'Persona Moral') {
                      if (isNumeric($scope.Empresa.RFC[0]) === true || isNumeric($scope.Empresa.RFC[1]) === true || isNumeric($scope.Empresa.RFC[2]) === true) {
                        $scope.frm.RFC.$invalid = true;
                        $scope.frm.RFC.$pristine = false;
                        $scope.valido = false;
                        $scope.mensajerfc = 'Los primeros 3 digitos deben ser letras.';
                      } else {
                        if ($scope.Empresa.RFC.length != '12') {
                          $scope.frm.RFC.$invalid = true;
                          $scope.frm.RFC.$pristine = false;
                          $scope.valido = false;
                          $scope.mensajerfc = 'El RFC debe tener 12 digitos.';
                        } else {
                          $scope.valido = true;
                          $scope.frm.RFC.$invalid = false;
                        }
                      }
                    }
                  }
                }
              }
            }
          } else {
            $scope.frm.RFC.$invalid = true;
            $scope.frm.RFC.$pristine = false;
            $scope.valido = false;
            $scope.mensajerfc = 'Este RFC ya esta registrado como distribuidor.';
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.EmpresaCreate = function () {
      UsuariosFactory.getCorreo($scope.Empresa)
        .success(function (result) {
          if (result[0].Success == 0) {
            $scope.Empresa.CorreoContacto = '';
            $scope.AlertaDominio = 'El Correo ya esta registrado, intenta con un correo diferente.';
          } else {
            if (($scope.frm.$invalid || $scope.Empresa.Formulario) == true || $scope.valido == false) {
              if ($scope.frm.NombreEmpresa.$invalid == true) {
                $scope.frm.NombreEmpresa.$pristine = false;
              }
              if ($scope.frm.DominioMicrosoft.$invalid == true) {
                $scope.frm.DominioMicrosoft.$pristine = false;
                $scope.Empresa.MensajeDominio = 'Ingresa un Dominio.';
              }
              if ($scope.frm.Direccion1.$invalid == true) {
                $scope.frm.Direccion1.$pristine = false;
              }
              if ($scope.frm.RFC.$invalid == true) {
                $scope.frm.RFC.$pristine = false;
              }
              if ($scope.frm.Ciudad.$invalid == true) {
                $scope.frm.Ciudad.$pristine = false;
              }
              if ($scope.Empresa.Estado == undefined) {
                $scope.frm.Estado.$pristine = false;
              }
              if ($scope.frm.Postal.$invalid == true) {
                $scope.frm.Postal.$pristine = false;
              }
              if ($scope.frm.Nombre.$invalid == true) {
                $scope.frm.Nombre.$pristine = false;
              }
              if ($scope.frm.Apellidos.$invalid == true) {
                $scope.frm.Apellidos.$pristine = false;
              }
              if ($scope.frm.CorreoElectronico.$invalid == true) {
                $scope.frm.CorreoElectronico.$pristine = false;
              }
              if ($scope.frm.Telefono.$invalid == true) {
                $scope.frm.Telefono.$pristine = false;
              }
            } else {
              $scope.loading = true;
              $scope.Empresa.Formulario = true;
              EmpresasFactory.postEmpresa($scope.Empresa)
                .success(function (result) {
                  var re, me, dat;
                  if (result[0]) {
                    re = result[0].Success;
                    me = result[0].Message;
                    dat = result[0].Dato;
                  } else {
                    re = result.success;
                    me = result.message;
                    dat = result.dato;
                  }
                  if (re) {
                    $scope.loading = false;
                    $location.path('/Clientes');
                  } else {
                    $scope.ShowToast(me, 'danger');
                    $scope.loading = false;
                    $scope.Empresa.Formulario = false;

                    if (dat == 20002) {
                      $scope.Empresa.DominioMicrosoft = '';
                      $scope.AlertaDominio = 'El dominio Microsoft ya existe, intenta con uno diferente.';
                    }
                  }
                })
                .error(function (data, status, headers, config) {
                  $scope.Empresa.Formulario = false;
                });
            }
          }
        })
        .error(function (data, status, headers, config) {
          $scope.Empresa.Formulario = false;
        });
    };

    $scope.EmpresaCancel = function () {
      $location.path('/Clientes');
    };
  };

  EmpresasCreateController.$inject = ['$scope', '$log', '$cookieStore', '$location', 'EmpresasFactory', 'EstadosFactory', 'UsuariosFactory'];

  angular.module('marketplace').controller('EmpresasCreateController', EmpresasCreateController);
}());

(function () {
  var EmpresasCreditoUpdateController = function ($scope, $log, $location, $cookieStore, $routeParams, EmpresasFactory) {
    var IdEmpresa = $routeParams.IdEmpresa;

    var Session = {};

    Session = $cookieStore.get('Session');

    $scope.Empresa = {};

    $scope.init = function () {
      $scope.CheckCookie();

      EmpresasFactory.getEmpresa(IdEmpresa)
        .success(function (Empresa) {
          $scope.Empresa = Empresa[0];
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.init();

    $scope.EmpresaUpdate = function () {
      var Empresa =
        {
          IdEmpresa: $scope.Empresa.IdEmpresa,
          Cliente: $scope.Empresa.IdERP,
          Credito: $scope.Empresa.Credito
        };

      EmpresasFactory.putEmpresa(Empresa)
        .success(function (result) {
          if (result.success === 1) {
            $scope.ShowToast(result.message, 'success');
            $location.path("/Empresas");
          } else {
            $scope.ShowToast(result.message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.EmpresaCancel = function () {
      $location.path("/Empresas");
    };
  };

  EmpresasCreditoUpdateController.$inject = ['$scope', '$log', '$location', '$cookieStore', '$routeParams', 'EmpresasFactory'];

  angular.module('marketplace').controller('EmpresasCreditoUpdateController', EmpresasCreditoUpdateController);
}());

(function () {
  var EmpresasImportController = function ($scope, $log, $location, $cookieStore, $routeParams, EmpresasFactory, EmpresasXEmpresasFactory, EstadosFactory, UsuariosFactory) {

    var IdEmpresa = $routeParams.IdEmpresa;
    $scope.IdEmpresaDistribuidor = IdEmpresa;
    $scope.EmpresasM = {};
    $scope.Empresas = {};
    $scope.Combo = {};

    $scope.init = function () {
      $scope.CheckCookie();

      EmpresasFactory.getEmpresa(IdEmpresa)
        .success(function (Empresa) {
          $scope.Empresa = Empresa[0];
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });

      EmpresasFactory.getEmpresasMicrosoft()
        .success(function (Empresas) {
          $scope.EmpresasM = Empresas.value;
          $scope.Combo.TipoRFC = [{ Nombre: 'Persona Física' }, { Nombre: 'Persona Moral' }];
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.init();

    $scope.Regresar = function () {
      $location.path("/Empresas");
    };

    $scope.ImportarEmpresa = function (IdEmpresaDistribuidor, IdMicrosoft, Dominio, Name) {
      $location.path("/Empresas/Importar/" + IdEmpresaDistribuidor + "/" + IdMicrosoft + "/" + Dominio + "/" + Name);
    };
  };

  EmpresasImportController.$inject = ['$scope', '$log', '$location', '$cookieStore', '$routeParams', 'EmpresasFactory', 'EmpresasXEmpresasFactory', 'EstadosFactory', 'UsuariosFactory'];

  angular.module('marketplace').controller('EmpresasImportController', EmpresasImportController);
}());

(function () {
  var EmpresasReadController = function ($scope, $log, $location, $cookieStore, EmpresasFactory, NivelesDistribuidorFactory) {
    var Session = {};

    Session = $cookieStore.get('Session');
    $scope.sortBy = 'Nombre';
    $scope.reverse = false;
    $scope.TablaVisible = false;
    $scope.cambiaAgente = false;

    $scope.init = function () {
      Session = $cookieStore.get('Session');
      $scope.CheckCookie();
      $scope.Empresas = null;
      $scope.TablaVisible = false;
      $scope.cambiaAgente = false;

      NivelesDistribuidorFactory.getNivelesDistribuidor()
        .success(function (NivelesDistribuidor) {
          if (NivelesDistribuidor.success) {
            $scope.selectNivelesDistribuidor = NivelesDistribuidor.data;
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.init();

    $scope.BajaEmpresa = function (index, IdEmpresa) {
      var Datos = { IdEmpresa: IdEmpresa, Activo: 0 };
      EmpresasFactory.validarBajaEmpresa(Datos)
        .success(function (result) {
          if (result[0].Success == true) {
            $scope.Empresas.splice(index, 1);
            EmpresasFactory.putEmpresa(Datos)
              .success(function (result) {
                if (result[0].Success == false) {
                  $scope.ShowToast(result[0].Message, 'danger');
                } else {
                  $scope.ShowToast('Empresa dada de baja', 'success');
                }
              })
              .error(function (data, status, headers, config) {
                $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
              });
          } else {
            $scope.ShowToast(result[0].Message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.OrdenarPor = function (Atributo) {
      $scope.sortBy = Atributo;
      $scope.reverse = !$scope.reverse;
    };

    $scope.BuscarEmpresas = function (busqueda) {
      EmpresasFactory.getEmpresa($scope.Empresa.Busqueda)
        .success(function (Empresas) {
          if (Empresas) {
            try {
              if (Empresas[0].Success == false || Empresas.length == null || Empresas.length == 'undefined') {
                $scope.Empresas = null;
                $scope.TablaVisible = false;
              } else {
                $scope.Empresas = Empresas;
                if ($scope.Empresas.length > 0) {
                  $scope.TablaVisible = true;
                } else {
                  $scope.Empresas = null;

                  $scope.TablaVisible = false;
                }
              }
            } catch (error) {
              $scope.Empresas = null;
              $scope.TablaVisible = false;
            }
          } else {
            $scope.Empresas = null;

            $scope.TablaVisible = false;
          }
        })
        .error(function (data, status, headers, config) {
          $scope.TablaVisible = false;
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.ActualizarConfirmacionCarta = function (Empresa) {
      var CartaConfirmacion1;
      var CartaConfirmacion2;
      if (Empresa.CartaConfirmacion1 == true || Empresa.CartaConfirmacion1 == 1) { CartaConfirmacion1 = 1; } else { CartaConfirmacion1 = 0; }
      if (Empresa.CartaConfirmacion2 == true || Empresa.CartaConfirmacion2 == 1) { CartaConfirmacion2 = 1; } else { CartaConfirmacion2 = 0; }
      var parametros = { IdEmpresa: Empresa.IdEmpresa, CartaConfirmacion1: CartaConfirmacion1, CartaConfirmacion2: CartaConfirmacion2 };
      EmpresasFactory.postCartaConfirmacion(parametros)
        .success(function (result) {
          if (result.success) {
            $scope.ShowToast(result.message, 'success');
          } else {
            $scope.ShowToast(result.message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.ActualizarIdNivelDistribuidor = function (Empresa) {
      var parametros = { IdEmpresa: Empresa.IdEmpresa, IdNivelDistribuidor: Empresa.IdNivelDistribuidor };
      EmpresasFactory.putActualizarNivelDistribuidor(parametros)
        .success(function (result) {
          if (result.success) {
            $scope.ShowToast(result.message, 'success');
          } else {
            $scope.ShowToast(result.message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.ActualizarAgentes = function (Empresa) {
      var parametros = { IdEmpresa: Empresa.IdEmpresa, AgenteMicrosoft: Empresa.AgenteMicrosoft, AgenteAutodesk: Empresa.AgenteAutodesk };
      if (typeof Empresa.AgenteMicrosoft === 'undefined' || typeof Empresa.AgenteAutodesk === 'undefined') {
        $scope.ShowToast('El nombre del agente solo debe contener letras y una longitud menor a 10 caracteres.', 'danger');
      } else {
        EmpresasFactory.putActualizarAgenteMarca(parametros)
          .success(function (result) {
            if (result.success) {
              $scope.ShowToast(result.message, 'success');
              Empresa.cambiaAgente = false;
            } else {
              $scope.ShowToast(result.message, 'danger');
            }
          })
          .error(function (data, status, headers, config) {
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      }
    };

    $scope.cambiarBoton = function (Empresa) {
      Empresa.cambiaAgente = true;
    };
  };

  EmpresasReadController.$inject = ['$scope', '$log', '$location', '$cookieStore', 'EmpresasFactory', 'NivelesDistribuidorFactory'];

  angular.module('marketplace').controller('EmpresasReadController', EmpresasReadController);
}());

(function () {
  var EmpresasRPController = function ($scope, $log, $cookieStore, $location, $uibModal, $filter, EmpresasXEmpresasFactory, NivelesDistribuidorFactory, $routeParams) {
    $scope.MostrarMensajeError = false;
    $scope.Empresas = [];
    $scope.Niveles = [];

    var error = function (error) {
      $scope.ShowToast(!error ? 'Ha ocurrido un error, intentelo mas tarde.' : error.message, 'danger');
      $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';
    };

    var obtenerEmpresas = function () {
      EmpresasXEmpresasFactory.getExchangeRateByIdEmpresa($routeParams.IdEmpresa)
        .then(function (respuesta) {
          var data = respuesta.data;
          var respuestaExitosa = data.success === 1;
          var empresas = data.data;
          if (respuestaExitosa) {
            var empresasConFormato = empresas.map(function (empresa) {
              empresa.FechaActivo = new Date(empresa.FechaActivo);
              return empresa;
            });
            $scope.Empresas = empresasConFormato;
          }
        })
        .catch(function (result) { error(result.data); });
    };

    var obtenerNiveles = function () {
      NivelesDistribuidorFactory.getNivelesDistribuidor()
        .then(function (result) {
          var response = result.data;
          if (!response.success) {
            error(result.data);
          } else {
            $scope.Niveles = response.data;
          }
        })
        .catch(function (result) { error(result.data); });
    };

    $scope.init = function () {
      obtenerEmpresas();
      obtenerNiveles();
    };

    $scope.init();

    $scope.asignarNivel = function (Empresa, IdNivelCS) {
      if (IdNivelCS === '') {
        IdNivelCS = Empresa.IdNivelCS;
      }
      var IdEmpresasXEmpresa = Empresa.IdEmpresasXEmpresa;
      var nivel = { IdEmpresasXEmpresa: IdEmpresasXEmpresa, IdNivelCS: IdNivelCS };
      NivelesDistribuidorFactory.asignarNivel(nivel)
        .then(function (result) {
          var response = result.data;
          if (!response.success) {
            error(result.data);
          } else {
            $scope.init();
            $scope.ShowToast('Nivel asignado.', 'success');
          }
        })
        .catch(function (result) { error(result.data); });
    };

    $scope.removerNivel = function (id) {
      NivelesDistribuidorFactory.removerNivel(id)
        .then(function (result) {
          var response = result.data;
          if (!response.success) {
            error(result.data);
          } else {
            $scope.init();
            $scope.ShowToast('Nivel removido.', 'success');
          }
        })
        .catch(function (result) { error(result.data); });
    };

    var tipoDeCambioValido = function (tipoDeCambio) {
      return tipoDeCambio > 0;
    };

    var actualizaTipoDeCambioATodasLasEmpresas = function () {
      $scope.Empresas = $scope.Empresas.map(function (Empresa) {
        Empresa.TipoCambioRP = $scope.RPTodos;
        return Empresa;
      });
    };

    var prepararDatosDePeticion = function (datos) {
      var empresas;
      if (typeof datos.map === 'function') {
        empresas = datos.slice();
      } else {
        empresas = [datos];
      }
      return {
        Empresas: empresas.map(function (Empresa) {
          return Object.assign({}, { TipoCambioRP: Number(Empresa.TipoCambioRP), IdEmpresasXEmpresa: Empresa.IdEmpresasXEmpresa });
        })
      };
    };

    $scope.ActualizarTodos = function () {
      if (tipoDeCambioValido($scope.RPTodos)) {
        actualizaTipoDeCambioATodasLasEmpresas();
        var datosDePeticion = prepararDatosDePeticion($scope.Empresas);
        EmpresasXEmpresasFactory.postExchangeRate(datosDePeticion)
          .then(function (respuesta) {
            var data = respuesta.data;
            var respuestaExitosa = data.success === 1;
            if (respuestaExitosa) {
              $scope.ShowToast('Actualizado correctamente.', 'success');
            } else {
              $scope.ShowToast('Error al actualizar el tipo de cambio.', 'danger');
            }
          })
          .catch(function (result) { error(result.data); });
        $scope.MostrarMensajeError = false;
      } else {
        $scope.MostrarMensajeError = true;
      }
    };

    $scope.ActualizarRP = function (Empresa) {
      if (tipoDeCambioValido(Empresa.TipoCambioRP)) {
        var datosDePeticion = prepararDatosDePeticion(Empresa);
        EmpresasXEmpresasFactory.postExchangeRate(datosDePeticion)
          .then(function (respuesta) {
            var data = respuesta.data;
            var respuestaExitosa = data.success === 1;
            if (respuestaExitosa) {
              $scope.ShowToast('Actualizado correctamente.', 'success');
            } else {
              $scope.ShowToast('Error al actualizar el tipo de cambio.', 'danger');
            }
          })
          .catch(function (result) { error(result.data); });
        Empresa.MostrarMensajeError = false;
      } else {
        Empresa.MostrarMensajeError = true;
      }
    };
  };
  EmpresasRPController.$inject = ['$scope', '$log', '$cookieStore', '$location', '$uibModal', '$filter', 'EmpresasXEmpresasFactory', 'NivelesDistribuidorFactory', '$routeParams'];

  angular.module('marketplace').controller('EmpresasRPController', EmpresasRPController);
}());

(function () {
  var EmpresasUpdateController = function ($scope, $log, $location, $cookieStore, $routeParams, EmpresasFactory, EmpresasXEmpresasFactory, EstadosFactory, UsuariosFactory) {
    var IdEmpresa = $routeParams.IdEmpresa;
    var Session = {};
    Session = $cookieStore.get('Session');
    $scope.Empresa = {};
    $scope.Combo = {};

    $scope.init = function () {
      Session = $cookieStore.get('Session');
      $scope.CheckCookie();

      EmpresasFactory.getEmpresas()
        .success(function (Empresa) {
          $scope.Empresa = Empresa[0];
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });

      EstadosFactory.getEstados()
        .success(function (result) {
          $scope.Combo.EstadoOptions = result;
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.init();

    $scope.EmpresaUpdate = function () {
      $scope.Empresa.CorreoElectronico = $scope.Empresa.CorreoContacto;
      UsuariosFactory.getUsuario($scope.Empresa.CorreoElectronico)
        .success(function (Usuario) {
          if (Usuario[0].Success == false) {
            $scope.Empresa.Nombre = $scope.Empresa.NombreContacto;
            $scope.Empresa.CorreoElectronico = $scope.Empresa.CorreoContacto;
            $scope.Empresa.IdTipoAcceso = 4;
            InsertarUsuario();
          } else {
            ActualizarEmpresa();
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.EmpresaDelete = function () {
      $scope.Empresa.Activo = 0;
      EmpresasXEmpresasFactory.putEmpresasXEmpresa($scope.Empresa)
        .success(function (result) {
          if (result[0].Success == true) {
            $location.path("/Empresas");
          } else {
            $scope.ShowToast(result[0].Message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.EmpresaCancel = function () {
      $location.path("/index");
    };

    function ActualizarEmpresa() {
      EmpresasFactory.putEmpresa($scope.Empresa)
        .success(function (result) {
          if (result[0].Success == true) {
            Session.NombreEmpresa = $scope.Empresa.NombreEmpresa;
            $cookieStore.put('Session', Session);
            $scope.ActualizarDatosSession();
            $location.path("/index");
            $scope.ShowToast("Empresa Actualizada", 'success');
          } else {
            $scope.ShowToast(result[0].Message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    }

    function InsertarUsuario() {
      UsuariosFactory.postUsuario($scope.Empresa)
        .success(function (Usuario) {
          if (Usuario[0].Success == true) {
            ActualizarEmpresa();
          } else {
            $scope.ShowToast(Usuario[0].Message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    }
  };

  EmpresasUpdateController.$inject = ['$scope', '$log', '$location', '$cookieStore', '$routeParams', 'EmpresasFactory', 'EmpresasXEmpresasFactory', 'EstadosFactory', 'UsuariosFactory'];

  angular.module('marketplace').controller('EmpresasUpdateController', EmpresasUpdateController);
}());

(function () {
  var EmpresasXEmpresasReadController = function ($scope, $log, $location, $cookieStore, EmpresasXEmpresasFactory, EmpresasFactory, PedidoDetallesFactory) {
    $scope.sortBy = 'NombreEmpresa';
    $scope.reverse = false;
    $scope.CreditoDisponible = 0;
    $scope.Cont = 0;
    $scope.form = {};
    $scope.form.habilitar = false;

    String.prototype.splice = function (idx, rem, s) {
      return (this.slice(0, idx) + s + this.slice(idx + Math.abs(rem)));
    };

    $scope.init = function () {
      $scope.CheckCookie();

      EmpresasXEmpresasFactory.getEmpresasXEmpresas()
        .success(function (Empresas) {
          if (Empresas) {
            for (var i = 0; i < Empresas.length; i++) {
              Empresas[i].WarningCredito = false;
            }

            $scope.Empresas = Empresas;

            for (var w = 0; w < $scope.Empresas.length; w++) {
              (function (index) {

                var parametros = { IdEmpresaUsuarioFinal: $scope.Empresas[index].IdEmpresa };

                PedidoDetallesFactory.postWarningCredito(parametros)
                  .success(function (result) {
                    if (result) {
                      if (result.success === 0) {
                        $scope.Empresas[index].WarningCredito = true;

                        $scope.ShowToast(result.message, 'danger');
                      }
                      else {
                        $scope.Empresas[index].WarningCredito = false;
                      }
                    }
                  })
                  .error(function (data, status, headers, config) {
                    $scope.ShowToast('No pudimos cargar tu información, por favor intenta de nuevo más tarde.', 'danger');
                    $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
                  });
              }(w));
            }
          }
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos cargar tus clientes, por favor intenta de nuevo más tarde', 'danger');
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });

      EmpresasFactory.getEmpresas()
        .success(function (data) {
          $scope.CreditoDisponible = data[0].Credito;
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos cargar los datos de tu empresa, por favor intenta de nuevo más tarde', 'danger');

          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.init();


    $scope.BajaEmpresa = function (Empresa) {
      var EmpresaUpdate = {};
      EmpresaUpdate = Empresa;
      EmpresaUpdate.IdEmpresaUsuarioFinal = Empresa.IdEmpresa;
      EmpresaUpdate.Activo = 0;

      EmpresasXEmpresasFactory.putEmpresasXEmpresa(EmpresaUpdate)
        .success(function (data) {
          if (data[0].Success == true) {
            $scope.ShowToast(data[0].Message, 'success');

            $scope.init();
          } else {
            $scope.Confirmar(Empresa.IdEmpresa);
            $scope.ShowToast(data[0].Message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos dar de baja a tu cliente, por favor intenta de nuevo más tarde', 'danger');

          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.Confirmar = function (IdEmpresa) {
      $scope.Empresas.forEach(function (Empresa) {
        if (Empresa.IdEmpresa == IdEmpresa) {
          Empresa.Mostrar = !Empresa.Mostrar;
        }
      }, this);
    };

    $scope.OrdenarPor = function (Atributo) {
      $scope.sortBy = Atributo;
      $scope.reverse = !$scope.reverse;
    };

    $scope.ActualizarCredito = function (Empresa) {
      var total = 0;

      if ($scope.Empresas !== undefined) {
        for (var i = 0; i < $scope.Empresas.length; i++) {
          var Empresas = $scope.Empresas[i];

          if (Empresas.PorcentajeCredito != undefined && Empresas.PorcentajeCredito != null) {
            if (Empresas.PorcentajeCredito < 0) {
              $scope.ShowToast('Cantidad no válida', 'danger');
              return;
            } else {
              total += Empresas.PorcentajeCredito;
            }
          } else {
            Empresas.PorcentajeCredito = 0;
          }
        }
      }

      if (total > $scope.CreditoDisponible) {
        $scope.ShowToast('No puedes exceder tu límite de crédito.', 'danger');
        $scope.init();
        return;
      }

      EmpresasXEmpresasFactory.putEmpresasXEmpresa(Empresa)
        .success(function (data) {
          if (data[0].Success == true) {
            $scope.ShowToast(data[0].Message, 'success');

            var parametros = { IdEmpresaUsuarioFinal: Empresa.IdEmpresa };

            PedidoDetallesFactory.postWarningCredito(parametros)
              .success(function (result) {
                if (result) {
                  var WarningCredito = false;

                  if (result.success === 0) {
                    WarningCredito = true;
                    $scope.ShowToast(result.message, 'danger');
                  } else {
                    WarningCredito = false;
                  }

                  for (var e = 0; e < $scope.Empresas.length; e++) {
                    if ($scope.Empresas[e].IdEmpresa === Empresa.IdEmpresa) {
                      $scope.Empresas[e].WarningCredito = WarningCredito;
                      break;
                    }
                  }
                }
              })
              .error(function (data, status, headers, config) {
                $scope.ShowToast('No pudimos cargar tu información, por favor intenta de nuevo más tarde.', 'danger');
                $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
              });
          } else {
            $scope.ShowToast(data[0].Message, 'danger');

            $scope.init();
          }
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos actualizar el crédito, por favor intenta de nuevo más tarde', 'danger');
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.NuevaEmpresa = function () {
      $location.path("/Empresa");
    };

    $scope.PosibilidadCredito = function () {
      var totalAsignado = 0;
      if ($scope.Empresas !== undefined) {
        for (var i = 0; i < $scope.Empresas.length; i++) {
          var Empresa = $scope.Empresas[i];
          if (Empresa.PorcentajeCredito != undefined && Empresa.PorcentajeCredito != null) {
            totalAsignado += Empresa.PorcentajeCredito;
          }
        }
      }

      return $scope.CreditoDisponible - totalAsignado;
    };

    $scope.CreditoRepartido = function () {
      var totalAsignado = 0;

      if ($scope.Empresas !== undefined) {
        for (var i = 0; i < $scope.Empresas.length; i++) {
          var Empresa = $scope.Empresas[i];

          if (Empresa.PorcentajeCredito != undefined && Empresa.PorcentajeCredito != null) {
            totalAsignado += Empresa.PorcentajeCredito;
          }
        }
      }

      return totalAsignado;
    };

    $scope.IniciarTourClients = function () {
      $scope.Tour = new Tour({
        steps: [
          {
            element: ".newClient",
            placement: "bottom",
            title: "Agrega nuevos clientes",
            content: "Da de alta un nuevo cliente y asígnale crédito para Click suscribe.",
            template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Atrás</button><button class='btn btn-default' data-role='next'>Sig »</button><button class='btn btn-default' data-role='end'>Finalizar</button></nav></div></div>"
          },
          {
            element: ".totalCredit",
            placement: "bottom",
            title: "Crédito total",
            content: "El crédito total que tienes en Click suscribe para hacer compras o renovar suscripciones.",
            template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Atrás</button><button class='btn btn-default' data-role='next'>Sig »</button><button class='btn btn-default' data-role='end'>Finalizar</button></nav></div></div>"
          },
          {
            element: ".asignCredit",
            placement: "bottom",
            title: "Crédito total asignado",
            content: "Cantidad que ya se repartió entre tus clientes.",
            template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Atrás</button><button class='btn btn-default' data-role='next'>Sig »</button><button class='btn btn-default' data-role='end'>Finalizar</button></nav></div></div>"
          },
          {
            element: ".giveCredit",
            placement: "bottom",
            title: "Crédito por repartir",
            content: "Cantidad disponible o pendiente por repartir entre tus clientes.",
            template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Atrás</button><button class='btn btn-default' data-role='next'>Sig »</button><button class='btn btn-default' data-role='end'>Finalizar</button></nav></div></div>"
          },
          {
            element: ".pesosCredit",
            placement: "left",
            title: "Asigna crédito",
            content: "Asígnale crédito a cada cliente en base a tu monto total.",
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

  EmpresasXEmpresasReadController.$inject = ['$scope', '$log', '$location', '$cookieStore', 'EmpresasXEmpresasFactory', 'EmpresasFactory', 'PedidoDetallesFactory'];

  angular.module('marketplace').controller('EmpresasXEmpresasReadController', EmpresasXEmpresasReadController);
}());

(function () {
  var MigracionController = function ($scope, $log, $location, $cookieStore, MigracionFactory) {
    $scope.editarMigracion = function (id) {
      $location.path('/migraciones/' + id);
    };

    $scope.init = function () {
      MigracionFactory.getMigraciones()
        .then(function (response) {
          $scope.migraciones = response.data.Migraciones;
        })
        .catch(console.log);
    };

    $scope.init();
  };

  MigracionController.$inject = ['$scope', '$log', '$location', '$cookieStore', 'MigracionFactory'];

  angular.module('marketplace').controller('MigracionController', MigracionController);
}());

(function () {
  var MigracionDetalleController = function ($scope, $log, $location, $cookieStore, $routeParams, MigracionFactory) {
    $scope.idMigracion = $routeParams.idMigracion;
    $scope.pasoSeleccionado = 0;
    $scope.pasoActual = 0;
    $scope.confirmoPasoActual = { checked: false };
    $scope.pasosDeMigracion = [
      { IdPaso: 0, llaveDePaso: 'NombreMigracion', nombreDePaso: 'Nombre  migración' },
      { IdPaso: 1, llaveDePaso: 'RelacionarMayorista', nombreDePaso: 'Relacionar mayorista' },
      { IdPaso: 2, llaveDePaso: 'ImportarDominio', nombreDePaso: 'Importar cliente' },
      { IdPaso: 3, llaveDePaso: 'CrearAdministrador', nombreDePaso: 'Crear administrador' },
      { IdPaso: 4, llaveDePaso: 'OrdenarSuscripciones', nombreDePaso: 'Ordenar suscripciones' },
      { IdPaso: 5, llaveDePaso: 'CancelarSuscripciones', nombreDePaso: 'Cancelar suscripciones' },
      { IdPaso: 6, llaveDePaso: 'AsignarAsientos', nombreDePaso: 'Confirmación' }
    ];
    $scope.contextos = [
      { IdContexto: 1, Contexto: 'sandbox' },
      { IdContexto: 2, Contexto: 'produccion' }
    ];

    $scope.datosDeMigracion = {
      NombreMigracion: '',
      NombreCliente: '',
      Dominio: '',
      IdContexto: 1,
      Contexto: 'sandox',
      RelacionarMayorista: 0,
      CrearAdministrador: 0,
      ImportarDominio: 0,
      OrdenarSuscripciones: 0,
      CancelarSuscripciones: 0,
      AsignarAsientos: 0
    };

    $scope.actualizarPasos = function () {
      if ($scope.idMigracion === '0') {
        $scope.pasoActual = 0;
        $scope.pasoSeleccionado = 0;
        return;
      }
      if ($scope.datosDeMigracion.RelacionarMayorista === 0) {
        $scope.pasoActual = 1;
        $scope.pasoSeleccionado = 1;
        return;
      }
      if ($scope.datosDeMigracion.ImportarDominio === 0) {
        $scope.pasoActual = 2;
        $scope.pasoSeleccionado = 2;
        return;
      }
      if ($scope.datosDeMigracion.CrearAdministrador === 0) {
        $scope.pasoActual = 3;
        $scope.pasoSeleccionado = 3;
        return;
      }
      if ($scope.datosDeMigracion.OrdenarSuscripciones === 0) {
        $scope.pasoActual = 4;
        $scope.pasoSeleccionado = 4;
        return;
      }
      if ($scope.datosDeMigracion.CancelarSuscripciones === 0) {
        $scope.pasoActual = 5;
        $scope.pasoSeleccionado = 5;
        return;
      }
      if ($scope.datosDeMigracion.AsignarAsientos === 0) {
        $scope.pasoActual = 6;
        $scope.pasoSeleccionado = 6;
        return;
      }
      $scope.pasoActual = 7;
      $scope.pasoSeleccionado = 7;
      return;
    };

    $scope.init = function () {
      if ($scope.idMigracion !== '0') {
        MigracionFactory.getMigracion($scope.idMigracion)
          .then(function (response) {
            if (response.data.data.length === 0) {
              $location.path('/migraciones/0');
              $scope.ShowToast(response.data.message, 'danger');
            } else {
              $scope.datosDeMigracion = response.data.data[0];
              $scope.actualizarPasos();
            }
          });
      }
      $scope.actualizarPasos();
    };

    $scope.init();

    $scope.crearMigracion = function () {
      var nuevaMigracion = {
        NombreMigracion: $scope.datosDeMigracion.NombreMigracion,
        IdContexto: $scope.datosDeMigracion.IdContexto
      };
      return MigracionFactory.postMigracion(nuevaMigracion);
    };

    $scope.validarDominio = function () {
      if ($scope.datosDeMigracion.Dominio.trim() !== '') {
        MigracionFactory.getDominio($scope.datosDeMigracion)
          .then(function (response) {
            if (response.data.success === 0) {
              $scope.datosDeMigracion.NombreCliente = '';
              return $scope.ShowToast(response.data.message, 'danger');
            }
            $scope.datosDeMigracion.NombreCliente = response.data.items[0].companyProfile.companyName;
          });
      }
    };

    $scope.importarDominio = function () {
      if ($scope.datosDeMigracion.Dominio) {
        if ($scope.datosDeMigracion.Dominio.trim()) {
          let cliente = {
            migration: {
              IdMigracion: $scope.datosDeMigracion.IdMigracion
            },
            context: $scope.datosDeMigracion.Contexto,
            domain: $scope.datosDeMigracion.Dominio
          };
          return MigracionFactory.postCliente(cliente);
        }
        return Promise.reject({
          success: 0,
          message: 'Ingresa el dominio de microsoft'
        });
      }
      return Promise.reject({
        success: 0,
        message: 'Ingresa el dominio de microsoft'
      });
    };

    $scope.crearAdministrador = function () {
      let usuario = {
        IdMigracion: $scope.datosDeMigracion.IdMigracion,
        userInfo: {
          Usuario: $scope.datosDeMigracion.Usuario,
          Nombre: $scope.datosDeMigracion.NombreUsuario,
          Apellidos: $scope.datosDeMigracion.ApellidosUsuario,
          Secreto: $scope.datosDeMigracion.Secreto
        },
        context: $scope.datosDeMigracion.Contexto
      };
      return MigracionFactory.postUsuario(usuario);
    };

    $scope.actualizarPasosEnBaseDeDatos = function () {
      for (let x = 0; x < $scope.pasosDeMigracion.length; x++) {
        if ($scope.pasoActual === $scope.pasosDeMigracion[x].IdPaso) {
          $scope.nombrePorActualizar = $scope.pasosDeMigracion[x].llaveDePaso;
        }
      }
      var objParaActualizar = {
        IdMigracion: $scope.idMigracion
      };
      objParaActualizar[$scope.nombrePorActualizar] = 1;
      MigracionFactory.patchMigracion(objParaActualizar)
        .then(function (response) {
          if (response.data.success) {
            return $scope.ShowToast(response.data.message, 'success');
          }
          $scope.ShowToast(response.data.message, 'danger');
          $scope.pasoActual--;
          $scope.pasoSeleccionado = $scope.pasoActual;
        });
    };

    $scope.setSelected = function (index) {
      if (index <= $scope.pasoActual) {
        $scope.pasoSeleccionado = index;
      }
    };
    $scope.regresar = function () {
      $location.path('/migraciones');
    };

    $scope.actualizarSiguientePaso = function () {
      $scope.actualizarPasosEnBaseDeDatos();
      if ($scope.pasoActual > $scope.pasoSeleccionado) {
        $scope.pasoSeleccionado = $scope.pasoSeleccionado + 1;
      } else {
        $scope.pasoActual = $scope.pasoActual + 1;
        $scope.pasoSeleccionado = $scope.pasoActual;
      }
      $scope.confirmoPasoActual.checked = false;
    };

    $scope.siguientePasoSinActualizar = function () {
      if ($scope.pasoActual > $scope.pasoSeleccionado) {
        $scope.pasoSeleccionado = $scope.pasoSeleccionado + 1;
      } else {
        $scope.pasoActual = $scope.pasoActual + 1;
        $scope.pasoSeleccionado = $scope.pasoActual;
      }
    };

    $scope.completarPaso = function () {
      console.log($scope.pasoSeleccionado, $scope.pasoActual, $scope.datosDeMigracion);
      if ($scope.pasoSeleccionado < $scope.pasoActual) {
        $scope.siguientePasoSinActualizar();
        return;
      }
      if ($scope.pasoActual === 0) {
        $scope.crearMigracion()
          .then(function (response) {
            if (response.data.success) {
              $location.path('/migraciones/' + response.data.data.insertId);
              return $scope.ShowToast(response.data.message, 'success');
            }
            $scope.ShowToast(response.data.message, 'danger');
            $scope.pasoActual--;
            $scope.pasoSeleccionado = $scope.pasoActual;
          });
      }
      if ($scope.pasoActual === 1) {
        return $scope.actualizarSiguientePaso();
      }
      if ($scope.pasoActual === 2) {
        $scope.importarDominio()
          .then(function (resultado) {
            if (resultado.data.success === 0) {
              return $scope.ShowToast(resultado.data.message, 'danger');
            }
            $scope.actualizarSiguientePaso();
          })
          .catch(function (err) {
            if (err.success === 0) {
              return $scope.ShowToast(err.message, 'danger');
            }
          });
      }
      if ($scope.pasoActual === 3) {
        $scope.crearAdministrador()
          .then(function (resultado) {
            console.log(resultado);
            if (resultado.data.success === 0) {
              return $scope.ShowToast(resultado.data.message, 'danger');
            }
            $scope.actualizarSiguientePaso();
          });
      }
      if ($scope.pasoActual > 3) {
        $scope.actualizarSiguientePaso();
      }
    };
    $scope.pasoAnterior = function () {
      if ($scope.pasoSeleccionado > 0) {
        $scope.pasoSeleccionado = $scope.pasoSeleccionado - 1;
      }
    };
    $scope.copyToCipbard = function () {
      var copyTextarea = document.querySelector('#invite-url');
      copyTextarea.select();
      document.execCommand('copy');
    };
    $scope.hacerOtraMigracion = function () {
      $location.path('/migraciones/0');
    };
  };

  MigracionDetalleController.$inject = ['$scope', '$log', '$location', '$cookieStore', '$routeParams', 'MigracionFactory'];

  angular.module('marketplace').controller('MigracionDetalleController', MigracionDetalleController);
}());

(function () {
  var NivelesClienteFinalController = function ($scope, $location, $cookieStore, NivelesClienteFinalFactory) {
    $scope.sortBy = 'Nivel';
    $scope.reverse = false;
    $scope.Nivel = {};
    $scope.levels = [];
    $scope.newLevel = "";
    $scope.session = $cookieStore.get('Session');

    const getLevels = function () {
      NivelesClienteFinalFactory.getLevels()
        .then(function (result) {
          $scope.levels = result.data.data;
        })
        .catch(function (result) {
          $scope.ShowToast(!result.data ? 'Ha ocurrido un error, intentelo mas tarde.' : result.data.message, 'danger');
        });
    };

    $scope.init = function () {
      $scope.CheckCookie();
      getLevels();
    };

    $scope.init();

    $scope.OrdenarPor = function (Atributo) {
      $scope.sortBy = Atributo;
      $scope.reverse = !$scope.reverse;
    };

    $scope.deleteLevel = function (level) {
      NivelesClienteFinalFactory.deleteLevel(level.IdNivelEmpresaUsuarioFinal)
        .then(function (result) {
          $scope.levels.forEach(function (property, index) {
            if (property.IdNivelEmpresaUsuarioFinal === level.IdNivelEmpresaUsuarioFinal) {
              $scope.levels.splice(index, 1);
            }
          });
          return result;
        })
        .then(function (result) { $scope.ShowToast(result.data.message, 'success') })
        .catch(function (result) {
          $scope.ShowToast(!result.data ? 'Ha ocurrido un error, intentelo mas tarde.' : result.data.message, 'danger');
        });
    };

    $scope.addLevel = function (level) {
      const enterpriseId = $scope.session.IdEmpresa;
      const newLevel = { IdEmpresaDistribuidor: enterpriseId, Nivel: level };
      NivelesClienteFinalFactory.addLevel(newLevel)
        .then(function (result) {
          $scope.ShowToast(result.data.message, 'success');
          $scope.newLevel = "";
          $scope.init();
        })
        .catch(function (result) {
          $scope.ShowToast(!data ? 'Ha ocurrido un error, intentelo mas tarde.' : result.data.message, 'danger');
        });
    }

    $scope.addDiscount = function (level) {
      $cookieStore.put('nivel', level.Nivel);
      $location.path('/Niveles/Distribuidor/' + level.IdNivelEmpresaUsuarioFinal + '/Descuentos');
    };

  };

  NivelesClienteFinalController.$inject = ['$scope', '$location', '$cookieStore', 'NivelesClienteFinalFactory'];

  angular.module('marketplace').controller('NivelesClienteFinalController', NivelesClienteFinalController);
}());

(function () {
  var NivelesReadController = function ($scope, $log, $location, $cookieStore, NivelesDistribuidorFactory) {
    $scope.sortBy = 'Nivel';
    $scope.reverse = false;
    $scope.Nivel = {};

    $scope.init = function () {
      $scope.CheckCookie();
      NivelesDistribuidorFactory.getNivelesDistribuidor()
        .success(function (resultNiveles) {
          if (resultNiveles.success) {
            $scope.Niveles = resultNiveles.data;
            $scope.Nivel.Nivel = '';
          } else {
            $scope.ShowToast(resultNiveles.message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.init();

    $scope.OrdenarPor = function (Atributo) {
      $scope.sortBy = Atributo;
      $scope.reverse = !$scope.reverse;
    };

    $scope.agregarNivel = function () {
      NivelesDistribuidorFactory.postNivelesDistribuidor($scope.Nivel)
        .success(function (result) {
          if (result.success) {
            $scope.ShowToast(result.message, 'success');
            $scope.init();
          } else {
            $scope.ShowToast(result.message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos eliminar el descuento seleccionado. Intenta de nuevo más tarde.', 'danger');
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.eliminarNivel = function (Nivel) {
      $scope.Niveles.forEach(function (Elemento, Index) {
        if (Elemento.IdNivelDistribuidor === Nivel.IdNivelDistribuidor) {
          $scope.Niveles.splice(Index, 1);
          return false;
        }
      });

      NivelesDistribuidorFactory.deleteNivelesDistribuidor(Nivel.IdNivelDistribuidor)
        .success(function (result) {
          if (result.success) {
            $scope.ShowToast(result.message, 'success');
          } else {
            $scope.init();
            $scope.ShowToast(result.message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos eliminar el descuento seleccionado. Intenta de nuevo más tarde.', 'danger');
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.configurarNivel = function (nivel) {
      var path = '/Niveles/' + nivel.IdNivelDistribuidor + '/Productos';
      $location.path(path);
    };
  };

  NivelesReadController.$inject = ['$scope', '$log', '$location', '$cookieStore', 'NivelesDistribuidorFactory'];

  angular.module('marketplace').controller('NivelesReadController', NivelesReadController);
}());

(function () {
  var ComprarController = function ($scope, $log, $location, $cookieStore, PedidoDetallesFactory, TipoCambioFactory, PedidosFactory, EmpresasFactory, $route) {
    $scope.currentPath = $location.path();
    $scope.PedidoDetalles = {};
    $scope.Distribuidor = {};
    $scope.error = false;

    const error = function (message) {
      $scope.ShowToast(!message ? 'Ha ocurrido un error, intentelo mas tarde.' : message, 'danger');
      $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';
    };

    const getOrderDetails = function () {
      return PedidoDetallesFactory.getPedidoDetalles()
        .then(function (result) {
          if (result.data.success) $scope.PedidoDetalles = result.data.data;
          $scope.PedidoDetalles.forEach(function (elem) {
            elem.Productos.forEach(function (item) {
              if (item.PrecioUnitario == null) $scope.error = true;
            });
          });
          if ($scope.error) $location.path('/Productos');
        })
        .catch(function (result) {
          $location.path('/Carrito/e');
          error('No pudimos cargar tu información, por favor intenta de nuevo más tarde.');
        });
    };

    const getEnterprises = function () {
      return EmpresasFactory.getEmpresas()
        .then(function (result) {
          $scope.Distribuidor = result.data[0];
        })
        .catch(function (result) {
          error('No pudimos cargar los datos de tu empresa, por favor intenta de nuevo más tarde');
          $location.path('/Carrito/e');
        });
    };

    $scope.prepararPedidos = function () {
      PedidoDetallesFactory.getPrepararCompra(1)
        .then(function (result) {
          if (result.data.success) $scope.ShowToast(result.data.message, 'success');
          else {
            $scope.ShowToast(result.data.message, 'danger');
            $location.path('/Carrito/e');
          }
        })
        .then(getOrderDetails)
        .then(getEnterprises)
        .catch(function (result) { error(result.data.message); });
    };

    $scope.init = function () {
      if ($scope.currentPath === '/Comprar') {
        $scope.CheckCookie();
        $scope.prepararPedidos();
      }
    };

    $scope.init();

    $scope.ActualizarFormaPago = function (IdFormaPago) {
      var empresa = { IdFormaPagoPredilecta: IdFormaPago };
      EmpresasFactory.putEmpresaFormaPago(empresa)
        .then(function (result) {
          if (result.data.success) {
            $scope.ShowToast(result.data.message, 'success');
            $scope.init();
          } else $scope.ShowToast(result.data.message, 'danger');
        })
        .catch(function (result) { error(result.data); });
    };

    $scope.calcularSubTotal = function (IdPedido) {
      let total = 0;
      $scope.PedidoDetalles.forEach(function (order) {
        order.Productos.forEach(function (product) {
          if (order.IdPedido === IdPedido && !product.PrimeraCompraMicrosoft) {
            total = total + (product.PrecioUnitario * product.Cantidad);
          }
        });
      });
      return total;
    };

    $scope.calcularIVA = function (IdPedido) {
      let total = $scope.calcularSubTotal(IdPedido);
      if ($scope.Distribuidor.ZonaImpuesto === 'Normal') total = 0.16 * total;
      if ($scope.Distribuidor.ZonaImpuesto === 'Nacional') total = 0.16 * total;
      if ($scope.Distribuidor.ZonaImpuesto === 'Frontera') total = 0.11 * total;
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

    $scope.back = function () {
      $location.path('/Carrito');
    };

    $scope.PagarTarjeta = function () {
      if ($scope.Distribuidor.IdFormaPagoPredilecta === 1) {
        PedidoDetallesFactory.getPrepararTarjetaCredito()
          .success(function (Datos) {
            var expireDate = new Date();
            expireDate.setTime(expireDate.getTime() + 600 * 2000); /* 20 minutos */
            $cookieStore.put('pedidosAgrupados', Datos.data['0'].pedidosAgrupados, { 'expires': expireDate });

            if (Datos.data['0'].total > 0) {
              if (Datos.success) {
                if ($cookieStore.get('pedidosAgrupados')) {
                  Checkout.configure({
                    merchant: Datos.data['0'].merchant,
                    session: { id: Datos.data['0'].session_id },
                    order:
                    {
                      amount: function () {
                        Datos.data['0'].total;
                      },
                      currency: Datos.data['0'].moneda,
                      description: 'Pago tarjeta bancaria',
                      id: Datos.data['0'].pedidos
                    },
                    interaction:
                    {
                      merchant:
                      {
                        name: 'CompuSoluciones',
                        address:
                        {
                          line1: 'CompuSoluciones y Asociados, S.A. de C.V.',
                          line2: 'Av. Mariano Oterno No. 1105',
                          line3: 'Col. Rinconada del Bosque C.P. 44530',
                          line4: 'Guadalajara, Jalisco. México'
                        },

                        email: 'order@yourMerchantEmailAddress.com',
                        phone: '+1 123 456 789 012',
                      },
                      displayControl: { billingAddress: 'HIDE', orderSummary: 'READ_ONLY' },
                      locale: 'es_MX',
                      theme: 'default'
                    }
                  });
                  Checkout.showLightbox();
                } else {
                  $scope.ShowToast('No pudimos comenzar con tu proceso de pago, favor de intentarlo una vez más.', 'danger');
                }
              } else {
                $scope.ShowToast('Algo salio mal con el pago con tarjeta bancaria, favor de intentarlo una vez más.', 'danger');
              }
            } else {
              $scope.pedidosAgrupados = Datos.data['0'].pedidosAgrupados;
              $scope.ComprarConTarjeta('Grátis', 'Grátis');
            }
          })
          .error(function (data, status, headers, config) {
            $scope.ShowToast('Error al obtener el tipo de cambio API Intelisis.', 'danger');
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      }
    };

    $scope.Comprar = function () {
      if ($scope.Distribuidor.IdFormaPagoPredilecta === 1) {
        $scope.PagarTarjeta();
      } else {
        PedidoDetallesFactory.getComprar()
          .success(function (compra) {
            if (compra.success === 1) {
              $scope.ShowToast(compra.message, 'success');

              $scope.ActualizarMenu();
              $location.path('/');
            }
            else {
              $location.path('/Carrito');
              $scope.ShowToast(compra.message, 'danger');
            }
          })
          .error(function (data, status, headers, config) {
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      }
    };

    $scope.ComprarConTarjeta = function (resultIndicator, sessionVersion) {
      var datosTarjeta = { 'TarjetaResultIndicator': resultIndicator, 'TarjetaSessionVersion': sessionVersion, 'PedidosAgrupados': $cookieStore.get('pedidosAgrupados') };

      if (datosTarjeta.PedidosAgrupados) {
        if (datosTarjeta.PedidosAgrupados[0].Renovacion) {
          PedidosFactory.patchPaymentInformation(datosTarjeta)
            .success(function (compra) {
              $cookieStore.remove('pedidosAgrupados');
              if (compra.success === 1) {
                $scope.ShowToast(compra.message, 'success');
                $location.path('/MonitorPagos/refrescar');
              }
            })
            .error(function (data, status, headers, config) {
              $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
            });
        } else {
          PedidosFactory.putPedido(datosTarjeta)
            .success(function (putPedidoResult) {
              $cookieStore.remove('pedidosAgrupados');
              if (putPedidoResult.success) {
                PedidoDetallesFactory.getComprar()
                  .success(function (compra) {
                    if (compra.success === 1) {
                      $scope.ShowToast(compra.message, 'success');
                      $scope.ActualizarMenu();
                      $location.path('/');
                    } else {
                      $location.path('/Carrito');
                      $scope.ShowToast(compra.message, 'danger');
                    }
                  })
                  .error(function (data, status, headers, config) {
                    $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
                  });
              } else {
                $scope.ShowToast('Algo salió mal con tu pedido, por favor ponte en contacto con tu equipo de soporte CompuSoluciones para más información.', 'danger');
                $scope.ActualizarMenu();
                $location.path('/Carrito/e');
              }
            })
            .error(function (data, status, headers, config) {
              $cookieStore.remove('pedidosAgrupados');
              $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
            });
        }
      } else {
        $scope.ShowToast('Algo salió mal con tu pedido, por favor ponte en contacto con tu equipo de soporte CompuSoluciones para más información.', 'danger');
        $location.path('/Carrito/e');
      }
    };
  };

  ComprarController.$inject = ['$scope', '$log', '$location', '$cookieStore', 'PedidoDetallesFactory', 'TipoCambioFactory', 'PedidosFactory', 'EmpresasFactory', '$route'];

  angular.module('marketplace').controller('ComprarController', ComprarController);
}());

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

(function () {
  var DetallesAzureController = function ($scope, $log, $cookieStore, $location, $uibModal, $filter, PedidoDetallesFactory, $routeParams) {
    var IdPedido = $routeParams.IdPedido;
    $scope.Mostrar = false;
    $scope.MostrarMensaje = false;
    $scope.init = function () {
      PedidoDetallesFactory.getAzureUsage(IdPedido)
        .success(function (usage) {
          if (usage.data.length < 1) {
            $scope.Mostrar = false;
            $scope.MostrarMensaje = true;
          } else {
            $scope.Mostrar = true;
            $scope.MostrarMensaje = false;
          }
          $scope.Total = 0;
          $scope.UsageDetails = usage.data.map(function (item) {
            if (item.Unidad === 'Hours') {
              item.Utilizado = Number(item.Utilizado).toFixed(2);
            } else {
              item.Utilizado = Number(item.Utilizado).toFixed(4);
            }
            $scope.Total += Number(item.Total);
            return item;
          });
          $scope.FechaActualizacion = usage.data[0].FechaActivo;
        })
        .error(function (data, status, headers, config) {
          $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';

          $scope.ShowToast('No pudimos cargar la lista de fabricantes, por favor intenta de nuevo más tarde.', 'danger');

          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });

    };
    $scope.init();

  };
  DetallesAzureController.$inject = ['$scope', '$log', '$cookieStore', '$location', '$uibModal', '$filter', 'PedidoDetallesFactory', '$routeParams'];

  angular.module('marketplace').controller('DetallesAzureController', DetallesAzureController);
}());

(function () {
  var MonitorPagos = function ($scope, $log, $cookieStore, $location, $uibModal, $filter, PedidoDetallesFactory, EmpresasFactory) {
    $scope.PedidoSeleccionado = 0;
    $scope.PedidosSeleccionadosParaPagar = [];
    $scope.PedidosObj = {};
    $scope.ServicioElectronico = 0;
    $scope.Subtotal = 0;
    $scope.Iva = 0;
    $scope.Total = 0;
    $scope.DeshabilitarPagar = false;
    $scope.todos = 0;
    function groupBy(array, f) {
      var groups = {};
      array.forEach(function (o) {
        var group = JSON.stringify(f(o));
        groups[group] = groups[group] || [];
        groups[group].push(o);
      });
      return Object.keys(groups).map(function (group) { return groups[group]; });
    };

    $scope.init = function () {
      $location.path('/MonitorPagos');
      PedidoDetallesFactory.getPendingOrdersToPay()
        .success(function (ordersToPay) {
          $scope.Pedidos = ordersToPay.data;
          if (!ordersToPay.data || ordersToPay.data.length === 0) {
            return $scope.DeshabilitarPagar = true;
          }
          $scope.PedidosAgrupados = groupBy(ordersToPay.data, function (item) { return [item.IdPedido]; });
          for (let x = 0; x < $scope.PedidosAgrupados.length; x++) {
            $scope.PedidosObj[$scope.PedidosAgrupados[x][0].IdPedido] = $scope.PedidosAgrupados[x][0];
          }
          $scope.TipoCambio = ordersToPay.data[0].TipoCambio;
        })
        .error(function (data, status, headers, config) {
          $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';

          $scope.ShowToast('No pudimos cargar los pedidos por pagar, por favor intenta de nuevo más tarde.', 'danger');

          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });

      if ($cookieStore.get('Session').IdTipoAcceso == 2 || $cookieStore.get('Session').IdTipoAcceso == 3) {
        EmpresasFactory.getEmpresa($cookieStore.get('Session').IdEmpresa)
          .success(function (empresa) {
            console.log(empresa);
            $scope.infoEmpresa = empresa[0];
          })
          .error(function (data, status, headers, config) {
            $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';

            $scope.ShowToast('No pudimos cargar la información, por favor intenta de nuevo más tarde.', 'danger');

            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      }
    };
    $scope.init();

    $scope.ActualizarPagoAutomatico = function () {
      console.log($scope.infoEmpresa.RealizarCargoAutomatico);
      EmpresasFactory.updateAutomaticPayment($scope.infoEmpresa.RealizarCargoAutomatico)
        .success(function (result) {
          if (result.success === 1) {
            $scope.ShowToast(result.message, 'success');
          }
        })
        .error(function (data, status, headers, config) {
          $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';

          $scope.ShowToast('No pudimos cargar la información, por favor intenta de nuevo más tarde.', 'danger');

          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.obtenerSubTotal = function (key) {
      var subtotal = 0;
      for (var x = 0; x < $scope.Pedidos.length; x++) {
        if ($scope.Pedidos[x].IdPedido == key) {
          subtotal += $scope.Pedidos[x].PrecioRenovacion * $scope.Pedidos[x].CantidadProxima;
        }
      }
      return subtotal * $scope.TipoCambio;
    };

    $scope.seleccionarTodos = function () {
      for (var x = 0; x < $scope.PedidosAgrupados.length; x++) {
        if ($scope.PedidosObj[$scope.PedidosAgrupados[x][0].IdPedido].Check !== $scope.todos) {
          $scope.PedidosObj[$scope.PedidosAgrupados[x][0].IdPedido].Check = $scope.todos;
          $scope.pedidosPorPagar($scope.PedidosAgrupados[x][0].IdPedido);
        }
      }
    };

    $scope.pedidosPorPagar = function (key) {
      for (var y = 0; y < $scope.Pedidos.length; y++) {
        if ($scope.Pedidos[y].IdPedido == key) {
          if (!$scope.PedidosObj[key].Check) {
            if ($scope.todos) {
              $scope.todos = 0;
            }
            for (var x = 0; x < $scope.PedidosSeleccionadosParaPagar.length; x++) {
              if (key == $scope.PedidosSeleccionadosParaPagar[x]) {
                $scope.PedidosSeleccionadosParaPagar.splice(x, 1);
              }
            }
            $scope.Pedidos[y].Seleccionado = 0;
          } else {
            $scope.PedidosSeleccionadosParaPagar.push(key);
            $scope.Pedidos[y].Seleccionado = 1;
          }
          break;
        }
      }

      if ($scope.PedidosSeleccionadosParaPagar.length === 0) {
        $scope.ServicioElectronico = 0;
        $scope.Subtotal = 0;
        $scope.Iva = 0;
        $scope.Total = 0;
      } else {
        PedidoDetallesFactory.monitorCalculations({ Pedidos: $scope.PedidosSeleccionadosParaPagar })
          .success(function (calculations) {
            if (calculations.total) {
              $scope.ServicioElectronico = calculations.electronicService;
              $scope.Subtotal = calculations.subtotal;
              $scope.Iva = calculations.iva;
              $scope.Total = calculations.total;
            } else {
              $scope.ServicioElectronico = 0;
              $scope.Subtotal = 0;
              $scope.Iva = 0;
              $scope.Total = 0;
            }
          })
          .error(function (data, status, headers, config) {
            $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';

            $scope.ShowToast('No pudimos realizar los cálculos, por favor intenta de nuevo más tarde.', 'danger');

            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      }
    };

    $scope.mostrarDetalles = function (key) {
      if ($scope.PedidosObj[key].Mostrar) {
        $scope.PedidosObj[key].Mostrar = 0;
      } else {
        $scope.PedidosObj[key].Mostrar = 1;
      }
    };

    $scope.pagar = function () {
      if ($scope.PedidosSeleccionadosParaPagar.length > 0) {
        PedidoDetallesFactory.payWidthCard({ Pedidos: $scope.PedidosSeleccionadosParaPagar })
          .success(function (Datos) {
            var expireDate = new Date();
            expireDate.setTime(expireDate.getTime() + 600 * 2000); /*20 minutos*/
            Datos.data["0"].pedidosAgrupados[0].TipoCambio = $scope.TipoCambio;
            $cookieStore.put('pedidosAgrupados', Datos.data["0"].pedidosAgrupados, { 'expires': expireDate });
            if (Datos.success) {
              if ($cookieStore.get('pedidosAgrupados')) {

                Checkout.configure({
                  merchant: Datos.data["0"].merchant,
                  session: { id: Datos.data["0"].session_id },
                  order:
                  {
                    amount: function () {
                      Datos.data["0"].total;
                    },
                    currency: Datos.data["0"].moneda,
                    description: 'Pago tarjeta bancaria',
                    id: Datos.data["0"].pedidos,
                  },
                  interaction:
                  {
                    merchant:
                    {
                      name: 'CompuSoluciones',
                      address:
                      {
                        line1: 'CompuSoluciones y Asociados, S.A. de C.V.',
                        line2: 'Av. Mariano Oterno No. 1105',
                        line3: 'Col. Rinconada del Bosque C.P. 44530',
                        line4: 'Guadalajara, Jalisco. México'
                      },

                      email: 'order@yourMerchantEmailAddress.com',
                      phone: '+1 123 456 789 012',
                    },
                    displayControl: { billingAddress: 'HIDE', orderSummary: 'READ_ONLY' },
                    locale: 'es_MX',
                    theme: 'default'
                  }
                });

                Checkout.showLightbox();

              }
            }
          })
          .error(function (data, status, headers, config) {
            $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';

            $scope.ShowToast('No pudimos conectarnos con el banco, por favor intenta de nuevo más tarde.', 'danger');

            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      } else {
        $scope.ShowToast('Selecciona al menos un pedido para pagar.', 'danger');
      }
    };
  };
  MonitorPagos.$inject = ['$scope', '$log', '$cookieStore', '$location', '$uibModal', '$filter', 'PedidoDetallesFactory', 'EmpresasFactory'];

  angular.module('marketplace').controller('MonitorPagos', MonitorPagos);
}());

(function () {
  var MonitorReadController = function ($scope, $log, $cookieStore, $location, EmpresasXEmpresasFactory, PedidoDetallesFactory, $uibModal, $filter, FabricantesFactory, PedidosFactory, EmpresasFactory) {
    $scope.EmpresaSelect = 0;
    var Params = {};
    $scope.form = {};
    $scope.form.habilitar = false;
    $scope.Vacio = 0;
    $scope.Pedidos = {};
    $scope.BuscarProductos = {};
    $scope.SessionCookie = $cookieStore.get('Session');

    $scope.init = function () {
      $scope.CheckCookie();

      FabricantesFactory.getFabricantes()
        .success(function (Fabricantes) {
          $scope.selectFabricantes = Fabricantes;
        })
        .error(function (data, status, headers, config) {
          $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';

          $scope.ShowToast('No pudimos cargar la lista de fabricantes, por favor intenta de nuevo más tarde.', 'danger');

          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });

      EmpresasXEmpresasFactory.getEmpresasXEmpresas()
        .success(function (Empresas) {
          $scope.selectEmpresas = Empresas;
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });

      if ($cookieStore.get('Session').IdTipoAcceso == 4 || $cookieStore.get('Session').IdTipoAcceso == 5 || $cookieStore.get('Session').IdTipoAcceso == 6) {
        Params.IdEmpresaUsuarioFinal = $cookieStore.get('Session').IdEmpresa;
        if (!$scope.BuscarProductos.IdFabricante) {
          $scope.BuscarProductos.IdFabricante = 0;
        }
        Params.IdFabricante = $scope.BuscarProductos.IdFabricante;
        PedidoDetallesFactory.postMonitor(Params)
          .success(function (result) {
            $scope.Pedidos = result.data[0];
            if (result == '') {
              $scope.Vacio = 0;
              $scope.EmpresaSelect = 'a';

            } else {
              $scope.Vacio = 1;
            }
          })
          .error(function (data, status, headers, config) {
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      }
    };

    $scope.init();

    $scope.ActualizarMonitor = function () {
      var flag = 0;
      if ($scope.EmpresaSelect == null) {
        flag = 1;
      }

      Params.IdEmpresaUsuarioFinal = $scope.EmpresaSelect;
      Params.IdEmpresaDistribuidor = $cookieStore.get('Session').IdEmpresa;

      if ($scope.EmpresaSelect === 0) {
        Params.IdEmpresaUsuarioFinal = $cookieStore.get('Session').IdEmpresa;
        Params.IdEmpresaDistribuidor = null;
      }
      if (!$scope.BuscarProductos.IdFabricante) {
        $scope.BuscarProductos.IdFabricante = 0;
      }
      Params.IdFabricante = $scope.BuscarProductos.IdFabricante;

      PedidoDetallesFactory.postMonitor(Params)
        .success(function (result) {
          $scope.Pedidos = result.data[0];
          if ($scope.EmpresaSelect == null || $scope.EmpresaSelect == 0) {
            $scope.Vacio = 1;
          } else {
            if (result == '') {
              $scope.Vacio = 0;
            } else {
              $scope.Vacio = 1;
            }
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.ActualizarCantidad = function (IdPedidoDetalle) {
      $scope.Pedidos.forEach(function (Pedido) {
        if (Pedido.IdPedidoDetalle == IdPedidoDetalle) {
          Pedido.MostrarCantidad = !Pedido.MostrarCantidad;
        }
      }, this);
    };

    $scope.Confirmar = function (IdPedidoDetalle) {
      $scope.Pedidos.forEach(function (Pedido) {
        if (Pedido.IdPedidoDetalle == IdPedidoDetalle) {
          Pedido.Mostrar = !Pedido.Mostrar;
        }
      }, this);
    };

    $scope.ActualizarPedidosAlCambiarMonedaOFormaPago = function (pedidoRecienActualizado) {
      for (var i = 0; i < $scope.Pedidos.length; i++) {
        if ($scope.Pedidos[i].IdPedido === pedidoRecienActualizado.IdPedido) {
          $scope.Pedidos[i].IdFormaPagoProxima = pedidoRecienActualizado.IdFormaPagoProxima;
          $scope.Pedidos[i].MonedaPagoProxima = pedidoRecienActualizado.MonedaPagoProxima;
        }
      }
    };

    $scope.ActualizarMoneda = function (pedido) {
      var APedido = {
        IdPedido: pedido.IdPedido,
        IdFormaPagoProxima: pedido.IdFormaPagoProxima,
        MonedaPagoProxima: pedido.MonedaPagoProxima
      };
      PedidosFactory.putPedidoPago(APedido)
        .success(function (result) {
          if (result.success === 0) {
            $scope.ShowToast(result.message, 'danger');
          } else {
            $scope.ActualizarPedidosAlCambiarMonedaOFormaPago(APedido);
            $scope.ShowToast(result.message, 'success');
          }
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde', 'danger');

          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.ActualizarPago = function (pedido) {
      var APedido = {
        IdPedido: pedido.IdPedido,
        IdFormaPagoProxima: pedido.IdFormaPagoProxima,
        MonedaPagoProxima: pedido.MonedaPagoProxima
      };
      PedidosFactory.putPedidoPago(APedido)
        .success(function (result) {
          if (result.success === 0) {
            $scope.ShowToast(result.message, 'danger');
          } else {
            $scope.ActualizarPedidosAlCambiarMonedaOFormaPago(APedido);
            $scope.ShowToast(result.message, 'success');
          }
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde', 'danger');

          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.ActualizarDetalle = function (Pedido) {
      if (Pedido.CantidadProxima <= 0 || Pedido.CantidadProxima === undefined || Pedido.CantidadProxima === null) {
        $scope.ShowToast('Cantidad no válida para el producto', 'danger');
        return false;
      }
      if (Pedido.CantidadProxima > Pedido.Cantidad) {
        $scope.ShowToast('No se puede actualizar a un numero mayor de suscripciones.', 'danger');
        return;
      }
      var PedidoActualizado =
        {
          IdPedidoDetalle: Pedido.IdPedidoDetalle,
          IdEmpresaUsuarioFinal: Pedido.IdEmpresaUsuarioFinal,
          MonedaCosto: Pedido.MonedaPrecio,
          CantidadProxima: Pedido.CantidadProxima,
          CargoRealizadoProximoPedido: Pedido.CargoRealizadoProximoPedido,
          IdEstatusPedido: 1
        };

      if (Pedido.Activo === 0) {
        PedidoActualizado.PorActualizarCantidad = 0;
      } else {
        if (Pedido.CantidadProxima === Pedido.Cantidad) {
          PedidoActualizado.PorActualizarCantidad = 0;
        } else {
          PedidoActualizado.PorActualizarCantidad = 1;
        }
      }

      PedidoDetallesFactory.putPedidoDetalle(PedidoActualizado)
        .success(function (PedidoDetalleSuccess) {

          if (PedidoDetalleSuccess.success == 1) {
            $scope.ShowToast(PedidoDetalleSuccess.message, 'success');
          }
          else {
            $scope.ShowToast(PedidoDetalleSuccess.message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde', 'danger');

          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.tomarFechaFin = function () {
      var FechaFin = new Date();
      FechaFin.setDate(22);
      FechaFin.setMonth(FechaFin.getMonth() + 2);

      return FechaFin;
    };

    $scope.CancelarPedido = function (Pedido) {
      $scope.Cancelar = true;
      $scope.guardar = Pedido;
      Pedido.Activo = 0;
      Pedido.PorCancelar = 1;
      $scope.form.habilitar = true;
      $scope.$emit('LOAD');
      PedidoDetallesFactory.putPedidoDetalle(Pedido)
        .success(function (result) {
          if (result.success == false) {
            $scope.ShowToast(result.message, 'danger');
          } else {
            $scope.ShowToast('Suscripción cancelada.', 'success');
          }
          $scope.$emit('UNLOAD');
          $scope.Cancelar = false;
          $scope.ActualizarMonitor();
          $scope.form.habilitar = false;
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.Reanudar = function (pedido) {
      pedido.Activo = 1;
      pedido.PorCancelar = 0;
      $scope.form.habilitar = true;
      if (pedido.Cantidad !== pedido.CantidadProxima) {
        pedido.PorActualizarCantidad = 1;
      }
      PedidoDetallesFactory.putPedidoDetalle(pedido)
        .success(function (result) {
          if (result.success == false) {
            $scope.ShowToast(result.message, 'danger');
          } else {
            $scope.ShowToast('Suscripción reanudada.', 'success');
          }
          $scope.form.habilitar = true;
          $scope.ActualizarMonitor();
          $scope.form.habilitar = false;
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.PedidoDetalleCancel = function () {
      $location.path("/PedidoDetalles");
    };

    $scope.IniciarTourMonitor = function () {
      $scope.Tour = new Tour({
        steps: [
          {
            element: ".selectOption",
            placement: "bottom",
            title: "Selecciona un cliente",
            content: "Para comenzar, selecciona un cliente para poder ver sus pedidos. Aquí podrás cancelar o renovar suscripciones, disminuir asientos para la renovación y consultar todos los pedidos generados.",
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

  MonitorReadController.$inject = ['$scope', '$log', '$cookieStore', '$location', 'EmpresasXEmpresasFactory', 'PedidoDetallesFactory', '$uibModal', '$filter', 'FabricantesFactory', 'PedidosFactory', 'EmpresasFactory'];

  angular.module('marketplace').controller('MonitorReadController', MonitorReadController);
}());

(function () {
  var PedidoDetallesReadController = function ($scope, $log, $location, $cookieStore, PedidoDetallesFactory, TipoCambioFactory, EmpresasXEmpresasFactory, EmpresasFactory, PedidosFactory, $routeParams) {
    $scope.CreditoValido = 1;
    $scope.error = false;
    $scope.Distribuidor = {};

    const error = function (error) {
      $scope.ShowToast(!error ? 'Ha ocurrido un error, intentelo mas tarde.' : error.message, 'danger');
      $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';
    };

    const getEnterprises = function () {
      return EmpresasFactory.getEmpresas()
        .then(function (result) {
          $scope.Distribuidor = result.data[0];
        })
        .catch(function (result) {
          error(result.data);
          $location.path('/Productos');
        });
    };

    const getOrderDetails = function (validate) {
      return PedidoDetallesFactory.getPedidoDetalles()
        .then(function (result) {
          if (result.data.success) {
            $scope.PedidoDetalles = result.data.data;
            $scope.PedidoDetalles.forEach(function (elem) {
              elem.Productos.forEach(function (item) {
                if (item.PrecioUnitario == null) $scope.error = true;
              });
            });
            if ($scope.error) {
              $scope.ShowToast('Ocurrio un error al procesar sus productos del carrito. Favor de contactar a soporte de CompuSoluciones.', 'danger');
            }
            if (!validate) $scope.ValidarFormaPago();
          } else {
            $scope.ShowToast(result.data.message, 'danger');
            $location.path('/Productos');
          }
        })
        .then(validarCarrito)
        .catch(function (result) { error(result.data); });
    };

    const validarCarrito = function () {
      return PedidoDetallesFactory.getValidarCarrito()
        .then(function (result) {
          if (result.data.success) {
            $scope.PedidoDetalles.forEach(function (item) {
              if ($scope.Distribuidor.IdFormaPagoPredilecta === 1 && item.MonedaPago !== 'Pesos') {
                $scope.ShowToast('Para pagar con tarjeta bancaria es necesario que los pedidos estén en pesos MXN. Actualiza tu forma de pago o cambia de moneda en los pedidos agregándolos una vez más.', 'danger');
              }
              $scope.CreditoValido = 1;
              item.hasCredit = 1;
              result.data.data.forEach(function (user) {
                if (item.IdEmpresaUsuarioFinal === user.IdEmpresaUsuarioFinal && !user.hasCredit) {
                  $scope.CreditoValido = 0;
                  item.hasCredit = 0;
                }
              });
            });
          } else {
            $scope.ShowToast('No pudimos validar tu carrito de compras, por favor intenta de nuevo.', 'danger');
            $location.path('/Productos');
          }
        })
        .catch(function (result) {
          error(result.data);
          $location.path('/Productos');
        });
    };

    $scope.init = function () {
      $scope.CheckCookie();
      PedidoDetallesFactory.getPrepararCompra(0)
        .then(getEnterprises)
        .then(getOrderDetails)
        .catch(function (result) { error(result.data); });
    };

    $scope.init();

    $scope.QuitarProducto = function (PedidoDetalle) {
      $scope.PedidoDetalles.forEach(function (order, indexOrder) {
        order.Productos.forEach(function (product, indexProduct) {
          if (product.IdPedidoDetalle === PedidoDetalle.IdPedidoDetalle) {
            $scope.PedidoDetalles[indexOrder].Productos.splice(indexProduct, 1);
            validarCarrito();
          }
          if ($scope.PedidoDetalles[indexOrder].Productos.length === 0) $scope.PedidoDetalles.splice(indexOrder, 1);
        });
      });

      PedidoDetallesFactory.deletePedidoDetalles(PedidoDetalle.IdPedidoDetalle)
        .success(function (PedidoDetalleResult) {
          if (!PedidoDetalleResult.success) {
            $scope.ShowToast(PedidoDetalleResult.message, 'danger');
            getOrderDetails(true);
          } else {
            $scope.ActualizarMenu();
            validarCarrito();
            $scope.ShowToast(PedidoDetalleResult.message, 'success');
          }
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos quitar el producto seleccionado. Intenta de nuevo más tarde.', 'danger');
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.ActualizarCodigo = function (value) {
      const order = {
        CodigoPromocion: value.CodigoPromocion,
        IdPedido: value.IdPedido
      };
      PedidosFactory.putCodigoPromocion(order)
        .then(function (result) {
          $scope.init();
          $scope.ShowToast(result.data.message, 'success');
        })
        .catch(function (result) { error(result.data); });
    };

    $scope.ValidarFormaPago = function () {
      var disabled = false;
      if ($scope.PedidoDetalles) {
        $scope.PedidoDetalles.forEach(function (order) {
          order.Productos.forEach(function (product) {
            if (product.IdTipoProducto === 3) {
              disabled = true;
              $scope.Distribuidor.IdFormaPago = 2;
            }
          });
        });
      }
      return disabled;
    };

    $scope.ActualizarFormaPago = function (IdFormaPago) {
      var empresa = { IdFormaPagoPredilecta: IdFormaPago };
      EmpresasFactory.putEmpresaFormaPago(empresa)
        .then(function (result) {
          if (result.data.success) {
            $scope.ShowToast(result.data.message, 'success');
            getOrderDetails();
          } else $scope.ShowToast(result.data.message, 'danger');
        })
        .catch(function (result) { error(result.data); });
    };

    $scope.modificarContratoBase = function (IdProducto, IdPedidoDetalle) {
      $location.path('/autodesk/productos/' + IdProducto + '/detalle/' + IdPedidoDetalle);
    };

    $scope.calcularSubTotal = function (IdPedido) {
      let total = 0;
      $scope.PedidoDetalles.forEach(function (order) {
        order.Productos.forEach(function (product) {
          if (order.IdPedido === IdPedido && !product.PrimeraCompraMicrosoft) {
            total = total + (product.PrecioUnitario * product.Cantidad);
          }
        });
      });
      return total;
    };

    $scope.calcularIVA = function (IdPedido) {
      let total = $scope.calcularSubTotal(IdPedido);
      if ($scope.Distribuidor.ZonaImpuesto === 'Normal') total = 0.16 * total;
      if ($scope.Distribuidor.ZonaImpuesto === 'Nacional') total = 0.16 * total;
      if ($scope.Distribuidor.ZonaImpuesto === 'Frontera') total = 0.11 * total;
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

    $scope.next = function () {
      if ($scope.Distribuidor.IdFormaPagoPredilecta === 2) validarCarrito();
      let next = true;
      if (!$scope.PedidoDetalles || $scope.PedidoDetalles.length === 0) next = false;
      else {
        $scope.PedidoDetalles.forEach(function (order) {
          if (!order.IdEmpresaUsuarioFinal) next = false;
          order.Productos.forEach(function (product) {
            if (product.Cantidad <= 0) next = false;
          });
        });
      }
      if (!next) {
        $scope.ShowToast('Revisa que tengas al menos un producto y que tenga un cliente seleccionado con crédito válido.', 'warning');
      } else $location.path('/Comprar');
    };

    $scope.IniciarTourCarrito = function () {
      $scope.Tour = new Tour({

        steps: [{
          element: '.formaPago',
          placement: 'rigth',
          title: 'Forma de pago del distribuidor',
          content: 'Selecciona la forma de pago predilecta para tu empresa, esta es una configuración única para toda la compañia. Si seleccionas pago con tarjeta bancaria tendrás que tener tus pedidos en pesos MXN, si requieres pagar en dolares USD podrás utilizar crédito CompuSoluciones.',
          template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Atrás</button><button class='btn btn-default' data-role='next'>Sig »</button><button class='btn btn-default' data-role='end'>Finalizar</button></nav></div></div>"
        }],

        backdrop: true,
        storage: false
      });

      $scope.Tour.init();
      $scope.Tour.start();
    };
  };

  PedidoDetallesReadController.$inject = ['$scope', '$log', '$location', '$cookieStore', 'PedidoDetallesFactory', 'TipoCambioFactory', 'EmpresasXEmpresasFactory', 'EmpresasFactory', 'PedidosFactory', '$routeParams'];

  angular.module('marketplace').controller('PedidoDetallesReadController', PedidoDetallesReadController);
}());

(function () {
  var PedidoDetallesUFReadController = function ($scope, $log, $location, $cookieStore, ComprasUFFactory, EmpresasFactory, $routeParams) {
    $scope.currentDistribuidor = $cookieStore.get('currentDistribuidor');
    $scope.TotalEnPesos = 0;
    $scope.SubtotalEnPesos = 0;
    $scope.IVA = 0;
    $scope.CarritoValido = false;

    $scope.validarCarrito = function () {
      EmpresasFactory.getValidarCreditoUF($scope.currentDistribuidor.IdEmpresa)
        .success(function (validacion) {
          $scope.TotalEnPesos = validacion.data.TotalActualEnSuCarrito;
          $scope.SubtotalEnPesos = validacion.data.SubtotalActualEnSuCarrito;
          $scope.IVA = validacion.data.IVA;
          if (!validacion.success) {
            $scope.CarritoValido = false;
            $scope.ShowToast('Haz llegado a tu tope de compras, por favor elimina productos de tu carrito o ponte en contacto con tu distribuidor.', 'danger');
          } else {
            $scope.CarritoValido = true;
          }
        })
        .error(function (data, status, headers, config) {
          $scope.CarritoValido = false;
          $scope.ShowToast('No pudimos validar tu carrito de compras, por favor intenta de nuevo refrescando tu página.', 'danger');
          $location.path('/uf/Productos');
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.init = function () {
      $scope.CheckCookie();
      $scope.validarCarrito();
      ComprasUFFactory.getComprasUF($scope.currentDistribuidor.IdEmpresa, 0)
        .success(function (carritoDeCompras) {
          if (carritoDeCompras.success) {
            $scope.PedidoDetalles = carritoDeCompras.data[0];
            if (!$scope.PedidoDetalles.length) { $scope.CarritoValido = false; }
            $scope.ActualizarMenu();
          } else {
            $scope.CarritoValido = false;
            $scope.ShowToast(carritoDeCompras.message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos preparar tu información, por favor intenta de nuevo más tarde.', 'danger');
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.init();

    $scope.QuitarProducto = function (PedidoDetalle) {
      $scope.PedidoDetalles.forEach(function (Elemento, Index) {
        if (Elemento.IdCompraUF === PedidoDetalle.IdCompraUF) {
          $scope.PedidoDetalles.splice(Index, 1);
          return false;
        }
      });

      ComprasUFFactory.deleteComprasUF(PedidoDetalle.IdCompraUF)
        .success(function (PedidoDetalleResult) {
          if (PedidoDetalleResult.success) {
            $scope.ActualizarMenu();
            $scope.validarCarrito();
            $scope.ShowToast('Producto eliminado de tu carrito de compras.', 'success');
          } else {
            $scope.ShowToast(PedidoDetalleResult.message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos quitar el producto seleccionado. Intenta de nuevo más tarde.', 'danger');
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.Siguiente = function () {
      if ($scope.CarritoValido) {
        $location.path('/uf/Comprar');
      } else {
        $scope.ShowToast('Revisa que tengas al menos un producto y que tenga un cliente seleccionado con crédito válido.', 'warning');
      }
    };
  };

  PedidoDetallesUFReadController.$inject = ['$scope', '$log', '$location', '$cookieStore', 'ComprasUFFactory', 'EmpresasFactory', '$routeParams'];

  angular.module('marketplace').controller('PedidoDetallesUFReadController', PedidoDetallesUFReadController);
}());

(function () {
  var PowerBIReadController = function ($scope, $log, $cookieStore, $location, $uibModal, $filter, PedidoDetallesFactory, $routeParams) {

    $scope.init = function () {

    };
    $scope.init();
  };

  PowerBIReadController.$inject = ['$scope', '$log', '$cookieStore', '$location', '$uibModal', '$filter', 'PedidoDetallesFactory', '$routeParams'];

  angular.module('marketplace').controller('PowerBIReadController', PowerBIReadController);
}());

(function () {
  var ProductoGuardadosReadController = function ($scope, $log, $location, $cookieStore, ProductoGuardadosFactory, PedidoDetallesFactory) {

    $scope.sortBy = 'Nombre';
    $scope.reverse = false;

    $scope.init = function () {
      $scope.CheckCookie();

      ProductoGuardadosFactory.getProductoGuardados()
        .success(function (ProductoGuardados) {
          $scope.ProductoGuardados = ProductoGuardados;
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.init();

    $scope.OrdenarPor = function (Atributo) {
      $scope.sortBy = Atributo;
      $scope.reverse = !$scope.reverse;
    };

    $scope.AgregarCarrito = function (Producto) {
      var ProductoGuardado = { IdPedido: $cookieStore.get('Pedido').IdPedidoActual, IdProducto: Producto.IdProducto, Cantidad: 1 };

      PedidoDetallesFactory.postPedidoDetalle(ProductoGuardado)
        .success(function (PedidoDetalleResult) {
          if (PedidoDetalleResult[0].Success == true) {
            $scope.ShowToast(PedidoDetalleResult[0].Message + " podrás cambiar la cantidad desde ahí", 'success');
            $scope.ActualizarMenu();
          }
          else {
            $scope.ShowToast(PedidoDetalleResult[0].Message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos agregar este producto a tu carrito de compras, por favor intenta de nuevo más tarde.', 'danger');

          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.QuitarProducto = function (ProductoQuitar) {
      $scope.ProductoGuardados.forEach(function (Elemento, Index) {

        if (Elemento.IdProductoGuardado == ProductoQuitar.IdProductoGuardado) {
          $scope.ProductoGuardados.splice(Index, 1);
          return false;
        }
      });

      ProductoGuardadosFactory.putProductoGuardado(ProductoQuitar)
        .success(function (PedidoGuardadoResult) {
          if (PedidoGuardadoResult[0].Success == false) {
            $scope.init();
            $scope.ShowToast(PedidoGuardadoResult[0].Message, 'danger');
          }
          else {
            $scope.ShowToast(PedidoGuardadoResult[0].Message, 'success');
          }
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos quitar el producto seleccionado. Intenta de nuevo más tarde.', 'danger');

          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };
  };

  ProductoGuardadosReadController.$inject = ['$scope', '$log', '$location', '$cookieStore', 'ProductoGuardadosFactory', 'PedidoDetallesFactory'];

  angular.module('marketplace').controller('ProductoGuardadosReadController', ProductoGuardadosReadController);
}());

(function () {
  var ConfigurarBaseController = function ($scope, $log, $location, $cookieStore, $routeParams, ProductosFactory, FabricantesFactory, TiposProductosFactory, PedidoDetallesFactory, TipoCambioFactory, ProductoGuardadosFactory, EmpresasXEmpresasFactory) {
    var IdProducto = $routeParams.IdProducto;
    var IdPedidoDetalle = $routeParams.IdPedidoDetalle;
    $scope.init = function () {
      ProductosFactory.getBaseSubscription(IdProducto)
        .then(function (result) {
          $scope.suscripciones = result.data.data;
          console.log($scope.suscripciones);
          console.log(result);
        })
        .catch(console.log);
    };

    $scope.init();

    $scope.actualizarBase = function (IdPedidoDetalleBase) {
      ProductosFactory.putBaseSubscription({ IdPedidoDetalle: IdPedidoDetalle, IdPedidoDetalleBase: IdPedidoDetalleBase })
        .then(function (resultadoUpdate) {
          if (resultadoUpdate.data.success) {
            $scope.ShowToast(resultadoUpdate.data.message, 'success');
            $location.path('/Carrito');
          } else {
            $scope.ShowToast(resultadoUpdate.data.message, 'danger');
          }
        })
        .catch(console.log);
    };


  };

  ConfigurarBaseController.$inject = ['$scope', '$log', '$location', '$cookieStore', '$routeParams', 'ProductosFactory', 'FabricantesFactory', 'TiposProductosFactory', 'PedidoDetallesFactory', 'TipoCambioFactory', 'ProductoGuardadosFactory', 'EmpresasXEmpresasFactory'];

  angular.module('marketplace').controller('ConfigurarBaseController', ConfigurarBaseController);
}());

(function () {
  var MisProductosReadController = function ($scope, $log, $location, $cookieStore, $routeParams, ProductosFactory) {
    $scope.sortBy = 'Nombre';
    $scope.reverse = false;
    $scope.precioCalculado;
    $scope.porcentaje;
    porcentajeAnterior = null;

    $scope.init = function () {
      $scope.btnGuardar = true;
      $scope.porcentaje = porcentajeAnterior = null;
      $scope.CheckCookie();
      ProductosFactory.getMisProductos()
        .success(function (misProductos) {
          $scope.Productos = misProductos.data;
        })
        .error(function (data, status, headers, config) {
          $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';
          $scope.ShowToast('No pudimos cargar la lista de productos, por favor intenta de nuevo más tarde.', 'danger');
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.OrdenarPor = function (Atributo) {
      $scope.sortBy = Atributo;
      $scope.reverse = !$scope.reverse;
    };

    $scope.init();

    function esNumerico(numero) {
      try {
        return (numero - 0) === numero && ('' + numero).trim().length > 0;
      } catch (error) {
        return false;
      }
    }

    function decimalesValidos(numero) {
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
        porcentajeAnterior = $scope.porcentaje;
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
          producto.Moneda = "";
          producto.Precio = null;
          $scope.btnGuardar = true;
        }, this);
        $scope.porcentaje = porcentajeAnterior = null;
      }
      else {
        $scope.porcentaje = porcentajeAnterior;
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
      }
      else {
        $scope.precioCalculado = false;
        $scope.Productos.forEach(function (producto) {
          producto.Moneda = '';
          producto.Precio = null;
        }, this);
      }
    };

    $scope.actualizarTodos = function (Productos) {
      ProductosFactory.putMisProductos(Productos)
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
            template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Atrás</button><button class='btn btn-default' data-role='next'>Sig »</button><button class='btn btn-default' data-role='end'>Finalizar</button></nav></div></div>",
          },
          {
            element: '.btnReset',
            placement: 'left',
            title: 'Restaurar',
            content: 'En caso de no querer guardar los cambios realizados por la calculadora, puede regresar a ver los precios que ya tenía guardados.',
            template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Atrás</button><button class='btn btn-default' data-role='next'>Sig »</button><button class='btn btn-default' data-role='end'>Finalizar</button></nav></div></div>",
          },
          {
            element: '.btnSaveAll',
            placement: 'left',
            title: 'Guardar todo',
            content: 'Esta opción le permite guardar todos los precios calculados, sin necesidad de ir presionando el botón de guardado en cada producto.',
            template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Atrás</button><button class='btn btn-default' data-role='next'>Sig »</button><button class='btn btn-default' data-role='end'>Finalizar</button></nav></div></div>",
          },

        ],
        backdrop: true,
        storage: false,
      });

      $scope.Tour.init();
      $scope.Tour.start();
    };

  };

  MisProductosReadController.$inject = ['$scope', '$log', '$location', '$cookieStore', '$routeParams', 'ProductosFactory'];

  angular.module('marketplace').controller('MisProductosReadController', MisProductosReadController);
}());

(function () {
  var ProductosReadController = function ($scope, $log, $location, $cookieStore, $routeParams, ProductosFactory, FabricantesFactory, TiposProductosFactory, PedidoDetallesFactory, TipoCambioFactory, ProductoGuardadosFactory, EmpresasXEmpresasFactory, UsuariosFactory, $anchorScroll) {
    var BusquedaURL = $routeParams.Busqueda;
    $scope.BuscarProductos = {};
    $scope.Pagina = 0;
    $scope.sortBy = 'Nombre';
    $scope.reverse = false;
    $scope.TipoCambio = 0;
    $scope.TipoCambioMs = 0;
    $scope.Mensaje = '...';
    $scope.selectProductos = {};
    $scope.TieneContrato = true;
    $scope.IdPedidoContrato = 0;

    $scope.BuscarProducto = function (ResetPaginado) {
      $scope.Mensaje = 'Buscando...';

      if (ResetPaginado == true) {
        $scope.Pagina = 0;
        $scope.BuscarProductos.Offset = $scope.Pagina * 6;
      }

      ProductosFactory.postBuscarProductos($scope.BuscarProductos)
        .success(function (Productos) {
          if (Productos.success === 1) {
            $scope.Productos = Productos.data[0].map(function (item) {
              item.IdPedidoContrato = 0;
              item.TieneContrato = true;
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
          $scope.TipoCambioMs = TipoCambio.DolarMS;
        })
        .error(function (data, status, headers, config) {
          $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';
          $scope.ShowToast('No pudimos obtener el tipo de cambio, por favor intenta una vez más.', 'danger');
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.init = function () {
      $scope.CheckCookie();

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

      EmpresasXEmpresasFactory.getClients()
        .success(function (Empresas) {
          $scope.selectEmpresas = Empresas.data;
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos cargar la información de tus clientes, por favor intenta de nuevo más tarde.', 'danger');

          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });

      $scope.BuscarProductos.IdProducto = undefined;
      $scope.BuscarProductos.IdFabricante = $scope.BuscarProductos.IdFabricante;
      $scope.BuscarProductos.IdTipoProducto = $scope.BuscarProductos.IdTipoProducto;
      $scope.BuscarProductos.Offset = $scope.Pagina * 6;

      if (BusquedaURL != 'undefined') {
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

    $scope.revisarProducto = function (Producto) {
      var IdProducto = Producto.IdProducto;
      var IdEmpresaUsuarioFinal = Producto.IdEmpresaUsuarioFinal;
      ProductosFactory.getProductContracts(IdEmpresaUsuarioFinal, IdProducto)
        .success(function (respuesta) {
          if (respuesta.success === 1) {
            Producto.contratos = respuesta.data;
            console.log(respuesta);
            if (Producto.contratos.length >= 1) {
              Producto.TieneContrato = true;
              Producto.IdPedidoContrato = respuesta.data[0].IdPedido;
            }
            if ((Producto.IdAccionAutodesk === 2 || !Producto.IdAccionAutodesk) && Producto.contratos.length === 0) {
              Producto.TieneContrato = false;
            }
            if (Producto.IdAccionAutodesk === 1) Producto.contratos.unshift({ IdPedido: 0, ResultadoFabricante6: 'Nuevo contrato...' });
          } else {
            $scope.ShowToast('No pudimos cargar la información de tus contratos, por favor intenta de nuevo más tarde.', 'danger');
          }
        })
        .error(function () {
          $scope.ShowToast('No pudimos cargar la información de tus contratos, por favor intenta de nuevo más tarde.', 'danger');
        });
      UsuariosFactory.getUsuariosContacto(Producto.IdEmpresaUsuarioFinal)
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

    $scope.CalcularPrecioTotal = function (Precio, Cantidad, MonedaPago, MonedaProducto, TipoCambio) {
      var total = 0.0;

      if (MonedaPago === 'Pesos' && MonedaProducto === 'Dólares') {
        Precio = Precio * TipoCambio;
      }

      if (MonedaPago === 'Dólares' && MonedaProducto === 'Pesos') {
        Precio = Precio / TipoCambio;
      }

      total = Precio * Cantidad;
      if (!total) { total = 0.00; }
      return total;
    };

    $scope.AgregarCarrito = function (Producto, Cantidad, IdPedidocontrato) {
      var NuevoProducto = {
        IdProducto: Producto.IdProducto,
        Cantidad: Cantidad,
        IdEmpresaUsuarioFinal: Producto.IdEmpresaUsuarioFinal,
        MonedaPago: Producto.MonedaPago,
        IdEsquemaRenovacion: Producto.IdEsquemaRenovacion,
        IdFabricante: Producto.IdFabricante,
        CodigoPromocion: Producto.CodigoPromocion,
        ResultadoFabricante2: Producto.IdProductoPadre,
        Especializacion: Producto.Especializacion,
        IdUsuarioContacto: Producto.IdUsuarioContacto,
        IdAccionAutodesk: Producto.IdAccionAutodesk
      };
      if (!Producto.IdUsuarioContacto && Producto.IdFabricante === 2 && Producto.TieneContrato) {
        const contrato = Producto.contratos
          .filter(function (p) {
            return Producto.IdPedidoContrato === p.IdPedido;
          })[0].ResultadoFabricante6;
        console.log(Producto.contratos, IdPedidocontrato, contrato);
        NuevoProducto.ContratoBaseAutodesk = contrato.trim();
        // NuevoProducto.IdAccionAutodesk = Producto.IdAccionProductoAutodesk === 1 ? 3 : 2;
      }
      if (Producto.IdFabricante === 2 && Producto.IdAccionAutodesk === 2 && !Producto.TieneContrato) {
        return $scope.ShowToast('No cuentas con un contrato para este producto.', 'danger');
      }
      if (!NuevoProducto.IdAccionAutodesk) delete NuevoProducto.IdAccionAutodesk;
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
                })
                .catch(console.log);
            }
            console.log(PedidoDetalleResult);
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

    $scope.AgregarGuardados = function (IdProductoSeleccionado) {
      var ProductoGuardado = { IdProducto: IdProductoSeleccionado };
      ProductoGuardadosFactory.postProductoGuardado(ProductoGuardado)
        .success(function (PedidoDetalleResult) {
          if (PedidoDetalleResult[0].Success == true) {
            $scope.ShowToast(PedidoDetalleResult[0].Message, 'success');
          } else {
            $scope.ShowToast(PedidoDetalleResult[0].Message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';

          $scope.ShowToast('No se pudo agregar este producto en la lista, por favor intenta de nuevo más tarde.', 'danger');

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

      function currentYPosition() {
        if (self.pageYOffset) return self.pageYOffset;

        if (document.documentElement && document.documentElement.scrollTop)
          return document.documentElement.scrollTop;

        if (document.body.scrollTop) return document.body.scrollTop;
        return 0;
      }

      function elmYPosition(eID) {
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

    $scope.IniciarTourProducts = function () {
      $scope.Tour = new Tour({

        steps: [
          {
            element: '.filterOption',
            placement: 'bottom',
            title: 'Filtra por fabricante',
            content: 'Puedes filtrar tu búsqueda por fabricante o marca para ser más preciso.',
            template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Atrás</button><button class='btn btn-default' data-role='next'>Sig »</button><button class='btn btn-default' data-role='end'>Finalizar</button></nav></div></div>",
          },
          {
            element: '.typeOptions',
            placement: 'bottom',
            title: 'Filtra por un tipo de producto',
            content: 'Puedes hacer un filtrado por los tipos de producto que requieras; suscripción o complementos.',
            template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Atrás</button><button class='btn btn-default' data-role='next'>Sig »</button><button class='btn btn-default' data-role='end'>Finalizar</button></nav></div></div>",
          },
          {
            element: '.favoriteOption',
            placement: 'left',
            title: 'Agregar a favoritos',
            content: 'Al agregar un producto a favoritos se guardará en tu lista de favoritos que podrás consultar en la parte superior derecha de la pagina, en el menú del carrito de compras.',
            template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Atrás</button><button class='btn btn-default' data-role='next'>Sig »</button><button class='btn btn-default' data-role='end'>Finalizar</button></nav></div></div>",
          },
          {
            element: '.ufs',
            placement: 'bottom',
            title: 'Selecciona el cliente',
            content: 'Una vez establecida la cantidad, selecciona a que usuario final va destinado este producto.',
            template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Atrás</button><button class='btn btn-default' data-role='next'>Sig »</button><button class='btn btn-default' data-role='end'>Finalizar</button></nav></div></div>",
          },
          {
            element: '.addOption',
            placement: 'bottom',
            title: 'Agregar al carrito',
            content: 'Una vez configurado tu producto, agregalo al carrito de compras.',
            template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Atrás</button><button class='btn btn-default' data-role='next'>Sig »</button><button class='btn btn-default' data-role='end'>Finalizar</button></nav></div></div>",
          },

        ],

        backdrop: true,
        storage: false,
      });

      $scope.Tour.init();
      $scope.Tour.start();
    };
  };

  ProductosReadController.$inject = ['$scope', '$log', '$location', '$cookieStore', '$routeParams', 'ProductosFactory', 'FabricantesFactory', 'TiposProductosFactory', 'PedidoDetallesFactory', 'TipoCambioFactory', 'ProductoGuardadosFactory', 'EmpresasXEmpresasFactory', 'UsuariosFactory', '$anchorScroll'];

  angular.module('marketplace').controller('ProductosReadController', ProductosReadController);
}());

(function () {
  var ProductosUFReadController = function ($scope, $log, $location, $cookieStore, $routeParams, ProductosXEmpresaFactory, FabricantesFactory, TiposProductosFactory, PedidoDetallesFactory, TipoCambioFactory, ProductoGuardadosFactory, EmpresasXEmpresasFactory, $anchorScroll, ProductosFactory, ComprasUFFactory) {
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
            $scope.Productos = Productos.data[0];
            if ($scope.Productos.length === 0) {
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

    $scope.revisarProducto = function (Producto) {
      var IdProducto = Producto.IdProducto;

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

    $scope.CalcularPrecioTotal = function (Precio, Cantidad, MonedaCompra, MonedaProducto, TipoCambio) {
      var total = 0.0;

      if (MonedaCompra === 'Pesos' && MonedaProducto === 'Dólares') {
        Precio = Precio * TipoCambio;
      }

      if (MonedaCompra === 'Dólares' && MonedaProducto === 'Pesos') {
        Precio = Precio / TipoCambio;
      }

      total = Precio * Cantidad;

      if (!total) { total = 0.00; }

      return total;
    };

    $scope.AgregarCarrito = function (Producto, Cantidad) {
      if (!Producto.IdProducto) { $scope.ShowToast('Selecciona un producto', 'danger'); return; }
      if (Producto.Cantidad <= 0) { $scope.ShowToast('Escribe una cantidad válida', 'danger'); return; }
      if (!Producto.MonedaCompra) { $scope.ShowToast('Selecciona una moneda', 'danger'); return; }
      var NuevoProducto = {
        IdProducto: Producto.IdProducto,
        Cantidad: Producto.Cantidad,
        IdEmpresaDistribuidor: $scope.currentDistribuidor.IdEmpresa,
        MonedaCompra: Producto.MonedaCompra
      };
      ComprasUFFactory.postComprasUF(NuevoProducto)
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

      function currentYPosition() {
        if (self.pageYOffset) { return self.pageYOffset; }

        if (document.documentElement && document.documentElement.scrollTop) {
          return document.documentElement.scrollTop;
        }

        if (document.body.scrollTop) { return document.body.scrollTop; }
        return 0;
      }

      function elmYPosition(eID) {
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
    ['$scope', '$log', '$location', '$cookieStore', '$routeParams', 'ProductosXEmpresaFactory', 'FabricantesFactory', 'TiposProductosFactory', 'PedidoDetallesFactory', 'TipoCambioFactory', 'ProductoGuardadosFactory', 'EmpresasXEmpresasFactory', '$anchorScroll', 'ProductosFactory', 'ComprasUFFactory'];

  angular.module('marketplace').controller('ProductosUFReadController', ProductosUFReadController);
}());

(function () {
  var PromocionsCreateController = function ($scope, $log, $cookieStore, $location, PromocionsFactory, FileUploader, AccesosAmazonFactory) {
    $scope.Promocion = {};
    $scope.IdPromocionNueva = 0;
    $scope.SubiendoArchivos = false;

    $scope.init = function () {
      $scope.CheckCookie();
    };

    $scope.init();

    var uploader = $scope.uploader = new FileUploader({
    });
    uploader.filters.push({
      name: 'imageFilter',
      fn: function (item /* {File|FileLikeObject}*/, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return this.queue.length < 1 && '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    uploader.onWhenAddingFileFailed = function (item /* {File|FileLikeObject}*/, filter, options) {

    };

    uploader.onAfterAddingFile = function (fileItem) {

    };

    uploader.onAfterAddingAll = function (addedFileItems) {

    };

    uploader.onBeforeUploadItem = function (item) {
      var extension = item.file.name.split('.');
      item.file.name = $scope.Promocion.IdPromocionNueva + '.' + extension[1];
    };

    uploader.onProgressItem = function (fileItem, progress) {

    };

    uploader.onProgressAll = function (progress) {

    };

    uploader.onSuccessItem = function (fileItem, response, status, headers) {

    };

    uploader.onErrorItem = function (fileItem, response, status, headers) {

    };

    uploader.onCancelItem = function (fileItem, response, status, headers) {

    };

    uploader.onCompleteItem = function (fileItem, response, status, headers) {
      AccesosAmazonFactory.getAccesosAmazon()
        .success(function (result) {
          if (result[0].Success == true) {
            subirImagen(fileItem, result);
          } else {
            $scope.ShowToast(result[0].Message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('Error al intentar subir la imagen.', 'danger');
        });
    };

    uploader.onCompleteAll = function () {

    };

    /* app.directive('ngThumb', ['$window', function ($window) {
      var helper = {
        support: !!($window.FileReader && $window.CanvasRenderingContext2D),
        isFile: function (item) {
          return angular.isObject(item) && item instanceof $window.File;
        },
        isImage: function (file) {
          var type = '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
          return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
      };

      return {
        restrict: 'A',
        template: '<canvas/>',
        link: function (scope, element, attributes) {
          if (!helper.support) return;

          var params = scope.$eval(attributes.ngThumb);

          if (!helper.isFile(params.file)) return;
          if (!helper.isImage(params.file)) return;

          var canvas = element.find('canvas');
          var reader = new FileReader();

          reader.onload = onLoadFile;
          reader.readAsDataURL(params.file);

          function onLoadFile (event) {
            var img = new Image();
            img.onload = onLoadImage;
            img.src = event.target.result;
          }

          function onLoadImage () {
            var width = params.width || this.width / this.height * params.height;
            var height = params.height || this.height / this.width * params.width;
            canvas.attr({ width: width, height: height });
            canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
          }
        }
      };
    }]);
*/
    $scope.PromocionCreate = function () {
      if (($scope.frm.$invalid)) {
        if ($scope.frm.Nombre.$invalid == true) {
          $scope.frm.Nombre.$pristine = false;
        }
        if ($scope.frm.CodigoProducto.$invalid == true) {
          $scope.frm.CodigoProducto.$pristine = false;
        }
        $scope.ShowToast('Datos inválidos, favor de verificar', 'danger');
      } else {
        $scope.SubiendoArchivos = true;
        var fileChooser = document.getElementById('archivo_promocion');
        var file = fileChooser.files[0];
        if (file) {
          if (!(/\.(jpeg|jpg|png)$/i.test(file.name))) {
            $scope.SubiendoArchivos = false;
            $scope.ShowToast('Extensión de archivo no válida', 'danger');
          } else {
            PromocionsFactory.postPromocion($scope.Promocion)
              .success(function (result) {
                if (result[0].Success == true) {
                  $scope.Promocion.IdPromocionNueva = result[0].Dato;
                  $scope.Promocion.Url = result[0].Dato;
                  $scope.Promocion.IdPromocion = result[0].Dato;
                  uploader.queue[0].upload();
                } else {
                  $scope.ShowToast(result[0].Message, 'danger');
                }
                $scope.SubiendoArchivos = false;
              })
              .error(function (data, status, headers, config) {
                $scope.SubiendoArchivos = false;
                $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
              });
          }
        } else {
          $scope.SubiendoArchivos = false;
          $scope.ShowToast('Debe adjuntar un archivo', 'danger');
        }
      }
    };

    $scope.PromocionCancel = function () {
      $location.path('/Promocions');
    };

    function subirImagen(fileItem, data) {
      var fileChooser = document.getElementById('archivo_promocion');
      var file = fileChooser.files[0];
      $scope.Promocion.Url = 'https://s3.amazonaws.com/marketplace.compusoluciones.com/Anexos/' + fileItem.file.name;
      AWS.config.update({ accessKeyId: data[0].AccessKey, secretAccessKey: data[0].SecretAccess });
      var bucketName = data[0].Bucket;
      var bucket = new AWS.S3({ params: { Bucket: bucketName } });
      var objKey = 'Anexos' + '/' + fileItem.file.name;
      var params = { Key: objKey, ContentType: fileItem.type, Body: file, ACL: 'public-read' };
      bucket.putObject(params, function (err, data) {
        if (err) {
          $scope.ShowToast(err, 'danger');
        } else {
          PromocionsFactory.putPromocion($scope.Promocion)
            .success(function (result) {
              if (result[0].Success == true) {
                $location.path('/Promocions');
                $scope.ShowToast('Promoción registrada', 'success');
              } else {
                $scope.ShowToast(result[0].Message, 'danger');
              }
            });
        }
      });
    }
  };

  PromocionsCreateController.$inject = ['$scope', '$log', '$cookieStore', '$location', 'PromocionsFactory', 'FileUploader', 'AccesosAmazonFactory'];

  angular.module('marketplace').controller('PromocionsCreateController', PromocionsCreateController);
}());

(function () {

  var PromocionsReadController = function ($scope, $log, $location, $cookieStore, PromocionsFactory) {
    $scope.sortBy = 'Nombre';
    $scope.reverse = false;

    $scope.init = function () {
      $scope.CheckCookie();

      PromocionsFactory.getPromocions()
        .success(function (Promocions) {
          $scope.Promocions = Promocions;
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.init();

    $scope.OrdenarPor = function (Atributo) {
      $scope.sortBy = Atributo;
      $scope.reverse = !$scope.reverse;
    };
  };

  PromocionsReadController.$inject = ['$scope', '$log', '$location', '$cookieStore', 'PromocionsFactory'];

  angular.module('marketplace').controller('PromocionsReadController', PromocionsReadController);
}());

(function () {
  var PromocionsUpdateController = function ($scope, $log, $location, $cookieStore, $routeParams, PromocionsFactory, FileUploader, AccesosAmazonFactory) {

    var IdPromocion = $routeParams.IdPromocion;
    $scope.Promocion = {};
    var uploader = $scope.uploader = new FileUploader({
    });

    uploader.filters.push({
      name: 'imageFilter',
      fn: function (item /*{File|FileLikeObject}*/, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return this.queue.length < 1 && '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {

    };

    uploader.onAfterAddingFile = function (fileItem) {

    };

    uploader.onAfterAddingAll = function (addedFileItems) {

    };

    uploader.onBeforeUploadItem = function (item) {

    };

    uploader.onProgressItem = function (fileItem, progress) {

    };

    uploader.onProgressAll = function (progress) {

    };

    uploader.onSuccessItem = function (fileItem, response, status, headers) {

    };

    uploader.onErrorItem = function (fileItem, response, status, headers) {

    };

    uploader.onCancelItem = function (fileItem, response, status, headers) {

    };

    uploader.onCompleteItem = function (fileItem, response, status, headers) {
      $scope.Promocion.Url = 'uploads/' + fileItem.file.name;
    };

    uploader.onCompleteAll = function () {

    };

    /* app.directive('ngThumb', ['$window', function ($window) {
      var helper = {
        support: !!($window.FileReader && $window.CanvasRenderingContext2D),
        isFile: function (item) {
          return angular.isObject(item) && item instanceof $window.File;
        },
        isImage: function (file) {
          var type = '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
          return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
      };

      return {
        restrict: 'A',
        template: '<canvas/>',
        link: function (scope, element, attributes) {
          if (!helper.support) return;

          var params = scope.$eval(attributes.ngThumb);

          if (!helper.isFile(params.file)) return;
          if (!helper.isImage(params.file)) return;

          var canvas = element.find('canvas');
          var reader = new FileReader();

          reader.onload = onLoadFile;
          reader.readAsDataURL(params.file);

          function onLoadFile(event) {
            var img = new Image();
            img.onload = onLoadImage;
            img.src = event.target.result;
          }

          function onLoadImage() {
            var width = params.width || this.width / this.height * params.height;
            var height = params.height || this.height / this.width * params.width;
            canvas.attr({ width: width, height: height });
            canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
          }
        }
      };
    }]);
*/
    $scope.init = function () {
      $scope.CheckCookie();

      PromocionsFactory.getPromocion(IdPromocion)
        .success(function (Promocion) {
          $scope.Promocion = Promocion[0];
          $scope.Promocion.estatusImagen = 1;
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.init();


    $scope.PromocionUpdate = function () {
      if (($scope.frm.$invalid)) {
        if ($scope.frm.Nombre.$invalid == true) {
          $scope.frm.Nombre.$pristine = false;
        }
        if ($scope.frm.CodigoProducto.$invalid == true) {
          $scope.frm.CodigoProducto.$pristine = false;
        }
        $scope.ShowToast("Datos inválidos, favor de verificar", 'danger');
      }
      else {
        PromocionsFactory.putPromocion($scope.Promocion)
          .success(function (result) {
            if (result[0].Success == true) {
              $location.path("/Promocions");
              $scope.ShowToast(result[0].Message, 'success');
            }
            else {
              $scope.ShowToast(result[0].Message, 'danger');
            }
          })
          .error(function (data, status, headers, config) {
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      }
    };

    $scope.PromocionDelete = function () {
      $scope.Promocion.Activo = 0;
      PromocionsFactory.putPromocion($scope.Promocion)
        .success(function (result) {

          if (result[0].Success == true) {
            $location.path("/Promocions");
            $scope.ShowToast("Promoción dada de baja", 'success');
          }
          else {
            $scope.ShowToast(result[0].Message, 'danger');
          }

        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });

      AccesosAmazonFactory.getAccesosAmazon()
        .success(function (result) {
          if (result[0].Success == true) {
            eliminarImagen(result);
          }
          else {
            $scope.ShowToast(result[0].Message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast(result[0].Message, 'danger');
        });
    };

    $scope.PromocionCancel = function () {
      $location.path("/Promocions");
    };

    $scope.ImagenDelete = function () {
      $scope.Promocion.estatusImagen = 0;
    };

    function eliminarImagen(data) {
      var Url = $scope.Promocion.Url;
      var resultado = Url.split("/");
      var picturePath = 'Anexos' + '/' + resultado[5];
      var s3Client = new AWS.S3({
        accessKeyId: data[0].AccessKey,
        secretAccessKey: data[0].SecretAccess,
        params: {
          Bucket: data[0].Bucket,
        },
      });

      s3Client.deleteObject({
        Key: picturePath,
      }, function (err, data) {

      });
    };
  };

  PromocionsUpdateController.$inject = ['$scope', '$log', '$location', '$cookieStore', '$routeParams', 'PromocionsFactory', 'FileUploader', 'AccesosAmazonFactory'];

  angular.module('marketplace').controller('PromocionsUpdateController', PromocionsUpdateController);
}());

(function () {
  var SoporteCreateController = function ($scope, $log, $cookieStore, $location, $uibModal, $filter, SoporteFactory, $routeParams) {

    $scope.init = function () {

    };
    $scope.init();

    $scope.SolicitarSoporte = function () {
      if (!$scope.frm.$invalid) {
        SoporteFactory.postSolicitud({ Solicitud: $scope.Soporte })
          .success(function (resultado) {
            if (resultado.success === 1) {
              $scope.ShowToast('Solicitud enviada.', 'success');
              $location.path('monitor-soporte');
            }
          })
          .error(function (data, status, headers, config) {
            $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';

            $scope.ShowToast('No pudimos enviar tu solicitud, por favor intenta de nuevo más tarde.', 'danger');

            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      }
    };

    $scope.Cancelar = function () {
      $location.path('/monitor-soporte');
    };
  };
  SoporteCreateController.$inject = ['$scope', '$log', '$cookieStore', '$location', '$uibModal', '$filter', 'SoporteFactory', '$routeParams'];

  angular.module('marketplace').controller('SoporteCreateController', SoporteCreateController);
}());

(function () {
  var SoporteReadController = function ($scope, $log, $cookieStore, $location, $uibModal, $filter, SoporteFactory, $routeParams) {

    $scope.init = function () {
      SoporteFactory.getSolicitudes()
        .success(function (Solicitudes) {
          $scope.Solicitudes = Solicitudes.data;
        })
        .error(function (data, status, headers, config) {
          $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';

          $scope.ShowToast('No pudimos cargar la lista de solicitudes, por favor intenta de nuevo más tarde.', 'danger');

          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };
    $scope.init();

    $scope.NuevaSolicitud = function () {
      $location.path('solicitar-soporte');
    };

    $scope.EditarDetalle = function (id) {
      console.log(id);
      $location.path('actualizar-soporte/' + id);
    };
  };
  SoporteReadController.$inject = ['$scope', '$log', '$cookieStore', '$location', '$uibModal', '$filter', 'SoporteFactory', '$routeParams'];

  angular.module('marketplace').controller('SoporteReadController', SoporteReadController);
}());

(function () {
  var SoporteUpdateController = function ($scope, $log, $cookieStore, $location, $uibModal, $filter, SoporteFactory, $routeParams) {
    var idSoporte = $routeParams.idSoporte;
    var combo = [];
    $scope.init = function () {
      SoporteFactory.getSolicitud(idSoporte)
        .success(function (resultado) {
          if (resultado.success === 1) {
            $scope.Soporte = resultado.data[0];
            $scope.Soporte.IdEstatus = resultado.data[0].IdEstatus.toString();
          }
        }).error(function (data, status, headers, config) {
          $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';
          $scope.ShowToast('No pudimos cargar los datos del detalle, por favor intenta de nuevo más tarde.', 'danger');
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
      SoporteFactory.getStatus()
        .success(function (resultado) {
          if (resultado.success === 1) {
            $scope.combo = resultado.data;
          }
        }).error(function (data, status, headers, config) {
          $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';
          $scope.ShowToast('No pudimos cargar la lista de status, por favor intenta de nuevo más tarde.', 'danger');
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };
    $scope.init();
    $scope.ActualizarSoporte = function () {
      if (!$scope.frm.$invalid) {
        var soporte = {
          IdEstatus: $scope.Soporte.IdEstatus,
          DescripcionSolucion: $scope.Soporte.DescripcionSolucion
        };
        SoporteFactory.patchSolicitud(idSoporte, soporte)
          .success(function (resultado) {
            if (resultado.success === 1) {
              $scope.ShowToast('Soporte actualizado.', 'success');
              $location.path('monitor-soporte');
            } else {
              $scope.ShowToast('Error al guardar los datos, verifica que los caracteres sean correctos.', 'danger');
            }
          })
          .error(function (data, status, headers, config) {
            $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';
            $scope.ShowToast('No pudimos enviar tu solicitud, por favor intenta de nuevo más tarde.', 'danger');
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      }
    };

    $scope.Cancelar = function () {
      $location.path('/monitor-soporte');
    };
  };
  SoporteUpdateController.$inject = ['$scope', '$log', '$cookieStore', '$location', '$uibModal', '$filter', 'SoporteFactory', '$routeParams'];

  angular.module('marketplace').controller('SoporteUpdateController', SoporteUpdateController);
}());
(function () {
  var ConfirmarCuentaController = function ($scope, $routeParams, $log, $location, UsuariosFactory) {
    var encryptedObject = $routeParams.encryptedObject;
    $scope.result = {};
    $scope.encryptedObject = $routeParams.encryptedObject;

    $scope.init = function () {
      $scope.navCollapsed = true;
      $scope.result = UsuariosFactory.confirmarCuenta($scope.encryptedObject)
        .success(function (result) {
          $scope.result = result[0];
          $log.log('result ' + $scope.result);
        })
        .error(function (error) {
          $scope.result = 'Ha ocurrido un error, comuniquese con su equipo de soporte.';
          $log.log('data error: ' + error);
        });
    };
    $scope.init();
  };

  ConfirmarCuentaController.$inject = ['$scope', '$routeParams', '$log', '$location', 'UsuariosFactory'];

  angular.module('marketplace').controller('ConfirmarCuentaController', ConfirmarCuentaController);
}());

(function () {
  const DesbloquearCuentaController = function ($scope, $routeParams, $log, $location, UsuariosFactory) {
    var encryptedObject = $routeParams.encryptedObject;
    $scope.result = {};

    $scope.init = function () {
      $scope.navCollapsed = true;
      $scope.result = UsuariosFactory.desbloquearCuenta(encryptedObject)
        .success(function (result) {
          $scope.result = result[0];
          $log.log('result ' + $scope.result);
        })
        .error(function (error) {
          $log.log('data error: ' + error);
        });
    };
    $scope.init();
  };
  DesbloquearCuentaController.$inject = ['$scope', '$routeParams', '$log', '$location', 'UsuariosFactory'];

  angular.module('marketplace').controller('DesbloquearCuentaController', DesbloquearCuentaController);
}());

(function () {
  var TerminosReadController = function ($scope, $log, $location, $cookieStore, UsuariosFactory, jwtHelper) {
    var Session = {};

    Session = $cookieStore.get('Session');

    $scope.Usuario = {};

    $scope.init = function () {
      $scope.navCollapsed = true;
    };

    $scope.ActualizarTerminos = function () {
      if (!($scope.Usuario.CorreoElectronico)) {
        $scope.ShowToast('Escribe tu correo electrónico', 'danger');

        return;
      }

      if (!($scope.Usuario.Contrasena)) {
        $scope.ShowToast('Escribe tu contraseña', 'danger');

        return;
      }

      if ($scope.Usuario.LeyoTerminos !== true) {
        $scope.ShowToast('Para usar este sitio es necesario aceptar los terminos y condiciones.', 'danger');

        return;
      }

      var UsuarioActualizar =
        {
          IdUsuario: Session.IdUsuario,
          LeyoTerminos: $scope.Usuario.LeyoTerminos
        };

      var LoginUsuario =
        {
          CorreoElectronico: $scope.Usuario.CorreoElectronico,
          Contrasena: $scope.Usuario.Contrasena
        };

      UsuariosFactory.postUsuarioIniciarSesion(LoginUsuario)
        .success(function (resultLogin) {
          if (resultLogin[0].Success == true) {
            UsuariosFactory.putUsuario(UsuarioActualizar)
              .success(function (result) {
                if (result[0].Success == true) {
                  UsuariosFactory.postUsuarioIniciarSesion(LoginUsuario)
                    .success(function (result) {
                      if (result[0].Success == true) {
                        var Session = {};

                        var tokenPayload = jwtHelper.decodeToken(result[0].Token);

                        var expireDate = new Date();

                        expireDate.setTime(expireDate.getTime() + 600 * 60000);

                        Session =
                          {
                            Token: result[0].Token,
                            CorreoElectronico: tokenPayload.CorreoElectronico,
                            Nombre: tokenPayload.Nombre,
                            IdUsuario: tokenPayload.IdUsuario,
                            ApellidoPaterno: tokenPayload.ApellidoPaterno,
                            ApellidoMaterno: tokenPayload.ApellidoMaterno,
                            IdTipoAcceso: tokenPayload.IdTipoAcceso,
                            NombreTipoAcceso: tokenPayload.NombreTipoAcceso,
                            IdEmpresa: tokenPayload.IdEmpresa,
                            NombreEmpresa: tokenPayload.NombreEmpresa,
                            LeyoTerminos: tokenPayload.LeyoTerminos,
                            distribuidores: tokenPayload.distribuidores,
                            Expira: expireDate.getTime()
                          };

                        $cookieStore.put('Session', Session, { 'expires': expireDate });

                        if (Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === '4' ||
                          Session.IdTipoAcceso === 5 || Session.IdTipoAcceso === '5' ||
                          Session.IdTipoAcceso === 6 || Session.IdTipoAcceso === '6') {
                          $cookieStore.put('currentDistribuidor', Session.distribuidores[0], { 'expires': expireDate });
                        }
                        $scope.detectarSitioActivoURL();
                        $scope.ActualizarDatosSession();
                        $scope.ActualizarMenu();

                        if (UsuarioActualizar.LeyoTerminos == 1) {
                          $location.path("/");
                        }
                      } else {
                        $scope.ShowToast(result[0].Message, 'danger');
                      }
                    })
                    .error(function (data, status, headers, config) {
                      $scope.ShowToast('Error, inicie sesión de nuevo', 'danger');

                      $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
                    });
                } else {
                  $scope.ShowToast(result[0].Message, 'danger');
                }
              })
              .error(function (data, status, headers, config) {
                $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
              });
          } else {
            $scope.ShowToast(resultLogin[0].Message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('Error, inicie sesión de nuevo', 'danger');
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.init();
  };

  TerminosReadController.$inject = ['$scope', '$log', '$location', '$cookieStore', 'UsuariosFactory', 'jwtHelper'];

  angular.module('marketplace').controller('TerminosReadController', TerminosReadController);
}());

(function () {
  var UsuariosCreateController = function ($scope, $log, $cookieStore, $location, UsuariosFactory, TiposAccesosFactory, EmpresasFactory) {
    var Session = {};
    Session = $cookieStore.get('Session');
    $scope.Session = Session;
    $scope.Usuario = {};
    $scope.empresa = 0;
    $scope.Usuario.Formulario = false;

    $scope.init = function () {
      $scope.CheckCookie();
      if (Session.IdTipoAcceso !== 2) {
        TiposAccesosFactory.getTiposAccesos()
          .success(function (TiposAccesos) {
            $scope.selectTiposAccesos = TiposAccesos;
            if (Session.IdTipoAcceso == 2 || Session.IdTipoAcceso == 4)
              $scope.Usuario.MuestraComboEmpresas = 0;
            else
              $scope.Usuario.MuestraComboEmpresas = 1;
          })
          .error(function (data, status, headers, config) {
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      };

      if (Session.IdTipoAcceso === 2) {
        UsuariosFactory.getAccessosParaDistribuidor()
          .success(function (TiposAccesos) {
            $scope.selectTiposAccesos = TiposAccesos.data;
          })
          .error(function (data, status, headers, config) {
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
        EmpresasFactory.getClientes()
          .success(function (Empresas) {
            $scope.selectEmpresas = Empresas.data;
          })
          .error(function (data, status, headers, config) {
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      }

      $scope.Usuario.Lada = 52;

      if (Session.IdTipoAcceso == 1) {
        EmpresasFactory.getEmpresas()
          .success(function (Empresas) {
            $scope.selectEmpresas = Empresas;
          })
          .error(function (data, status, headers, config) {
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      }
    };

    $scope.init();

    $scope.UsuarioCreate = function () {
      if ($scope.frm.$valid) {
        delete $scope.Usuario.Formulario;
        if (Session.IdTipoAcceso !== 2) {
          UsuariosFactory.postUsuario($scope.Usuario)
            .success(function (result) {
              if (result[0].Success == true) {
                $location.path("/Usuarios");
                $scope.ShowToast(result[0].Message, 'success');
              }
              else {
                $scope.ShowToast(result[0].Message, 'danger');
              }
            })
            .error(function (data, status, headers, config) {
              $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
            });
        }
        if (Session.IdTipoAcceso === 2) {
          const user = Object.assign({}, $scope.Usuario);
          if ($scope.Usuario.IdTipoAcceso === 4 || $scope.Usuario.IdTipoAcceso === 6) {
            user.TipoUsuario = 'END_USER';
            user.IdTipoAcceso = $scope.Usuario.IdTipoAcceso.toString();
            user.Lada = $scope.Usuario.Lada.toString();
            UsuariosFactory.postUsuarioCliente(user)
              .success(function (result) {
                if (result.success === 1) {
                  $location.path("/Usuarios");
                  $scope.ShowToast(result.message, 'success');
                } else {
                  $scope.ShowToast(result.message, 'danger');
                  return;
                }
              })
              .error(function (data, status, headers, config) {
                $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
              });
          }
          if ($scope.Usuario.IdTipoAcceso != 4 && $scope.Usuario.IdTipoAcceso != 6) {
            UsuariosFactory.postUsuario($scope.Usuario)
              .success(function (result) {
                if (result[0].Success == true) {
                  $location.path("/Usuarios");
                  $scope.ShowToast(result[0].Message, 'success');
                }
                else {
                  $scope.ShowToast(result[0].Message, 'danger');
                }
              })
              .error(function (data, status, headers, config) {
                $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
              });
          }
        }
      } else $scope.ShowToast('Alguno de los campos es invalido', 'danger');
    };

    $scope.UsuarioCancel = function () {
      $location.path("/Usuarios");
    };
  };

  UsuariosCreateController.$inject = ['$scope', '$log', '$cookieStore', '$location', 'UsuariosFactory', 'TiposAccesosFactory', 'EmpresasFactory'];

  angular.module('marketplace').controller('UsuariosCreateController', UsuariosCreateController);
}());

(function () {
  var UsuariosLoginController = function ($scope, $log, $cookieStore, $location, UsuariosFactory, jwtHelper, $routeParams, EmpresasFactory) {
    $scope.Subdominio = $routeParams.Subdominio;
    $scope.validarSubdominio = function () {
      if ($scope.Subdominio) {
        EmpresasFactory.getSitio($scope.Subdominio)
          .success(function (sitio) {
            if (sitio.success) {
              if (sitio.data[0]) {
                var expireDate = new Date();
                expireDate.setTime(expireDate.getTime() + 600 * 60000);
                $cookieStore.put('currentDistribuidor', sitio.data[0], { 'expires': expireDate });
                $scope.currentDistribuidor = $cookieStore.get('currentDistribuidor');
              }
            }
          })
          .error(function (data, status, headers, config) {
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      }
    };

    $scope.init = function () {
      $scope.esNavegadorSoportado();
      $scope.navCollapsed = true;
      /* $scope.validarSubdominio();*/
      $scope.ActualizarMenu();
    };

    $scope.init();

    $scope.IniciarSesion = function () {
      $cookieStore.remove('Session');
      $cookieStore.remove('Pedido');
      $scope.Usuario.IdEmpresa = $scope.currentDistribuidor.IdEmpresa;
      $cookieStore.remove('currentDistribuidor');
      $scope.SessionCookie = {};
      UsuariosFactory.postUsuarioIniciarSesion($scope.Usuario)
        .success(function (result) {
          if (result[0].Success) {
            var Session = {};

            var tokenPayload = jwtHelper.decodeToken(result[0].Token);

            var expireDate = new Date();

            expireDate.setTime(expireDate.getTime() + 600 * 60000);

            Session = {
              Token: result[0].Token,
              CorreoElectronico: tokenPayload.CorreoElectronico,
              Nombre: tokenPayload.Nombre,
              IdUsuario: tokenPayload.IdUsuario,
              ApellidoPaterno: tokenPayload.ApellidoPaterno,
              ApellidoMaterno: tokenPayload.ApellidoMaterno,
              IdTipoAcceso: tokenPayload.IdTipoAcceso,
              NombreTipoAcceso: tokenPayload.NombreTipoAcceso,
              IdEmpresa: tokenPayload.IdEmpresa,
              NombreEmpresa: tokenPayload.NombreEmpresa,
              LeyoTerminos: tokenPayload.LeyoTerminos,
              distribuidores: tokenPayload.distribuidores,
              Expira: expireDate.getTime()
            };

            $cookieStore.put('Session', Session, { 'expires': expireDate });

            if (Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === '4' ||
              Session.IdTipoAcceso === 5 || Session.IdTipoAcceso === '5' ||
              Session.IdTipoAcceso === 6 || Session.IdTipoAcceso === '6') {
              $cookieStore.put('currentDistribuidor', Session.distribuidores[0], { 'expires': expireDate });
            }

            $scope.detectarSitioActivoURL();

            $scope.ActualizarMenu();

            if (Session.LeyoTerminos === 1 || Session.LeyoTerminos === '1') {
              $location.path('/');
            } else {
              $scope.ShowToast('Para usar el sitio necesitas aceptar los terminos y condiciones', 'danger');
              $location.path('/TerminosCondiciones');
            }
          } else {
            $scope.ShowToast(result[0].Message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('Error al iniciar sesión', 'danger');
          $log.log('data error: ' + data + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };
  };

  UsuariosLoginController.$inject = ['$scope', '$log', '$cookieStore', '$location', 'UsuariosFactory', 'jwtHelper', '$routeParams', 'EmpresasFactory'];

  angular.module('marketplace').controller('UsuariosLoginController', UsuariosLoginController);
}());

(function () {
  var UsuariosReadController = function ($scope, $log, $location, $cookieStore, UsuariosFactory, UsuariosXEmpresasFactory, EmpresasFactory) {

    $scope.sortBy = 'Nombre';
    $scope.reverse = false;
    $scope.empresaSel = '';
    const Session = $cookieStore.get('Session');
    if (Session.IdTipoAcceso === 1) {
      $scope.empresaActual = 'CompuSoluciones';
    }
    if (Session.IdTipoAcceso === 2) {
      $scope.empresaActual = Session.NombreEmpresa;
    }

    $scope.init = function () {
      $scope.CheckCookie();
      if (Session.IdTipoAcceso !== 2) {
        EmpresasFactory.getEmpresas()
          .success(function (Empresas) {
            $scope.selectEmpresas = Empresas;
            if ($scope.SessionCookie.IdTipoAcceso != 1) {
              $scope.empresaSel = $scope.selectEmpresas[0].IdEmpresa;
            }

            $scope.MostrarUsuariosEmp(isNaN(parseInt($scope.empresaSel)) ? 0 : parseInt($scope.empresaSel));
          })
          .error(function (data, status, headers, config) {
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      }
      if (Session.IdTipoAcceso === 2) {
        EmpresasFactory.getClientes()
          .success(function (Empresas) {
            $scope.selectEmpresas = Empresas.data;
            $scope.ObtenerUsuariosPropios();
          })
          .error(function (data, status, headers, config) {
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      }
    };

    $scope.OrdenarPor = function (Atributo) {
      $scope.sortBy = Atributo;
      $scope.reverse = !$scope.reverse;
    };

    $scope.ObtenerUsuariosPropios = function () {
      UsuariosFactory.getUsuariosPropios()
        .success(function (UsuariosXEmpresas) {
          $scope.Usuarios = UsuariosXEmpresas.data;
          console.log($scope.Usuarios);
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.ObtenerUsuariosPorCliente = function (IdEmpresa) {
      UsuariosFactory.getUsuariosContacto(IdEmpresa)
        .success(function (UsuariosXEmpresas) {
          $scope.Usuarios = UsuariosXEmpresas.data;
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.MostrarUsuariosEmp = function (IdEmpresa) {
      if (Session.IdTipoAcceso === 2) {
        if (IdEmpresa) {
          $scope.ObtenerUsuariosPorCliente(IdEmpresa);
        } else {
          $scope.ObtenerUsuariosPropios();
        }
      } else {
        UsuariosXEmpresasFactory.getUsuariosXEmpresa(IdEmpresa)
          .success(function (UsuariosXEmpresas) {
            $scope.Usuarios = UsuariosXEmpresas;
          })
          .error(function (data, status, headers, config) {
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      }
    };

    $scope.init();

    $scope.IniciarTourColaborador = function () {
      $scope.Tour = new Tour({
        steps: [
          {
            element: ".searchOption",
            placement: "bottom",
            title: "Busqueda de colaboradores",
            content: "Puedes filtrar a tus colaboradores buscando por su nombre, apellidos o correo electrónico.",
            template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Atrás</button><button class='btn btn-default' data-role='next'>Sig »</button><button class='btn btn-default' data-role='end'>Finalizar</button></nav></div></div>"
          },
          {
            element: ".newColaborator",
            placement: "bottom",
            title: "Agrega nuevos colaboradores",
            content: "Para poder dar de alta un nuevo colaborador da click aquí y llena la información que se te solicite.",
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

  UsuariosReadController.$inject = ['$scope', '$log', '$location', '$cookieStore', 'UsuariosFactory', 'UsuariosXEmpresasFactory', 'EmpresasFactory'];

  angular.module('marketplace').controller('UsuariosReadController', UsuariosReadController);
}());

(function () {
  var UsuariosRecuperarController = function ($scope, $log, $location, UsuariosFactory) {
    $scope.Usuario = {};

    $scope.init = function () {
      $scope.navCollapsed = true;
    };

    $scope.init();


    $scope.RecuperarContrasena = function () {
      UsuariosFactory.postRecuperar($scope.Usuario)
        .success(function (Result) {
          $scope.Usuario.Respuesta = Result;
          $scope.ShowToast(Result, 'success');
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };
  };

  UsuariosRecuperarController.$inject = ['$scope', '$log', '$location', 'UsuariosFactory'];

  angular.module('marketplace').controller('UsuariosRecuperarController', UsuariosRecuperarController);
}());

(function () {
  var UsuariosUpdateController = function ($scope, $log, $location, $cookieStore, $routeParams, UsuariosFactory, jwtHelper, UsuariosXEmpresasFactory, TiposAccesosFactory) {
    var Session = {};
    Session = $cookieStore.get('Session');
    var IdUsuario = $routeParams.IdUsuario;
    $scope.Usuario = {};

    $scope.init = function () {
      $scope.Usuario.MuestraCamposContrasenas = 0;
      Session = $cookieStore.get('Session');

      $scope.CheckCookie();

      if (Session.IdTipoAcceso == 2 || Session.IdTipoAcceso == 4) {
        TiposAccesosFactory.getTiposAccesos()
          .success(function (TiposAccesos) {
            $scope.selectTiposAccesos = TiposAccesos;
          })
          .error(function (data, status, headers, config) {
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      }

      if (IdUsuario == Session.IdUsuario) {
        $scope.Usuario.IdUsuario = Session.IdUsuario;
        $scope.Usuario.Nombre = Session.Nombre;
        $scope.Usuario.ApellidoPaterno = Session.ApellidoPaterno;
        $scope.Usuario.ApellidoMaterno = Session.ApellidoMaterno;
        $scope.Usuario.CorreoElectronico = Session.CorreoElectronico;
        $scope.Usuario.ModificaContrasena = 1;

        UsuariosFactory.getUsuario($routeParams.IdUsuario)
          .success(function (Usuario) {
            if (Usuario[0].Success == true) {
              $scope.Usuario.Lada = Usuario[0].Lada;
              $scope.Usuario.Telefono = Usuario[0].Telefono;
            } else {
              $scope.ShowToast(Usuario[0].Message, 'danger');
              $location.path('/');
            }
          })
          .error(function (data, status, headers, config) {
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      } else {
        UsuariosFactory.getUsuario($routeParams.IdUsuario)
          .success(function (Usuario) {
            if (Usuario[0].Success == true) {
              $scope.Usuario = Usuario[0];
              $scope.Usuario.ModificaContrasena = 0;
              $scope.Usuario.IdUsuario = Usuario[0].IdUsuario;
              $scope.Usuario.IdEmpresa = Session.IdEmpresa;
              $scope.Usuario.TipoAccesoDistribuidor = Session.IdTipoAcceso;
              $scope.Usuario.collegeSelection = Usuario[0].IdTipoAcceso;
              $scope.Usuario.Lada = Usuario[0].Lada;
              $scope.Usuario.Telefono = Usuario[0].Telefono;
            } else {
              $scope.ShowToast(Usuario[0].Message, 'danger');
              $location.path('/Usuarios');
            }
          })
          .error(function (data, status, headers, config) {
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      }
    };

    $scope.init();

    $scope.UsuarioUpdate = function () {
      if ($scope.Usuario.ModificaContrasena == 1) {
        if (($scope.frm.$invalid)) {
          if ($scope.frm.Nombre.$invalid == true) {
            $scope.frm.Nombre.$pristine = false;
          }
          if ($scope.frm.CorreoElectronico.$invalid == true) {
            $scope.frm.CorreoElectronico.$pristine = false;
          }
          if ($scope.frm.Contrasena.$invalid == true) {
            $scope.frm.Contrasena.$pristine = false;
          }

          $scope.ShowToast('Datos inválidos, favor de verificar', 'danger');
        } else {
          UsuariosFactory.postUsuarioIniciarSesion($scope.Usuario)
            .success(function (result) {
              if (result[0].Success == true) {
                if ($scope.Usuario.ContrasenaNueva != null && $scope.Usuario.ContrasenaNueva != undefined && $scope.Usuario.ContrasenaConfirmar != null && $scope.Usuario.ContrasenaConfirmar != undefined)
                  $scope.Usuario.Contrasena = $scope.Usuario.ContrasenaNueva;
                UsuariosFactory.putUsuario($scope.Usuario)
                  .success(function (result) {
                    if (result[0].Success == true) {
                      UsuariosFactory.postUsuarioIniciarSesion($scope.Usuario)
                        .success(function (result) {
                          if (result[0].Success == true) {
                            var Session = {};

                            var tokenPayload = jwtHelper.decodeToken(result[0].Token);

                            var expireDate = new Date();

                            expireDate.setTime(expireDate.getTime() + 600 * 60000);

                            Session = {
                              Token: result[0].Token,
                              CorreoElectronico: tokenPayload.CorreoElectronico,
                              Nombre: tokenPayload.Nombre,
                              IdUsuario: tokenPayload.IdUsuario,
                              ApellidoPaterno: tokenPayload.ApellidoPaterno,
                              ApellidoMaterno: tokenPayload.ApellidoMaterno,
                              IdTipoAcceso: tokenPayload.IdTipoAcceso,
                              NombreTipoAcceso: tokenPayload.NombreTipoAcceso,
                              IdEmpresa: tokenPayload.IdEmpresa,
                              NombreEmpresa: tokenPayload.NombreEmpresa,
                              LeyoTerminos: tokenPayload.LeyoTerminos,
                              distribuidores: tokenPayload.distribuidores,
                              Expira: expireDate.getTime()
                            };

                            $cookieStore.put('Session', Session, { 'expires': expireDate });

                            $scope.detectarSitioActivoURL();
                            $scope.ActualizarDatosSession();
                            $scope.ActualizarMenu();

                            $scope.ShowToast('Datos actualizados correctamente', 'success');

                            $scope.CheckCookie();
                          } else {
                            $scope.ShowToast(result[0].Message, 'danger');
                          }
                        })
                        .error(function (data, status, headers, config) {
                          $scope.ShowToast('Error, inicie sesión de nuevo', 'danger');

                          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
                        });
                    } else {
                      $scope.ShowToast(result[0].Message, 'danger');
                    }
                  })
                  .error(function (data, status, headers, config) {
                    $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
                  });
              } else {
                $scope.ShowToast('Autentificación no válida', 'danger');
              }
            })
            .error(function (data, status, headers, config) {
              $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
            });
        }
      } else {
        UsuariosXEmpresasFactory.putUsuariosXEmpresa($scope.Usuario)
          .success(function (result) {
            if (result[0].Success == true) {
              $location.path('/Usuarios');
            } else {
              $scope.ShowToast(result[0].Message, 'danger');
            }
          })
          .error(function (data, status, headers, config) {
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      }
    };

    $scope.UsuarioDelete = function () {
      $scope.Usuario.Activo = 0;
      UsuariosFactory.putUsuario($scope.Usuario)
        .success(function (result) {
          if (result[0].Success == true) {
            UsuariosXEmpresasFactory.putUsuariosXEmpresa($scope.Usuario)
              .success(function (result) {
                if (result[0].Success == true) {
                  $location.path('/Usuarios');
                  $scope.ShowToast('Usuario dado de baja', 'success');
                } else {
                  $scope.ShowToast(result[0].Message, 'danger');
                }
              })
              .error(function (data, status, headers, config) {
                $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
              });
          } else {
            $scope.ShowToast(result[0].Message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.UsuarioCancel = function () {
      if ($scope.Usuario.ModificaContrasena == 1) {
        $location.path('/');
      } else {
        $location.path('/Usuarios');
      }
    };

    $scope.ValidaContrasena = function () {
      if ($scope.Usuario.ContrasenaNueva !== $scope.Usuario.ContrasenaConfirmar) {
        $scope.ShowToast('Nueva Contraseña y Contraseña Confirmar no coinciden', 'danger');
        return false;
      }
      return true;
    };
  };

  UsuariosUpdateController.$inject = ['$scope', '$log', '$location', '$cookieStore', '$routeParams', 'UsuariosFactory', 'jwtHelper', 'UsuariosXEmpresasFactory', 'TiposAccesosFactory'];
  angular.module('marketplace').controller('UsuariosUpdateController', UsuariosUpdateController);
}());

(function () {
  var VersionController = function ($scope, $log, $location, $cookieStore, $route, VersionFactory, $anchorScroll) {
    $scope.versiones = [];
    $scope.currentPath = $location.path();
    $anchorScroll.yOffset = 130;

    $scope.init = function () {
      if ($scope.currentPath === '/Version') {
        $scope.CheckCookie();
        $scope.obtenerVersiones();
      }
    };

    $scope.obtenerVersiones = function () {
      VersionFactory.getVersiones()
        .success(function (versiones) {
          $scope.versiones = versiones.data;
          obtenerDetalle();
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos traer las versiones.', 'danger');
          $location.path('/');
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    var obtenerDetalle = function (Id) {
      var IdVersion = Id || $scope.versiones[0].IdVersion;
      VersionFactory.getVersionDetalle(IdVersion)
        .success(function (versiones) {
          $scope.detalleVersion = versiones.data;
          console.log(versiones);
          SetTitulo();
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos traer el detalle de la versión.', 'danger');
          $location.path('/');
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.init();

    $scope.GetDetalle = function (IdVersion, text) {
      if (!IdVersion) {
        IdVersion = 4;
      }
      obtenerDetalle(IdVersion);
    };

    $scope.scrollTo = function (id) {
      //$location.hash(id);
      $anchorScroll(id);
    }

    var SetTitulo = function () {
      var selectedIndex = document.getElementsByName("Versiones")[0].selectedIndex - 1;
      if (selectedIndex < 0) {
        selectedIndex = 0;
      }
      $scope.Titulo = $scope.versiones[selectedIndex].Version;
    };
  };

  VersionController.$inject = ['$scope', '$log', '$location', '$cookieStore', '$route', 'VersionFactory', '$anchorScroll', '$routeParams'];
  angular.module('marketplace').controller('VersionController', VersionController);
}());