(function () {
  var ReportesFactory = function ($http, $cookieStore, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookieStore.get('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.getReportes = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'Reportes');
    };

    factory.getGenerarReporte = function (IdReporte) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'GenerarReporte/' + IdReporte);
    };

    return factory;
  };

  ReportesFactory.$inject = ['$http', '$cookieStore', '$rootScope'];

  angular.module('marketplace').factory('ReportesFactory', ReportesFactory);
}());
