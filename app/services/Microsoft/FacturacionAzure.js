(function () {
  var FacturacionAzure = function ($http, $cookies, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = () => {
      Session = $cookies.getObject('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.ordersBillAzure = function () {
      factory.refreshToken();
      return $http.get($rootScope.MAPI + 'subscriptions/ordersBillAzurePlan');
    };

    factory.invoices = function () {
      factory.refreshToken();
      return $http.put($rootScope.MAPI + 'subscriptions/invoices');
    };

    factory.reconciliationAzurePlan = function () {
      factory.refreshToken();
      return $http.put($rootScope.MAPI + 'subscriptions/reconciliationAzurePlan');
    };

    factory.updateDetailOrdersAzurePlan = function () {
      factory.refreshToken();
      return $http.put($rootScope.MAPI + 'subscriptions/updateDetailOrdersAzurePlan');
    };

    return factory;
  };

  FacturacionAzure.$inject = ['$http', '$cookies', '$rootScope'];

  angular.module('marketplace').factory('FacturacionAzure', FacturacionAzure);
}());
