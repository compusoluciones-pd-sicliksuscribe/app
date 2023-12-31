(function () {
  var ProductoGuardadosFactory = function ($http, $cookies, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookies.getObject('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.getProductoGuardados = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'ProductoGuardados');
    };

    factory.getProductoGuardado = function (IdProductoGuardado) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'ProductoGuardados/' + IdProductoGuardado);
    };

    factory.postProductoGuardado = function (ProductoGuardado) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'ProductoGuardados', ProductoGuardado);
    };

    factory.putProductoGuardado = function (ProductoGuardado) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'ProductoGuardados', ProductoGuardado);
    };

    return factory;
  };

  ProductoGuardadosFactory.$inject = ['$http', '$cookies', '$rootScope'];

  angular.module('marketplace').factory('ProductoGuardadosFactory', ProductoGuardadosFactory);
}());
