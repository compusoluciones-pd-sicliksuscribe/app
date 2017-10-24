(function () {
  var TipoCambioFactory = function ($http, $cookies, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookies.getObject('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.getTipoCambio = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'TipoCambio');
    };

    return factory;
  };

  TipoCambioFactory.$inject = ['$http', '$cookies', '$rootScope'];

  angular.module('marketplace').factory('TipoCambioFactory', TipoCambioFactory);
}());
