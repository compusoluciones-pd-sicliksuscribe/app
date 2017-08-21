(function () {
  var NivelesClienteFinalFactory = function ($http, $cookieStore, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookieStore.get('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.getMisProductos = function() {
      factory.refreshToken();
      return $http.get($rootScope.API + 'MisProductos');
    };

    factory.getLevels = function() {
      factory.refreshToken();
      return $http.get($rootScope.API + 'distributor/customer/level');
    };

    factory.deleteLevel = function(levelId) {
      factory.refreshToken();
      return $http.delete($rootScope.API + 'distributor/customer/' + levelId + '/level');
    };

    factory.addLevel = function(level) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'distributor/customer/level', level);
    };

    return factory;
  };

  NivelesClienteFinalFactory.$inject = ['$http', '$cookieStore', '$rootScope'];

  angular.module('marketplace').factory('NivelesClienteFinalFactory', NivelesClienteFinalFactory);
}());
