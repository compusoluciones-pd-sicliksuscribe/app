(function () {
  var EstadosFactory = function ($http, $cookieStore, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookieStore.get('Session');
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

    return factory;
  };

  EstadosFactory.$inject = ['$http', '$cookieStore', '$rootScope'];

  angular.module('marketplace').factory('EstadosFactory', EstadosFactory);
}());
