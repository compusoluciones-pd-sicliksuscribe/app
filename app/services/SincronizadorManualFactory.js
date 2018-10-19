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

    factory.getSincronizadorManual = function (agente, offset) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'microsoft/manualsynchronizer/' + agente + '/offset/' + offset);
    };

    factory.getAgentes = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'microsoft/manualsynchronizer/Agentes');
    };

    factory.updateSincronizadorManual = function (details) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'microsoft/manualsynchronizer', details);
    };

    factory.Sincronizar = function (payload) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'microsoft/manualSync', payload);
    };

    factory.SincronizarCancelar = function (detalle) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'microsoft/manualSync/Cancel', detalle);
    };

    return factory;
  };

  SincronizadorManualFactory.$inject = ['$http', '$cookies', '$rootScope'];

  angular.module('marketplace').factory('SincronizadorManualFactory', SincronizadorManualFactory);
}());
