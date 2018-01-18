(function () {
  var FacturacionFactory = function ($http, $cookies, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookies.getObject('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.postDarDeAlta = function (datos) {
      factory.refreshToken();
      return $http({
        method: 'POST',
        url: $rootScope.API + 'billing-to-third-parties/signup',
        headers: {
          'Content-Type': undefined,
          'token': Session.Token
        },
        data: datos
      });
    };

    factory.ringById = function (id) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'billing-to-third-parties/ring/' + id);
    };

    factory.selectBills = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'billing-to-third-parties/pending-bills');
    };

    factory.billStatus = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'billing-status');
    };

    factory.datesBills = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'dates-bills');
    };

    factory.selectBillsDetails = function (IdFactura) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'billing-to-third-parties/bill-details/' + IdFactura);
    };

    factory.deleteBill = function (IdFacturaDetalle) {
      factory.refreshToken();
      return $http.delete($rootScope.API + 'billing-to-third-parties/bill-details/' + IdFacturaDetalle);
    };

    factory.createBill = function (factura) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'billing-to-third-parties/bill-details/', factura);
    };

    factory.updateBill = function (factura) {
      factory.refreshToken();
      return $http.patch($rootScope.API + 'billing-to-third-parties/bill-details/', factura);
    };

    factory.getReceptor = function (IdFactura) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'billing-to-third-parties/pending-bills/' + IdFactura);
    };

    factory.updateExtras = function (factura) {
      factory.refreshToken();
      return $http.patch($rootScope.API + 'billing-to-third-parties/bill-details/extras', factura);
    };

    factory.activateBill = function (factura) {
      factory.refreshToken();
      return $http.patch($rootScope.API + 'billing-to-third-parties/bill-details/activate', factura);
    };

    factory.cancelBill = function (factura) {
      factory.refreshToken();
      return $http.patch($rootScope.API + 'billing-to-third-parties/bill-details/' + factura);
    };

    return factory;
  };

  FacturacionFactory.$inject = ['$http', '$cookies', '$rootScope'];

  angular.module('marketplace').factory('FacturacionFactory', FacturacionFactory);
}());
