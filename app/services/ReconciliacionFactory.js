(function () {
  var ReconciliacionFactory = function ($http, $cookies, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookies.getObject('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.getReconciliacion = function (dateFilter) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'reconciliacion/' + dateFilter);
    };

    factory.getHistogramInfo = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'histograma/');
    };

    factory.getTimeLine = function (body) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'timeline/' + body.IdFactura + '/' + body.IdLicencia);
    };
    
    factory.getTotalCS = function (date) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'ventasClick/' + date);
    };

    return factory;
  };

  ReconciliacionFactory.$inject = ['$http', '$cookies', '$rootScope'];

  angular.module('marketplace').factory('ReconciliacionFactory', ReconciliacionFactory);
}());
