(function () {
  var VersionFactory = function ($http, $cookies, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookies.getObject('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.getVersiones = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'versions');
    };

    factory.getVersionDetalle = function (IdVersion) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'versions/'+IdVersion);
    };

    return factory;
  };
  VersionFactory.$inject = ['$http', '$cookies', '$rootScope'];
  angular.module('marketplace').factory('VersionFactory', VersionFactory);
}());
