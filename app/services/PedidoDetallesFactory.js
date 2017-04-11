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

    factory.postPedidoDetalle = function (PedidoDetalle) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'PedidoDetalles', PedidoDetalle);
    };

    factory.getPedidoDetalles = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'PedidoDetalles');
    };

    factory.postPedidoDetallesAddOns = function (Producto) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'PedidoDetalles/AddOns', Producto);
    };

    factory.deletePedidoDetalles = function (IdPedidoDetalle) {
      factory.refreshToken();
      return $http.delete($rootScope.API + 'PedidoDetalles/' + IdPedidoDetalle);
    };

    factory.postMonitor = function (IdEmpresaUsuarioFinal) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'Monitor', IdEmpresaUsuarioFinal);
    };

    factory.putPedidoDetalle = function (PedidoDetalle) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'PedidoDetalles', PedidoDetalle);
    };

    factory.getPrepararCompra = function (enCheckout) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'PedidoDetalles/PrepararCompra/' + enCheckout);
    };

    factory.getContarProductos = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'PedidoDetalles/ContarProductos');
    };

    factory.getComprar = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'PedidoDetalles/Comprar');
    };

    factory.postWarningCredito = function (params) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'warningCredito', params);
    };

    factory.getValidarCarrito = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'PedidoDetalles/validarCarrito');
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
      return $http.get($rootScope.API + 'orders/get-pending-orders-to-pay');
    };

    factory.monitorCalculations = function (Pedidos) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'orders/pending-orders-monitor-calculations', Pedidos);
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
