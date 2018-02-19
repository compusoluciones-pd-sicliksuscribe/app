(function () {
  var PedidoDetallesFactory = function ($http, $cookies, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookies.getObject('Session');
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
      return $http.post($rootScope.API + 'shopping-cart/credit-card-payments');
    };

    factory.prepararPaypal = function (params) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'paypal/order', params);
    };

    factory.confirmarPaypal = function (params) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'paypal/order/confirm', params);
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

    factory.monitorCalculationsPayPal = function (Pedidos) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'orders/renovations/payments/paypal/1', Pedidos);
    };

    factory.payWidthCard = function (Pedidos) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'orders/pay-width-card', Pedidos);
    };

    factory.preparePayPal = function (params) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'paypal/order', params);
    };

    factory.confirmPayPal = function (params) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'paypal/order/confirm', params);
    };

    factory.payWithPaypal = function (Pedidos) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'orders/pay-with-paypal', Pedidos);
    };

    return factory;
  };

  PedidoDetallesFactory.$inject = ['$http', '$cookies', '$rootScope'];

  angular.module('marketplace').factory('PedidoDetallesFactory', PedidoDetallesFactory);
}());
