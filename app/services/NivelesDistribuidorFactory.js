(function () {
  var NivelesDistribuidorFactory = function ($http, $cookies, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookies.getObject('Session');
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

    //yorsh
    factory.getNivelesDistribuidor = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'NivelDistribuidor');
    };

    factory.getNivelesDistribuidorFinalUser = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'tuclick/get-levels/');
    };

    factory.getProductosPorNivel = function (idNivelCS) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'levels/' + idNivelCS + '/products');
    };

    factory.asignarNivel = function (nivel) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'levels/assign', nivel);
    };

    factory.asignarNivelTuclick = function (nivel) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'tuclick/assign-level/', nivel);
    };

    factory.createLevelDiscount = function (level) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'levels/discount', level);
    };

    factory.removerNivel = function (id) {
      factory.refreshToken();
      return $http.delete($rootScope.API + 'levels/' + id);
    };

    factory.removerNivelTuclick = function (id) {
      factory.refreshToken();
      return $http.delete($rootScope.API + 'tuclick/levels/' + id);
    };

    return factory;
  };

  NivelesDistribuidorFactory.$inject = ['$http', '$cookies', '$rootScope'];

  angular.module('marketplace').factory('NivelesDistribuidorFactory', NivelesDistribuidorFactory);
}());
