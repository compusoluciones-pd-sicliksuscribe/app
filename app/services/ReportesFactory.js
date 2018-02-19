(function () {
  var ReportesFactory = function ($http, $cookies, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookies.getObject('Session');
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

  ReportesFactory.$inject = ['$http', '$cookies', '$rootScope'];

  angular.module('marketplace').factory('ReportesFactory', ReportesFactory);
}());
