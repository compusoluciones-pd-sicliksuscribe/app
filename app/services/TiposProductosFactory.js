(function () {
  var TiposProductosFactory = function ($http, $cookies, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookies.getObject('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.getTiposProductos = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'TiposProductos');
    };

    factory.getTipoProducto = function (IdTipoProducto) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'TiposProductos/' + IdTipoProducto);
    };

    return factory;
  };

  TiposProductosFactory.$inject = ['$http', '$cookies', '$rootScope'];

  angular.module('marketplace').factory('TiposProductosFactory', TiposProductosFactory);
}());
