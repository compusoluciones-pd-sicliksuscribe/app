(function () {
  var DescuentosNivelesFactory = function ($http, $cookieStore, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookieStore.get('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.getDiscountLevels = function(levelId, enterpriseId) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'distributor/customer/' + levelId + '/discount-level/' + enterpriseId);
    };

    factory.addDiscountLevels = function(levelId, product) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'distributor/customer/' + levelId + '/discount-level', product);
    };

    return factory;
  };

  DescuentosNivelesFactory.$inject = ['$http', '$cookieStore', '$rootScope'];

  angular.module('marketplace').factory('DescuentosNivelesFactory', DescuentosNivelesFactory);
}());
