(function () {
  var UsuariosXEmpresasFactory = function ($http, $cookieStore, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookieStore.get('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.getUsuariosXEmpresas = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'UsuariosXEmpresas');
    };

    factory.getUsuariosXEmpresa = function (IdEmpresa) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'UsuariosXEmpresas/' + IdEmpresa);
    };


    factory.postUsuariosXEmpresa = function (UsuariosXEmpresa) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'UsuariosXEmpresas', UsuariosXEmpresa);
    };

    factory.putUsuariosXEmpresa = function (UsuariosXEmpresa) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'UsuariosXEmpresas', UsuariosXEmpresa);
    };

    return factory;
  };

  UsuariosXEmpresasFactory.$inject = ['$http', '$cookieStore', '$rootScope'];

  angular.module('marketplace').factory('UsuariosXEmpresasFactory', UsuariosXEmpresasFactory);
}());
