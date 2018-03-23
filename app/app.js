(function () {
  var app = angular.module('marketplace', ['ngRoute', 'ngAnimate', 'ngCookies', 'ngTouch', 'angular-jwt', 'angular-parallax', 'ui.bootstrap', 'angular.filter', 'angularFileUpload', 'ngToast', 'ui.mask', 'directives.loading', 'bcherny/formatAsCurrency', 'ng.deviceDetector', 'color.picker']);
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
          'check': function ($location, $cookies) {
            var Session = $cookies.getObject('Session');
            if (!(Session.IdTipoAcceso === 1 || Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3 || Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === 5 || Session.IdTipoAcceso === 6 || Session.IdTipoAcceso === 7)) { $location.path('/404'); }
          }
        }
      })

      .when('/MisProductos', {
        controller: 'MisProductosReadController', templateUrl: 'app/views/Productos/MisProductosRead.html',
        resolve: {
          'check': function ($location, $cookies) {
            var Session = $cookies.getObject('Session');
            if (!(Session.IdTipoAcceso === 2 && Session.IdPlanTuClick !== null)) { $location.path('/404'); }
          }
        }
      })

      .when('/Configuracion', {
        controller: 'ConfiguracionUpdateController', templateUrl: 'app/views/Empresas/ConfiguracionUpdate.html',
        resolve: {
          'check': function ($location, $cookies) {
            var Session = $cookies.getObject('Session');
            if (!(Session.IdTipoAcceso === 2)) { $location.path('/404'); }
          }
        }
      })
      .when('/autodesk/productos/:IdProducto/detalle/:IdPedidoDetalle', {
        controller: 'ConfigurarBaseController', templateUrl: 'app/views/Productos/ConfigurarBase.html',
        resolve: {
          'check': function ($location, $cookies) {
            var Session = $cookies.getObject('Session');
            if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3)) { $location.path('/404'); }
          }
        }
      })

      .when('/monitor-soporte', {
        controller: 'SoporteReadController', templateUrl: 'app/views/Soporte/SoporteRead.html',
        resolve: {
          'check': function ($location, $cookies) {
            var Session = $cookies.getObject('Session');
            if (!(Session.IdTipoAcceso === 1 || Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3)) { $location.path('/404'); }
          }
        }
      })

      .when('/solicitar-soporte', {
        controller: 'SoporteCreateController', templateUrl: 'app/views/Soporte/SoporteCreate.html',
        resolve: {
          'check': function ($location, $cookies) {
            var Session = $cookies.getObject('Session');
            if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3)) { $location.path('/404'); }
          }
        }
      })

      .when('/actualizar-soporte/:idSoporte', {
        controller: 'SoporteUpdateController', templateUrl: 'app/views/Soporte/SoporteUpdate.html',
        resolve: {
          'check': function ($location, $cookies) {
            var Session = $cookies.getObject('Session');
            if (!(Session.IdTipoAcceso === 1)) { $location.path('/404'); }
          }
        }
      })

      .when('/actualizar-datos-facturacion', {
        controller: 'FacturacionCreateController', templateUrl: 'app/views/Facturacion/FacturacionCreate.html',
        resolve: {
          'check': function ($location, $cookies, jwtHelper) {
            var Session = $cookies.getObject('Session');
            if (!((Session.IdTipoAcceso === 3 || Session.IdTipoAcceso === 2) && Session.mFacturacion)) { $location.path('/404'); }
          }
        }
      })

      .when('/facturas-pendientes', {
        controller: 'FacturacionReadController', templateUrl: 'app/views/Facturacion/FacturacionRead.html',
        resolve: {
          'check': function ($location, $cookies, jwtHelper) {
            var Session = $cookies.getObject('Session');
            if (!((Session.IdTipoAcceso === 3 || Session.IdTipoAcceso === 2) && Session.mFacturacion)) { $location.path('/404'); }
          }
        }
      })

      .when('/facturas-pendientes/:IdFactura', {
        controller: 'FacturacionReadDetailsController', templateUrl: 'app/views/Facturacion/FacturacionReadDetails.html',
        resolve: {
          'check': function ($location, $cookies, jwtHelper) {
            var Session = $cookies.getObject('Session');
            if (!((Session.IdTipoAcceso === 3 || Session.IdTipoAcceso === 2) && Session.mFacturacion)) { $location.path('/404'); }
          }
        }
      })

      .when('/power-bi', {
        controller: 'PowerBIReadController', templateUrl: 'app/views/PowerBI/PowerBIRead.html',
        resolve: {
          'check': function ($location, $cookies) {
            var Session = $cookies.getObject('Session');
            if (!(Session.IdTipoAcceso === 1)) { $location.path('/404'); }
          }
        }
      })

      .when('/aplicaciones', {
        controller: 'AplicacionesReadController', templateUrl: 'app/views/Aplicaciones/AplicacionesRead.html',
        resolve: {
          'check': function ($location, $cookies) {
            var Session = $cookies.getObject('Session');
            if (!(Session.IdTipoAcceso === 2 && Session.IdEmpresa === 110)) { $location.path('/404'); }
          }
        }
      })

      .when('/migraciones', {
        controller: 'MigracionController', templateUrl: 'app/views/Migracion/Migracion.html',
        resolve: {
          'check': function ($location, $cookies) {
            var Session = $cookies.getObject('Session');
            if (!(Session.IdTipoAcceso === 2 && Session.IdEmpresa === 110)) { $location.path('/404'); }
          }
        }
      })

      .when('/migraciones/:idMigracion', {
        controller: 'MigracionDetalleController', templateUrl: 'app/views/Migracion/MigracionDetalle.html',
        resolve: {
          'check': function ($location, $cookies) {
            var Session = $cookies.getObject('Session');
            if (!(Session.IdTipoAcceso === 2 && Session.IdEmpresa === 110)) { $location.path('/404'); }
          }
        }
      })

      .when('/ConfigurarRPs/:IdEmpresa', {
        controller: 'EmpresasRPController', templateUrl: 'app/views/Empresas/EmpresasRP.html',
        resolve: {
          'check': function ($location, $cookies) {
            var Session = $cookies.getObject('Session');
            if (!(Session.IdTipoAcceso === 1)) { $location.path('/404'); }
          }
        }
      })

      .when('/ConfigurarRPs/FinalUser/:IdEmpresa', {
        controller: 'EmpresasRPUFController', templateUrl: 'app/views/Empresas/EmpresasRPUF.html',
        resolve: {
          'check': function ($location, $cookies) {
            var Session = $cookies.getObject('Session');
            if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 4)) { $location.path('/404'); }
          }
        }
      })

      .when('/Monitor', {
        controller: 'MonitorReadController', templateUrl: 'app/views/PedidoDetalles/MonitorRead.html',
        resolve: {
          'check': function ($location, $cookies) {
            var Session = $cookies.getObject('Session');
            if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3 || Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === 5 || Session.IdTipoAcceso === 6 || Session.IdTipoAcceso === 7)) { $location.path('/404'); }
          }
        }
      })

      .when('/MonitorPagos', {
        controller: 'MonitorPagos', templateUrl: 'app/views/PedidoDetalles/MonitorPagos.html',
        resolve: {
          'check': function ($location, $cookies) {
            var Session = $cookies.getObject('Session');
            if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3 || Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === 5 || Session.IdTipoAcceso === 6 || Session.IdTipoAcceso === 7)) { $location.path('/404'); }
          }
        }
      })

      .when('/MonitorPagos/refrescar', {
        controller: 'MonitorPagos', templateUrl: 'app/views/PedidoDetalles/MonitorPagos.html',
        resolve: {
          'check': function ($location, $cookies) {
            var Session = $cookies.getObject('Session');
            if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3 || Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === 5 || Session.IdTipoAcceso === 6 || Session.IdTipoAcceso === 7)) { $location.path('/404'); }
          }
        }
      })

      .when('/DetallesAzure/:IdPedido', {
        controller: 'DetallesAzureController', templateUrl: 'app/views/PedidoDetalles/DetallesAzure.html',
        resolve: {
          'check': function ($location, $cookies) {
            var Session = $cookies.getObject('Session');
            if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3)) { $location.path('/404'); }
          }
        }
      })

      .when('/TerminosCondiciones', {
        controller: 'TerminosReadController', templateUrl: 'app/views/Usuarios/TerminosRead.html',
        resolve: {
          'check': function ($location, $cookies) {
            var Session = $cookies.getObject('Session');
            if (!(Session.IdTipoAcceso === 1 || Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3 || Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === 5 || Session.IdTipoAcceso === 6 || Session.IdTipoAcceso === 7)) { $location.path('/404'); }
          }
        }
      })

      .when('/Usuario', {
        controller: 'UsuariosCreateController', templateUrl: 'app/views/Usuarios/UsuariosCreate.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); if (!(Session.IdTipoAcceso === 1 || Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === 6 || Session.IdTipoAcceso === 7)) { $location.path('/404'); } } }
      })

      .when('/Usuarios', {
        controller: 'UsuariosReadController', templateUrl: 'app/views/Usuarios/UsuariosRead.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); if (!(Session.IdTipoAcceso === 1 || Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === 6 || Session.IdTipoAcceso === 7)) { $location.path('/404'); } } }
      })

      .when('/Empresa', {
        controller: 'EmpresasCreateController', templateUrl: 'app/views/Empresas/EmpresasCreate.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 7)) { $location.path('/404'); } } }
      })

      .when('/Empresa/:IdEmpresa', {
        controller: 'EmpresasUpdateController', templateUrl: 'app/views/Empresas/EmpresasUpdate.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); if (!(Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === 6)) { $location.path('/404'); } } }
      })

      .when('/Clientes', {
        controller: 'EmpresasXEmpresasReadController', templateUrl: 'app/views/EmpresasXEmpresas/EmpresasXEmpresasRead.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3 || Session.IdTipoAcceso === 7)) { $location.path('/404'); } } }
      })

      .when('/Productos/:Busqueda', {
        controller: 'ProductosReadController', templateUrl: 'app/views/Productos/ProductosRead.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3 || Session.IdTipoAcceso === 7)) { $location.path('/404'); } } }
      })

      .when('/Productos', {
        controller: 'ProductosReadController', templateUrl: 'app/views/Productos/ProductosRead.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3 || Session.IdTipoAcceso === 7)) { $location.path('/404'); } } }
      })

      .when('/Comprar', {
        controller: 'ComprarController', templateUrl: 'app/views/PedidoDetalles/Comprar.html',
        resolve: {
          'check': function ($location, $cookies) {
            var Session = $cookies.getObject('Session');
            if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3)) {
              $location.path('/404');
            }
          }
        }
      })

      .when('/uf/Comprar', {
        controller: 'ComprarUFController', templateUrl: 'app/views/PedidoDetalles/ComprarUF.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); if (!(Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === 5 || Session.IdTipoAcceso === 6)) { $location.path('/404'); } } }
      })

      .when('/Carrito', {
        controller: 'PedidoDetallesReadController', templateUrl: 'app/views/PedidoDetalles/PedidoDetallesRead.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3)) { $location.path('/404'); } } }
      })

      .when('/Carrito/:error', {
        controller: 'PedidoDetallesReadController', templateUrl: 'app/views/PedidoDetalles/PedidoDetallesRead.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3)) { $location.path('/404'); } } }
      })

      .when('/uf/Productos/:Busqueda', {
        controller: 'ProductosUFReadController', templateUrl: 'app/views/Productos/ProductosUFRead.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); if (!(Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === 5 || Session.IdTipoAcceso === 6)) { $location.path('/404'); } } }
      })

      .when('/uf/Productos', {
        controller: 'ProductosUFReadController', templateUrl: 'app/views/Productos/ProductosUFRead.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); if (!(Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === 5 || Session.IdTipoAcceso === 6)) { $location.path('/404'); } } }
      })

      .when('/uf/Carrito', {
        controller: 'PedidoDetallesUFReadController', templateUrl: 'app/views/PedidoDetalles/PedidoDetallesUFRead.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); if (!(Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === 5 || Session.IdTipoAcceso === 6)) { $location.path('/404'); } } }
      })

      .when('/uf/Carrito/:error', {
        controller: 'PedidoDetallesUFReadController', templateUrl: 'app/views/PedidoDetalles/PedidoDetallesUFRead.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); if (!(Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === 5 || Session.IdTipoAcceso === 6)) { $location.path('/404'); } } }
      })

      .when('/Favoritos', {
        controller: 'ProductoGuardadosReadController', templateUrl: 'app/views/ProductoGuardados/ProductoGuardadosRead.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3)) { $location.path('/404'); } } }
      })

      .when('/Empresas/Importar/:IdEmpresa', {
        controller: 'EmpresasImportController', templateUrl: 'app/views/Empresas/EmpresasImport.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); if (!(Session.IdTipoAcceso === 1)) { $location.path('/404'); } } }
      })

      .when('/Empresas/Importar/:IdEmpresa/:IdMicrosoft/:Dominio/:Name', {
        controller: 'EmpresasCompletarController', templateUrl: 'app/views/Empresas/EmpresasCompletar.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); if (!(Session.IdTipoAcceso === 1)) { $location.path('/404'); } } }
      })

      .when('/Empresas', {
        controller: 'EmpresasReadController', templateUrl: 'app/views/Empresas/EmpresasRead.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); if (!(Session.IdTipoAcceso === 1)) { $location.path('/404'); } } }
      })

      .when('/Credito/:IdEmpresa', {
        controller: 'EmpresasCreditoUpdateController', templateUrl: 'app/views/Empresas/EmpresasCreditoUpdate.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); if (!(Session.IdTipoAcceso === 1)) { $location.path('/404'); } } }
      })

      .when('/Promocion', {
        controller: 'PromocionsCreateController', templateUrl: 'app/views/Promocions/PromocionsCreate.html',
        resolve: { 'check': function ($location, $cookies) {
          var Session = $cookies.getObject('Session');
          if (!(Session.IdTipoAcceso === 1) && !(Session.IdTipoAcceso === 2) && !(Session.IdTipoAcceso === 3)) { $location.path('/404'); }
        } }
      })

      .when('/Promocions', {
        controller: 'PromocionsReadController', templateUrl: 'app/views/Promocions/PromocionsRead.html',
        resolve: { 'check': function ($location, $cookies) {
          var Session = $cookies.getObject('Session');
          if (!(Session.IdTipoAcceso === 1) && !(Session.IdTipoAcceso === 2) && !(Session.IdTipoAcceso === 3)) { $location.path('/404'); }
        } }
      })

      .when('/Promocion/:IdPromocion', {
        controller: 'PromocionsUpdateController', templateUrl: 'app/views/Promocions/PromocionsUpdate.html',
        resolve: { 'check': function ($location, $cookies) {
          var Session = $cookies.getObject('Session'); 
          if (!(Session.IdTipoAcceso === 1) && !(Session.IdTipoAcceso === 2) && !(Session.IdTipoAcceso === 3)) { $location.path('/404'); }
        } }
      })

      .when('/Reportes', {
        controller: 'ReportesController', templateUrl: 'app/views/Reportes.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); if (!(Session.IdTipoAcceso === 1 || Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3 || Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === 5 || Session.IdTipoAcceso === 6 || Session.IdTipoAcceso === 7)) { $location.path('/404'); } } }
      })

      .when('/Niveles', {
        controller: 'NivelesReadController', templateUrl: 'app/views/Niveles/NivelesRead.html',
        resolve: {
          'check': function ($location, $cookies, jwtHelper) {
            var Session = $cookies.getObject('Session');
            var decoded = jwtHelper.decodeToken(Session.Token);
            if (!(decoded.IdTipoAcceso === 1)) {
              $location.path('/404');
            }
          }
        }
      })

      .when('/Niveles/Distribuidor', {
        controller: 'NivelesClienteFinalController', templateUrl: 'app/views/Niveles/NivelesClienteFinal.html',
        resolve: { 'check': function ($location, $cookies, jwtHelper) {
          var Session = $cookies.getObject('Session');
          var decoded = jwtHelper.decodeToken(Session.Token);
          if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3) || !decoded.Niveles) { $location.path('/404'); }
        } }
      })

      .when('/Niveles/Distribuidor/:IdDescuento/Descuentos', {
        controller: 'DescuentosNivelesController', templateUrl: 'app/views/Descuentos/DescuentosNiveles.html',
        resolve: { 'check': function ($location, $cookies, jwtHelper) {
          var Session = $cookies.getObject('Session');
          var decoded = jwtHelper.decodeToken(Session.Token);
          if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3) || !decoded.Niveles) { $location.path('/404'); }
        } }
      })

      .when('/Niveles/:IdNivel/Productos', {
        controller: 'DescuentosNivelesCSController', templateUrl: 'app/views/Descuentos/DescuentosNivelesCS.html',
        resolve: { 'check': function ($location, $cookies, jwtHelper) {
          var Session = $cookies.getObject('Session');
          if (!Session.IdTipoAcceso === 1) { $location.path('/404'); }
        } }
      })

      .when('/Descuentos', {
        controller: 'DescuentosReadController', templateUrl: 'app/views/Descuentos/DescuentosRead.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); if (!(Session.IdTipoAcceso === 1)) { $location.path('/404'); } } }
      })

      .when('/Descuento', {
        controller: 'DescuentosCreateController', templateUrl: 'app/views/Descuentos/DescuentosCreate.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); if (!(Session.IdTipoAcceso === 1)) { $location.path('/404'); } } }
      })

      .when('/Descuento/:Descuento', {
        controller: 'DescuentosUpdateController', templateUrl: 'app/views/Descuentos/DescuentosUpdate.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); if (!(Session.IdTipoAcceso === 1)) { $location.path('/404'); } } }
      })

      .when('/Version', {
        controller: 'VersionController', templateUrl: 'app/views/VersionControl/VersionControl.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 1)) { $location.path('/404'); } } }
      })

      /* .when('/:Subdominio', { controller: 'UsuariosLoginController', templateUrl: 'app/views/Usuarios/UsuariosLogin.html' }) */

      .otherwise({ redirectTo: '/404' });
  });
}());
