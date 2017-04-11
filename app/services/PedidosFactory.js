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

    factory.patchPaymentInformation = function (paymentResult)  {
      factory.refreshToken();
      return $http.patch($rootScope.API + 'orders/update-payment-details', paymentResult);
    }

    return factory;
  };

  PedidosFactory.$inject = ['$http', '$cookieStore', '$rootScope'];

  angular.module('marketplace').factory('PedidosFactory', PedidosFactory);
}());
