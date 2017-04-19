(function () {
  var EmpresasXEmpresasFactory = function ($http, $cookieStore, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookieStore.get('Session');
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

    factory.postExchangeRate = function (Empresas) {
      console.log(Empresas);
      factory.refreshToken();
      return $http.post($rootScope.API + 'exchange-rate', Empresas);
    };

    factory.postEmpresasXEmpresa = function (EmpresasXEmpresa) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'EmpresasXEmpresas', EmpresasXEmpresa);
    };

    factory.putEmpresasXEmpresa = function (EmpresasXEmpresa) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'EmpresasXEmpresas', EmpresasXEmpresa);
    };

    return factory;
  };

  EmpresasXEmpresasFactory.$inject = ['$http', '$cookieStore', '$rootScope'];

  angular.module('marketplace').factory('EmpresasXEmpresasFactory', EmpresasXEmpresasFactory);
}());
