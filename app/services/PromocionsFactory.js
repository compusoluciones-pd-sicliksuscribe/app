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

    factory.getPromocions = function (IdEmpresa) {
      if (!IdEmpresa) {
        IdEmpresa = 0;
      }
      factory.refreshToken();
      return $http.get($rootScope.API + 'Promotions/' + IdEmpresa);
    };

    factory.getPromocion = function (IdPromocion) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'Promotion/' + IdPromocion);
    };

    factory.postPromocion = function (Promocion) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'Promotions', Promocion);
    };

    factory.putPromocion = function (Promocion) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'Promotion/' + Promocion.IdPromocion, Promocion);
    };

    return factory;
  };

  PromocionsFactory.$inject = ['$http', '$cookies', '$rootScope'];

  angular.module('marketplace').factory('PromocionsFactory', PromocionsFactory);
}());
