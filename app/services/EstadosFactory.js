(function () {
  var EstadosFactory = function ($http, $cookies, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookies.getObject('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.getEstados = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'Estados');
    };

    factory.getEstado = function (IdEstado) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'Estados/' + IdEstado);
    };

    factory.getEstadosDiccionario = function (clave) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'Estados/Diccionario/' + clave);
    };
    return factory;
  };

  EstadosFactory.$inject = ['$http', '$cookies', '$rootScope'];

  angular.module('marketplace').factory('EstadosFactory', EstadosFactory);
}());
