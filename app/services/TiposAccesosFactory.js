(function () {
  var TiposAccesosFactory = function ($http, $cookies, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookies.getObject('Session');
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

  TiposAccesosFactory.$inject = ['$http', '$cookies', '$rootScope'];

  angular.module('marketplace').factory('TiposAccesosFactory', TiposAccesosFactory);
}());
