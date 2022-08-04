(function () {
  var app = angular.module('marketplace', ['ngRoute', 'ngAnimate', 'ngCookies', 'ngTouch', 'angular-jwt', 'angular-parallax', 'ui.bootstrap', 'angular.filter', 'angularFileUpload', 'ngToast', 'ui.mask', 'directives.loading', 'bcherny/formatAsCurrency', 'ng.deviceDetector', 'color.picker', 'ngTextTruncate']);
  app.config(function ($routeProvider) {
    $routeProvider

      .when('/', { controller: 'LandingController', templateUrl: 'app/views/Landing.html' })
      .when('/siclick/:tokenSiclick', { controller: 'UsuariosLoginController', templateUrl: 'app/views/Landing.html' })
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
            if (!(Session.IdTipoAcceso === 1 || Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3 || Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === 5 || Session.IdTipoAcceso === 6 || Session.IdTipoAcceso === 7 || Session.IdTipoAcceso === 8)) { $location.path('/404');
            }
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

      .when('/Descuento-Anual', {
        controller: 'DescuentoAnualCreateController', templateUrl: 'app/views/Descuentos/DescuentoAnualCreate.html',
        resolve: {
          'check': function ($location, $cookies) {
            var Session = $cookies.getObject('Session');
            if (!(Session.IdTipoAcceso === 1 || Session.IdTipoAcceso === 7)) { $location.path('/app/views/Aplicaciones/DescuentoAnualCreate.html'); }
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
            if (!(Session.IdTipoAcceso === 1 || Session.IdTipoAcceso === 8)) { $location.path('/404'); }
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

      .when('/ConfigurarRPs/FinalUser', {
        controller: 'EmpresasRPUFController', templateUrl: 'app/views/Empresas/EmpresasRPUF.html',
        resolve: {
          'check': function ($location, $cookies) {
            var Session = $cookies.getObject('Session');
            if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 4)) { $location.path('/404'); }
          }
        }
      })

      .when('/ConfigurarRPs/:IdEmpresa', {
        controller: 'EmpresasRPController', templateUrl: 'app/views/Empresas/EmpresasRP.html',
        resolve: {
          'check': function ($location, $cookies) {
            var Session = $cookies.getObject('Session');
            if (!(Session.IdTipoAcceso === 1 || Session.IdTipoAcceso === 8)) { $location.path('/404'); }
          }
        }
      })

      .when('/DescuentoPromoAzure/:IdEmpresa', {
        controller: 'EmpresaAzurePromoController', templateUrl: 'app/views/Empresas/EmpresaAzurePromo.html',
        resolve: {
          'check': function ($location, $cookies) {
            var Session = $cookies.getObject('Session');
            if (!(Session.IdTipoAcceso === 1 || Session.IdTipoAcceso === 8)) { $location.path('/404'); }
          }
        }
      })

      .when('/Monitor', {
        controller: 'MonitorReadController', templateUrl: 'app/views/PedidoDetalles/MonitorRead.html',
        resolve: {
          'check': function ($location, $cookies) {
            var Session = $cookies.getObject('Session');
            if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3 || Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === 5 || Session.IdTipoAcceso === 6 || Session.IdTipoAcceso === 7 || Session.IdTipoAcceso === 10)) { $location.path('/404'); }
          }
        }
      })

      .when('/Monitor/uf', {
        controller: 'MonitorReadUFController', templateUrl: 'app/views/PedidoDetalles/MonitorReadUF.html',
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

      .when('/MonitorPagos/uf', {
        controller: 'MonitorPagosUF', templateUrl: 'app/views/PedidoDetalles/MonitorPagosUF.html',
        resolve: {
          'check': function ($location, $cookies) {
            var Session = $cookies.getObject('Session');
            if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3 || Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === 5 || Session.IdTipoAcceso === 6 || Session.IdTipoAcceso === 7)) { $location.path('/404'); }
          }
        }
      })

      .when('/MonitorPagos/uf/refrescar', {
        controller: 'MonitorPagosUF', templateUrl: 'app/views/PedidoDetalles/MonitorPagosUF.html',
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
            if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3 || Session.IdTipoAcceso === 10)) { $location.path('/404'); }
          }
        }
      })

      .when('/TerminosCondiciones', {
        controller: 'TerminosReadController', templateUrl: 'app/views/Usuarios/TerminosRead.html',
        resolve: {
          'check': function ($location, $cookies) {
            var Session = $cookies.getObject('Session');
            if (!(Session.IdTipoAcceso === 1 || Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3 || Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === 5 || Session.IdTipoAcceso === 6 || Session.IdTipoAcceso === 7 || Session.IdTipoAcceso === 8)) { $location.path('/404'); }
          }
        }
      })

      .when('/Usuario', {
        controller: 'UsuariosCreateController', templateUrl: 'app/views/Usuarios/UsuariosCreate.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); if (!(Session.IdTipoAcceso === 1 || Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === 6 || Session.IdTipoAcceso === 7 || Session.IdTipoAcceso === 10)) { $location.path('/404'); } } }
      })

      .when('/Usuarios', {
        controller: 'UsuariosReadController', templateUrl: 'app/views/Usuarios/UsuariosRead.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); if (!(Session.IdTipoAcceso === 1 || Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === 6 || Session.IdTipoAcceso === 7 || Session.IdTipoAcceso === 8 || Session.IdTipoAcceso === 10)) { $location.path('/404'); } } }
      })

      .when('/Usuarios/uf', {
        controller: 'UsuarioReadUFController', templateUrl: 'app/views/Usuarios/UsuariosReadUF.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); if (!(Session.IdTipoAcceso === 1 || Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === 6 || Session.IdTipoAcceso === 7 || Session.IdTipoAcceso === 8)) { $location.path('/404'); } } }
      })
      .when('/Empresa', {
        controller: 'EmpresasCreateController', templateUrl: 'app/views/Empresas/EmpresasCreate.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 7 || Session.IdTipoAcceso === 3 || Session.IdTipoAcceso === 10)) { $location.path('/404'); } } }
      })

      .when('/Registrarse', {
        controller: 'RegistrarEmpresaTuclickController', templateUrl: 'app/views/Registrar/RegistrarEmpresaTuclick.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); if ((Session)) { $location.path('/404'); } } }
      })

      
      .when('/Terminos', {
        controller: 'TerminosYCondicionesController', templateUrl: 'app/views/TuClick/TerminosYCondiciones.html'
      }) 

      .when('/AvisoPrivacidad', {
        controller: 'AvisoPrivacidadController', templateUrl: 'app/views/TuClick/AvisoPrivacidad.html',
      })
       
      .when('/DatosContacto', {
        controller: 'DatosContactoController', templateUrl: 'app/views/TuClick/DatosContacto.html',
      })

      .when('/Empresa/ActualizarDominio/:IdEmpresa', {
        controller: 'EmpresasUpdateMicrosoftDomainController', templateUrl: 'app/views/Empresas/EmpresasUpdateMicrosoftDomain.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); if (!(Session.IdTipoAcceso === 1 || Session.IdTipoAcceso === 2)) { $location.path('/404'); } } }
      })

      .when('/Empresa/:IdEmpresa', {
        controller: 'EmpresasUpdateController', templateUrl: 'app/views/Empresas/EmpresasUpdate.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === 6)) { $location.path('/404'); } } }
      })

      .when('/Clientes', {
        controller: 'EmpresasXEmpresasReadController', templateUrl: 'app/views/EmpresasXEmpresas/EmpresasXEmpresasRead.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3 || Session.IdTipoAcceso === 7 || Session.IdTipoAcceso === 10)) { $location.path('/404'); } } }
      })

      .when('/Productos/:Busqueda', {
        controller: 'ProductosReadController', templateUrl: 'app/views/Productos/ProductosRead.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3 || Session.IdTipoAcceso === 7 || Session.IdTipoAcceso === 10)) { $location.path('/404'); } } }
      })

      .when('/Productos', {
        controller: 'ProductosReadController', templateUrl: 'app/views/Productos/ProductosRead.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3 || Session.IdTipoAcceso === 7 || Session.IdTipoAcceso === 10)) { $location.path('/404'); } } }
      })

      .when('/Comprar', {
        controller: 'ComprarController', templateUrl: 'app/views/PedidoDetalles/Comprar.html',
        resolve: {
          'check': function ($location, $cookies) {
            var Session = $cookies.getObject('Session');
            if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3 || Session.IdTipoAcceso === 10)) {
              $location.path('/404');
            }
          }
        }
      })
      .when('/MonitorAws', {
        controller: ' MonitorDetalleAwsController', templateUrl: 'app/views/Aws/MonitorDetallesAws.html',
        resolve: {
          'check': function ($location, $cookies) {
            var Session = $cookies.getObject('Session');
            if (!!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3 || Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === 5 || Session.IdTipoAcceso === 6 || Session.IdTipoAcceso === 7)) {
              $location.path('/404');
            }
          }
        }
      })


      .when('/uf/Comprar', {
        controller: 'ComprarUFController', templateUrl: 'app/views/PedidoDetalles/ComprarUF.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); if (!(Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === 5 || Session.IdTipoAcceso === 6 || Session.IdTipoAcceso === 2)) { $location.path('/404'); } } }
      })

      .when('/Carrito', {
        templateUrl: 'app/views/PedidoDetalles/PedidoDetallesRead.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3 || Session.IdTipoAcceso === 10)) { $location.path('/404'); } } }
      })

      .when('/Carrito/:error', {
        controller: 'PedidoDetallesReadController', templateUrl: 'app/views/PedidoDetalles/PedidoDetallesRead.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3 || Session.IdTipoAcceso === 10)) { $location.path('/404'); } } }
      })

      .when('/uf/Productos/:Busqueda', {
        controller: 'ProductosUFReadController', templateUrl: 'app/views/Productos/ProductosUFRead.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === 5 || Session.IdTipoAcceso === 6)) { $location.path('/404'); } } }
      })

      .when('/uf/Productos', {
        controller: 'ProductosUFReadController', templateUrl: 'app/views/Productos/ProductosUFRead.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === 5 || Session.IdTipoAcceso === 6)) { $location.path('/404'); } } }
      })

      .when('/uf/Carrito', {
        controller: 'PedidoDetallesUFReadController', templateUrl: 'app/views/PedidoDetalles/PedidoDetallesUFRead.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === 5 || Session.IdTipoAcceso === 6)) { $location.path('/404'); } } }
      })

      .when('/uf/Carrito/:error', {
        controller: 'PedidoDetallesUFReadController', templateUrl: 'app/views/PedidoDetalles/PedidoDetallesUFRead.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === 5 || Session.IdTipoAcceso === 6)) { $location.path('/404'); } } }
      })

      .when('/Favoritos', {
        controller: 'ProductoGuardadosReadController', templateUrl: 'app/views/ProductoGuardados/ProductoGuardadosRead.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3)) { $location.path('/404'); } } }
      })

      .when('/Empresas/Importar/:IdEmpresa', {
        controller: 'EmpresasImportController', templateUrl: 'app/views/Empresas/EmpresasImport.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); if (!(Session.IdTipoAcceso === 1 || Session.IdTipoAcceso === 8)) { $location.path('/404'); } } }
      })

      .when('/Empresas/Importar/:IdEmpresa/:IdMicrosoft/:Dominio/:Name', {
        controller: 'EmpresasCompletarController', templateUrl: 'app/views/Empresas/EmpresasCompletar.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); if (!(Session.IdTipoAcceso === 1)) { $location.path('/404'); } } }
      })

      .when('/Empresas', {
        controller: 'EmpresasReadController', templateUrl: 'app/views/Empresas/EmpresasRead.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); if (!(Session.IdTipoAcceso === 1 || Session.IdTipoAcceso === 8)) { $location.path('/404'); } } }
      })

      .when('/Credito/:IdEmpresa', {
        controller: 'EmpresasCreditoUpdateController', templateUrl: 'app/views/Empresas/EmpresasCreditoUpdate.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); if (!(Session.IdTipoAcceso === 1 || Session.IdTipoAcceso === 8)) { $location.path('/404'); } } }
      })

      .when('/Promocion', {
        controller: 'PromocionsCreateController', templateUrl: 'app/views/Promocions/PromocionsCreate.html',
        resolve: {
          'check': function ($location, $cookies) {
            var Session = $cookies.getObject('Session');
            if (!(Session.IdTipoAcceso === 1) && !(Session.IdTipoAcceso === 2) && !(Session.IdTipoAcceso === 3)) { $location.path('/404'); }
          }
        }
      })

      .when('/Promocions', {
        controller: 'PromocionsReadController', templateUrl: 'app/views/Promocions/PromocionsRead.html',
        resolve: {
          'check': function ($location, $cookies) {
            var Session = $cookies.getObject('Session');
            if (!(Session.IdTipoAcceso === 1) && !(Session.IdTipoAcceso === 2) && !(Session.IdTipoAcceso === 3)) { $location.path('/404'); }
          }
        }
      })

      .when('/Promocion/:IdPromocion', {
        controller: 'PromocionsUpdateController', templateUrl: 'app/views/Promocions/PromocionsUpdate.html',
        resolve: {
          'check': function ($location, $cookies) {
            var Session = $cookies.getObject('Session');
            if (!(Session.IdTipoAcceso === 1) && !(Session.IdTipoAcceso === 2) && !(Session.IdTipoAcceso === 3)) { $location.path('/404'); }
          }
        }
      })

      .when('/Reportes', {
        controller: 'ReportesController', templateUrl: 'app/views/Reportes.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); if (!(Session.IdTipoAcceso === 1 || Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3 || Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === 5 || Session.IdTipoAcceso === 6 || Session.IdTipoAcceso === 7 || Session.IdTipoAcceso === 8 || Session.IdTipoAcceso === 10)) { $location.path('/404'); } } }
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

      .when('/MonitorAws', {
        controller: 'MonitorDetalleAwsController', templateUrl: 'app/views/Aws/MonitorDetalleAws.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); 
        if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3 || Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === 5 || Session.IdTipoAcceso === 6 || Session.IdTipoAcceso === 7 || Session.IdTipoAcceso === 1)) { $location.path('/404'); } } }
      })




      .when('/Niveles/Distribuidor', {
        controller: 'NivelesClienteFinalController', templateUrl: 'app/views/Niveles/NivelesClienteFinal.html',
        resolve: {
          'check': function ($location, $cookies, jwtHelper) {
            var Session = $cookies.getObject('Session');
            var decoded = jwtHelper.decodeToken(Session.Token);
            if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3) || !decoded.Niveles) { $location.path('/404'); }
          }
        }
      })

      .when('/Niveles/Distribuidor/:IdDescuento/Descuentos', {
        controller: 'DescuentosNivelesController', templateUrl: 'app/views/Descuentos/DescuentosNiveles.html',
        resolve: {
          'check': function ($location, $cookies, jwtHelper) {
            var Session = $cookies.getObject('Session');
            var decoded = jwtHelper.decodeToken(Session.Token);
            if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3) || !decoded.Niveles) { $location.path('/404'); }
          }
        }
      })

      .when('/Niveles/:IdNivel/Productos', {
        controller: 'DescuentosNivelesCSController', templateUrl: 'app/views/Descuentos/DescuentosNivelesCS.html',
        resolve: {
          'check': function ($location, $cookies, jwtHelper) {
            var Session = $cookies.getObject('Session');
            if (!Session.IdTipoAcceso === 1) { $location.path('/404'); }
          }
        }
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
      .when('/MonitorConsulta', {
        controller: 'MonitorConsultaController', templateUrl: 'app/views/PedidoDetalles/MonitorConsultasUF.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); if (!(Session.IdTipoAcceso === 2)) { $location.path('/404'); } } }
      })

      .when('/SuccessOrder', {
        controller: 'SuccessOrderController', templateUrl: 'app/views/PedidoDetalles/SuccessOrder.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); if (!(Session.IdTipoAcceso === 1 || Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 10)) { $location.path('/'); } } }
      })

      .when('/AdministrarSuscripciones', {
        controller: 'SincronizadorReadController', templateUrl: 'app/views/Sincronizador/SincronizadorRead.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); if (!(Session.IdTipoAcceso === 1 || Session.IdTipoAcceso === 8)) { $location.path('/404'); } } }
      })

      .when('/MonitorVmware', {
        controller: 'MonitorDetalleVmwareController', templateUrl: 'app/views/Vmware/MonitorDetalleVmware.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); 
        if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3 || Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === 5 || Session.IdTipoAcceso === 6 || Session.IdTipoAcceso === 7 || Session.IdTipoAcceso === 1)) { $location.path('/404'); } } }
      })
      .when('/MonitorAws', {
        controller: 'MonitorDetalleAwsController', templateUrl: 'app/views/Aws/MonitorDetalleAws.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); 
        if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3 || Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === 5 || Session.IdTipoAcceso === 6 || Session.IdTipoAcceso === 7 || Session.IdTipoAcceso === 1)) { $location.path('/404'); } } }
      })

      .when('/Restablecer', { controller: 'UsuariosRestablecerController', templateUrl: 'app/views/Usuarios/UsuariosRestablecer.html' })
      .when('/CambiarContrasena/:encryptedObject', { controller: 'UsuariosCambiarContrasenaController', templateUrl: 'app/views/Usuarios/UsuariosCambiarContrasena.html' })
      .when('/MonitorAws', {
        controller: 'MonitorDetalleAwsController', templateUrl: 'app/views/Aws/MonitorDetalleAws.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); 
        if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3 || Session.IdTipoAcceso === 4 || Session.IdTipoAcceso === 5 || Session.IdTipoAcceso === 6 || Session.IdTipoAcceso === 7 || Session.IdTipoAcceso === 1)) { $location.path('/404'); } } }
      })
      /* .when('/:Subdominio', { controller: 'UsuariosLoginController', templateUrl: 'app/views/Usuarios/UsuariosLogin.html' }) */

      .when('/MonitorMicrosoft', {
        controller: 'MonitorAgenteController', templateUrl: 'app/views/MonitorAgente/MonitorAgente.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); 
        if (!(Session.IdTipoAcceso === 1 || Session.IdTipoAcceso === 8)) { $location.path('/404'); } } }
      })

      .when('/ImportacionesAutodesk', {
        controller: '', templateUrl: 'app/views/ImportarPedidosAutodesk/ImportarPedidosAutodesk.html',
        resolve: { 'check': function ($location, $cookies) { var Session = $cookies.getObject('Session'); 
        if (!(Session.IdTipoAcceso === 1 || Session.IdTipoAcceso === 8 || Session.IdTipoAcceso === 10 || Session.IdTipoAcceso === 2)) { $location.path('/404'); } } }
      })

      .when('/MonitorMPN', {
        controller: 'MonitorMPNController', templateUrl: 'app/views/MonitorMPN/MonitorMPN.html',
        resolve: { 'check': function ($location, $cookies) {
          var Session = $cookies.getObject('Session');
          if (!(Session.IdTipoAcceso === 1 || Session.IdTipoAcceso === 8)) { $location.path('/404'); }
        }}
      })

      .when('/ParticionPedidos', {
        controller: 'ParticionPedidosController', templateUrl: 'app/views/Autodesk/ParticionPedido.html',
        resolve: { 'check': function ($location, $cookies) {
          var Session = $cookies.getObject('Session');
          if (!(Session.IdTipoAcceso === 1 || Session.IdTipoAcceso === 8 || Session.IdTipoAcceso === 10)) { $location.path('/404'); }
        }}
      })

      .when('/CambiarDistribuidor', {
        controller: 'CambiarDistribuidorController', templateUrl: 'app/views/SuperUsuario/CambiarDistribuidor.html',
        resolve: { 'check': function ($location, $cookies) {
          var Session = $cookies.getObject('Session');
          if (!(Session.IdTipoAcceso === 10)) { $location.path('/404'); }
        }}
      })

      .when('/ActualizarCSN', {
        controller: 'ActualizarCSNController', templateUrl: 'app/views/Autodesk/ActualizarCSN.html',
        resolve: { 'check': function ($location, $cookies) {
          var Session = $cookies.getObject('Session');
          if (!(Session.IdTipoAcceso === 1 || Session.IdTipoAcceso === 8 || Session.IdTipoAcceso === 10 || Session.IdTipoAcceso === 2)) { $location.path('/404'); }
        }}
      })

      .when('/Reconciliacion', {
        templateUrl: 'app/views/Reconciliacion/Reconciliacion.html',
        resolve: { 'check': function ($location, $cookies) {
          var Session = $cookies.getObject('Session');
          if (!(Session.IdTipoAcceso === 1 || Session.IdTipoAcceso === 8)) { $location.path('/404'); }
        }}
      })

      .when('/ConfirmarSP', {
        templateUrl: 'app/views/Autodesk/ConfirmarSP.html',
        resolve: { 'check': function ($location, $cookies) {
          var Session = $cookies.getObject('Session');
          if (!(Session.IdTipoAcceso === 1 || Session.IdTipoAcceso === 8 || Session.IdTipoAcceso === 10)) { $location.path('/404'); }
        }}
      })

      .when('/Politicas/:politic', {
        controller: 'PoliticasReadController',
        templateUrl: 'app/views/Usuarios/PoliticasRead.html'
      })

      .when('/MonitorPremium', {
        templateUrl: 'app/views/Autodesk/MonitorPremium.html',
        resolve: { 'check': function ($location, $cookies) {
          var Session = $cookies.getObject('Session');
          if (!(Session.IdTipoAcceso === 1 || Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 8 || Session.IdTipoAcceso === 10)) { $location.path('/404'); }
        }}
      })

      .when('/confirmacionCompra', {
        templateUrl: 'app/views/openpay/confirmacion3ds.html',
        resolve: { 'check': function ($location, $cookies) {
          var Session = $cookies.getObject('Session');
          if (!(Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 3 || Session.IdTipoAcceso === 10)) { $location.path('/404'); }
        }}
      })

      .when('/MonitorContratos', {
        templateUrl: 'app/views/Autodesk/MonitorContratos.html',
        resolve: { 'check': function ($location, $cookies) {
          var Session = $cookies.getObject('Session');
          if (!(Session.IdTipoAcceso === 1 || Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 8 || Session.IdTipoAcceso === 10)) { $location.path('/404'); }
        }}
      })

      .when('/FacturacionAzure', {
        controller: 'FacturacionController', templateUrl: 'app/views/Facturacion/FacturacionAzure.html',
        resolve: { 'check': function ($location, $cookies) {
          var Session = $cookies.getObject('Session');
          if (!(Session.IdTipoAcceso === 1 || Session.IdTipoAcceso === 8)) { $location.path('/404'); }
        }}
      })
      .otherwise({ redirectTo: '/404' });
  });
}());
