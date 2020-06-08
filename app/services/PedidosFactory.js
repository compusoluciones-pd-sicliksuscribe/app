(function () {
  var PedidosFactory = function ($http, $cookies, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookies.getObject('Session');
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

    factory.patchPedidosParaRenovar = function (paymentResult) {
      factory.refreshToken();
      return $http.patch($rootScope.API + 'tuclick/update-payment-details', paymentResult);
    };

    factory.patchPaymentInformationPayPal = function (paymentResult) {
      factory.refreshToken();
      return $http.patch($rootScope.API + 'orders/update-payment-details', paymentResult);
    };

    factory.patchPaymentInformationPrePaid = function (paymentResult) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'orders/pay-with-prepaid', paymentResult);
    };

    factory.renewContract = function (contractData) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'autodesk/contracts/renew', contractData);
    };

    factory.renewContractTuClick = function (contractData, currentDistribuidor) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'autodesk/contracts/renew/tuclick/' + currentDistribuidor, contractData);
    };

    factory.payWithCardOpenpay = function (bodyReq) {
      delete $http.defaults.headers.common['Authorization'];
      factory.refreshToken();
      return $http.post($rootScope.API + 'open-pay/pay-with-card', bodyReq);
    };
    
    factory.payWithSpeiOpenpay = function (bodyReq) {
      delete $http.defaults.headers.common['Authorization'];
      factory.refreshToken();
      return $http.post($rootScope.API + 'open-pay/pay-with-spei', bodyReq);
    };
    
    factory.payInStore = function (bodyReq) {
      delete $http.defaults.headers.common['Authorization'];
      factory.refreshToken();
      return $http.post($rootScope.API + 'open-pay/pay-in-store', bodyReq);
    };
    
    return factory;
  };

  PedidosFactory.$inject = ['$http', '$cookies', '$rootScope'];

  angular.module('marketplace').factory('PedidosFactory', PedidosFactory);
}());
