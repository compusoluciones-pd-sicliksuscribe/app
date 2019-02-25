(function () {
  var DescuentosFactory = function ($http, $cookies, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookies.getObject('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.postDescuentoAnual = function (DescuentoAnual, FechaExpiracion) {
      factory.refreshToken();

      return $http.post($rootScope.API + 'descuentoAnual/' + DescuentoAnual + '/' + FechaExpiracion);
    };

    factory.getDescuentoAnual = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'descuentoAnual');
    };

    factory.refreshToken();

    factory.postDescuento = function (Descuento,FechaExpiracion) {
      console.log('desc: ', Descuento, 'fecha ', FechaExpiracion);
      factory.refreshToken();
      return $http.post($rootScope.API + 'ConfiguracionDescuento', Descuento, FechaExpiracion);
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

  DescuentosFactory.$inject = ['$http', '$cookies', '$rootScope'];

  angular.module('marketplace').factory('DescuentosFactory', DescuentosFactory);
}());
