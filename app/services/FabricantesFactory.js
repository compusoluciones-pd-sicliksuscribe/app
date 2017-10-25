(function () {
  var FabricantesFactory = function ($http, $cookies, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookies.getObject('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.getFabricantes = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'Fabricantes');
    };

    factory.getFabricante = function (IdFabricante) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'Fabricantes/' + IdFabricante);
    };

    factory.postFabricante = function (Fabricante) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'Fabricantes', Fabricante);
    };

    factory.putFabricante = function (Fabricante) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'Fabricantes', Fabricante);
    };

    return factory;
  };

  FabricantesFactory.$inject = ['$http', '$cookies', '$rootScope'];

  angular.module('marketplace').factory('FabricantesFactory', FabricantesFactory);
}());
