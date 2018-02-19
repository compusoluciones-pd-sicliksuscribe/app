(function () {
  var PromocionsFactory = function ($http, $cookies, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookies.getObject('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.getPromocions = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'Promocions');
    };

    factory.getPromocion = function (IdPromocion) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'Promocions/' + IdPromocion);
    };

    factory.postPromocion = function (Promocion) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'Promocions', Promocion);
    };

    factory.putPromocion = function (Promocion) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'Promociones', Promocion);
    };

    return factory;
  };

  PromocionsFactory.$inject = ['$http', '$cookies', '$rootScope'];

  angular.module('marketplace').factory('PromocionsFactory', PromocionsFactory);
}());
