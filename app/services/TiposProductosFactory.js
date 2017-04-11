(function () {
  var TiposProductosFactory = function ($http, $cookieStore, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookieStore.get('Session');
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

  TiposProductosFactory.$inject = ['$http', '$cookieStore', '$rootScope'];

  angular.module('marketplace').factory('TiposProductosFactory', TiposProductosFactory);
}());
