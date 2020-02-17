(function () {
  var MonitorAgenteFactory = function ($http, $cookies, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookies.getObject('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.getOrdersMonitor = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'microsoft/monitor/orders');
    };

    return factory;
  };

  MonitorAgenteFactory.$inject = ['$http', '$cookies', '$rootScope'];

  angular.module('marketplace').factory('MonitorAgenteFactory', MonitorAgenteFactory);
}());
