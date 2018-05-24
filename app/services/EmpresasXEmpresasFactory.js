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

    factory.postExchangeRate = function (Empresas) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'exchange-rate', Empresas);
    };

    factory.postCancelDate = function (Empresa) {
      factory.refreshToken();
      delete Empresa.MostrarMensajeError;
      delete Empresa.NombreNivel;
      delete Empresa.NombreEmpresa;
      return $http.patch($rootScope.API + 'enterprise/' + Empresa.IdEmpresaUsuarioFinal + '/cancel-dates', Empresa);
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

    return factory;
  };

  EmpresasXEmpresasFactory.$inject = ['$http', '$cookies', '$rootScope'];

  angular.module('marketplace').factory('EmpresasXEmpresasFactory', EmpresasXEmpresasFactory);
}());
