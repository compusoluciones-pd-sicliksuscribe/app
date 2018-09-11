(function () {
  var SincronizadorManualFactory = function ($http, $cookies, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookies.getObject('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.getSincronizadorManual = function (agente) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'microsoft/manualsynchronizer/' + agente);
    };

    return factory;
  };

  SincronizadorManualFactory.$inject = ['$http', '$cookies', '$rootScope'];

  angular.module('marketplace').factory('SincronizadorManualFactory', SincronizadorManualFactory);
}());
