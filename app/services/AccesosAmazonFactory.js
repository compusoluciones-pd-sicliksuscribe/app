(function () {
  var AccesosAmazonFactory = function ($http, $cookies, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookies.getObject('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.getAccesosAmazon = function () {
      factory.refreshToken();
      return $http.getObject($rootScope.API + 'AccesosAmazon');
    };

    return factory;
  };

  AccesosAmazonFactory.$inject = ['$http', '$cookies', '$rootScope'];

  angular.module('marketplace').factory('AccesosAmazonFactory', AccesosAmazonFactory);
}());
