(function () {
  var NivelesDistribuidorFactory = function ($http, $cookieStore, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookieStore.get('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.postNivelesDistribuidor = function (NivelDistribuidor) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'NivelDistribuidor', NivelDistribuidor);
    };

    factory.putNivelesDistribuidor = function (IdNivelDistribuidor, NivelDistribuidor) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'NivelDistribuidor/' + IdNivelDistribuidor, NivelDistribuidor);
    };

    factory.deleteNivelesDistribuidor = function (IdNivelDistribuidor) {
      factory.refreshToken();
      return $http.delete($rootScope.API + 'NivelDistribuidor/' + IdNivelDistribuidor);
    };

    factory.getNivelesDistribuidor = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'NivelDistribuidor');
    };

    factory.getProductosPorNivel = function (idNivelCS) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'levels/' + idNivelCS + '/products');
    };

    factory.asignarNivel = function (nivel) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'levels/assign', nivel);
    };

    factory.createLevelDiscount = function (level) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'levels/discount', level);
    };

    factory.removerNivel = function (id) {
      factory.refreshToken();
      return $http.delete($rootScope.API + 'levels/' + id);
    };

    return factory;
  };

  NivelesDistribuidorFactory.$inject = ['$http', '$cookieStore', '$rootScope'];

  angular.module('marketplace').factory('NivelesDistribuidorFactory', NivelesDistribuidorFactory);
}());
