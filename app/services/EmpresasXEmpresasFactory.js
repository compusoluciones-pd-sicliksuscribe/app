(function () {
  var EmpresasXEmpresasFactory = function ($http, $cookies, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookies.getObject('Session');
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

    factory.getClientsTuclick = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'tuclick/get-clients/');
    };

    factory.postExchangeRate = function (Empresas) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'exchange-rate', Empresas);
    };

    factory.patchCancelDate = function (dataValues) {
      factory.refreshToken();
      return $http.patch($rootScope.API + 'enterprise/' + dataValues.IdEmpresaUsuarioFinal + '/cancel-dates', dataValues);
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

    factory.getAcceptanceAgreementByClient = function (IdEmpresa) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'agreements/clients/' + IdEmpresa);
    };

    factory.getCustomerAgreements = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'agreements/get-customer-agreement');
    };

    factory.updateDiscountAzure = function (empresa) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'enterprise/update-discount-azure', empresa);
    };

    factory.putEmpresasXEmpresaAzureBudget = function (EmpresasXEmpresa) {
      factory.refreshToken();
      console.log('AAPI  ', $rootScope.API);
      return $http.put($rootScope.API + 'enterprise-by-enterprise/setAzureMovement', EmpresasXEmpresa);
    };

    return factory;
  };

  EmpresasXEmpresasFactory.$inject = ['$http', '$cookies', '$rootScope'];

  angular.module('marketplace').factory('EmpresasXEmpresasFactory', EmpresasXEmpresasFactory);
}());
