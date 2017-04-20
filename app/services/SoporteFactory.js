(function () {
  var SoporteFactory = function ($http, $cookieStore, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookieStore.get('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.getSolicitudes = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'support');
    };

    factory.postSolicitud = function (Solicitud) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'support', Solicitud);
    };

    factory.patchSolicitud = function (idSolicitud, Solicitud) {
      factory.refreshToken();
      return $http.patch($rootScope.API + 'support/' + idSolicitud, Solicitud);
    };

    factory.getStatus = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'support-status');
    };

    factory.getSolicitud = function (idSolicitud) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'support/'+ idSolicitud);
    };

    return factory;
  };

  SoporteFactory.$inject = ['$http', '$cookieStore', '$rootScope'];

  angular.module('marketplace').factory('SoporteFactory', SoporteFactory);
}());
