(function () {
  var DescuentosFactory = function ($http, $cookieStore, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookieStore.get('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.postDescuento = function (Descuento) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'ConfiguracionDescuento', Descuento);
    };

    factory.putDescuento = function (Descuento) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'ConfiguracionDescuento/' + Descuento.IdConfiguracionDescuento, Descuento);
    };

    factory.deleteDescuento = function (IdConfiguracionDescuento) {
      factory.refreshToken();
      return $http.delete($rootScope.API + 'ConfiguracionDescuento/' + IdConfiguracionDescuento);
    };

    factory.getDescuentos = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'ConfiguracionDescuento');
    };

    factory.getEspecializaciones = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'Especializaciones');
    };

    return factory;
  };

  DescuentosFactory.$inject = ['$http', '$cookieStore', '$rootScope'];

  angular.module('marketplace').factory('DescuentosFactory', DescuentosFactory);
}());
