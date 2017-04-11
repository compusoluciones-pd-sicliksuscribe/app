(function () {
  var AccesosAmazonFactory = function ($http, $cookieStore, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookieStore.get('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.getAccesosAmazon = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'AccesosAmazon');
    };

    return factory;
  };

  AccesosAmazonFactory.$inject = ['$http', '$cookieStore', '$rootScope'];

  angular.module('marketplace').factory('AccesosAmazonFactory', AccesosAmazonFactory);
}());
