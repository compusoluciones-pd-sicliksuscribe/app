(function () {
  var TiposAccesosFactory = function ($http, $cookieStore, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookieStore.get('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.getTiposAccesos = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'TiposAccesos');
    };

    factory.getTipoAcceso = function (IdTipoAcceso) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'TiposAccesos/' + IdTipoAcceso);
    };

    return factory;
  };

  TiposAccesosFactory.$inject = ['$http', '$cookieStore', '$rootScope'];

  angular.module('marketplace').factory('TiposAccesosFactory', TiposAccesosFactory);
}());
