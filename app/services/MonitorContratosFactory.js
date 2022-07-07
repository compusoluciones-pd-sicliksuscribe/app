(function () {
  var MonitorContratosFactory = function ($http, $cookies, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = () => {
      Session = $cookies.getObject('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.getEndCustomer = () => {
      factory.refreshToken();
      return $http.get($rootScope.API + 'autodesk/get-endCustomer');
    };

    factory.getContractCustomer = (EndCustomerCSN) => {
      factory.refreshToken();
      return $http.get($rootScope.API + 'autodesk/get-contract-customer/' + EndCustomerCSN);
    };

    factory.getUserEndCustomer = (EndCustomerCSN) => {
      factory.refreshToken();
      return $http.get($rootScope.API + 'autodesk/get-userEndCustomer/' + EndCustomerCSN);
    };

    factory.renewContract = function (contractData) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'autodesk/contract-subscriptions/renew', contractData);
    };

    factory.actualizarEsquemaRenovacion = (contractNumber, serialNumber, contractTerm) => {
      factory.refreshToken();
      return $http.post($rootScope.API + 'autodesk/update-subscriptions', {contractNumber, serialNumber, contractTerm});
    };

    factory.extendContract = contractData => {
      factory.refreshToken();
      return $http.post($rootScope.API + 'autodesk/contracts/extend', contractData);
    };

    return factory;
  };

  MonitorContratosFactory.$inject = ['$http', '$cookies', '$rootScope'];

  angular.module('marketplace').factory('MonitorContratosFactory', MonitorContratosFactory);
}());
